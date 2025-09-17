import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageCircle, Send, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const SupportPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    submitted: false,
    submitting: false,
    error: ''
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I get a refund?",
      answer: "If you're not satisfied with your Session, email us at hello@startsolo.in with details, and we will address your query as per the refund and terms & conditions policy."
    },
    {
      question: "I missed my scheduled session. Can I reschedule?",
      answer: "Yes! If you missed your session, you can reschedule for another available date. Please contact us with your original booking details, and we'll help you find a new session date."
    },
    {
      question: "How do I access the course materials?",
      answer: "After enrolling in the full course, you'll receive login credentials to our learning platform where all course materials are hosted, or you will get access via WhatsApp, depending on the delivery format mechanism of the course. If you're having trouble accessing your materials, please contact our support team."
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ ...formState, submitting: true });
    
    try {
      // Convert form data to URL-encoded string for Netlify
      const formData = new FormData(e.target as HTMLFormElement);
      await fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString()
      });
      
      setFormState({
        ...formState,
        submitted: true,
        submitting: false,
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setFormState({
        ...formState,
        submitting: false,
        error: 'There was an error submitting the form. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <a 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
          </a>
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Support & Contact</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help you on your solo business journey. Get in touch with us through any of the channels below.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <Mail className="h-8 w-8 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4 text-sm">For general inquiries and support</p>
              <a 
                href="mailto:hello@startsolo.in" 
                className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                hello@startsolo.in
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <MessageCircle className="h-8 w-8 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">WhatsApp Support</h3>
              <p className="text-gray-600 mb-4 text-sm">Quick responses for urgent queries</p>
              <a 
                href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij" 
                className="text-green-600 hover:text-green-700 transition-colors font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {formState.submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  Your message has been received. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setFormState({ ...formState, submitted: false })}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-800 font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                name="support"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
              >
                {/* Hidden field for Netlify form handling */}
                <input type="hidden" name="form-name" value="support" />
                <div className="hidden">
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Please select a subject</option>
                    <option value="Session Inquiry">Session Inquiry</option>
                    <option value="Course Information">Course Information</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Partnership Opportunity">Partnership Opportunity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                {formState.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {formState.error}
                  </div>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={formState.submitting}
                    className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                  >
                    {formState.submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;