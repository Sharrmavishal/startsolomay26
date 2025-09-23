import React, { useState } from 'react';
import { X, Phone, Check } from 'lucide-react';

interface DiscoveryCallFormProps {
  onClose: () => void;
  audience?: 'women' | 'graduates' | 'engineers' | 'default';
}

const DiscoveryCallForm: React.FC<DiscoveryCallFormProps> = ({ onClose, audience = 'default' }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    city: '',
    whatsappPermission: false,
    consent: false
  });

  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
    city: '',
    consent: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateMobile = (mobile: string) => {
    if (!mobile.trim()) return 'Mobile number is required';
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) return 'Mobile number must be 10 digits';
    if (!/^[6-9]/.test(cleanMobile)) return 'Mobile number must start with 6, 7, 8, or 9';
    return '';
  };

  const validateCity = (city: string) => {
    if (!city.trim()) return 'City is required';
    if (city.trim().length < 2) return 'City must be at least 2 characters';
    if (city.trim().length > 30) return 'City must be less than 30 characters';
    if (!/^[a-zA-Z\s]+$/.test(city.trim())) return 'City can only contain letters and spaces';
    return '';
  };

  const validateConsent = (consent: boolean) => {
    if (!consent) return 'You must agree to the Terms of Service and Privacy Policy';
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(formData.name);
    const mobileError = validateMobile(formData.mobile);
    const cityError = validateCity(formData.city);
    const consentError = validateConsent(formData.consent);
    
    const newErrors = {
      name: nameError,
      mobile: mobileError,
      city: cityError,
      consent: consentError
    };
    
    setErrors(newErrors);
    
    // If there are any errors, don't submit
    if (nameError || mobileError || cityError || consentError) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Track form submission in Netlify
    const netlifyFormData = new FormData();
    netlifyFormData.append('form-name', 'discovery-call-form');
    netlifyFormData.append('name', formData.name.trim());
    netlifyFormData.append('mobile', formData.mobile.replace(/\D/g, ''));
    netlifyFormData.append('city', formData.city.trim());
    netlifyFormData.append('whatsapp-permission', formData.whatsappPermission ? 'Yes' : 'No');
    
    try {
      // Submit to Netlify Forms
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyFormData as any).toString()
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-[color:var(--color-gray-900)] hover:text-[color:var(--color-navy)]">
            <X className="h-5 w-5" />
          </button>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Thank You!</h3>
          <p className="text-[color:var(--color-gray-900)] mb-3">
            Your discovery call request has been submitted successfully.
          </p>
          <p className="text-[color:var(--color-gray-600)] text-sm">
            Our team will contact you within 24 hours to schedule your free discovery call.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[color:var(--color-gray-900)] hover:text-[color:var(--color-navy)] transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[color:var(--color-navy)] rounded-full flex items-center justify-center mx-auto mb-3">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[color:var(--color-navy)] mb-2">
            Set up a Discovery Call
          </h2>
          <p className="text-[color:var(--color-gray-900)] text-sm">
            Let's discuss your solopreneur journey and how we can help you succeed.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" name="discovery-call-form" data-netlify="true">
          {/* Hidden form name for Netlify */}
          <input type="hidden" name="form-name" value="discovery-call-form" />
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[color:var(--color-gray-900)] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              maxLength={50}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-navy)] focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-[color:var(--color-gray-300)]'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-[color:var(--color-gray-900)] mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-navy)] focus:border-transparent ${
                errors.mobile ? 'border-red-500' : 'border-[color:var(--color-gray-300)]'
              }`}
              placeholder="Enter your 10-digit mobile number"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-[color:var(--color-gray-900)] mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              maxLength={30}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-navy)] focus:border-transparent ${
                errors.city ? 'border-red-500' : 'border-[color:var(--color-gray-300)]'
              }`}
              placeholder="Enter your city"
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          {/* WhatsApp Permission Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="whatsappPermission"
              name="whatsappPermission"
              checked={formData.whatsappPermission}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-[color:var(--color-navy)] border-[color:var(--color-gray-300)] rounded focus:ring-[color:var(--color-navy)]"
            />
            <label htmlFor="whatsappPermission" className="text-sm text-[color:var(--color-gray-900)]">
              {audience === 'women' && "I give permission to add me to the Women's WhatsApp Community for networking and support"}
              {audience === 'graduates' && 'I give permission to add me to the Graduates WhatsApp Community for networking and support'}
              {audience === 'engineers' && 'I give permission to add me to the Engineers WhatsApp Community for networking and support'}
              {audience === 'default' && 'I give permission to add me to the Start Solo WhatsApp Community for networking and support'}
            </label>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-[color:var(--color-navy)] border-[color:var(--color-gray-300)] rounded focus:ring-[color:var(--color-navy)]"
            />
            <label htmlFor="consent" className="text-sm text-[color:var(--color-gray-900)]">
              I agree to the <a href="/terms" target="_blank" className="text-[color:var(--color-teal)] hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-[color:var(--color-teal)] hover:underline">Privacy Policy</a>, and consent to receive updates. Unsubscribe anytime.
            </label>
          </div>
          {errors.consent && (
            <p className="text-red-500 text-xs mt-1">{errors.consent}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[color:var(--color-navy)] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[color:var(--color-cta)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Book Discovery Call'}
          </button>
        </form>

        {/* Info Note */}
        <div className="mt-4 text-center">
          <p className="text-[color:var(--color-gray-500)] text-xs leading-relaxed">
            Thank you for your interest. We typically respond within 24 hours on business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryCallForm;
