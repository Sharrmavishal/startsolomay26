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
      title: "Workshops and Bootcamps",
      description: "Learn how to sharpen your skills, validate your ideas, and grow with confidence.",
      icon: BookOpen,
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      iconBg: "bg-[color:var(--color-teal)]"
    },
    {
      title: "Mentorship and Coaching", 
      description: "Get guidance from practitioners who understand the Solopreneur journey.",
      icon: Users,
      bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      iconBg: "bg-[color:var(--color-cta)]"
    },
    {
      title: "Capacity Building",
      description: "Develop branding, storytelling, and positioning that help you stand out.",
      icon: Target,
      bgImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      iconBg: "bg-[color:var(--color-navy)]"
    }
  ];

  return (
    <section id="what-we-do" className="py-16 bg-white border-t border-gray-100 border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-4">
            What We Do
          </h2>
          <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] max-w-3xl mx-auto">
            Helping Solopreneurs Build Smart and Sustainably
          </p>
        </div>

        {/* Horizontal Banner Layout - Exactly like the image */}
        <div className="grid grid-cols-1 md:grid-cols-3 h-80 mb-12 overflow-hidden rounded-2xl">
          {programs.map((program, index) => {
            const IconComponent = program.icon;
            return (
              <div 
                key={index}
                className="relative overflow-hidden group"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${program.bgImage})` }}
                >
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300"></div>
                </div>
                
                {/* Content - Centered like the image */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${program.iconBg} rounded-full flex items-center justify-center mb-6`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {program.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/90 text-base leading-relaxed max-w-xs">
                    {program.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button 
            onClick={handleExplorePrograms}
            className="bg-[color:var(--color-cta)] hover:bg-[color:var(--color-cta-dark)] text-[color:var(--color-cta-text)] px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center text-lg font-semibold mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Explore Programs <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WorkshopMentorshipSection;