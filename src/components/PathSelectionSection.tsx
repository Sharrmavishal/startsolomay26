import { ArrowRight } from 'lucide-react';

// Icons for each path
const WomenIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8C27.3137 8 30 10.6863 30 14C30 17.3137 27.3137 20 24 20C20.6863 20 18 17.3137 18 14C18 10.6863 20.6863 8 24 8Z" fill="var(--color-teal)"/>
    <path d="M24 22C27.3137 22 30 24.6863 30 28V36H27V42H21V36H18V28C18 24.6863 20.6863 22 24 22Z" fill="var(--color-teal)"/>
    <circle cx="36" cy="14" r="4" fill="var(--color-cta)"/>
    <circle cx="12" cy="14" r="4" fill="var(--color-cta)"/>
  </svg>
);

const GraduatesIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 6L42 16L24 26L6 16L24 6Z" fill="var(--color-teal)"/>
    <path d="M14 20V30C14 33.3137 18.4772 36 24 36C29.5228 36 34 33.3137 34 30V20" stroke="var(--color-navy)" strokeWidth="2"/>
    <path d="M42 16V28" stroke="var(--color-navy)" strokeWidth="2"/>
    <path d="M42 32C43.1046 32 44 31.1046 44 30C44 28.8954 43.1046 28 42 28C40.8954 28 40 28.8954 40 30C40 31.1046 40.8954 32 42 32Z" fill="var(--color-cta)"/>
  </svg>
);

const EngineersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 10C26.2091 10 28 11.7909 28 14C28 16.2091 26.2091 18 24 18C21.7909 18 20 16.2091 20 14C20 11.7909 21.7909 10 24 10Z" fill="var(--color-teal)"/>
    <path d="M36 26L30 20H18L12 26L18 32H30L36 26Z" fill="var(--color-cta)"/>
    <path d="M18 32V38H30V32" stroke="var(--color-navy)" strokeWidth="2"/>
    <path d="M24 18V20" stroke="var(--color-navy)" strokeWidth="2"/>
  </svg>
);

const pathOptions = [
  {
    title: "Women Making Their Career Comeback",
    description: "Build a business that reflects your values and vision, with strategies tailored for women founders.",
    icon: WomenIcon,
    bgColorClass: "bg-[color:var(--color-teal)] bg-opacity-10",
    textColorClass: "text-[color:var(--color-teal)]",
    hoverColorClass: "group-hover:text-[color:var(--color-navy)]",
    iconColor: "var(--color-teal)",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    customPath: "/women-entrepreneurs"
  },
  {
    title: "Graduates & Students",
    description: "Turn your academic knowledge into a profitable business while balancing studies or early career.",
    icon: GraduatesIcon,
    bgColorClass: "bg-[color:var(--color-cta)] bg-opacity-10",
    textColorClass: "text-[color:var(--color-cta)]",
    hoverColorClass: "group-hover:text-[color:var(--color-navy)]",
    iconColor: "var(--color-cta)",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Engineers in Career Transition",
    description: "Leverage your technical expertise to create a sustainable solo business with high earning potential.",
    icon: EngineersIcon,
    bgColorClass: "bg-[color:var(--color-sky)] bg-opacity-10",
    textColorClass: "text-[color:var(--color-sky)]",
    hoverColorClass: "group-hover:text-[color:var(--color-navy)]",
    iconColor: "var(--color-sky)",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    customPath: "/engineers-in-career-transition"
  }
];

const PathSelectionSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-4">Choose Your Path</h2>
          <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] max-w-2xl mx-auto">
            Your skills, your path — pick your starting point.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pathOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div 
                key={index}
                className="flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image box */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={option.image} 
                    alt={option.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-white p-2 rounded-full">
                    <Icon />
                  </div>
                </div>
                
                {/* Text box */}
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <h3 className="text-xl font-bold mb-3 text-[color:var(--color-navy)]">
                    {option.title}
                  </h3>
                  <p className="text-[color:var(--color-gray-900)] mb-6 flex-grow">
                    {option.description}
                  </p>
                  <a 
                    href={option.customPath || `/path/${option.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/--+/g, '-')}`}
                    className="bg-[color:var(--color-cta)] hover:bg-[color:var(--color-cta-dark)] text-[color:var(--color-cta-text)] px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold"
                  >
                    Explore More <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PathSelectionSection;
