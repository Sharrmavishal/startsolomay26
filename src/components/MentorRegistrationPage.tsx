import React, { useState } from 'react';
import { ArrowLeft, Send, Shield, Check, ChevronDown, ChevronUp } from 'lucide-react';

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
    submitting: false
  });

  const [expertiseAreas, setExpertiseAreas] = useState([
    {
      category: "Business Development",
      skills: ["Business Planning", "Market Research", "Strategy Development", "Entrepreneurship"],
      isOpen: false
    },
    {
      category: "Marketing and Sales",
      skills: ["Digital Marketing", "Social Media Marketing", "Content Marketing", "Sales Strategy", "Branding"],
      isOpen: false
    },
    {
      category: "Financial Management",
      skills: ["Accounting", "Bookkeeping", "Tax Planning", "Financial Analysis", "Budgeting"],
      isOpen: false
    },
    {
      category: "Productivity and Time Management",
      skills: ["Goal Setting", "Prioritization", "Time Management Tools", "Productivity Techniques"],
      isOpen: false
    },
    {
      category: "Technology and IT",
      skills: ["Web Development", "Front-end Development", "Back-end Development", "Cybersecurity", "Data Analysis"],
      isOpen: false
    },
    {
      category: "Communication and Content Creation",
      skills: ["Writing (Copywriting, Blogging)", "Graphic Design", "Video Production", "Photography", "Public Speaking"],
      isOpen: false
    },
    {
      category: "Education and Training",
      skills: ["Course Creation", "Online Teaching", "Curriculum Development", "Educational Technology"],
      isOpen: false
    },
    {
      category: "Personal Development and Emotional Intelligence",
      skills: ["Mindfulness", "Emotional Intelligence", "Leadership Development", "Motivation", "Career Coaching", "Conflict Resolution", "Team Building", "Empathy and Active Listening"],
      isOpen: false
    },
    {
      category: "Legal and Compliance",
      skills: ["Business Law", "Intellectual Property", "Contract Negotiation", "Regulatory Compliance"],
      isOpen: false
    },
    {
      category: "Operations and Logistics",
      skills: ["Supply Chain Management", "Project Management", "Customer Service", "Operations Strategy"],
      isOpen: false
    },
    {
      category: "Data Science and Analytics",
      skills: ["Data Engineering", "Machine Learning", "Data Visualization", "Business Intelligence"],
      isOpen: false
    },
    {
      category: "Language and Localization",
      skills: ["Translation", "Interpretation", "Localization", "Language Teaching"],
      isOpen: false
    }
  ]);

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

  const toggleSection = (index: number) => {
    setExpertiseAreas(prev => prev.map((area, i) => 
      i === index ? { ...area, isOpen: !area.isOpen } : area
    ));
  };

  // Get selected skills count for each category
  const getSelectedCount = (skills: string[]) => {
    return skills.filter(skill => formData.expertise.includes(skill)).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <a 
            href="/" 
            className="inline-flex items-center text-primary hover:text-primary-dark mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
          </a>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {/* Hero Image */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1743151891/Untitled_design_6_reaw6k.png"
                alt="Mentorship at Start Solo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h1 className="text-3xl font-bold mb-2">Join as a Mentor</h1>
                  <p className="text-lg text-white/90">
                    Share your expertise and help shape the next generation of successful solopreneurs.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {formData.submitted ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You for Your Interest!</h3>
                  <p className="text-gray-700 mb-6">
                    We've received your application to join our mentor network. Our team will review your profile and get back to you within 2-3 business days.
                  </p>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, submitted: false }))}
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={handleSubmit}
                  className="space-y-6"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience *
                    </label>
                    <select
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
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
                    <label htmlFor="background" className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Background *
                    </label>
                    <textarea
                      id="background"
                      name="background"
                      value={formData.background}
                      onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="Brief overview of your professional experience and achievements..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      I want to join as: *
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value="mentor"
                          checked={formData.role === 'mentor'}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                          className="mr-2"
                        />
                        Mentor
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value="guest_speaker"
                          checked={formData.role === 'guest_speaker'}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                          className="mr-2"
                        />
                        Guest Speaker
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Areas of Expertise * <span className="text-gray-500 text-xs">(Select all that apply)</span>
                    </label>
                    <div className="space-y-3">
                      {expertiseAreas.map((area, index) => (
                        <div 
                          key={index} 
                          className={`bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 ${
                            area.isOpen ? 'shadow-md' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleSection(index)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">{area.category}</h4>
                              {getSelectedCount(area.skills) > 0 && (
                                <p className="text-sm text-primary">
                                  {getSelectedCount(area.skills)} selected
                                </p>
                              )}
                            </div>
                            {area.isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                          
                          {area.isOpen && (
                            <div className="px-4 pb-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {area.skills.map((skill, skillIndex) => {
                                  const isSelected = formData.expertise.includes(skill);
                                  return (
                                    <button
                                      key={skillIndex}
                                      type="button"
                                      onClick={() => toggleExpertise(skill)}
                                      className={`flex items-center p-2 rounded-md text-left transition-all ${
                                        isSelected 
                                          ? 'bg-primary text-white' 
                                          : 'bg-white text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-2 ${
                                        isSelected 
                                          ? 'bg-white border-white' 
                                          : 'border-gray-300'
                                      }`}>
                                        {isSelected && <Check className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-transparent'}`} />}
                                      </div>
                                      <span className="flex-1">{skill}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <label htmlFor="otherExpertise" className="block text-sm font-medium text-gray-700 mb-1">
                        Other Areas of Expertise
                      </label>
                      <input
                        type="text"
                        id="otherExpertise"
                        name="otherExpertise"
                        value={formData.otherExpertise}
                        onChange={(e) => setFormData(prev => ({ ...prev, otherExpertise: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Enter any additional areas of expertise..."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="whyInterested" className="block text-sm font-medium text-gray-700 mb-1">
                      Why are you interested in mentoring? *
                    </label>
                    <textarea
                      id="whyInterested"
                      name="whyInterested"
                      value={formData.whyInterested}
                      onChange={(e) => setFormData(prev => ({ ...prev, whyInterested: e.target.value }))}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="Tell us why you'd like to join our mentor network and what you hope to contribute..."
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">Vetting Process</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      All applications are carefully reviewed by our team to ensure the highest quality of mentorship for our community. The review process typically takes 2-3 business days.
                    </p>
                    <p className="text-sm text-gray-600">
                      For any questions about the application process, please contact us at{' '}
                      <a href="mailto:hello@startsolo.in" className="text-primary hover:text-primary-dark">
                        hello@startsolo.in
                      </a>
                    </p>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={formData.submitting}
                      className="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formData.submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Sign Up <Send className="ml-2 h-5 w-5" />
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
  );
};

export default MentorRegistrationPage;