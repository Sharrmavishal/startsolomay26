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
    <section className="py-8 bg-brand-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-brand-gray-50 rounded-2xl p-8">
            <h2 className="text-lg text-brand-navy text-center mb-6">
              Still have questions about the upcoming sessions?
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Email */}
              <a 
                href="mailto:hello@startsolo.in"
                className="flex-1 bg-brand-white rounded-xl p-4 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 border border-brand-gray-200 group"
              >
                <Mail className="h-5 w-5 text-brand-yellow" />
                <span className="font-medium text-brand-navy">Contact Us</span>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-brand-whatsapp rounded-xl p-4 hover:bg-brand-whatsapp-dark transition-all duration-300 flex items-center justify-center gap-3 text-brand-white"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium text-brand-steel">Ask in WhatsApp Hub</span>
              </a>

              {/* Register */}
              <a 
                href="#webinar-dates"
                onClick={handleClick}
                className="flex-1 bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold gap-3 relative overflow-hidden group hover:shadow-lg z-0"
              >
                <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-3">
                  <span className="font-medium">Register for Session</span>
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;