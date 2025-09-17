import { Download, Sparkles } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import LeadMagnetForm from './LeadMagnetForm';

const leadMagnets = [
  {
    title: "Solo Business Idea Generator",
    description: "Map your skills into a clear solo business idea. No funding needed.",
    bgColor: "bg-white",
    bgColorStyle: "var(--color-teal)", // Subtle teal background
    accentColor: "var(--color-navy)", // Navy blue for better contrast with light blue
    buttonColor: "bg-[color:var(--color-cta)] hover:bg-[color:var(--color-cta-dark)] text-[color:var(--color-cta-text)]",
    textColor: "text-[color:var(--color-navy)]",
    iconColor: "var(--color-navy)",
    downloadCount: "2,457",
    tag: "Most Popular",
    tagColor: "yellow",
    downloadUrl: "/downloads/solo-business-idea-worksheet.pdf",
    fileName: "solo-business-idea-worksheet.pdf"
  },
  {
    title: "10 Solo Business Ideas That Don't Need VC",
    description: "Low-investment ideas you can start on your own terms.",
    bgColor: "bg-white",
    bgColorStyle: "var(--color-sky)", // Subtle sky blue background
    accentColor: "var(--color-steel)", // Steel blue for better contrast with light gray
    buttonColor: "border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] hover:bg-[color:var(--color-navy)] hover:text-white",
    textColor: "text-[color:var(--color-navy)]",
    iconColor: "var(--color-steel)",
    downloadCount: "1,893",
    tag: "Quick Start",
    tagColor: "steel",
    downloadUrl: "/downloads/solo-business-ideas.pdf",
    fileName: "solo-business-ideas.pdf"
  }
];

// Animation for the download button
interface DownloadButtonProps {
  color: string;
  text: string;
  onClick: () => void;
}

