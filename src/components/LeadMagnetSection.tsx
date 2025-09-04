import { Download, Sparkles } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import LeadCaptureForm, { LeadCaptureData } from './LeadCaptureForm';

const leadMagnets = [
  {
    title: "Unlock My Solo Business Idea",
    description: "Self-work worksheet to map your skills into clear solo business ideas, no funding needed.",
    bgColor: "bg-white",
    bgColorStyle: "#B7D4E6", // Light blue
    accentColor: "#1D3A6B", // Navy blue for better contrast with light blue
    buttonColor: "bg-cta hover:bg-cta-dark",
    textColor: "text-navy",
    iconColor: "#1D3A6B",
    downloadCount: "2,457",
    tag: "Most Popular",
    tagColor: "yellow"
  },
  {
    title: "10 Solo Business Ideas That Don't Need VC",
    description: "Low-investment ideas you can start on your own terms.",
    bgColor: "bg-white",
    bgColorStyle: "#E4E5E7", // Light gray
    accentColor: "#607D8B", // Steel blue for better contrast with light gray
    buttonColor: "border-2 border-navy bg-white text-navy hover:bg-navy hover:text-white",
    textColor: "text-navy",
    iconColor: "#607D8B",
    downloadCount: "1,893",
    tag: "Quick Start",
    tagColor: "steel"
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
  const isPrimaryCta = color.includes('bg-cta');
  
  return (
    <button 
      className={`${isPrimaryCta ? 'bg-cta text-cta-text' : color} px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      data-tracking="lead-magnet-download-button"
    >
      {isPrimaryCta && (
        <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
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
    <div className="absolute -top-3 -right-3 z-10">
      <div className="relative">
        <div className={`bg-${color} text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg flex items-center`}>
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
      <path d="M24 24H56" stroke="#1D3A6B" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 36H56" stroke="#1D3A6B" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 48H44" stroke="#1D3A6B" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 60H50" stroke="#1D3A6B" strokeWidth="3" strokeLinecap="round" />
      <path className="animate-pulse" d="M60 30L60 50" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
      <path className="animate-pulse" d="M20 30L20 50" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
    </svg>
    <div className="absolute -top-2 -right-2 w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
      PDF
    </div>
  </div>
);

// Worksheet icon with animation
const WorksheetIcon = ({ color }: IconProps) => (
  <div className="relative">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform duration-500 hover:scale-110">
      <rect x="16" y="12" width="48" height="56" rx="4" fill={color} fillOpacity="0.2" />
      <path d="M28 40L36 48L52 32" stroke="#1D3A6B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 64L56 64" stroke="#1D3A6B" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 48V64" stroke="#1D3A6B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="24" r="8" fill={color} fillOpacity="0.4" className="animate-pulse" />
    </svg>
    <div className="absolute -top-2 -right-2 w-8 h-8 bg-cta rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
      PDF
    </div>
  </div>
);

const LeadMagnetSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState({ title: '', pdfName: '' });

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
  
  const handleLeadFormSubmit = (formData: LeadCaptureData) => {
    console.log('Lead form submitted:', formData);
    
    // Log the phone number for tracking
    console.log('Phone with country code:', formData.phone);
    
    // Trigger PDF download
    const pdfUrl = `/downloads/${currentPdf.pdfName}`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = currentPdf.pdfName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadClick = (title: string) => {
    // Set the current PDF info and open the lead capture form
    const pdfName = title.includes('Unlock') ? 'solo-business-idea-worksheet.pdf' : 'solo-business-ideas.pdf';
    setCurrentPdf({
      title: title,
      pdfName: pdfName
    });
    setIsLeadFormOpen(true);
  };

  return (
    <section id="lead-magnet" ref={sectionRef} className="py-20 relative overflow-hidden">
      {isLeadFormOpen && (
        <LeadCaptureForm
          onClose={handleLeadFormClose}
          onSubmit={handleLeadFormSubmit}
          title={currentPdf.title}
          pdfName={currentPdf.pdfName}
        />
      )}
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-navy bg-opacity-5 z-0">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #1D3A6B 1px, transparent 1px)', 
          backgroundSize: '30px 30px',
          opacity: 0.1
        }}></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-cta rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-teal-400 rounded-full opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">
            Two free tools to kickstart your solo journey.
          </h2>
          <div className="w-24 h-1 bg-cta mx-auto mt-6 mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download these resources and take the first step toward your independent business today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {leadMagnets.map((item, index) => (
            <div 
              key={index} 
              className={`${item.bgColor} rounded-xl shadow-xl p-8 flex flex-col items-center text-center relative transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ 
                transitionDelay: `${index * 200}ms`,
                backgroundColor: item.bgColorStyle 
              }}
            >
              {/* Popular tag */}
              <AnimatedTag text={item.tag} color={item.tagColor} />
              
              <div className="mb-6 mt-4">
                {index === 0 ? 
                  <WorksheetIcon color={item.iconColor} /> : 
                  <DocumentIcon color={item.iconColor} />
                }
              </div>
              
              <h3 className={`text-xl font-bold mb-3 ${item.textColor}`}>
                {item.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {item.description}
              </p>
              
              <DownloadButton 
                color={item.buttonColor} 
                text="Download Now"
                onClick={() => handleDownloadClick(item.title)}
              />
              
              <div className="mt-4 text-sm text-gray-500 flex items-center">
                <Download className="w-3 h-3 mr-1" /> {item.downloadCount} downloads
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
