import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useContent } from './ContentProvider';

const StickyWhatsAppCTA: React.FC = () => {
  const { whatsappHub } = useContent();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState('');

  // Track scroll position to show/hide the button and determine current section
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setIsVisible(window.scrollY > 300);
      
      // Determine current section for analytics tracking
      const sections = [
        'hero', 'webinar-info', 'webinar-dates', 'testimonials', 
        'instructor', 'journey', 'course', 'whatsapp-hub', 
        'guarantee', 'faq'
      ];
      
      // Find the section that's currently most visible in the viewport
      let currentSectionId = '';
      let maxVisibleHeight = 0;
      
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          
          if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            currentSectionId = sectionId;
          }
        }
      });
      
      if (currentSectionId && currentSectionId !== currentSection) {
        setCurrentSection(currentSectionId);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      <a 
        href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij"
        className="flex items-center bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 group"
        aria-label="Join our WhatsApp Hub"
        data-tracking={`sticky-whatsapp-${currentSection}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="h-6 w-6 mr-2" />
        <span className="font-medium whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out">
          Join WhatsApp Hub
        </span>
      </a>
    </div>
  );
};

export default StickyWhatsAppCTA;