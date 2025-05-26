import React, { useState } from 'react';
import { ArrowRight, MessageCircle, Sparkles, Target, Rocket, TrendingUp, RefreshCcw, CheckCircle, Star } from 'lucide-react';
import { QuizResult as ResultType } from './types';
import { saveQuizLead } from '../../lib/supabase';

interface QuizResultProps {
  result: ResultType;
  score: number;
}

const QuizResult: React.FC<QuizResultProps> = ({ result, score }) => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    optIn: false
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!userDetails.name.trim() || !userDetails.email.trim()) {
        throw new Error('Please fill in all required fields');
      }

      const quizLead = {
        name: userDetails.name.trim(),
        email: userDetails.email.trim(),
        quiz_stage: result.stage,
        quiz_persona: result.persona,
        quiz_score: score,
        opt_in: userDetails.optIn
      };

      console.log('Submitting quiz lead:', quizLead);
      await saveQuizLead(quizLead);
      
      setFormSubmitted(true);
      setUserDetails({ name: '', email: '', optIn: false });
    } catch (err) {
      console.error('Error saving lead:', err);
      setError('There was an error saving your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Stage 0: Still Thinking':
        return <Sparkles className="h-12 w-12 text-yellow-500" />;
      case 'Stage 1: Curious':
        return <Target className="h-12 w-12 text-orange-500" />;
      case 'Stage 2: Builder':
        return <Rocket className="h-12 w-12 text-blue-500" />;
      case 'Stage 3: Scaler':
        return <TrendingUp className="h-12 w-12 text-purple-500" />;
      case 'Stage 4: Relaunch':
        return <RefreshCcw className="h-12 w-12 text-green-500" />;
      default:
        return <Sparkles className="h-12 w-12 text-yellow-500" />;
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary-light/10 to-white -m-8 p-8 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6">
            {getStageIcon(result.stage)}
          </div>
          <div className="inline-block bg-secondary-light/20 text-secondary-dark px-6 py-2 rounded-full mb-4 font-medium text-lg">
            {result.stage}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            You're a {result.persona}
          </h2>
          <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">{result.summary}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Current Stage</h3>
        <p className="text-gray-700 mb-4">{result.description}</p>
        <div className="bg-secondary-light/10 p-4 rounded-lg">
          <p className="text-gray-800 font-medium">{result.helpText}</p>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {result.courses.map((course, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-gray-600">{course.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">₹{course.price.toLocaleString()}</div>
                  {course.originalPrice && (
                    <div className="text-sm text-gray-500">
                      <span className="line-through">₹{course.originalPrice.toLocaleString()}</span>
                      <span className="ml-2 text-highlight">
                        Save ₹{(course.originalPrice - course.price).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Star className="h-5 w-5 text-accent mr-2" />
                  What you'll learn:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.curriculum.map((item, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={course.ctaUrl}
                className="block w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition text-center font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {course.cta} <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {!formSubmitted ? (
        <div className="bg-gradient-to-br from-primary-light/10 to-white rounded-xl p-6 border border-primary-light/20 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Get Your Personalized Roadmap</h3>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="optIn"
                  name="optIn"
                  type="checkbox"
                  checked={userDetails.optIn}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, optIn: e.target.checked }))}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="optIn" className="text-sm text-gray-600">
                  I'd like to receive updates about courses, resources, and solopreneur tips. You can unsubscribe anytime.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition flex items-center justify-center font-medium disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Get My Roadmap <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center mb-8">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-700">
            We'll send your personalized roadmap to your email shortly.
          </p>
        </div>
      )}

      <div className="text-center">
        <a
          href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij"
          className="inline-flex items-center text-[#25D366] hover:text-[#128C7E] transition font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Join our WhatsApp Hub for more resources
        </a>
      </div>
    </div>
  );
};

export default QuizResult;