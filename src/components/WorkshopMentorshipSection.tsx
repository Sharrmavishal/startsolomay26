import React from 'react';
import { ArrowRight, BookOpen, Users, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkshopMentorshipSection: React.FC = () => {
  const navigate = useNavigate();

  const handleExplorePrograms = () => {
    navigate('/course');
  };

  const programs = [
    {
      title: "Turn Skills into a Viable Business Plan",
      description: "Identify your strengths and create a clear, actionable business plan that works.",
      icon: BookOpen,
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      iconBg: "bg-[color:var(--color-teal)]"
    },
    {
      title: "Eliminate Guesswork, Launch with Confidence", 
      description: "Use proven tools and step-by-step systems to launch your business the right way.",
      icon: Users,
      bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      iconBg: "bg-[color:var(--color-cta)]"
    },
    {
      title: "Build an Independent Growth Engine",
      description: "Develop smart and sustainable marketing and growth strategies that keep your business thriving on your terms.",
      icon: Target,
      bgImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      iconBg: "bg-[color:var(--color-navy)]"
    }
  ];

  return (
    <section id="what-we-do" className="py-16 bg-white border-t border-gray-100 border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-3 sm:mb-4 px-4">
            What We Do
          </h2>
              <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] max-w-3xl mx-auto px-4">
                From Skills to Success: Your Complete Solopreneur Journey
              </p>
        </div>

        {/* Horizontal Banner Layout - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-3 min-h-[400px] md:h-80 mb-12 overflow-hidden rounded-2xl">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <div 
                key={index}
                className="relative overflow-hidden group min-h-[400px] md:min-h-0"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${program.bgImage})` }}
                >
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300"></div>
                </div>
                
                {/* Content - Mobile Optimized */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8">
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${program.iconBg} rounded-full flex items-center justify-center mb-4 sm:mb-6`}>
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 px-2">
                    {program.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-sm sm:max-w-xs px-2">
                    {program.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center px-4">
          <button 
            onClick={handleExplorePrograms}
            className="bg-[color:var(--color-cta)] hover:bg-[color:var(--color-cta-dark)] text-[color:var(--color-cta-text)] px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-300 flex items-center justify-center text-base sm:text-lg font-semibold mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Explore Programs <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WorkshopMentorshipSection;