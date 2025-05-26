import React, { useState } from 'react';
import { Award, BookOpen, Users, Briefcase, ArrowRight, Mic, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InstructorAndExpertsSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const speakers = [
    {
      name: "Abhi Mahapatra",
      role: "Brand Growth & High-Impact Engagement Expert",
      company: "Ex: Amazon, Nissan, Ford",
      image: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361533/Abhi_Mahapatra_800x600_w7sfio.png",
      topic: "Experiential Growth Strategies for Solopreneurs",
      credentials: [
        "Former Director of Communications at Amazon India with 20+ years in brand strategy",
        "Top 20 Global Professionals by Provoke Media/ Holmes Report",
        "Recognized among the Top 100 Influential Game Changers of 2025 by e4m"
      ]
    },
    {
      name: "Sophia Christina",
      role: "Brand Storytelling & Reputation Architect",
      company: "Marketing Communications Expert",
      image: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361977/WhatsApp_Image_2025-03-07_at_20.58.08_eeinos.jpg",
      topic: "The Art of Storytelling—Creating Content with Meaning & Impact",
      credentials: [
        "Former Head of Communications at IIM Ahmedabad, crafting narratives in academia",
        "Built ingredient-led and product storytelling strategies at Marico",
        "Teacher, Public Speaker, Corporate Mentor"
      ]
    },
    {
      name: "Ishan Russell",
      role: "Founder & CEO, LdrX AI",
      company: "Leadership & Digital Influence Mentor",
      image: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361535/Ishan_800x600_e0j11p.png",
      topic: "Building a Strong Personal Brand—Leadership in the Age of AI",
      credentials: [
        "Founder of LdrX AI, helping leaders amplify their influence & remove barriers to action",
        "Former TV journalist turned entrepreneur, shaping executive and political brand narratives",
        "Led Social Saheli, empowering rural women with digital & leadership skills"
      ]
    },
    {
      name: "Sumit Kumar",
      role: "Cartoonist",
      company: "Founder of Bakarmax",
      image: "https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361536/Sumit_800x600_zcxj1d.png",
      topic: "Building a Solo Career, Beyond Just an Instagram Page",
      credentials: [
        "Author of 3 graphic novels, writer for Savita Bhabhi, and winner of Best Indian Webcomic three years in a row",
        "Part of the founding team of Comic Con India & has taught at the University of Illinois",
        "Successfully crowdfunded Kickstarter project 'Aapki Poojita', now in production"
      ]
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 2 >= speakers.length ? 0 : prev + 2));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 2 < 0 ? speakers.length - 2 : prev - 2));
  };

  return (
    <section id="instructor" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary-light/20 text-primary-dark px-4 py-1 rounded-full mb-4 font-medium">
            LEARN FROM THE BEST
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Your Mentor & Guest Speakers</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from industry leaders, innovators, and challengers who bring real-world expertise to help you build, launch, and scale as a solopreneur.
          </p>
        </div>
        
        {/* Main Mentor Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5">
                <img 
                  src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361535/Meet_The_Trainer_800x800_wb7jkq.png"
                  alt="Diksha Sethi - Communications Specialist" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-8 md:p-10">
                <div className="inline-block bg-primary-light/20 text-primary-dark px-3 py-1 rounded-full mb-3 text-sm font-medium">
                  YOUR LEAD MENTOR
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Diksha Sethi</h3>
                <p className="text-primary font-medium mb-4">Founder, Start Solo</p>
                
                <p className="text-gray-700 mb-6">
                  Meet Diksha Sethi—Communications Specialist, brand whisperer, and solopreneur champion. With 18 years of experience leading brands like Mastercard, Ford, IndiGo, SpiceJet, and Qualcomm, she has navigated boardrooms, crisis war rooms, and major brand launches.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-700">18+ years of proven agency leadership expertise</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-700">Empowered 2,800+ professionals</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-700">20,000+ hours of impactful mentoring</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-700">Award-winning podcaster & NLP practitioner</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                  <p className="italic text-gray-700 mb-3">
                    "I believe in our motto: 'Start Solo—but not alone.' My mission is to help people look beyond the 9-to-5 and turn their passion into financial freedom. Start Solo is a community that incubates, mentors, and empowers solopreneurs to launch and grow—every step of the way."
                  </p>
                  <p className="font-medium text-gray-900">— Diksha Sethi</p>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <a 
                    href="/learn"
                    onClick={handleClick}
                    className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition"
                  >
                    Learn about the Courses <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Expert Speakers Section - Carousel Design */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Guest Speakers</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our course and community feature exclusive sessions with these successful entrepreneurs and specialists
            </p>
          </div>
          
          <div className="relative">
            {/* Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-50"
              aria-label="Previous speakers"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-50"
              aria-label="Next speakers"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
            
            {/* Speakers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {speakers.slice(activeSlide, activeSlide + 2).map((speaker, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="flex items-start">
                    <div className="w-1/3">
                      <div className="aspect-square">
                        <img 
                          src={speaker.image} 
                          alt={speaker.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="w-2/3 p-4">
                      <h4 className="font-bold text-gray-900 mb-2">{speaker.name}</h4>
                      <p className="text-accent text-sm font-medium">{speaker.role}</p>
                      <p className="text-gray-600 text-sm mb-3">{speaker.company}</p>
                      
                      <div className="bg-accent-light/10 p-3 rounded-lg mb-3">
                        <div className="flex items-start">
                          <Mic className="h-4 w-4 text-accent mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm">{speaker.topic}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {speaker.credentials.slice(0, 2).map((credential, i) => (
                          <div key={i} className="flex items-start">
                            <Award className="h-4 w-4 text-accent mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-600 text-sm">{credential}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(speakers.length / 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index * 2)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeSlide === index * 2 ? 'bg-primary w-6' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorAndExpertsSection;