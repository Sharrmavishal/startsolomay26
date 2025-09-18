import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Award } from 'lucide-react';
import { useContent } from './ContentProvider';
import { useNavigate } from 'react-router-dom';
import LeadCaptureForm, { LeadCaptureData } from './LeadCaptureForm';
import MentorForm from './MentorForm';

const HeroSection = () => {
  const { hero, general } = useContent();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isMentorFormOpen, setIsMentorFormOpen] = useState(false);
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

  const handleMentorFormOpen = () => {
    setIsMentorFormOpen(true);
  };

  const handleMentorFormClose = () => {
    setIsMentorFormOpen(false);
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
    <section id="hero" className="py-6 sm:py-8 md:py-12 lg:py-16 relative bg-white border-b border-gray-100">
      {isLeadFormOpen && (
        <LeadCaptureForm
          onClose={handleLeadFormClose}
          onSubmit={handleLeadFormSubmit}
          title={currentPdf.title}
          pdfName={currentPdf.pdfName}
        />
      )}
      {isMentorFormOpen && (
        <MentorForm
          onClose={handleMentorFormClose}
        />
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="w-full lg:w-1/2 mb-6 sm:mb-8 lg:mb-0 lg:pr-8 xl:pr-10">
                        <div className="inline-block bg-gray-100 text-[color:var(--color-teal)] px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-4 md:mb-6 font-medium text-sm md:text-base shadow-sm uppercase">
              {hero?.highlight?.replace('{cohortStartDate}', general?.cohortStartDate || 'TBA') || `Next cohort starts ${general?.cohortStartDate || 'TBA'}`}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[color:var(--color-navy)] leading-tight mb-4 sm:mb-5 md:mb-6">
              {hero?.heading || "Start a Profitable Solo Business, But Not Alone"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[color:var(--color-gray-900)] mb-5 sm:mb-6 md:mb-8 leading-relaxed">
              {hero?.subheading || "A First of its Kind Incubator for Solopreneurs"}
            </p>
            <ul className="mb-5 sm:mb-6 md:mb-8 list-disc ml-4 sm:ml-6 text-sm sm:text-base text-[color:var(--color-gray-900)] space-y-1">
              {(hero?.keyPoints || []).map((point: string, i: number) => (
                <li key={i} className="leading-relaxed">{point}</li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-5 sm:mb-6 md:mb-8">
              {hero?.primaryButton && (
                <a 
                  href="/course"
                  onClick={handleClick}
                  className="bg-[color:var(--color-cta)] hover:bg-[color:var(--color-cta-dark)] text-[color:var(--color-cta-text)] px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base font-semibold w-full sm:w-auto"
                  aria-label={hero.primaryButton.text || "Primary CTA"}
                  data-tracking={hero.primaryButton.trackingId || "hero-primary-cta"}
                >
                  {hero.primaryButton.text || "Register Now"} <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </a>
              )}
              {hero?.secondaryButton && (
                <button 
                  onClick={handleMentorFormOpen}
                  className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm sm:text-base font-semibold w-full sm:w-auto"
                  aria-label={hero.secondaryButton.text || "Secondary CTA"}
                  data-tracking={hero.secondaryButton.trackingId || "hero-secondary-cta"}
                >
                  {hero.secondaryButton.text || "Meet Your Instructor"} <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </button>
              )}
            </div>
            
            <div className="flex items-center">
              <div className="flex -space-x-1 sm:-space-x-2 md:-space-x-3">
                {solopreneurImages.map((image, i) => (
                  <img 
                    key={i}
                    src={image}
                    alt={`Solopreneur ${i+1}`}
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-white object-cover shadow-sm"
                    loading="lazy"
                  />
                ))}
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-[color:var(--color-cta)] flex items-center justify-center text-[color:var(--color-cta-text)] text-xs sm:text-xs md:text-sm font-bold shadow-sm">
                  2.8k+
                </div>
              </div>
              <p className="ml-2 sm:ml-3 md:ml-4 text-xs sm:text-xs md:text-sm text-[color:var(--color-gray-900)]">
                <span className="font-bold text-[color:var(--color-cta)]">2,800+</span> happy solopreneurs
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl border border-[color:var(--color-gray-100)]">
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
                <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 md:p-6">
                  {(hero && 'stats' in hero && Array.isArray((hero as any).stats) ? (hero as any).stats : [
                    { value: "2,800+", label: "Graduates" },
                    { value: "4.9/5", label: "Avg. Rating" },
                    { value: "100%", label: "Satisfaction" }
                  ]).map((stat: any, i: number) => (
                    <div className="text-center" key={i}>
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[color:var(--color-teal)] mx-auto mb-1" />
                      <div className="text-sm sm:text-base md:text-lg font-bold text-[color:var(--color-navy)]">{stat.value}</div>
                      <p className="text-xs sm:text-xs text-[color:var(--color-gray-900)]">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-3 sm:px-4 pb-3 sm:pb-4">
                  {hero?.trustBadge && (typeof hero.trustBadge === 'string' ? (
                    <span className="text-xs text-[color:var(--color-gray-900)] font-medium">{hero.trustBadge}</span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {'image' in hero.trustBadge && (hero.trustBadge as any).image && (
                        <img src={(hero.trustBadge as any).image} alt={('alt' in hero.trustBadge && (hero.trustBadge as any).alt) ? (hero.trustBadge as any).alt : "Trust Badge"} className="h-6 w-6" />
                      )}
                      {'text' in hero.trustBadge && (
                        <span className="text-xs text-[color:var(--color-gray-900)] font-medium">{(hero.trustBadge as any).text}</span>
                      )}
                    </div>
                  ))}
                  {hero?.limitedOffer && (
                                <div className="text-xs text-[color:var(--color-navy)] font-bold bg-[color:var(--color-orange)] bg-opacity-20 px-2 py-1 rounded-md">
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