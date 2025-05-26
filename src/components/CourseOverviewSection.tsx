import React, { useState } from 'react';
import { Calendar, Clock, Users, Shield, Info, Send, MessageCircle } from 'lucide-react';
import { useContent } from './ContentProvider';

const CourseOverviewSection = () => {
  const { course, general } = useContent();
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
    <section id="course" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-block bg-primary-light/20 text-primary-dark px-4 py-1 rounded-full mb-3 font-medium">
            THE FULL PROGRAM
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Start Solo Blueprint: The Complete Course
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            After the Solo Accelerator Session, take your solo business journey to the next level with our comprehensive course delivered LIVE.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6">
              {/* Course Structure Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Live Sessions */}
                <div className="bg-primary-light/5 p-4 rounded-lg border border-primary-light/20">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-bold text-gray-900">Live Sessions Structure</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 text-sm">
                      <span className="font-medium">4 Weekends</span>
                      <span className="mx-2">•</span>
                      <span>Each weekend - 2 live sessions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm text-gray-600">2.5 to 3 hours per session</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm text-gray-600">90 mins – Live Training + Exercises</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm text-gray-600">30 mins – Spotlight Activity / Group Discussions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm text-gray-600">30-45 mins – Live Q&A / Coaching</span>
                    </div>
                  </div>
                </div>

                {/* Cohort Details */}
                <div className="bg-secondary-light/5 p-4 rounded-lg border border-secondary-light/20">
                  <div className="flex items-center mb-3">
                    <Users className="h-5 w-5 text-secondary mr-2" />
                    <h3 className="font-bold text-gray-900">Cohort Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-secondary mr-2" />
                      <span className="text-sm text-gray-700">Next cohort starts April 12, 2025</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-secondary mr-2" />
                      <span className="text-sm text-gray-700">Limited seats per cohort</span>
                    </div>
                    <div className="bg-white rounded-md p-3 border border-secondary-light/20 space-y-2">
                      <div className="flex items-center text-secondary text-sm">
                        <Shield className="h-4 w-4 mr-2" />
                        <span className="font-medium">Special discount for session participants</span>
                      </div>
                      <div className="flex items-center text-secondary text-sm">
                        <Info className="h-4 w-4 mr-2" />
                        <span className="font-medium">Get full details about the curriculum, free tools, and AI resources during the accelerator session</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="mt-8 border-t border-gray-100 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Request More Information
                </h3>

                {formData.submitted ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                    <div className="text-green-600 mb-2">✓</div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Thank You!</h4>
                    <p className="text-gray-700 mb-4">
                      Your message has been received. We'll get back to you as soon as possible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, submitted: false }))}
                        className="inline-flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-light/10 transition"
                      >
                        Send Another Inquiry
                      </button>
                      <a 
                        href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-[#25D366] text-white rounded-md hover:bg-[#128C7E] transition"
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
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
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      ></textarea>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={formData.submitting}
                        className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {formData.submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Inquiry <Send className="ml-2 h-5 w-5" />
                          </>
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