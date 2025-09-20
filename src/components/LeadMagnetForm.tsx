import React, { useState } from 'react';
import { X, Download, CheckCircle } from 'lucide-react';

interface LeadMagnetFormProps {
  isOpen: boolean;
  onClose: () => void;
  leadMagnet: {
    title: string;
    downloadUrl: string;
    fileName: string;
  };
}

const LeadMagnetForm: React.FC<LeadMagnetFormProps> = ({ isOpen, onClose, leadMagnet }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consent: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateName = (name: string): string => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) return 'Please enter a valid 10-digit mobile number';
    return '';
  };

  const validateConsent = (consent: boolean): string => {
    if (!consent) return 'You must agree to the Terms of Service and Privacy Policy';
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const consentError = validateConsent(formData.consent);

    if (nameError || emailError || phoneError || consentError) {
      setErrors({
        name: nameError,
        email: emailError,
        phone: phoneError,
        consent: consentError
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Netlify Forms
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('form-name', 'lead-magnet-download');
      formDataToSubmit.append('lead-magnet-title', leadMagnet.title);
      formDataToSubmit.append('name', formData.name.trim());
      formDataToSubmit.append('email', formData.email.trim());
      formDataToSubmit.append('phone', formData.phone.replace(/\D/g, ''));
      formDataToSubmit.append('download-file', leadMagnet.fileName);
      formDataToSubmit.append('timestamp', new Date().toISOString());

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSubmit as any).toString()
      });

      // Show success state
      setIsSuccess(true);
      
      // Auto download the file
      const link = document.createElement('a');
      link.href = leadMagnet.downloadUrl;
      link.download = leadMagnet.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', consent: false });
        setErrors({});
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-[color:var(--color-navy)] mb-2">
                {isSuccess ? 'Download Started!' : 'Get Your Free Resource'}
              </h2>
              {!isSuccess && (
                <p className="text-sm sm:text-base text-[color:var(--color-gray-900)] text-opacity-70">
                  Fill in your details to download instantly
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isSuccess ? (
            <div className="text-center py-12">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-[color:var(--color-navy)] mb-4">
                Thank You!
              </h3>
              <p className="text-lg text-[color:var(--color-gray-900)] mb-4">
                Your download of <strong className="text-[color:var(--color-teal)]">{leadMagnet.title}</strong> has started automatically.
              </p>
              <p className="text-sm text-[color:var(--color-gray-900)] text-opacity-70">
                Check your downloads folder. This window will close automatically.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center bg-gradient-to-r from-[color:var(--color-teal)] bg-opacity-10 to-[color:var(--color-sky)] bg-opacity-10 p-4 sm:p-6 rounded-xl border border-[color:var(--color-teal)] border-opacity-20">
                  <div className="bg-[color:var(--color-teal)] p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                    <Download className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[color:var(--color-navy)] text-base sm:text-lg mb-1">
                      {leadMagnet.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[color:var(--color-gray-900)] text-opacity-70">
                      Free download • No spam, ever
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[color:var(--color-navy)] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--color-teal)] focus:border-transparent transition-all text-sm sm:text-base ${
                      errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                    maxLength={50}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[color:var(--color-navy)] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--color-teal)] focus:border-transparent transition-all ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[color:var(--color-navy)] mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--color-teal)] focus:border-transparent transition-all ${
                      errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your 10-digit mobile number"
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-2 p-3 bg-[color:var(--color-gray-50)] rounded-lg">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="mt-0.5 h-3 w-3 text-[color:var(--color-teal)] border-[color:var(--color-gray-200)] rounded focus:ring-[color:var(--color-teal)]"
                  />
                  <label htmlFor="consent" className="text-xs text-[color:var(--color-gray-900)]">
                    I agree to the <a href="/terms" target="_blank" className="text-[color:var(--color-teal)] hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-[color:var(--color-teal)] hover:underline">Privacy Policy</a>, and consent to receive updates. Unsubscribe anytime.
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.consent}
                  </p>
                )}

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.submit}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[color:var(--color-teal)] hover:bg-[#4A8B85] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-3" />
                      Download Now
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

export default LeadMagnetForm;
