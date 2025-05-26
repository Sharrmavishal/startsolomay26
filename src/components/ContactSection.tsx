import React from 'react';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { smoothScrollTo } from '../utils/scrollUtils';

const ContactSection = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      smoothScrollTo(href.substring(1));
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-lg text-gray-900 text-center mb-6">
              Still have questions about the upcoming sessions?
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Email */}
              <a 
                href="mailto:hello@startsolo.in"
                className="flex-1 bg-white rounded-xl p-4 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 border border-gray-200 group"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-medium text-gray-900">Contact Us</span>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] rounded-xl p-4 hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center gap-3 text-white"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Ask in WhatsApp Hub</span>
              </a>

              {/* Register */}
              <a 
                href="#webinar-dates"
                onClick={handleClick}
                className="flex-1 bg-primary rounded-xl p-4 hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-3 text-white"
              >
                <span className="font-medium">Register for Session</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;