import React, { useState } from 'react';
import { X, Download, AlertCircle } from 'lucide-react';

interface LeadCaptureFormProps {
  onClose: () => void;
  onSubmit: (formData: LeadCaptureData) => void;
  title: string;
  pdfName: string;
}

export interface LeadCaptureData {
  name: string;
  email: string;
  phone: string;
  emailOptIn: boolean;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onClose, onSubmit, title, pdfName }) => {
  const [formData, setFormData] = useState<LeadCaptureData>({
    name: '',
    email: '',
    phone: '',
    emailOptIn: true
  });
  
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Allow for country code format +XX XXXXXXXXXX
    const phoneRegex = /^\+[0-9]{1,4}\s[0-9]{6,14}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      email: '',
      phone: ''
    });
    
    // Validate email
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }
    
    // Validate phone
    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number with country code (e.g. +91 9876543210)' }));
      return;
    }
    
    setSubmitting(true);

    try {
      // Convert form data to URL-encoded string for Netlify
      const formDataToSubmit = new FormData(e.target as HTMLFormElement);
      await fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formDataToSubmit as any).toString()
      });
      
      setSubmitted(true);
      setSubmitting(false);
      
      // Call the onSubmit callback with the form data
      onSubmit(formData);
      
      // Auto-close after successful submission
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitting(false);
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
          {submitted ? (
            <div className="text-center py-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
              <p className="text-gray-700 mb-2">
                Your download is starting automatically...
              </p>
              <div className="bg-cta/10 p-4 rounded-lg border border-cta mt-4">
                <p className="text-brand-gray-900 font-medium">
                  <Download className="inline-block mr-2 h-5 w-5" />
                  Downloading {pdfName}...
                </p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {title}
              </h2>

              <form 
                onSubmit={handleSubmit}
                className="space-y-4"
                name="lead-capture"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                data-tracking="lead-capture-form"
                data-pdf-name={pdfName}
              >
                {/* Hidden fields for Netlify */}
                <input type="hidden" name="form-name" value="lead-capture" />
                <input type="hidden" name="pdf-name" value={pdfName} />
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary text-base"
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
                    className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary text-base`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number with Country Code *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-brand-primary focus:border-brand-primary text-base`}
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, phone: e.target.value }));
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Format: +[country code] [number], e.g. +91 9876543210</p>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailOptIn"
                      name="emailOptIn"
                      type="checkbox"
                      checked={formData.emailOptIn}
                      onChange={(e) => setFormData(prev => ({ ...prev, emailOptIn: e.target.checked }))}
                      className="h-4 w-4 text-yellow border-gray-300 rounded focus:ring-yellow"
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
                  disabled={submitting}
                  className="w-full bg-cta hover:bg-cta-dark text-cta-text px-4 py-2 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Download Now <Download className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureForm;
