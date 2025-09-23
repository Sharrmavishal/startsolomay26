import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface MentorFormProps {
  onClose: () => void;
}

const MentorForm: React.FC<MentorFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    agenda: '',
    message: '',
    consent: false,
    submitted: false,
    submitting: false
  });

  const agendaOptions = [
    "I have an idea, but it's not clear",
    "I want to validate before I invest more",
    "I'm stuck with pricing/clients",
    "I'm restarting after a career break",
    "I want help choosing a course"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, submitting: true }));

    try {
      // Convert form data to URL-encoded string for Netlify
      const formDataToSubmit = new FormData(e.target as HTMLFormElement);
      await fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formDataToSubmit as any).toString()
      });
      
      setFormData(prev => ({
        ...prev,
        submitted: true,
        submitting: false
      }));
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormData(prev => ({ ...prev, submitting: false }));
    }
  };

  // (Removed Razorpay embed script to avoid duplicate buttons). Using a styled link instead.

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          {formData.submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-[color:var(--color-cta)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[color:var(--color-cta-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-3">Thank You!</h3>
              <p className="text-[color:var(--color-gray-900)] mb-4 text-sm">
                We'll be in touch via WhatsApp within 12 hours to book your slot. To confirm your session, please complete the ₹999 commitment fee now:
              </p>
              {/* Single styled CTA button linking to Razorpay page */}
              <div className="flex justify-center">
                <a
                  href="https://rzp.io/rzp/Ibh0MbWI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#1D3A6B] hover:bg-[#152A4F] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-colors"
                >
                  Pay ₹999 to Confirm
                </a>
              </div>
              <p className="text-xs text-[color:var(--color-gray-700)] mt-3">
                Having trouble? <a href="https://rzp.io/rzp/Ibh0MbWI" target="_blank" rel="noopener noreferrer" className="text-[color:var(--color-teal)] underline">Open payment page</a>
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-[color:var(--color-navy)] mb-1">
                  Let's Talk. One Mentor Call Can Save You Weeks.
                </h2>
                <p className="text-[color:var(--color-gray-900)] text-sm">
                  Get personalized guidance from experienced entrepreneurs
                </p>
              </div>

              <form 
                onSubmit={handleSubmit}
                className="space-y-4"
                name="mentor-call"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
              >
                {/* Hidden fields for Netlify */}
                <input type="hidden" name="form-name" value="mentor-call" />
                <div className="hidden">
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[color:var(--color-gray-900)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    className="w-full border border-[color:var(--color-gray-200)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[color:var(--color-navy)] focus:border-[color:var(--color-navy)] text-sm transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[color:var(--color-gray-900)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                    className="w-full border border-[color:var(--color-gray-200)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[color:var(--color-navy)] focus:border-[color:var(--color-navy)] text-sm transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-[color:var(--color-gray-900)] mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full border border-[color:var(--color-gray-200)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[color:var(--color-navy)] focus:border-[color:var(--color-navy)] text-sm transition-colors"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                  <p className="text-xs text-[color:var(--color-gray-900)] mt-1">
                    Include country code (e.g., +91 for India)
                  </p>
                </div>

                <div>
                  <label htmlFor="agenda" className="block text-sm font-medium text-[color:var(--color-gray-900)] mb-1">
                    What would you like help with? *
                  </label>
                  <select
                    id="agenda"
                    name="agenda"
                    required
                    className="w-full border border-[color:var(--color-gray-200)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[color:var(--color-navy)] focus:border-[color:var(--color-navy)] text-sm transition-colors"
                    value={formData.agenda}
                    onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
                  >
                    <option value="">Please select</option>
                    {agendaOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[color:var(--color-gray-900)] mb-1">
                    Anything specific you'd like to discuss? (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={2}
                    placeholder="Tell us more about your situation, goals, or specific challenges..."
                    className="w-full border border-[color:var(--color-gray-200)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[color:var(--color-navy)] focus:border-[color:var(--color-navy)] text-sm transition-colors resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  ></textarea>
                </div>

                <div className="flex items-start space-x-2 p-3 bg-[color:var(--color-gray-50)] rounded-lg">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                    className="mt-0.5 h-3 w-3 text-[color:var(--color-navy)] border-[color:var(--color-gray-200)] rounded focus:ring-[color:var(--color-navy)]"
                  />
                  <label htmlFor="consent" className="text-xs text-[color:var(--color-gray-900)]">
                    I agree to the <a href="/terms" target="_blank" className="text-[color:var(--color-teal)] hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-[color:var(--color-teal)] hover:underline">Privacy Policy</a>, and consent to receive updates. Unsubscribe anytime.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formData.submitting}
                  aria-label="Book mentorship call and pay commitment fee"
                  className="w-full bg-[color:var(--color-cta)] hover:bg-[color:var(--color-cta-dark)] text-[color:var(--color-cta-text)] px-5 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-base sm:text-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {formData.submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Book My Call for ₹999 <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-xs text-[color:var(--color-gray-900)] mb-2">
                    <span className="font-semibold">₹999 commitment fee</span> - Non-refundable
                  </p>
                  <p className="text-xs text-[color:var(--color-gray-900)]">
                    Helps us prioritize serious requests and ensure quality mentorship
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorForm;