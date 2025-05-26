import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, Instagram, Linkedin } from 'lucide-react';
import { useContent } from './ContentProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { smoothScrollTo } from '../utils/scrollUtils';

const Header = () => {
  const { header } = useContent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'shadow-sm py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <a 
            href="/" 
            onClick={handleNavClick}
            className="flex items-center hover:opacity-80 transition-opacity duration-200"
            aria-label="Return to homepage"
          >
            <img 
              src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1741547630/logos_250_x_50_ma4vuc.svg"
              alt="Start Solo Logo"
              className="h-8 md:h-10 w-auto"
              onError={(e) => {
                if (!logoError) {
                  setLogoError(true);
                  e.currentTarget.src = "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741331994/Start_SOLO_logos_250_x_50_1_czoxog.png";
                }
              }}
            />
          </a>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-600 hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {header.navLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                className={`text-gray-600 hover:text-primary transition ${
                  link.label === "Join as a Mentor" ? "font-medium text-primary" : ""
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
                className="text-gray-400 hover:text-primary transition"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://www.instagram.com/start.solo/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-primary transition"
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
              className="bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-dark transition flex items-center text-sm"
            >
              <LogIn className="h-3.5 w-3.5 mr-1.5" />
              Student Login
            </a>
          </nav>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-100 z-50">
              <nav className="flex flex-col space-y-4">
                {header.navLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    className={`text-gray-600 hover:text-primary transition py-2 ${
                      link.label === "Join as a Mentor" ? "font-medium text-primary" : ""
                    }`}
                    onClick={handleNavClick}
                  >
                    {link.label}
                  </a>
                ))}
                
                {/* Social Media Links for Mobile */}
                <div className="flex items-center space-x-4 py-2 border-t border-gray-100">
                  <a 
                    href="https://www.linkedin.com/company/start-solo" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-primary transition"
                    aria-label="Follow us on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/start.solo/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-primary transition"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <a 
                    href="http://hub.startsolo.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition text-center flex items-center justify-center"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Student Login
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