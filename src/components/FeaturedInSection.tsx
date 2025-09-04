import React, { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

const FeaturedInSection = () => {
  // Client logos with updated URLs
  const clientLogos = [
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
    },
    {
      name: "Smart Power India",
      logo: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741528868/V2-_Workshop_Logos-_180x60_kst5qv.png"
    }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  // Automatic scrolling animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const speed = 0.5; // Adjust speed as needed
    const containerWidth = scrollContainer.offsetWidth;
    const singleSetWidth = containerWidth / 3; // Width of one set of logos

    const scroll = () => {
      scrollPosition += speed;

      // Reset position when one set of logos is scrolled out
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
      }

      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    scroll();

    // Pause animation on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => scroll();

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="py-4 bg-brand-gray-50 border-brand-y border-brand-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Title and Logo Ticker - Hidden on mobile */}
        <div className="hidden md:block">
          <div className="flex items-center mb-2">
            <h3 className="text-sm font-medium text-brand-gray-600 uppercase tracking-wider mr-4">Past Trainings and Workshops</h3>
            <div className="h-px bg-brand-gray-200 flex-grow"></div>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                ref={scrollRef}
                className="flex items-center space-x-12 py-2 transition-transform duration-1000"
                style={{ width: '300%' }} // Make room for 3 sets of logos
              >
                {[...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                  <div 
                    key={`logo-${index}`}
                    className="group relative grayscale hover:grayscale-0 transition duration-300"
                    title={client.name}
                  >
                    <img 
                      src={client.logo} 
                      alt={client.name} 
                      className="h-16 w-auto object-contain" // Increased height from h-12 to h-16
                      loading="lazy"
                    />
                    {/* Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-brand-gray-900 text-brand-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      {client.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedInSection;