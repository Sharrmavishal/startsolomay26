import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Award } from 'lucide-react';
import { useContent } from './ContentProvider';
import { useNavigate } from 'react-router-dom';
import LeadCaptureForm, { LeadCaptureData } from './LeadCaptureForm';

const HeroSection = () => {
  const { hero, general } = useContent();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState({ title: '', pdfName: '' });

  // Fallbacks for missing content
  if (!hero) {
    console.warn('Hero content is missing from context.');
  }
  if (!general) {
    console.warn('General content is missing from context.');
  }
  // fallbackStats is used directly in the map below; no need for 'stats' variable.

  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const buttonText = e.currentTarget.textContent?.trim() || '';
    
    // Check if this is a PDF download link
    if (href?.includes('.pdf') || href?.includes('/download/')) {
      // Set the current PDF info and open the lead capture form
      setCurrentPdf({
        title: buttonText.includes('Unlock') ? 'Unlock My Solo Business Idea' : 'Get Your Free PDF Resource',
        pdfName: href.split('/').pop() || 'resource.pdf'
      });
      setIsLeadFormOpen(true);
    } else if (href === '#quiz') {
      navigate('/quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to the href directly
      const targetUrl = href || '/';
      if (targetUrl.startsWith('#')) {
        const element = document.querySelector(targetUrl);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = targetUrl;
      }
    }
  };

  const solopreneurImages = [
    "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741377252/4_n4k8ik.png",
    "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741377252/3_uwcerw.png",
    "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741377240/2_sscxaj.png",
    "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741377240/1_cizh8t.png",
    "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  ];
  
  const handleLeadFormClose = () => {
    setIsLeadFormOpen(false);
  };
  
  const handleLeadFormSubmit = (formData: LeadCaptureData) => {
    console.log('Lead form submitted:', formData);
    
    // Trigger PDF download
    const pdfUrl = `/downloads/${currentPdf.pdfName}`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = currentPdf.pdfName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="hero" className="py-8 md:py-16 bg-brand-gradient-hero">
      {isLeadFormOpen && (
        <LeadCaptureForm
          onClose={handleLeadFormClose}
          onSubmit={handleLeadFormSubmit}
          title={currentPdf.title}
          pdfName={currentPdf.pdfName}
        />
      )}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center mb-8 md:mb-12">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
            <div className="inline-block bg-brand-highlight/90 text-brand-white px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-4 md:mb-6 font-medium text-sm md:text-base animate-pulse shadow-sm">
              {hero?.highlight?.replace('{cohortStartDate}', general?.cohortStartDate || 'TBA') || `Next cohort starts ${general?.cohortStartDate || 'TBA'}`}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-gray-900 leading-tight mb-4 md:mb-6">
              {hero?.heading || "Start a Profitable Solo Business, But Not Alone"}
            </h1>
            <p className="text-lg md:text-xl text-brand-gray-700 mb-6 md:mb-8 leading-relaxed">
              {hero?.subheading || "Your dream business starts with you — and you don't have to build it alone."}
            </p>
            <ul className="mb-6 md:mb-8 list-disc ml-6 text-brand-gray-700">
              {(hero?.keyPoints || []).map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              {hero?.primaryButton && (
                <a 
                  href="#lead-magnet"
                  onClick={handleClick}
                  className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
                  aria-label={hero.primaryButton.text || "Primary CTA"}
                  data-tracking={hero.primaryButton.trackingId || "hero-primary-cta"}
                >
                  <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                    {hero.primaryButton.text || "Register Now"} <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </span>
                </a>
              )}
              {hero?.secondaryButton && (
                <a 
                  href="#lead-magnet"
                  onClick={handleClick}
                  className="border-2 border-navy bg-white text-navy px-6 py-3 rounded-lg hover:bg-navy hover:text-white transition flex items-center justify-center text-sm md:text-base font-semibold"
                  aria-label={hero.secondaryButton.text || "Secondary CTA"}
                  data-tracking={hero.secondaryButton.trackingId || "hero-secondary-cta"}
                >
                  {hero.secondaryButton.text || "Meet Your Instructor"} <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </a>
              )}
            </div>
            
            <div className="flex items-center">
              <div className="flex -space-x-2 md:-space-x-3">
                {solopreneurImages.map((image, i) => (
                  <img 
                    key={i}
                    src={image}
                    alt={`Solopreneur ${i+1}`}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-brand-2 border-brand-white object-cover shadow-sm"
                    loading="lazy"
                  />
                ))}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-brand-2 border-brand-white bg-yellow flex items-center justify-center text-brand-gray-900 text-xs md:text-sm font-bold shadow-sm">
                  2.8k+
                </div>
              </div>
              <p className="ml-3 md:ml-4 text-xs md:text-sm text-brand-gray-600">
                <span className="font-bold text-yellow">2,800+</span> happy solopreneurs
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2 w-full">
            <div className="relative">
              <div className="bg-brand-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl border border-brand-gray-100">
                <div className="relative">
                  <div className="aspect-video">
                    {hero?.videoId ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${hero.videoId}`}
                        title="Solo Accelerator Session Preview"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : hero?.previewImage ? (
                      <img 
                        src={hero.previewImage} 
                        alt="Session Preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : null}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 p-4 md:p-6">
                  {(hero && 'stats' in hero && Array.isArray((hero as any).stats) ? (hero as any).stats : [
                    { value: "2,800+", label: "Graduates" },
                    { value: "4.9/5", label: "Avg. Rating" },
                    { value: "100%", label: "Satisfaction" }
                  ]).map((stat: any, i: number) => (
                    <div className="text-center" key={i}>
                      <Award className="h-5 w-5 md:h-6 md:w-6 text-brand-accent mx-auto mb-1" />
                      <div className="text-base md:text-lg font-bold text-brand-gray-900">{stat.value}</div>
                      <p className="text-xs text-brand-gray-600">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-4 pb-4">
                  {hero?.trustBadge && (typeof hero.trustBadge === 'string' ? (
                    <span className="text-xs text-brand-gray-600 font-medium">{hero.trustBadge}</span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {'image' in hero.trustBadge && (hero.trustBadge as any).image && (
                        <img src={(hero.trustBadge as any).image} alt={('alt' in hero.trustBadge && (hero.trustBadge as any).alt) ? (hero.trustBadge as any).alt : "Trust Badge"} className="h-6 w-6" />
                      )}
                      {'text' in hero.trustBadge && (
                        <span className="text-xs text-brand-gray-600 font-medium">{(hero.trustBadge as any).text}</span>
                      )}
                    </div>
                  ))}
                  {hero?.limitedOffer && (
                    <div className="text-xs text-brand-red-500 font-bold bg-brand-red-50 px-2 py-1 rounded-md">
                      {typeof hero.limitedOffer === 'string' ? hero.limitedOffer : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor form popup removed */}
    </section>
  );
};

export default HeroSection;