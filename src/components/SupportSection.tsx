import { Users, BookOpen, UserPlus } from 'lucide-react';

interface SupportPillar {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const supportPillars: SupportPillar[] = [
  {
    title: "Workshops",
    description: "Step-by-step guided sessions, practical & live.",
    icon: <BookOpen className="h-8 w-8 text-white" />,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "1:1 Mentorship",
    description: "Affordable, personal guidance for real solopreneurs.",
    icon: <UserPlus className="h-8 w-8 text-white" />,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Community",
    description: "Connect, share, and grow with other solo founders.",
    icon: <Users className="h-8 w-8 text-white" />,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

const SupportSection = () => {
  return (
    <section className="py-20 bg-white relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            How We Support You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From spark to success — we're with you every step of the way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {supportPillars.map((pillar, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden"
            >
              {/* Background image with overlay */}
              <div className="aspect-[4/3] relative">
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-500"></div>
                <img 
                  src={pillar.image} 
                  alt={pillar.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                  <div className="bg-navy p-4 rounded-full mb-4 shadow-lg">
                    {pillar.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-white/90 max-w-xs">
                    {pillar.description}
                  </p>
                  
                  {/* Reveal on hover */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-navy to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button className="text-white border border-white hover:bg-white hover:text-navy px-6 py-2 rounded-full transition-colors duration-300 text-sm font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
