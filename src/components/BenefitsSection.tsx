import { Target, TrendingUp, Shield } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Target className="h-12 w-12 text-yellow" />, 
      title: "Proven Framework", 
      description: "Learn the exact step-by-step blueprint used by 2800+ successful solo entrepreneurs to build profitable businesses."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-yellow" />, 
      title: "Actionable Strategies", 
      description: "Get practical, implementable strategies you can start using immediately to attract clients and generate income."
    },
    {
      icon: <Shield className="h-12 w-12 text-yellow" />, 
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
    <section id="benefits" className="py-20 bg-brand-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">WHY ATTEND THIS SESSION</h2>
          <p className="text-xl text-brand-steel max-w-3xl mx-auto">
            The 90-Min Solo Accelerator Session: Your Launchpad to Freedom!
          </p>
        </div>
        
        <p className="text-brand-steel text-lg text-center mb-12">
          Thinking about starting your solo business but feeling stuck? This power-packed 90-minute webinar will give you the clarity, confidence, and game plan to take the leap—without any risks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-brand-white rounded-xl p-8 shadow-lg hover:shadow-xl transition border border-brand-yellow-200">
              <div className="mb-6">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">{benefit.title}</h3>
              <p className="text-brand-steel">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-brand-yellow-light/10 rounded-xl p-8 border border-brand-yellow-200">
          <h3 className="text-2xl font-bold text-brand-navy mb-6 text-center">What You'll Learn in This Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatYouWillLearn.map((item, index) => (
              <div key={index} className="bg-brand-snow p-4 rounded-lg border border-brand-yellow-200">
                <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-brand-steel">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-brand-steel font-medium text-lg">Next Session</p>
          <p className="text-brand-navy text-xl font-bold">Starts June 15, 2025</p>
          <p className="text-brand-steel mt-2">90 Minutes | Packed with value | ₹99 Registration Fee</p>
        </div>

        <div className="text-center mt-8">
          <a href="#redirects to webinar section" className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold inline-block relative overflow-hidden group hover:shadow-lg z-0">
            <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Register for the Webinar
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
