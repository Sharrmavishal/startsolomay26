import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Affordable Investment, Priceless Returns</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your goals and budget.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="lg:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Self-Guided</h3>
              <p className="text-gray-600 mb-6">Perfect for self-starters who want the complete blueprint.</p>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-gray-900">$197</span>
                <span className="text-lg line-through text-gray-500 ml-2">$297</span>
                <span className="text-sm text-gray-600 ml-2">one-time payment</span>
              </div>
              <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition mb-6">
                Get Started
              </button>
              <div className="space-y-3">
                {[
                  "Full course access (42 video lessons)",
                  "Downloadable workbooks & templates",
                  "Community access",
                  "Completion certificate",
                  "Lifetime updates"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                {[
                  "Live Q&A sessions",
                  "1-on-1 coaching calls",
                  "Business audit & feedback"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start opacity-50">
                    <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Premium Plan */}
          <div className="lg:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-indigo-600 relative">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 text-sm font-bold">
              MOST POPULAR
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Guided Journey</h3>
              <p className="text-gray-600 mb-6">For those who want personalized guidance and faster results.</p>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-gray-900">$497</span>
                <span className="text-lg line-through text-gray-500 ml-2">$697</span>
                <span className="text-sm text-gray-600 ml-2">one-time payment</span>
              </div>
              <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition mb-6">
                Enroll Now
              </button>
              <div className="space-y-3">
                {[
                  "Everything in Self-Guided",
                  "Bi-weekly live Q&A sessions",
                  "2 personal 1-on-1 coaching calls",
                  "Business audit & personalized feedback",
                  "Priority email support",
                  "Extended community access (1 year)",
                  "Bonus: Advanced marketing masterclass"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-xl p-8 shadow-md max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">100% Risk-Free Guarantee</h3>
          <p className="text-gray-700 text-center mb-6">
            If you're not completely satisfied with the course within 30 days, we'll refund your investment in full. No questions asked.
          </p>
          <div className="flex justify-center">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-md hover:bg-indigo-700 transition flex items-center">
              Secure Your Spot Today <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;