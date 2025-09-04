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
    <footer className="bg-cta/10 text-brand-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1741677468/Start_solo_Inverted_icon_100x100_qroif2.svg" 
                alt="Start Solo Logo" 
                className="h-10 w-10 bg-white rounded-full p-1"
              />
              <span className="font-bold text-xl">Start Solo</span>
            </div>
            <p className="text-brand-navy mb-4">
              Start Solo, but not alone
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">Home</a></li>
              <li><a href="/about" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">About Us</a></li>
              <li><a href="/#path-selection" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">Choose Your Path</a></li>
              <li><a href="/#instructor" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">Mentors</a></li>
              <li><a href="/quiz" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">Quiz</a></li>
              <li><a href="/#testimonials" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">Success Stories</a></li>
              <li><a href="/#faq" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">FAQs</a></li>
              <li><a href="/solosprint-bootcamp" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">Solosprint Bootcamp</a></li>
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
                  className="text-brand-navy hover:text-brand-yellow-dark transition flex items-center"
                >
                  <MessageCircle className="h-4 w-4 mr-1 text-green-400" />
                  <span>WhatsApp Hub</span>
                </a>
              </li>
              <li><a href="/#lead-magnet" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">Downloads</a></li>
              <li><a href="/#testimonials" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">Success Stories</a></li>
              <li>
                <a href="/join-mentor" onClick={handleClick} className="text-brand-navy hover:text-brand-yellow-dark transition">
                  Join as a Mentor
                </a>
              </li>
              <li>
                <a 
                  href="/policies/privacy" 
                  onClick={handleClick}
                  className="text-brand-navy hover:text-brand-yellow-dark transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/policies/terms" 
                  onClick={handleClick}
                  className="text-brand-navy hover:text-brand-yellow-dark transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/policies/refund" 
                  onClick={handleClick}
                  className="text-brand-navy hover:text-brand-yellow-dark transition"
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <p className="text-brand-navy mb-4">
              Have questions about upcoming sessions or the course? We're here to help.
            </p>
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-brand-yellow-light mr-2" />
              <a href="mailto:hello@startsolo.in" className="text-brand-navy hover:text-brand-yellow-dark transition">
                hello@startsolo.in
              </a>
            </div>
            <a 
              href="/support" 
              onClick={handleClick}
              className="bg-cta hover:bg-cta-dark text-cta-text px-4 py-2 rounded-lg transition flex items-center justify-center text-sm font-semibold"
            >
              Contact Support
            </a>
          </div>
        </div>
        
        <div className="border-t border-brand-yellow-light pt-8 text-center text-brand-navy text-sm">
          <p className="mb-2">&copy; {new Date().getFullYear()} Start Solo. All rights reserved.</p>
          <p>Results achieved will vary based on individual commitment, execution effectiveness, and prevailing market dynamics.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;