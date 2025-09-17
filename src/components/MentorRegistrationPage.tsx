import React, { useState } from 'react';
import { ArrowLeft, Send, Shield, Check, ChevronDown, ChevronUp, ArrowRight, User, Briefcase, Target } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  background: string;
  role: string;
  expertise: string[];
  otherExpertise: string;
  whyInterested: string;
  yearsOfExperience: string;
  submitted: boolean;
  submitting: boolean;
  currentStep: number;
}

const MentorRegistrationPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    background: '',
    role: 'mentor',
    expertise: [],
    otherExpertise: '',
    whyInterested: '',
    yearsOfExperience: '',
    submitted: false,
    submitting: false,
    currentStep: 1
  });

  // Simplified expertise categories with most popular options
  const popularExpertise = [
    "Business Strategy & Planning",
    "Digital Marketing",
    "Sales & Business Development", 
    "Financial Management",
    "Web Development",
    "Content Creation & Writing",
    "Leadership & Team Management",
    "Productivity & Time Management",
    "Career Coaching",
    "Project Management"
  ];

  const allExpertise = [
    "Business Strategy & Planning",
    "Digital Marketing", 
    "Sales & Business Development",
    "Financial Management",
    "Web Development",
    "Content Creation & Writing",
    "Leadership & Team Management",
    "Productivity & Time Management",
    "Career Coaching",
    "Project Management",
    "Data Analysis",
    "Graphic Design",
    "Video Production",
    "Public Speaking",
    "Legal & Compliance",
    "Operations Management",
    "Customer Service",
    "Branding & Design",
    "Social Media Marketing",
    "E-commerce",
    "Mobile App Development",
    "Cybersecurity",
    "Machine Learning",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, submitting: true }));
    
    try {
      // Convert form data to URL-encoded string for Netlify
      const formDataToSubmit = new FormData(e.target as HTMLFormElement);
      // Convert arrays to comma-separated strings for Netlify
      formDataToSubmit.set('expertise', formData.expertise.join(', '));
      
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

  const toggleExpertise = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(skill)
        ? prev.expertise.filter(s => s !== skill)
        : [...prev.expertise, skill]
    }));
  };

  const nextStep = () => {
    setFormData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setFormData(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.background && formData.yearsOfExperience;
      case 3:
        return formData.expertise.length > 0 && formData.whyInterested;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <a 
            href="/" 
            className="inline-flex items-center text-brand-teal hover:text-brand-teal-dark mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
          </a>

          <div className="bg-brand-white rounded-xl shadow-md overflow-hidden border border-brand-gray-200">
            {/* Hero Image */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-brand-navy z-10"></div>
              <img 
                src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1743151891/Untitled_design_6_reaw6k.png"
                alt="Mentorship at Start Solo"
                className="w-full h-full object-cover opacity-40 relative z-0"
              />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="p-8 text-center w-full">
                  <h1 className="text-3xl font-bold mb-3 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                    Join as a Mentor
                  </h1>
                  <p className="text-lg text-white max-w-2xl mx-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    Share your expertise and help shape the next generation of successful solopreneurs.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {formData.submitted ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Interest!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We've received your application to join our mentor network. Our team will review your profile and get back to you within 2-3 business days.
                  </p>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, submitted: false, currentStep: 1 }))}
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-800 font-medium"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={handleSubmit}
                  name="mentor-registration"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                >
                  {/* Hidden field for Netlify form handling */}
                  <input type="hidden" name="form-name" value="mentor-registration" />
                  <div className="hidden">
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
                  </div>

                  <div>
                    {/* Progress Steps */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            formData.currentStep >= step 
                              ? 'bg-brand-teal text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {step}
                          </div>
                          {step < 3 && (
                            <div className={`w-12 h-1 mx-2 ${
                              formData.currentStep > step ? 'bg-brand-teal' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step Content */}
                  {formData.currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <User className="h-12 w-12 text-brand-teal mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-brand-navy mb-2">Basic Information</h2>
                        <p className="text-brand-gray-900">Let's start with your contact details</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-brand-gray-900 mb-1 body-brand">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                            className="w-full px-4 py-3 border border-brand-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-brand-gray-900 mb-1 body-brand">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                            className="w-full px-4 py-3 border border-brand-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-brand-gray-900 mb-1 body-brand">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                          className="w-full px-4 py-3 border border-brand-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!isStepValid(1)}
                          className="bg-brand-teal text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-teal-dark"
                        >
                          Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {formData.currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Briefcase className="h-12 w-12 text-brand-teal mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-brand-navy mb-2">Professional Background</h2>
                        <p className="text-brand-gray-900">Tell us about your experience</p>
                      </div>

                      <div>
                        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-brand-gray-900 mb-1 body-brand">
                          Years of Experience *
                        </label>
                        <select
                          id="yearsOfExperience"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                          required
                          className="w-full px-4 py-3 border border-brand-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                        >
                          <option value="">Select years of experience</option>
                          <option value="1-3">1-3 years</option>
                          <option value="4-6">4-6 years</option>
                          <option value="7-10">7-10 years</option>
                          <option value="11-15">11-15 years</option>
                          <option value="15+">15+ years</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="background" className="block text-sm font-medium text-brand-gray-900 mb-1 body-brand">
                          Professional Background *
                        </label>
                        <textarea
                          id="background"
                          name="background"
                          value={formData.background}
                          onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                          required
                          rows={4}
                          className="w-full px-4 py-3 border border-brand-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                          placeholder="Brief overview of your professional experience and achievements..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brand-gray-900 mb-3 body-brand">
                          I want to join as: *
                        </label>
                        <div className="flex space-x-6">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="role"
                              value="mentor"
                              checked={formData.role === 'mentor'}
                              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                              className="mr-3 h-4 w-4 text-brand-teal"
                            />
                            <span className="text-brand-gray-900">Mentor</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="role"
                              value="guest_speaker"
                              checked={formData.role === 'guest_speaker'}
                              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                              className="mr-3 h-4 w-4 text-brand-teal"
                            />
                            <span className="text-brand-gray-900">Guest Speaker</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex items-center text-brand-gray-600 hover:text-brand-gray-900 transition-colors"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!isStepValid(2)}
                          className="bg-brand-teal text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-teal-dark"
                        >
                          Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {formData.currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <Target className="h-12 w-12 text-brand-teal mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-brand-navy mb-2">Areas of Expertise</h2>
                        <p className="text-brand-gray-900">Select your areas of expertise (choose 3-5)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brand-gray-900 mb-4 body-brand">
                          Popular Areas *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                          {popularExpertise.map((skill) => {
                            const isSelected = formData.expertise.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => toggleExpertise(skill)}
                                className={`p-3 rounded-lg text-left transition-all ${
                                  isSelected 
                                    ? 'bg-brand-teal text-white border-2 border-brand-teal' 
                                    : 'bg-white text-brand-gray-900 border-2 border-gray-200 hover:border-brand-teal'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                                    isSelected 
                                      ? 'bg-white border-white' 
                                      : 'border-gray-300'
                                  }`}>
                                    {isSelected && <Check className="h-3 w-3 text-brand-teal" />}
                                  </div>
                                  <span className="text-sm font-medium">{skill}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <details className="mb-6">
                          <summary className="cursor-pointer text-brand-teal hover:text-brand-teal-dark font-medium mb-4">
                            View all expertise areas
                          </summary>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {allExpertise.filter(skill => !popularExpertise.includes(skill)).map((skill) => {
                              const isSelected = formData.expertise.includes(skill);
                              return (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={() => toggleExpertise(skill)}
                                  className={`p-3 rounded-lg text-left transition-all ${
                                    isSelected 
                                      ? 'bg-brand-teal text-white border-2 border-brand-teal' 
                                      : 'bg-white text-brand-gray-900 border-2 border-gray-200 hover:border-brand-teal'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                                      isSelected 
                                        ? 'bg-white border-white' 
                                        : 'border-gray-300'
                                    }`}>
                                      {isSelected && <Check className="h-3 w-3 text-brand-teal" />}
                                    </div>
                                    <span className="text-sm font-medium">{skill}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </details>

                        {formData.expertise.includes('Other') && (
                          <div className="mb-6">
                            <label htmlFor="otherExpertise" className="block text-sm font-medium text-brand-gray-900 mb-1 body-brand">
                              Please specify other areas
                            </label>
                            <input
                              type="text"
                              id="otherExpertise"
                              name="otherExpertise"
                              value={formData.otherExpertise}
                              onChange={(e) => setFormData(prev => ({ ...prev, otherExpertise: e.target.value }))}
                              className="w-full px-4 py-3 border border-brand-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                              placeholder="Enter other areas of expertise..."
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="whyInterested" className="block text-sm font-medium text-brand-gray-900 mb-1 body-brand">
                          Why are you interested in mentoring? *
                        </label>
                        <textarea
                          id="whyInterested"
                          name="whyInterested"
                          value={formData.whyInterested}
                          onChange={(e) => setFormData(prev => ({ ...prev, whyInterested: e.target.value }))}
                          required
                          rows={4}
                          className="w-full px-4 py-3 border border-brand-gray-200 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                          placeholder="Tell us why you'd like to join our mentor network and what you hope to contribute..."
                        />
                      </div>

                      <div className="bg-brand-gray-50 p-4 rounded-lg border border-brand-gray-200">
                        <h4 className="font-medium text-brand-navy mb-2 heading-brand">Vetting Process</h4>
                        <p className="text-sm text-brand-steel mb-4 body-brand">
                          All applications are carefully reviewed by our team to ensure the highest quality of mentorship for our community. The review process typically takes 2-3 business days.
                        </p>
                        <p className="text-sm text-brand-steel body-brand">
                          For any questions about the application process, please contact us at{' '}
                          <a href="mailto:hello@startsolo.in" className="text-brand-teal hover:text-brand-teal-dark">
                            hello@startsolo.in
                          </a>
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex items-center text-brand-gray-600 hover:text-brand-gray-900 transition-colors"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Previous
                        </button>
                        <button
                          type="submit"
                          disabled={!isStepValid(3) || formData.submitting}
                          className="bg-brand-teal text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-teal-dark"
                        >
                          {formData.submitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Application <Send className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorRegistrationPage;