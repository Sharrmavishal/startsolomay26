import React from 'react';
import { Target, TrendingUp, Shield, Clock, Calendar, ArrowRight, Lightbulb } from 'lucide-react';
import { useContent } from './ContentProvider';
import { smoothScrollTo } from '../utils/scrollUtils';

const WebinarInfoSection = () => {
  const { webinarInfo } = useContent();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      smoothScrollTo(href.substring(1));
    }
  };

  const learningPoints = [
    {
      title: "Finding Your Profitable Niche",
      description: "Discover how to identify a niche that aligns with your skills and has high profit potential",
      icon: <Target className="h-8 w-8 text-primary" />
    },
    {
      title: "Creating Your Irresistible Offer",
      description: "Package your expertise with effective branding, pricing, and messaging",
      icon: <Lightbulb className="h-8 w-8 text-primary" />
    },
    {
      title: "Client Acquisition Blueprint",
      description: "Learn practical strategies to attract and convert high-quality clients",
      icon: <TrendingUp className="h-8 w-8 text-primary" />
    },
    {
      title: "Scaling Without Burnout",
      description: "Use automation and systems to grow without working 24/7",
      icon: <Shield className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <section id="webinar-info" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-light/20 text-primary-dark px-4 py-1 rounded-full mb-4 font-medium">
            WHY ATTEND THIS SESSION
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The 90-Min Solo Accelerator Session: Your Launchpad to Freedom!
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thinking about starting your solo business but feeling stuck? This power-packed 90-minute webinar will give you the clarity, confidence, and game plan to take the leap—without any risks.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Learning Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {learningPoints.map((point, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="mb-4">{point.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{point.title}</h3>
                <p className="text-gray-600 text-sm">{point.description}</p>
              </div>
            ))}
          </div>

          {/* Session Details Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center">
                  <Calendar className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900">Next Session</h4>
                  <p className="text-gray-600">March 22, 2025</p>
                </div>
                <div className="text-center">
                  <Clock className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h4 className="font-bold text-gray-900">90 Minutes</h4>
                  <p className="text-gray-600">Packed with value</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-light/10 rounded-full p-4 inline-block">
                    <div className="text-3xl font-bold text-primary">₹99</div>
                    <div className="text-sm text-gray-600">Registration Fee</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a 
                  href="#webinar-dates"
                  onClick={handleClick}
                  className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition"
                >
                  Reserve Your Spot Now! <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebinarInfoSection;