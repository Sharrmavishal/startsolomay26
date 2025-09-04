import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useContent } from './ContentProvider';

const FAQSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  
  const { faq = { 
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions',
    faqs: [] 
  }} = useContent();

  if (!faq || !faq.faqs) {
    console.warn('FAQ content is missing or incomplete from context.');
  }
  
  // Get visible FAQs based on expanded state
  const visibleFaqs = isExpanded ? faq.faqs : faq.faqs.slice(0, 4);

  // If there are no FAQs, don't render the section
  if (!faq.faqs || faq.faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="py-12 bg-brand-yellowte">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-brand-navy mb-4">{faq.title}</h2>
          <p className="text-brand-steel mb-4">{faq.subtitle}</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {visibleFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-brand-yellowte rounded-lg border transition-all duration-300 ${
                  openIndex === index ? 'border-brand-yellow shadow-md' : 'border-brand-gray-200'
                }`}
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                >
                  <span className={`font-medium ${openIndex === index ? 'text-brand-yellow' : 'text-brand-navy'}`}>
                    {faq.question}
                  </span>
                  <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-90 text-brand-yellow' : 'text-brand-steel'
                  }`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="p-4 pt-0 text-brand-steel bg-brand-snow whitespacebg-brand-yellow-lightne">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {faq.faqs.length > 4 && (
            <div className="text-center mt-6">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-brand-yellow hover:text-brand-yellow-dark transition font-medium"
              >
                {isExpanded ? (
                  <>Show Less <ChevronRight className="ml-1 h-4 w-4 rotate-90" /></>
                ) : (
                  <>View More Questions <ChevronRight className="ml-1 h-4 w-4 -rotate-90" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;