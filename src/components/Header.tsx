import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, Instagram, Linkedin } from 'lucide-react';
import { useContent } from './ContentProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { smoothScrollTo } from '../utils/scrollUtils';

const Header = () => {
  const { header } = useContent();

  if (!header) {
    console.warn('Header content is missing from context.');
  }
  // Fallback in case header content is missing
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrolled = window.scrollY > 10;
        setIsScrolled(scrolled);
      }, 10); // Small delay to debounce rapid scroll events
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle navigation
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    if (!href) return;

    // For home logo or other links to home
    if (href === '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMenuOpen(false);
      return;
    }

    // For section links on the homepage
    if (href.startsWith('/#')) {
      const sectionId = href.substring(2); // Remove /# to get section id
      
      if (location.pathname !== '/') {
        // If we're not on homepage, navigate there first
        navigate('/', { state: { scrollTo: sectionId } });
      } else {
        // If already on homepage, just scroll
        smoothScrollTo(sectionId);
      }
      setIsMenuOpen(false);
      return;
    }

    // For regular routes (not hash links)
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-200 ease-in-out border-b border-gray-200 ${isScrolled ? 'shadow-md py-3' : 'shadow-sm py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center header-content">
          <a 
            href="/" 
            onClick={handleNavClick}
            className="flex items-center hover:opacity-80 transition-opacity duration-200 header-logo-container"
            aria-label="Return to homepage"
          >
            <img 
              src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1758377695/start_solo_logo_200x60_masrm4.svg"
              alt="Start Solo Logo"
              className="header-logo"
              style={{ 
                height: '60px',
                width: '200px',
                objectFit: 'contain',
                objectPosition: 'left center'
              }}
            />
          </a>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-900 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6 header-nav">
            {header.navLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                className={`text-gray-900 hover:text-blue-600 transition-colors font-medium ${
                  link.label === "Join as a Mentor" ? "text-[color:var(--color-cta)] hover:text-[color:var(--color-cta-dark)]" : ""
                }`}
                onClick={handleNavClick}
              >
                {link.label}
              </a>
            ))}

            {/* Social Media Links */}
            <div className="flex items-center space-x-3 ml-4 border-l border-gray-200 pl-4">
              <a 
                href="https://www.linkedin.com/company/start-solo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-900 hover:text-blue-600 transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://www.instagram.com/start.solo/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-900 hover:text-blue-600 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>

            {/* Student Login Button - Reduced size */}
            <a 
              href="http://hub.startsolo.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[color:var(--color-cta)] text-[color:var(--color-cta-text)] px-3 py-1.5 rounded-md hover:bg-[color:var(--color-cta-dark)] transition-colors flex items-center text-sm font-medium"
            >
              <LogIn className="h-3.5 w-3.5 mr-1.5" />
              Participant Login
            </a>
          </nav>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200 z-50">
              <nav className="flex flex-col space-y-4">
                {header.navLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    className={`text-gray-700 hover:text-blue-600 transition-colors py-2 ${
                      link.label === "Join as a Mentor" ? "font-medium text-[color:var(--color-cta)] hover:text-[color:var(--color-cta-dark)]" : ""
                    }`}
                    onClick={handleNavClick}
                  >
                    {link.label}
                  </a>
                ))}
                
                {/* Social Media Links for Mobile */}
                <div className="flex items-center space-x-4 py-2 border-t border-gray-200">
                  <a 
                    href="https://www.linkedin.com/company/start-solo" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-900 hover:text-blue-600 transition-colors"
                    aria-label="Follow us on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/start.solo/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-900 hover:text-blue-600 transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <a 
                    href="http://hub.startsolo.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[color:var(--color-cta)] text-[color:var(--color-cta-text)] px-4 py-2 rounded-md hover:bg-[color:var(--color-cta-dark)] transition-colors text-center flex items-center justify-center font-medium"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Participant Login
                  </a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;