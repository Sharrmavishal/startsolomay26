import { Calendar, Clock } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-brand-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">What You'll Learn in This Webinar</h2>
          <p className="text-xl text-brand-steel max-w-3xl mx-auto">
            Discover the exact framework used by successful solo entrepreneurs to build profitable businesses.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-white rounded-xl shadow-xl overflow-hidden">
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
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-brand-navy mb-2">{item.title}</h3>
                      <p className="text-brand-steel">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 bg-brand-primary/5 p-6 rounded-lg border border-brand-primary/10">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/3 mb-6 md:mb-0 text-center">
                    <Calendar className="h-12 w-12 text-brand-primary mx-auto mb-2" />
                    <h4 className="font-bold text-brand-navy">Multiple Dates</h4>
                    <p className="text-brand-steel">Choose what works for you</p>
                  </div>
                  <div className="md:w-1/3 mb-6 md:mb-0 text-center">
                    <Clock className="h-12 w-12 text-brand-primary mx-auto mb-2" />
                    <h4 className="font-bold text-brand-navy">90 Minutes</h4>
                    <p className="text-brand-steel">Packed with value</p>
                  </div>
                  <div className="md:w-1/3 text-center">
                    <div className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-lg z-0">
                      <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                      <div className="text-3xl font-bold relative z-10 group-hover:text-white transition-colors duration-300">$1</div>
                      <div className="text-sm relative z-10 group-hover:text-white transition-colors duration-300">Registration Fee</div>
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