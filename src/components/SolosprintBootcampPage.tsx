import React, { useState } from 'react';
import { ArrowLeft, Send, MapPin, BookOpen, Calendar, Users, CheckCircle } from 'lucide-react';

interface FormData {
  locations: string[];
  topics: string[];
  otherTopic: string;
  duration: string;
  email: string;
  submitted: boolean;
  submitting: boolean;
}

const SolosprintBootcampPage = () => {
  const [formData, setFormData] = useState<FormData>({
    locations: [],
    topics: [],
    otherTopic: '',
    duration: '',
    email: '',
    submitted: false,
    submitting: false
  });

  const cities = [
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
            className="inline-flex items-center text-primary hover:text-primary-dark mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
          </a>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {/* Hero Image */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1743153844/Start_solo_website_creatives_xkrroj.png"
                alt="Solosprint Bootcamp"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h1 className="text-3xl font-bold mb-2">Solosprint Bootcamp: Shape Your Future</h1>
                  <p className="text-xl text-white/90">
                    Help us create a bootcamp that truly meets your needs as a solopreneur
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {formData.submitted ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You for Your Input!</h3>
                  <p className="text-gray-700 mb-6">
                    Your preferences will help us shape the Solosprint Bootcamp. We'll keep you updated on the locations and topics as they're finalized.
                  </p>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, submitted: false }))}
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition"
                  >
                    Submit Another Response
                  </button>
                </div>
              ) : (
                <>
                  {/* Introduction */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Solosprint Bootcamp?</h2>
                    <p className="text-gray-700 mb-4">
                      A dynamic, collaborative initiative designed to equip solopreneurs with actionable skills, insights, and networks they need to succeed. We're making this bootcamp with you and for you – your preferences will shape the experience!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <Users className="h-6 w-6 text-primary mb-2" />
                        <h3 className="font-bold text-gray-900 mb-1">Collaboration</h3>
                        <p className="text-sm text-gray-600">Co-created with solopreneurs like you</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <BookOpen className="h-6 w-6 text-primary mb-2" />
                        <h3 className="font-bold text-gray-900 mb-1">Value-Driven</h3>
                        <p className="text-sm text-gray-600">Focused on real challenges and solutions</p>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <Calendar className="h-6 w-6 text-primary mb-2" />
                        <h3 className="font-bold text-gray-900 mb-1">Practical Learning</h3>
                        <p className="text-sm text-gray-600">Actionable insights you can implement</p>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Form */}
                  <form 
                    onSubmit={handleSubmit}
                    className="space-y-8"
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

                    {/* Preferred Locations */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <MapPin className="h-5 w-5 text-primary mr-2" />
                        Preferred Location(s)
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {cities.map((city) => (
                          <label 
                            key={city}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                              formData.locations.includes(city)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="locations"
                              value={city}
                              checked={formData.locations.includes(city)}
                              onChange={() => handleLocationChange(city)}
                              className="sr-only"
                            />
                            <span className="ml-2">{city}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Session Topics */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <BookOpen className="h-5 w-5 text-primary mr-2" />
                        Preferred Topics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {topics.map((topic) => (
                          <label 
                            key={topic}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                              formData.topics.includes(topic)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="topics"
                              value={topic}
                              checked={formData.topics.includes(topic)}
                              onChange={() => handleTopicChange(topic)}
                              className="sr-only"
                            />
                            <span className="ml-2">{topic}</span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Other Topics (Optional)
                        </label>
                        <input
                          type="text"
                          name="otherTopic"
                          value={formData.otherTopic}
                          onChange={(e) => setFormData(prev => ({ ...prev, otherTopic: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          placeholder="Suggest additional topics you'd like to see covered"
                        />
                      </div>
                    </div>

                    {/* Duration Preference */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Calendar className="h-5 w-5 text-primary mr-2" />
                        Preferred Duration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {['1 Day', '2 Days', 'More than 2 Days'].map((duration) => (
                          <label 
                            key={duration}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                              formData.duration === duration
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                            }`}
                          >
                            <input
                              type="radio"
                              name="duration"
                              value={duration}
                              checked={formData.duration === duration}
                              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                              className="sr-only"
                            />
                            <span className="ml-2">{duration}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Enter your email to receive updates about the bootcamp"
                      />
                    </div>

                    {/* Submit Button */}
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
                            Submit Your Preferences <Send className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolosprintBootcampPage;