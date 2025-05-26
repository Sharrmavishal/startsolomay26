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

    // For Quiz link
    if (href === '/quiz') {
      navigate('/quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
    <footer className="bg-rich text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1741677468/Start_solo_Inverted_icon_100x100_qroif2.svg" 
                alt="Start Solo Logo" 
                className="h-6 w-6"
              />
              <span className="font-bold text-xl">Start Solo</span>
            </div>
            <p className="text-gray-400 mb-4">
              Start Solo, but not alone
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" onClick={handleClick} className="text-gray-400 hover:text-white transition">Home</a></li>
              <li><a href="/about" onClick={handleClick} className="text-gray-400 hover:text-white transition">About Us</a></li>
              <li><a href="/learn" onClick={handleClick} className="text-gray-400 hover:text-white transition">Learn</a></li>
              <li><a href="/#instructor" onClick={handleClick} className="text-gray-400 hover:text-white transition">Mentors</a></li>
              <li><a href="/quiz" onClick={handleClick} className="text-gray-400 hover:text-white transition">Quiz</a></li>
              <li><a href="/#testimonials" onClick={handleClick} className="text-gray-400 hover:text-white transition">Success Stories</a></li>
              <li><a href="/#faq" onClick={handleClick} className="text-gray-400 hover:text-white transition">FAQs</a></li>
              <li><a href="/solosprint-bootcamp" onClick={handleClick} className="text-gray-400 hover:text-white transition">Solosprint Bootcamp</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition flex items-center"
                >
                  <MessageCircle className="h-4 w-4 mr-1 text-green-400" />
                  <span>WhatsApp Hub</span>
                </a>
              </li>
              <li><a href="/#testimonials" onClick={handleClick} className="text-gray-400 hover:text-white transition">Success Stories</a></li>
              <li>
                <a href="/join-mentor" onClick={handleClick} className="text-gray-400 hover:text-white transition">
                  Join as a Mentor
                </a>
              </li>
              <li>
                <a 
                  href="/policies/privacy" 
                  onClick={handleClick}
                  className="text-gray-400 hover:text-white transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/policies/terms" 
                  onClick={handleClick}
                  className="text-gray-400 hover:text-white transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/policies/refund" 
                  onClick={handleClick}
                  className="text-gray-400 hover:text-white transition"
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <p className="text-gray-400 mb-4">
              Have questions about upcoming sessions or the course? We're here to help.
            </p>
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-primary-light mr-2" />
              <a href="mailto:hello@startsolo.in" className="text-gray-400 hover:text-white transition">
                hello@startsolo.in
              </a>
            </div>
            <a 
              href="/support" 
              onClick={handleClick}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition inline-block"
            >
              Contact Support
            </a>
          </div>
        </div>
        
        <div className="border-t border-rich-light pt-8 text-center text-gray-500 text-sm">
          <p className="mb-2">&copy; {new Date().getFullYear()} Start Solo. All rights reserved.</p>
          <p>Results achieved will vary based on individual commitment, execution effectiveness, and prevailing market dynamics.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;