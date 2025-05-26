import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  Target, 
  ShoppingBag, 
  Users, 
  Settings,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const ChallengesSection = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isTouching, setIsTouching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const challenges = [
    {
      problem: "I have an idea... now what?",
      solution: "Get started without overwhelm",
      icon: Lightbulb,
      details: "Break down your big idea into small, actionable steps"
    },
    {
      problem: "Not sure if this will work?",
      solution: "Validate it fast with real feedback",
      icon: Target,
      details: "Test your idea with real customers before investing too much"
    },
    {
      problem: "What do I even sell?",
      solution: "We'll help you figure it out",
      icon: ShoppingBag,
      details: "Package your skills into services people actually want"
    },
    {
      problem: "Where are my clients?",
      solution: "Get 5 in 5 days",
      icon: Users,
      details: "Learn proven strategies to find and attract your ideal clients"
    },
    {
      problem: "Doing too much?",
      solution: "Simplify, automate, and grow",
      icon: Settings,
      details: "Build systems that help you do more with less effort"
    }
  ];

  const handleQuizClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isMobile) {
      navigate('/quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [navigate, isMobile]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setIsTouching(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = Math.abs(touchY - touchStartY);
    
    // If user has scrolled more than 10px, they're probably trying to scroll
    if (deltaY > 10) {
      setIsTouching(false);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, index: number) => {
    if (isTouching) {
      if (isMobile) {
        setHoveredIndex(hoveredIndex === index ? null : index);
      } else {
        handleQuizClick(e);
      }
    }
    setTouchStartY(null);
    setIsTouching(false);
  };

  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-secondary-light/5 via-white to-primary-light/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              What's Holding You Back
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Tap the one that sounds like you — we've mapped your next move.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {challenges.map((challenge, index) => {
              const Icon = challenge.icon;
              return (
                <div
                  key={index}
                  className="relative w-full touch-none"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={(e) => handleTouchEnd(e, index)}
                  onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                  onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                  onClick={handleQuizClick}
                  role="button"
                  tabIndex={0}
                >
                  <div className="bg-white rounded-xl border border-gray-200 hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                    {/* Base State */}
                    <div className={`p-4 md:p-6 ${hoveredIndex === index ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="bg-secondary-light/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                            <Icon className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                          </div>
                          <p className="text-sm md:text-base text-gray-700 font-medium">
                            {challenge.problem}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-secondary flex-shrink-0" />
                      </div>
                    </div>

                    {/* Hover/Active State */}
                    <div 
                      className={`absolute inset-0 p-4 md:p-6 bg-gradient-to-r from-secondary-light/10 to-primary-light/10 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      } transition-opacity duration-300`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                            <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm md:text-base text-primary font-medium">
                              {challenge.solution}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                              {challenge.details}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <button
              onClick={handleQuizClick}
              className="inline-flex items-center bg-primary text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg hover:bg-primary-dark transition transform hover:translate-y-[-2px] text-sm md:text-base"
            >
              Find Your Starting Point <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </button>
            <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3">
              2-minute quiz • Free • No login needed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;