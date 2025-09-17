import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { useContent } from './ContentProvider';

const FAQSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { faq = { 
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions',
    faqs: [] 
  }} = useContent();

  if (!faq || !faq.faqs) {
    console.warn('FAQ content is missing or incomplete from context.');
  }
  
  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faq.faqs;
    return faq.faqs.filter(faqItem => 
      faqItem.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faqItem.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [faq.faqs, searchQuery]);

  // Get visible FAQs based on expanded state
  const visibleFaqs = isExpanded ? filteredFaqs : filteredFaqs.slice(0, 4);

  // If there are no FAQs, don't render the section
  if (!faq.faqs || faq.faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{faq.title}</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">{faq.subtitle}</p>
          
          {/* Search Bar */}
          <div className="max-w-sm mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            />
          </div>
        </div>
        
        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse all questions below.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {visibleFaqs.map((faqItem, index) => (
                  <div 
                    key={index} 
                    className={`bg-white rounded-lg border transition-all duration-300 hover:shadow-md ${
                      openIndex === index 
                        ? 'border-blue-500 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <button
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                      aria-expanded={openIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span className={`font-medium pr-4 ${
                        openIndex === index ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {faqItem.question}
                      </span>
                      <ChevronDown className={`h-5 w-5 transition-transform duration-300 flex-shrink-0 ${
                        openIndex === index ? 'rotate-180 text-blue-600' : 'text-gray-500'
                      }`} />
                    </button>
                    <div 
                      id={`faq-answer-${index}`}
                      className={`overflow-hidden transition-all duration-300 ${
                        openIndex === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-4 pb-4">
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {faqItem.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More/Less Button */}
              {filteredFaqs.length > 4 && (
                <div className="text-center mt-6">
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    {isExpanded ? (
                      <>
                        Show Less
                        <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
                      </>
                    ) : (
                      <>
                        View All {filteredFaqs.length} Questions
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-8">
          <div className="bg-gray-50 rounded-lg p-6 max-w-xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/support" 
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Contact Support
              </a>
              <a 
                href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Visual divider */}
      <div className="border-t border-gray-200 mt-8"></div>
    </section>
  );
};

export default FAQSection;