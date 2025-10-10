import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { smoothScrollTo } from '../utils/scrollUtils';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    if (!href) return;


    // For home logo or other links to home
    if (href === '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      return;
    }

    // For regular routes (not hash links)
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[color:var(--color-navy)] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1741677468/Start_solo_Inverted_icon_100x100_qroif2.svg" 
                alt="Start Solo Logo" 
                className="h-10 w-10"
              />
              <span className="font-bold text-xl text-white">Start Solo</span>
            </div>
            <p className="text-gray-300 mb-4">
              Start Solo, but not alone
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/course" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">Launchpad Course</a></li>
              <li><a href="/webinar" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">Webinar</a></li>
              <li><a href="/women-entrepreneurs" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">For Women</a></li>
              <li><a href="/path/graduates-students" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">For Graduates</a></li>
              <li><a href="/engineers-in-career-transition" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">For Engineers</a></li>
              <li><a href="/#instructor" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">Mentors</a></li>
              <li><a href="/#testimonials" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="/#faq" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="/solosprint-bootcamp" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">Solosprint Bootcamp</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/#path-selection" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">Choose Your Path</a></li>
              <li>
                <a 
                  href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <MessageCircle className="h-4 w-4 mr-1 text-green-600" />
                  <span>WhatsApp Hub</span>
                </a>
              </li>
              <li><a href="/#lead-magnet" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">Downloads</a></li>
              <li>
                <a href="/join-mentor" onClick={handleClick} className="text-gray-300 hover:text-white transition-colors">
                  Join as a Mentor
                </a>
              </li>
              <li>
                <a 
                  href="/policies/privacy" 
                  onClick={handleClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/policies/terms" 
                  onClick={handleClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/policies/refund" 
                  onClick={handleClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contact Us</h4>
            <p className="text-gray-300 mb-4">
              Have questions about upcoming sessions or the course? We're here to help.
            </p>
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-white mr-2" />
              <a href="mailto:hello@startsolo.in" className="text-gray-300 hover:text-white transition-colors">
                hello@startsolo.in
              </a>
            </div>
            <a 
              href="/support" 
              onClick={handleClick}
              className="bg-[color:var(--color-teal)] hover:bg-[color:var(--color-cta-accent-dark)] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center text-sm font-semibold"
            >
              Contact Support
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-600 pt-8 text-center text-gray-300 text-sm">
          <p className="mb-2">&copy; 2025-26 Start Solo. All rights reserved.</p>
          <p>Results achieved will vary based on individual commitment, execution effectiveness, and prevailing market dynamics.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;