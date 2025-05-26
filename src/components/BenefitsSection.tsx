import React from 'react';
import { CheckCircle, Target, TrendingUp, Shield } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Target className="h-12 w-12 text-primary" />, 
      title: "Proven Framework", 
      description: "Learn the exact step-by-step blueprint used by 2800+ successful solo entrepreneurs to build profitable businesses."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-primary" />, 
      title: "Actionable Strategies", 
      description: "Get practical, implementable strategies you can start using immediately to attract clients and generate income."
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />, 
      title: "Avoid Common Pitfalls", 
      description: "Discover the mistakes that cause most solo entrepreneurs to fail and learn how to navigate around them successfully."
    }
  ];

  const whatYouWillLearn = [
    {
      title: "Why Solopreneurship is the Future", 
      description: "Discover why now is the perfect time to start your solo business journey"
    },
    {
      title: "Finding Your Profitable Niche", 
      description: "Identify a niche that matches your skills and has real market demand"
    },
    {
      title: "Creating an Irresistible Offer", 
      description: "Package your expertise with effective branding, pricing, and messaging"
    },
    {
      title: "The Start Solo Blueprint", 
      description: "Get a step-by-step roadmap to build your business with confidence"
    },
    {
      title: "Client Acquisition Made Simple", 
      description: "Learn practical strategies to attract and convert high-quality clients"
    },
    {
      title: "Scaling Without Burnout", 
      description: "Use automation and systems to grow without working 24/7"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">WHY ATTEND THIS SESSION</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The 90-Min Solo Accelerator Session: Your Launchpad to Freedom!
          </p>
        </div>
        
        <p className="text-gray-700 text-lg text-center mb-12">
          Thinking about starting your solo business but feeling stuck? This power-packed 90-minute webinar will give you the clarity, confidence, and game plan to take the leap—without any risks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="mb-6">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-tertiary-light/10 rounded-xl p-8 border border-tertiary-light/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You'll Learn in This Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatYouWillLearn.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-700 font-medium text-lg">Next Session</p>
          <p className="text-gray-900 text-xl font-bold">Starts June 15, 2025</p>
          <p className="text-gray-700 mt-2">90 Minutes | Packed with value | ₹99 Registration Fee</p>
        </div>

        <div className="text-center mt-8">
          <a href="#redirects to webinar section" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition">
            Register for the Webinar
          </a>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
