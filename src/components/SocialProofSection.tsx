import React from 'react';
import { Award, ExternalLink, Mic } from 'lucide-react';

const SocialProofSection = () => {
  // Featured publications with updated logos
  const featuredIn = [
    {
      name: "NCAER",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741359851/10_misjh1.png"
    },
    {
      name: "NACO",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741359850/9_mgpcyn.png"
    },
    {
      name: "Panjab University",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741359850/8_sz3qvt.png"
    },
    {
      name: "GSK",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741359847/5_lq3o9j.png"
    },
    {
      name: "IIMC",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741359848/6_otgsi0.png"
    },
    {
      name: "Burson",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741359848/7_bsoixp.png"
    },
    {
      name: "Indigo",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741358180/3_fjkx7q.png"
    },
    {
      name: "Spicejet",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741358180/2_qslw3m.png"
    },
    {
      name: "AvianWE",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741358180/1_hht7vs.png"
    },
    {
      name: "Swasti Health Catalyst",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741358985/Workshop_Logos-_180x60_h7xl6m.png"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-lg font-medium text-gray-600">AS FEATURED IN</p>
        </div>
        
        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center mb-16">
          {featuredIn.map((publication, index) => (
            <div 
              key={index} 
              className="grayscale hover:grayscale-0 transition duration-300 w-full flex items-center justify-center"
            >
              <img 
                src={publication.logo} 
                alt={publication.name} 
                className="h-12 md:h-16 object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        {/* Award Recognition Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 mb-6 md:mb-0 text-center">
                <Mic className="h-16 w-16 text-accent mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900">Dynamic LIVE Sessions</h3>
              </div>
              <div className="md:w-3/4 md:pl-8 md:border-l md:border-gray-200">
                <p className="text-gray-700 mb-4">
                  The Start Solo Blueprint level course consistently maintains a 4.9-star rating from participants and is recognized as a high-impact session that delivers value without fluff.
                </p>
                <a 
                  href="#testimonials" 
                  className="text-primary font-medium flex items-center hover:text-primary-dark transition"
                >
                  Read the case study <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;