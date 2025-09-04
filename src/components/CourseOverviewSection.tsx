import React, { useState } from 'react';
import { Calendar, Clock, Users, Shield, Info, Send, MessageCircle } from 'lucide-react';
import { useContent } from './ContentProvider';

const CourseOverviewSection = () => {
  const { course, general } = useContent();

  if (!course) {
    console.warn('Course content is missing from context.');
  }
  if (!general) {
    console.warn('General content is missing from context.');
  }
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    submitted: false,
    submitting: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, submitting: true }));
    
    try {
      // Convert form data to URL-encoded string for Netlify
      const formData = new FormData(e.target as HTMLFormElement);
      await fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString()
      });
      
      setFormData(prev => ({
        ...prev,
        submitted: true,
        submitting: false,
        name: '',
        email: '',
        subject: '',
        message: ''
      }));
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormData(prev => ({ ...prev, submitting: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="course" className="py-12 bg-brand-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-block bg-cta/20 text-cta px-4 py-1 rounded-full mb-3 font-bold">
            THE FULL PROGRAM
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-gray-500 mb-3">
            Start Solo Blueprint: The Complete Course
          </h2>
          <p className="text-brand-highlight max-w-3xl mx-auto">
            After the Solo Accelerator Session, take your solo business journey to the next level with our comprehensive course delivered LIVE.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-white rounded-xl shadow-md overflow-hidden border border-brand-gray-100">
            <div className="p-6">
              {/* Course Structure Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Live Sessions */}
                <div className="bg-cta/10 p-4 rounded-lg border border-cta/20">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-brand-primary mr-2" />
                    <h3 className="font-bold text-brand-gray-500">Live Sessions Structure</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-brand-gray-700 text-sm">
                      <span className="font-medium">4 Weekends</span>
                      <span className="mx-2">•</span>
                      <span>Each weekend - 2 live sessions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-brand-primary mr-2" />
                      <span className="text-sm text-brand-gray-600">2.5 to 3 hours per session</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-brand-primary mr-2" />
                      <span className="text-sm text-brand-gray-600">90 mins – Live Training + Exercises</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-brand-primary mr-2" />
                      <span className="text-sm text-brand-gray-600">30 mins – Spotlight Activity / Group Discussions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-brand-primary mr-2" />
                      <span className="text-sm text-brand-gray-600">30-45 mins – Live Q&A / Coaching</span>
                    </div>
                  </div>
                </div>

                {/* Cohort Details */}
                <div className="bg-brand-secondary-light/5 p-4 rounded-lg border border-brand-secondary-light/20">
                  <div className="flex items-center mb-3">
                    <Users className="h-5 w-5 text-brand-secondary mr-2" />
                    <h3 className="font-bold text-brand-gray-500">Cohort Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-brand-secondary mr-2" />
                      <span className="text-sm text-brand-gray-700">Next cohort starts April 12, 2025</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-brand-secondary mr-2" />
                      <span className="text-sm text-brand-gray-700">Limited seats per cohort</span>
                    </div>
                    <div className="bg-brand-white rounded-md p-3 border border-brand-secondary-light/20 space-y-2">
                      <div className="flex items-center text-brand-secondary text-sm">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="font-medium">Special discount for session participants</span>
                      </div>
                      <div className="flex items-center text-brand-secondary text-sm">
                        <Info className="h-4 w-4 mr-2" />
                        <span className="font-medium">Get full details about the curriculum, free tools, and AI resources during the accelerator session</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="mt-8 border-t border-brand-gray-100 pt-8">
                <h3 className="text-xl font-bold text-brand-gray-500 mb-6 text-center">
                  Request More Information
                </h3>

                {formData.submitted ? (
                  <div className="bg-brand-green-50 border border-brand-green-100 rounded-lg p-6 text-center">
                    <div className="text-brand-green-600 mb-2">✓</div>
                    <h4 className="text-lg font-bold text-brand-gray-500 mb-2">Thank You!</h4>
                    <p className="text-brand-gray-700 mb-4">
                      Your message has been received. We'll get back to you as soon as possible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, submitted: false }))}
                        className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
                      >
                        <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                          Send Another Inquiry
                        </span>
                      </button>
                      <a 
                        href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-brand-whatsapp text-brand-white rounded-md hover:bg-brand-whatsapp-dark transition"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Join WhatsApp Hub
                      </a>
                    </div>
                  </div>
                ) : (
                  <form 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    name="course-inquiry"
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                  >
                    {/* Hidden field for Netlify form handling */}
                    <input type="hidden" name="form-name" value="course-inquiry" />
                    <div className="hidden">
                      <label>
                        Don't fill this out if you're human: <input name="bot-field" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-brand-gray-700 mb-1">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                      >
                        <option value="">Please select</option>
                        <option value="accelerator">Solo Accelerator Session</option>
                        <option value="curriculum">Start Solo Blueprint's Curriculum</option>
                        <option value="experts">Information about Expert Speakers</option>
                        <option value="bootcamp-schedule">Bootcamp Schedule</option>
                        <option value="bootcamp-structure">Bootcamp Structure</option>
                        <option value="membership">Membership Details</option>
                        <option value="tools">Complementary Tools</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-brand-gray-700 mb-1">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-brand-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                      ></textarea>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={formData.submitting}
                        className="bg-cta text-white px-6 py-3 rounded-lg transition-all duration-300 inline-flex items-center justify-center text-sm md:text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group hover:shadow-lg z-0"
                      >
                        <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1] group-disabled:hidden"></span>
                        {formData.submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="relative z-10">Sending...</span>
                          </>
                        ) : (
                          <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                            Send Inquiry <Send className="ml-2 h-5 w-5" />
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseOverviewSection;