import { Mic, Award, ExternalLink, Calendar, ArrowRight } from 'lucide-react';

const SpeakersSection = () => {
  const speakers = [
    {
      name: "Sarah Williams",
      role: "Marketing Strategist & Founder",
      company: "Growth Accelerator",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      topic: "Client Acquisition Strategies for Solo Entrepreneurs",
      credentials: ["Former CMO at TechGiant", "Author of 'Marketing Simplified'", "15+ years in digital marketing"],
      date: "July 10, 2025"
    },
    {
      name: "Michael Chen",
      role: "Systems & Automation Expert",
      company: "Workflow Mastery",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      topic: "Scaling Your Business with Automation",
      credentials: ["Built 3 7-figure businesses", "Featured in Entrepreneur Magazine", "Helped 200+ businesses automate"],
      date: "July 24, 2025"
    },
    {
      name: "Emily Rodriguez",
      role: "Financial Strategist",
      company: "Solo Business CFO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      topic: "Financial Freedom Through Smart Business Planning",
      credentials: ["Certified Financial Planner", "Former Wall Street Analyst", "Specializes in solo business finances"],
      date: "August 7, 2025"
    }
  ];

  return (
    <section id="speakers" className="py-20 bg-brand-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-brand-accent-light/20 text-brand-accent-dark px-4 py-1 rounded-full mb-4 font-medium">
            EXPERT SESSIONS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">Learn From Industry Experts</h2>
          <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto">
            Our course and community feature exclusive sessions with these successful entrepreneurs and specialists
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {speakers.map((speaker, index) => (
            <div key={index} className="bg-brand-white rounded-xl shadow-md overflow-hidden border border-brand-gray-100">
              <div className="h-48 overflow-hidden">
                <img 
                  src={speaker.image} 
                  alt={speaker.name} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-gray-900 mb-1">{speaker.name}</h3>
                <p className="text-brand-accent font-medium mb-4">{speaker.role}, {speaker.company}</p>
                
                <div className="bg-brand-accent-light/10 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <Mic className="h-5 w-5 text-brand-accent mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-brand-gray-900 mb-1">Speaking On:</h4>
                      <p className="text-brand-gray-700">{speaker.topic}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold text-brand-gray-900 mb-2 text-sm uppercase tracking-wider">Credentials:</h4>
                  <ul className="space-y-1">
                    {speaker.credentials.map((credential, i) => (
                      <li key={i} className="flex items-start">
                        <Award className="h-4 w-4 text-brand-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-brand-gray-700 text-sm">{credential}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center text-brand-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{speaker.date}</span>
                  </div>
                  <a 
                    href="#" 
                    className="text-brand-accent font-medium text-sm flex items-center hover:text-brand-accent-dark transition"
                  >
                    Learn more <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto bg-brand-white rounded-xl p-8 shadow-md border border-brand-gray-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 mb-6 md:mb-0 text-center">
              <div className="bg-brand-accent-light/20 rounded-full p-4 inline-block">
                <Mic className="h-10 w-10 text-brand-accent" />
              </div>
            </div>
            <div className="md:w-3/4 md:pl-8">
              <h3 className="text-xl font-bold text-brand-gray-900 mb-3">Access All Expert Sessions</h3>
              <p className="text-brand-gray-700 mb-4">
                These expert sessions are included with the full Start Solo Blueprint course. Webinar attendees and WhatsApp Hub members 
                also get access to selected sessions throughout the year.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <a href="#webinar-dates" className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0">
                  <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                    Register for Webinar <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </a>
                <a href="#whatsapp-hub" className="border-2 border-navy bg-white text-navy px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0">
                  <span className="absolute inset-0 bg-navy transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                    Join WhatsApp Hub - Free
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="/courses" 
            className="bg-yellow text-brand-gray-900 px-6 py-3 rounded-lg transition-all duration-300 inline-flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
          >
            <span className="absolute inset-0 bg-yellow-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
            <span className="relative z-10 transition-colors duration-300 flex items-center">
              Learn about the Courses <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;