const DownloadButton = ({ color, text, onClick }: DownloadButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if the button is using the primary CTA style
  const isPrimaryCta = color.includes('bg-[color:var(--color-cta)]');
  
  return (
    <button 
      className={`${isPrimaryCta ? 'bg-[color:var(--color-cta)] text-[color:var(--color-cta-text)]' : color} px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      data-tracking="lead-magnet-download-button"
    >
      {isPrimaryCta && (
        <span className="absolute inset-0 bg-[color:var(--color-cta-text)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
      )}
      <span className={`relative z-10 flex items-center ${isPrimaryCta ? 'group-hover:text-white transition-colors duration-300' : ''}`}>
        {text} <Download className={`ml-2 h-4 w-4 ${isHovered ? 'animate-bounce' : ''}`} />
      </span>
      {!isPrimaryCta && (
        <span className="absolute bottom-0 left-0 w-full h-0 bg-opacity-20 bg-white transition-all duration-300 group-hover:h-full"></span>
      )}
    </button>
  );
};

// Custom animated tag component
interface AnimatedTagProps {
  text: string;
  color: string;
}

const AnimatedTag = ({ text, color }: AnimatedTagProps) => {
  return (
    <div className="absolute -top-2 -right-2 z-10">
      <div className="relative">
        <div className={`bg-[color:var(--color-cta)] text-[color:var(--color-navy)] text-xs font-bold py-1 px-2 rounded-full shadow-lg flex items-center`}>
          <Sparkles className="w-3 h-3 mr-1" />
          {text}
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-full animate-ping opacity-30"></div>
      </div>
    </div>
  );
};

// Document icon with animation
interface IconProps {
  color: string;
}

const DocumentIcon = ({ color }: IconProps) => (
  <div className="relative">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform duration-500 hover:scale-110">
      <rect x="16" y="8" width="48" height="64" rx="4" fill={color} fillOpacity="0.2" />
      <path d="M24 24H56" stroke="var(--color-navy)" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 36H56" stroke="var(--color-navy)" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 48H44" stroke="var(--color-navy)" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 60H50" stroke="var(--color-navy)" strokeWidth="3" strokeLinecap="round" />
      <path className="animate-pulse" d="M60 30L60 50" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
      <path className="animate-pulse" d="M20 30L20 50" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
    </svg>
    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[color:var(--color-navy)] rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
      PDF
    </div>
  </div>
);

// Worksheet icon with animation
const WorksheetIcon = ({ color }: IconProps) => (
  <div className="relative">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform duration-500 hover:scale-110">
      <rect x="16" y="12" width="48" height="56" rx="4" fill={color} fillOpacity="0.2" />
      <path d="M28 40L36 48L52 32" stroke="var(--color-navy)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 64L56 64" stroke="var(--color-navy)" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 48V64" stroke="var(--color-navy)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="24" r="8" fill={color} fillOpacity="0.4" className="animate-pulse" />
    </svg>
    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[color:var(--color-cta)] rounded-full flex items-center justify-center text-[color:var(--color-cta-text)] text-xs font-bold animate-bounce">
      PDF
    </div>
  </div>
);

const LeadMagnetSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [currentLeadMagnet, setCurrentLeadMagnet] = useState({ title: '', downloadUrl: '', fileName: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  const handleLeadFormClose = () => {
    setIsLeadFormOpen(false);
  };
  
  const handleDownloadClick = (leadMagnet: any) => {
    // Set the current lead magnet info and open the form
    setCurrentLeadMagnet({
      title: leadMagnet.title,
      downloadUrl: leadMagnet.downloadUrl,
      fileName: leadMagnet.fileName
    });
    setIsLeadFormOpen(true);
  };

  return (
    <section id="lead-magnet" ref={sectionRef} className="py-12 relative overflow-hidden bg-white border-y border-gray-100">
      {isLeadFormOpen && (
        <LeadMagnetForm
          isOpen={isLeadFormOpen}
          onClose={handleLeadFormClose}
          leadMagnet={currentLeadMagnet}
        />
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[color:var(--color-cta)] rounded-full opacity-10 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[color:var(--color-teal)] rounded-full opacity-10 blur-xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-3">
            Kickstart Your Solopreneur Journey
          </h2>
          <div className="w-16 h-1 bg-[color:var(--color-cta)] mx-auto mb-3"></div>
          <p className="text-base text-[color:var(--color-gray-900)] max-w-xl mx-auto">
            Download for FREE
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {leadMagnets.map((item, index) => (
            <div 
              key={index} 
              className={`${item.bgColor} rounded-2xl shadow-xl p-6 flex items-start space-x-4 relative transform transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ 
                transitionDelay: `${index * 200}ms`,
                backgroundColor: `${item.bgColorStyle}20`
              }}
            >
              {/* Popular tag */}
              <AnimatedTag text={item.tag} color={item.tagColor} />
              
              {/* Compact icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-[color:var(--color-teal)] rounded-xl flex items-center justify-center text-white shadow-lg">
                {index === 0 ? 
                  // Lightbulb icon for Solo Business Idea Generator
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21C9 21.5523 9.44772 22 10 22H14C14.5523 22 15 21.5523 15 21V20H9V21Z" fill="currentColor"/>
                    <path d="M12 2C8.13401 2 5 5.13401 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.5523 8.44772 18 9 18H15C15.5523 18 16 17.5523 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13401 15.866 2 12 2Z" fill="currentColor"/>
                    <path d="M10 9H14V11H10V9Z" fill="white"/>
                    <path d="M11 12H13V14H11V12Z" fill="white"/>
                  </svg> : 
                  // List icon for 10 Solo Business Ideas
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H21V8H3V6Z" fill="currentColor"/>
                    <path d="M3 10H21V12H3V10Z" fill="currentColor"/>
                    <path d="M3 14H21V16H3V14Z" fill="currentColor"/>
                    <path d="M3 18H21V20H3V18Z" fill="currentColor"/>
                    <circle cx="6" cy="7" r="1.5" fill="white"/>
                    <circle cx="6" cy="11" r="1.5" fill="white"/>
                    <circle cx="6" cy="15" r="1.5" fill="white"/>
                    <circle cx="6" cy="19" r="1.5" fill="white"/>
                  </svg>
                }
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-bold mb-2 ${item.textColor}`}>
                  {item.title}
                </h3>
                
                <p className="text-sm text-[color:var(--color-gray-900)] mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Download Button with Count */}
                <div className="flex items-center justify-between">
                  <button 
                    className={`${item.buttonColor} px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center text-sm font-semibold relative overflow-hidden group hover:shadow-lg`}
                    onClick={() => handleDownloadClick(item)}
                    data-tracking="lead-magnet-download-button"
                  >
                    <span className="relative z-10 flex items-center">
                      Download Free <Download className="ml-2 h-4 w-4" />
                    </span>
                  </button>
                  
                  <div className="flex items-center text-xs text-[color:var(--color-gray-900)]">
                    <Download className="w-3 h-3 mr-1" />
                    {item.downloadCount}
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

export default LeadMagnetSection;
