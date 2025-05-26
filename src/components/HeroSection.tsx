import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Award } from 'lucide-react';
import { useContent } from './ContentProvider';
import { smoothScrollTo } from '../utils/scrollUtils';
import MentorForm from './MentorForm';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { hero, general } = useContent();
  const [showMentorForm, setShowMentorForm] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    if (href === '#quiz') {
      navigate('/quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowMentorForm(true);
    }
  };

  const solopreneurImages = [
    "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741377252/4_n4k8ik.png",
    "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741377252/3_uwcerw.png",
    "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741377240/2_sscxaj.png",
    "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741377240/1_cizh8t.png",
    "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  ];

  return (
    <section id="hero" className="py-8 md:py-16 bg-gradient-to-br from-primary-light/10 via-white to-secondary-light/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center mb-8 md:mb-12">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
            <div className="inline-block bg-highlight/90 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-4 md:mb-6 font-medium text-sm md:text-base animate-pulse shadow-sm">
              Next cohort starts {general?.cohortStartDate}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
              You don't need more advice — you need a starting point.
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed">
              Get your personalized roadmap, mini-course, and mentor nudges — all delivered directly on WhatsApp. We'll guide you from stuck to started. Solo, not alone. We've got your back.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              <a 
                href="#quiz" 
                onClick={handleClick}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition flex items-center justify-center shadow-lg transform hover:translate-y-[-2px] duration-200 text-sm md:text-base"
                aria-label="Take the solopreneur quiz"
                data-tracking="hero-quiz-cta"
              >
                Take the Quiz <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </a>
              <button 
                onClick={() => setShowMentorForm(true)}
                className="border-2 border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg hover:border-primary hover:text-primary transition flex items-center justify-center text-sm md:text-base"
                aria-label="Talk to a mentor"
                data-tracking="hero-mentor-cta"
              >
                Talk to a Mentor 1:1 <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
            
            <div className="flex items-center">
              <div className="flex -space-x-2 md:-space-x-3">
                {solopreneurImages.map((image, i) => (
                  <img 
                    key={i}
                    src={image}
                    alt={`Solopreneur ${i+1}`}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white object-cover shadow-sm"
                    loading="lazy"
                  />
                ))}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-sm">
                  2.8k+
                </div>
              </div>
              <p className="ml-3 md:ml-4 text-xs md:text-sm text-gray-600">
                <span className="font-bold text-primary">2,800+</span> happy solopreneurs
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2 w-full">
            <div className="relative">
              <div className="absolute -top-4 -left-4 bg-secondary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg z-10 shadow-md animate-pulse text-sm md:text-base">
                <span className="font-bold">Launch Your Solo Gig in 5 Days</span>
              </div>
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl border border-gray-100">
                <div className="relative">
                  <div className="aspect-video">
                    <iframe 
                      src="https://www.youtube.com/embed/3Vj-RIsURlQ"
                      title="Solo Accelerator Session Preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 p-4 md:p-6">
                  <div className="text-center">
                    <Award className="h-5 w-5 md:h-6 md:w-6 text-accent mx-auto mb-1" />
                    <div className="text-base md:text-lg font-bold text-gray-900">2,800+</div>
                    <p className="text-xs text-gray-600">Graduates</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-5 w-5 md:h-6 md:w-6 text-accent mx-auto mb-1" />
                    <div className="text-base md:text-lg font-bold text-gray-900">20,000+</div>
                    <p className="text-xs text-gray-600">Training Hours</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-5 w-5 md:h-6 md:w-6 text-accent mx-auto mb-1" />
                    <div className="text-base md:text-lg font-bold text-gray-900">4.9/5</div>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMentorForm && <MentorForm onClose={() => setShowMentorForm(false)} />}
    </section>
  );
};

export default HeroSection;