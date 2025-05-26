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
    emailOptIn: false,
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

      // Set timeout for redirect
      setTimeout(() => {
        window.location.href = 'https://hub.startsolo.in/l/ce8af018cf';
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormData(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative">
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
              <p className="text-gray-700 mb-2">
                We'll be in touch via WhatsApp within 12 hours to book your slot!
              </p>
              <div className="bg-primary/10 p-4 rounded-lg border border-primary mt-4">
                <p className="text-primary font-medium">
                  Please wait while we redirect you to confirm your session...
                </p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Let's Talk. One Mentor Call Can Save You Weeks.
              </h2>

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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-1">
                    What would you like help with? *
                  </label>
                  <select
                    id="agenda"
                    name="agenda"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Anything specific you'd like to discuss? (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailOptIn"
                      name="emailOptIn"
                      type="checkbox"
                      checked={formData.emailOptIn}
                      onChange={(e) => setFormData(prev => ({ ...prev, emailOptIn: e.target.checked }))}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </div>
                  <div className="ml-2">
                    <label htmlFor="emailOptIn" className="text-xs text-gray-600">
                      I'd like to receive updates about courses and resources. You can unsubscribe anytime.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formData.submitting}
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition flex items-center justify-center text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formData.submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Book My Call for ₹999 <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 italic">
                  Non-refundable commitment fee. Helps us prioritise serious requests.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorForm;