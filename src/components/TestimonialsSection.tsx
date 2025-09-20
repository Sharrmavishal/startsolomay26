import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const testimonials = [
    {
      name: "Ashish Sethi",
      role: "PricewaterhouseCoopers (PWC)",
      quote: "Diksha's clear and concise explanation of modern digital marketing concepts, paired with actionable tips, has empowered me to confidently pitch strategies even with little prior experience.",
      stars: 4.5
    },
    {
      name: "Sharmistha Ghosh",
      role: "Senior Vice President, AvianWE",
      quote: "Diksha's session was one of the most insightful I've attended—she offered simple, memorable concepts that helped shape a sustainable social media strategy for my neurodiversity platform.",
      stars: 4.5
    },
    {
      name: "Nishi Oswal",
      role: "Corporate Communications, Shell",
      quote: "Diksha's 3-day program was an engaging blend of in-depth digital marketing expertise, practical examples, and interactive activities that deliver significant value.",
      stars: 4.5
    },
    {
      name: "Parul Gangodia",
      role: "Senior Executive (content), Mama Earth",
      quote: "Diksha's 3-day workshop was both informative and engaging, with a focus on technical insights that truly enhanced the experience.",
      stars: 4.5
    },
    {
      name: "Ritika Sharma",
      role: "Communications Consultant, Archetype",
      quote: "Diksha's incredible approach to digital marketing fundamentals, enriched with practical case studies, has boosted my confidence to handle campaigns independently—highly recommended for anyone starting their marketing journey.",
      stars: 4.5
    },
    {
      name: "Bhawna Arora",
      role: "Counselling Therapist",
      quote: "The personalised attention and clear details suggested were quite practical and made sense.",
      stars: 4.5
    },
    {
      name: "Shweta Mishra",
      role: "Founder, Yoganomy Wellness",
      quote: "Had a great experience working with them.",
      stars: 4.5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isAnimating, testimonials.length]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-4 w-4 fill-current text-[color:var(--color-cta)]" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-[color:var(--color-cta)]/30" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-current text-[color:var(--color-cta)]" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-[color:var(--color-cta)]/30" />
      );
    }

    return stars;
  };

  const handlePrevious = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((current) => 
        current === 0 ? testimonials.length - 1 : current - 1
      );
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((current) => (current + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block bg-gray-100 text-[color:var(--color-teal)] px-4 py-1 rounded-full mb-4 font-medium">
            SUCCESS STORIES
          </div>
          <h2 className="text-3xl font-bold text-[color:var(--color-navy)] mb-4">Real Experiences, Real Impact</h2>
          <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] max-w-3xl mx-auto">
            Discover how professionals and entrepreneurs have transformed their careers through our workshops and mentoring
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-xl shadow-lg p-6 border border-[color:var(--color-gray-100)]">
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-[color:var(--color-gray-50)]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-[color:var(--color-gray-900)]" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-[color:var(--color-gray-50)]"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-[color:var(--color-gray-900)]" />
            </button>

            <div className="overflow-hidden">
              <div 
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                <div className="flex">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={index}
                      className="w-full flex-shrink-0"
                      style={{ width: '100%' }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="flex mb-4">
                          {renderStars(testimonial.stars)}
                        </div>
                        <p className="text-[color:var(--color-gray-900)] italic text-lg mb-6 max-w-2xl">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <h4 className="font-bold text-[color:var(--color-navy)]">{testimonial.name}</h4>
                          <p className="text-[color:var(--color-teal)]">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === index ? 'bg-[color:var(--color-cta)] w-6' : 'bg-[color:var(--color-gray-200)]'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/learn"
              onClick={handleClick}
              className="bg-[color:var(--color-cta)] text-[color:var(--color-cta-text)] px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
              data-tracking="testimonials-cta"
            >
              <span className="absolute inset-0 bg-[color:var(--color-cta-dark)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                Start Your Solo Journey <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;