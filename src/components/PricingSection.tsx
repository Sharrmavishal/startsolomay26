import { Check, X, ArrowRight } from 'lucide-react';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-brand-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">Affordable Investment, Priceless Returns</h2>
          <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your goals and budget.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="lg:w-1/2 bg-brand-white rounded-xl shadow-lg overflow-hidden border border-brand-gray-100">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-brand-gray-900 mb-2">Self-Guided</h3>
              <p className="text-brand-gray-600 mb-6">Perfect for self-starters who want the complete blueprint.</p>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-brand-gray-900">$197</span>
                <span className="text-lg line-through text-brand-gray-500 ml-2">$297</span>
                <span className="text-sm text-brand-gray-600 ml-2">one-time payment</span>
              </div>
              <button className="w-full bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold mb-6 relative overflow-hidden group hover:shadow-lg z-0">
                <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Get Started
                </span>
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
                    <Check className="h-5 w-5 text-brand-success mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-brand-gray-700">{feature}</span>
                  </div>
                ))}
                {[
                  "Live Q&A sessions",
                  "1-on-1 coaching calls",
                  "Business audit & feedback"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start opacity-50">
                    <X className="h-5 w-5 text-brand-error mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-brand-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Premium Plan */}
          <div className="lg:w-1/2 bg-brand-white rounded-xl shadow-lg overflow-hidden border-2 border-indigo-600 relative">
            <div className="absolute top-0 right-0 bg-cta text-cta-text px-4 py-1 text-sm font-bold transition-all duration-300 group-hover:bg-cta-text group-hover:text-white">
              MOST POPULAR
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-brand-gray-900 mb-2">Guided Journey</h3>
              <p className="text-brand-gray-600 mb-6">For those who want personalized guidance and faster results.</p>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-brand-gray-900">$497</span>
                <span className="text-lg line-through text-brand-gray-500 ml-2">$697</span>
                <span className="text-sm text-brand-gray-600 ml-2">one-time payment</span>
              </div>
              <button className="w-full bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold mb-6 relative overflow-hidden group hover:shadow-lg z-0">
                <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Enroll Now
                </span>
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
                    <Check className="h-5 w-5 text-brand-success mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-brand-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-brand-white rounded-xl p-8 shadow-md max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-brand-gray-900 mb-4 text-center">100% Risk-Free Guarantee</h3>
          <p className="text-brand-gray-700 text-center mb-6">
            If you're not completely satisfied with the course within 30 days, we'll refund your investment in full. No questions asked.
          </p>
          <div className="flex justify-center">
            <button className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0">
              <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                Secure Your Spot Today <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;