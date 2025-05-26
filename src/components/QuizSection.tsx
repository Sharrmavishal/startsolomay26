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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Take the first step with a quick quiz.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We'll show you what to focus on, what to skip, and how to move forward.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-secondary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">2-Minute Quiz</h3>
                  <p className="text-gray-600 text-sm">Assess where you are in under 2 minutes</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-secondary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Personalized Report</h3>
                  <p className="text-gray-600 text-sm">Get stage-based insights + action steps</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-secondary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Action Steps</h3>
                  <p className="text-gray-600 text-sm">Your next step delivered directly on WhatsApp</p>
                </div>
              </div>

              <div className="text-center">
                <a 
                  href="/quiz"
                  onClick={handleQuizClick}
                  className="inline-flex items-center bg-secondary text-white px-8 py-4 rounded-lg hover:bg-secondary-dark transition transform hover:translate-y-[-2px]"
                >
                  Get Instant Recommendations <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <p className="text-sm text-gray-500 mt-4">
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