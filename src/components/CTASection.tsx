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
    <section className="py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-primary/10">
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-accent fill-current" />
                  ))}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Stuck isn't a Strategy.
                </h2>
                <p className="text-xl text-gray-600">
                  Let's Make you a Successful Solopreneur.
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
                <div className="flex flex-col items-center justify-center">
                  <a 
                    href="/quiz"
                    onClick={handleClick}
                    className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-medium shadow-lg"
                    data-tracking="main-cta"
                  >
                    Take the Quiz <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                  <p className="text-sm text-gray-500 mt-3">
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