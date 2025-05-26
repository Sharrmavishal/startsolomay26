import React from 'react';
import { CheckCircle, Target, TrendingUp, Shield, Clock, Calendar } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What You'll Learn in This Webinar</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the exact framework used by successful solo entrepreneurs to build profitable businesses.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="space-y-8">
                {[
                  {
                    title: "Finding Your Profitable Niche",
                    description: "Discover how to identify a niche that aligns with your skills and has high profit potential. We'll show you our 3-step validation process to ensure market demand before you invest time and resources."
                  },
                  {
                    title: "Creating Your Irresistible Offer",
                    description: "Learn how to package your expertise into an offer that stands out in the marketplace. We'll cover pricing strategies, positioning, and how to communicate your value proposition effectively."
                  },
                  {
                    title: "Client Acquisition Blueprint",
                    description: "Master our proven system for attracting and converting high-quality clients consistently. You'll learn specific strategies that work even if you hate marketing or sales."
                  },
                  {
                    title: "Scaling Without Burnout",
                    description: "Discover how to grow your solo business without working more hours. We'll share our framework for leveraging systems, automation, and strategic outsourcing to increase revenue while maintaining work-life balance."
                  },
                  {
                    title: "Q&A Session",
                    description: "Get your specific questions answered live during our interactive Q&A session. This is your chance to get personalized advice for your unique situation."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-light/20 text-primary font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 bg-secondary-light/10 p-6 rounded-lg border border-secondary-light/20">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 mb-6 md:mb-0 text-center">
                    <Calendar className="h-12 w-12 text-secondary mx-auto mb-2" />
                    <h4 className="font-bold text-gray-900">Multiple Dates</h4>
                    <p className="text-gray-600">Choose what works for you</p>
                  </div>
                  <div className="md:w-1/3 mb-6 md:mb-0 text-center">
                    <Clock className="h-12 w-12 text-secondary mx-auto mb-2" />
                    <h4 className="font-bold text-gray-900">90 Minutes</h4>
                    <p className="text-gray-600">Packed with value</p>
                  </div>
                  <div className="md:w-1/3 text-center">
                    <div className="bg-white text-primary rounded-full p-4 inline-block">
                      <div className="text-3xl font-bold">$1</div>
                      <div className="text-sm">Registration Fee</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;