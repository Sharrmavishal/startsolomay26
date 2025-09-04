import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-brand-gradient-cta">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-white rounded-2xl shadow-xl overflow-hidden border border-brand-primary/10">
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-brand-accent fill-current" />
                  ))}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">
                  Stuck isn't a Strategy.
                </h2>
                <p className="text-xl text-brand-gray-600">
                  Let's Make you a Successful Solopreneur.
                </p>
              </div>

              <div className="bg-brand-gradient-cta-inner rounded-xl p-6 border border-brand-primary/10">
                <div className="flex flex-col items-center justify-center">
                  <a 
                    href="/quiz"
                    onClick={handleClick}
                    className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold w-full md:w-auto shadow-lg relative overflow-hidden group hover:shadow-lg z-0"
                    data-tracking="main-cta"
                  >
                    <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                      Take the Quiz <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </a>
                  <p className="text-sm text-brand-gray-500 mt-3">
                    Find your perfect starting point in 2 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;