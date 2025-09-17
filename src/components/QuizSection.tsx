import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Rocket, ArrowRight } from 'lucide-react';

const QuizSection = () => {
  const navigate = useNavigate();

  const handleQuizClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="quiz" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-secondary-light/20 text-secondary-dark px-4 py-1 rounded-full mb-4 font-medium">
            DISCOVER YOUR PATH
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Take the first step with a quick quiz.
          </h2>
          <p className="text-xl text-[color:var(--color-gray-900)] max-w-3xl mx-auto">
            We'll show you what to focus on, what to skip, and how to move forward.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[color:var(--color-gray-100)]">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-secondary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-brand-navy mb-2">2-Minute Quiz</h3>
                  <p className="text-[color:var(--color-gray-900)] text-sm">Assess where you are in under 2 minutes</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-secondary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-brand-navy mb-2">Personalized Report</h3>
                  <p className="text-[color:var(--color-gray-900)] text-sm">Get stage-based insights + action steps</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-secondary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-brand-navy mb-2">Action Steps</h3>
                  <p className="text-[color:var(--color-gray-900)] text-sm">Your next step delivered directly on WhatsApp</p>
                </div>
              </div>

              <div className="text-center">
                <a 
                  href="/quiz"
                  onClick={handleQuizClick}
                  className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
                >
                  <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                    Get Instant Recommendations <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </a>
                <p className="text-sm text-[color:var(--color-gray-900)] mt-4">
                  Free. No login. Results + Roadmap in 2 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;