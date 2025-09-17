import React, { useState } from 'react';
import { ArrowLeft, Send, MapPin, BookOpen, Calendar, Users, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FormData {
  locations: string[];
  topics: string[];
  otherTopic: string;
  duration: string;
  email: string;
  submitted: boolean;
  submitting: boolean;
  currentStep: number;
}

const SolosprintBootcampPage = () => {
  const [formData, setFormData] = useState<FormData>({
    locations: [],
    topics: [],
    otherTopic: '',
    duration: '',
    email: '',
    submitted: false,
    submitting: false,
    currentStep: 1
  });

  // Simplified cities list - most popular first
  const popularCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];
  const allCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune',
    'Jaipur', 'Ahmedabad', 'Kochi', 'Chandigarh', 'Indore', 'Lucknow'
  ];

  const topics = [
    'Marketing Strategies',
    'Financial Management for Solopreneurs',
    'Product Development & Scaling',
    'Building a Personal Brand',
    'Time Management & Productivity Hacks',
    'Networking & Partnerships'
  ];

  const nextStep = () => {
    setFormData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setFormData(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.locations.length > 0;
      case 2:
        return formData.topics.length > 0;
      case 3:
        return formData.duration !== '';
      default:
        return true;
    }
  };

  const handleLocationChange = (city: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(city)
        ? prev.locations.filter(loc => loc !== city)
        : [...prev.locations, city]
    }));
  };

  const handleTopicChange = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, submitting: true }));

    try {
      // Convert form data to URL-encoded string for Netlify
      const formDataToSubmit = new FormData(e.target as HTMLFormElement);
      // Convert arrays to comma-separated strings for Netlify
      formDataToSubmit.set('locations', formData.locations.join(', '));
      formDataToSubmit.set('topics', formData.topics.join(', '));
      
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solosprint Bootcamp</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Help us create a bootcamp that truly meets your needs as a solopreneur. Your preferences will shape the experience!
            </p>
            
            {/* What is Solosprint Bootcamp */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What is Solosprint Bootcamp?</h2>
              <p className="text-gray-600 mb-6">
                A dynamic, collaborative initiative designed to equip solopreneurs with actionable skills, insights, and networks they need to succeed.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Collaboration</h3>
                  <p className="text-sm text-gray-600">Co-created with solopreneurs like you</p>
                </div>
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Value-Driven</h3>
                  <p className="text-sm text-gray-600">Focused on real challenges and solutions</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Practical Learning</h3>
                  <p className="text-sm text-gray-600">Actionable insights you can implement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {formData.submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You for Your Input!</h3>
                <p className="text-gray-600 mb-6">
                  Your preferences will help us shape the Solosprint Bootcamp. We'll keep you updated on the locations and topics as they're finalized.
                </p>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, submitted: false, currentStep: 1 }))}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-800 font-medium"
                >
                  Submit Another Response
                </button>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                name="solosprint-bootcamp"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
              >
                {/* Hidden fields for Netlify */}
                <input type="hidden" name="form-name" value="solosprint-bootcamp" />
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
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step}
                        </div>
                        {step < 3 && (
                          <div className={`w-12 h-1 mx-2 ${
                            formData.currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
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
                      <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Preferred Locations</h2>
                      <p className="text-gray-600">Select the cities where you'd like to attend the bootcamp</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Popular Cities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        {popularCities.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => handleLocationChange(city)}
                            className={`p-3 rounded-lg text-left transition-all ${
                              formData.locations.includes(city)
                                ? 'bg-blue-600 text-white border-2 border-blue-600' 
                                : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600'
                            }`}
                          >
                            <span className="font-medium">{city}</span>
                          </button>
                        ))}
                      </div>

                      <details className="mb-6">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium mb-4">
                          View all cities
                        </summary>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {allCities.filter(city => !popularCities.includes(city)).map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => handleLocationChange(city)}
                              className={`p-3 rounded-lg text-left transition-all ${
                                formData.locations.includes(city)
                                  ? 'bg-blue-600 text-white border-2 border-blue-600' 
                                  : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600'
                              }`}
                            >
                              <span className="font-medium">{city}</span>
                            </button>
                          ))}
                        </div>
                      </details>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid(1)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {formData.currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Preferred Topics</h2>
                      <p className="text-gray-600">Select the topics you'd like to learn about</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {topics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicChange(topic)}
                          className={`p-4 rounded-lg text-left transition-all ${
                            formData.topics.includes(topic)
                              ? 'bg-blue-600 text-white border-2 border-blue-600' 
                              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600'
                          }`}
                        >
                          <span className="font-medium">{topic}</span>
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Other Topics (Optional)
                      </label>
                      <input
                        type="text"
                        name="otherTopic"
                        value={formData.otherTopic}
                        onChange={(e) => setFormData(prev => ({ ...prev, otherTopic: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Suggest additional topics you'd like to see covered"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid(2)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {formData.currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Duration & Contact</h2>
                      <p className="text-gray-600">Tell us your preferred duration and how to reach you</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-4">
                        Preferred Duration
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        {['1 Day', '2 Days', 'More than 2 Days'].map((duration) => (
                          <button
                            key={duration}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, duration }))}
                            className={`p-4 rounded-lg text-center transition-all ${
                              formData.duration === duration
                                ? 'bg-blue-600 text-white border-2 border-blue-600' 
                                : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600'
                            }`}
                          >
                            <span className="font-medium">{duration}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your email to receive updates about the bootcamp"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </button>
                      <button
                        type="submit"
                        disabled={!isStepValid(3) || formData.submitting}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 flex items-center"
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
                            Submit Your Preferences <Send className="ml-2 h-5 w-5" />
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
  );
};

export default SolosprintBootcampPage;