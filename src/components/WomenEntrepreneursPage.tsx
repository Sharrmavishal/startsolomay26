import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Calendar, Users, BookOpen, Phone } from 'lucide-react';
import MentorForm from './MentorForm';
import LeadMagnetForm from './LeadMagnetForm';
import DiscoveryCallForm from './DiscoveryCallForm';

const WomenEntrepreneursPage: React.FC = () => {
  const [isMentorFormOpen, setIsMentorFormOpen] = useState(false);
  const [isPassionGuideFormOpen, setIsPassionGuideFormOpen] = useState(false);
  const [isSupportToolkitFormOpen, setIsSupportToolkitFormOpen] = useState(false);
  const [isDiscoveryCallFormOpen, setIsDiscoveryCallFormOpen] = useState(false);
  const [isStickyCTAVisible, setIsStickyCTAVisible] = useState(false);

  const handleMentorFormClose = () => {
    setIsMentorFormOpen(false);
  };

  const handlePassionGuideFormClose = () => {
    setIsPassionGuideFormOpen(false);
  };

  const handleSupportToolkitFormClose = () => {
    setIsSupportToolkitFormOpen(false);
  };

  const handleDiscoveryCallFormClose = () => {
    setIsDiscoveryCallFormOpen(false);
  };

  // Track scroll position to show/hide the sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling down 300px
      setIsStickyCTAVisible(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {isMentorFormOpen && (
        <MentorForm
          onClose={handleMentorFormClose}
        />
      )}
      {isPassionGuideFormOpen && (
        <LeadMagnetForm
          isOpen={isPassionGuideFormOpen}
          onClose={handlePassionGuideFormClose}
          leadMagnet={{
            title: "Free Passion Rediscovery Guide",
            fileName: "passion-rediscovery-guide.pdf",
            downloadUrl: "/downloads/passion-rediscovery-guide.pdf"
          }}
        />
      )}
      {isSupportToolkitFormOpen && (
        <LeadMagnetForm
          isOpen={isSupportToolkitFormOpen}
          onClose={handleSupportToolkitFormClose}
          leadMagnet={{
            title: "Passion Rediscovery Guide (Free)",
            fileName: "passion-rediscovery-guide.pdf",
            downloadUrl: "/downloads/passion-rediscovery-guide.pdf"
          }}
        />
      )}
      {isDiscoveryCallFormOpen && (
        <DiscoveryCallForm
          onClose={handleDiscoveryCallFormClose}
        />
      )}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[color:var(--color-gray-50)] to-[color:var(--color-teal)] bg-opacity-10 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 lg:pr-8 xl:pr-12 mb-8 sm:mb-10 lg:mb-0">
              <div className="inline-block bg-[color:var(--color-teal)] text-white px-3 sm:px-4 py-1 rounded-full mb-4 font-medium text-xs sm:text-sm">
                ASPIRING WOMEN ENTREPRENEURS
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--color-navy)] mb-4 sm:mb-5 md:mb-6 leading-tight">
                From Career Break to Breakthrough
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl text-[color:var(--color-teal)] mb-4 sm:mb-5 md:mb-6 font-medium">
                Welcome to Work That Moves With Your Life
              </h2>
              <p className="text-base sm:text-lg text-[color:var(--color-gray-900)] mb-5 sm:mb-6 md:mb-8 leading-relaxed">
                Your pause wasn't a setback—it was part of your journey. With Start Solo, rediscover your purpose and shape a career that grows with you, not against you.
              </p>
              <p className="text-base sm:text-lg text-[color:var(--color-gray-900)] mb-6 sm:mb-7 md:mb-8 leading-relaxed">
                Life and work can flow together. Your skills and ambitions are always relevant, ready for new possibilities.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setIsPassionGuideFormOpen(true)}
                  className="bg-[color:var(--color-cta)] text-[color:var(--color-cta-text)] px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0 w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-[color:var(--color-cta-dark)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 transition-colors duration-300 flex items-center">
                    Free Passion Rediscovery Guide <Download className="ml-2 h-4 w-4" />
                  </span>
                </button>
                <button 
                  onClick={() => setIsMentorFormOpen(true)}
                  className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0 w-full sm:w-auto"
                >
                  <span className="absolute inset-0 bg-[color:var(--color-navy)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                    1:1 Mentorship <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Woman entrepreneur working" 
                  className="rounded-lg shadow-xl w-full max-w-sm sm:max-w-md mx-auto lg:max-w-full h-auto object-cover"
                  style={{ maxHeight: "400px" }}
                />
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-lg shadow-lg hidden sm:block">
                  <p className="text-brand-navy font-bold text-sm sm:text-base">Join 570+ women</p>
                  <p className="text-[color:var(--color-gray-900)] text-xs sm:text-sm">who've transformed their career breaks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* We See You. We Hear You. Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-[color:var(--color-gray-50)] to-white relative overflow-hidden" id="learn-more">
        {/* Decorative elements */}
        <div className="absolute top-5 right-5 w-16 h-16 sm:w-20 sm:h-20 bg-[color:var(--color-teal)] rounded-full opacity-5 blur-2xl"></div>
        <div className="absolute bottom-5 left-5 w-12 h-12 sm:w-16 sm:h-16 bg-[color:var(--color-cta)] rounded-full opacity-5 blur-xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Compact Header */}
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-block bg-[color:var(--color-teal)] text-[#E4E5E7] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 font-normal text-sm sm:text-base">
              Today you might ask:
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-3 sm:mb-4 leading-tight">
              We See You. We Hear You.
            </h2>
            <p className="text-base sm:text-lg text-[color:var(--color-gray-900)] mb-5 sm:mb-6 leading-relaxed">
              Maybe you stepped back for caregiving, learning, or rest. At Start Solo, we believe your experience enriches both your work and your life. You never have to choose just one.
            </p>
          </div>
          
          {/* Compact 3-column layout */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Question 1 */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-teal)] relative">
                <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-5 h-5 sm:w-6 sm:h-6 bg-[color:var(--color-teal)] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">1</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[color:var(--color-navy)] mb-2 sm:mb-3 leading-tight">
                  Can my career fit into my life, not the other way around?
                </h3>
                <p className="text-[color:var(--color-gray-900)] text-xs sm:text-sm leading-relaxed">
                  Find flexibility that adapts to your changing needs and priorities.
                </p>
              </div>
              
              {/* Question 2 */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-cta)] relative">
                <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-5 h-5 sm:w-6 sm:h-6 bg-[color:var(--color-cta)] rounded-full flex items-center justify-center">
                  <span className="text-[color:var(--color-cta-text)] font-bold text-xs">2</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[color:var(--color-navy)] mb-2 sm:mb-3 leading-tight">
                  Are my skills still meaningful?
                </h3>
                <p className="text-[color:var(--color-gray-900)] text-xs sm:text-sm leading-relaxed">
                  Discover how your unique expertise remains valuable and can be leveraged in new ways.
                </p>
              </div>
              
              {/* Question 3 */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-navy)] relative">
                <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-5 h-5 sm:w-6 sm:h-6 bg-[color:var(--color-navy)] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">3</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[color:var(--color-navy)] mb-2 sm:mb-3 leading-tight">
                  How do I rebuild confidence and momentum?
                </h3>
                <p className="text-[color:var(--color-gray-900)] text-xs sm:text-sm leading-relaxed">
                  Access tools and community support to regain your professional footing at your own pace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design a Career Section */}
      <section className="py-8 md:py-12 bg-[color:var(--color-gray-50)]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Compact Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--color-navy)] mb-3">Design a Career That Lives Alongside What Matters Most</h2>
            </div>
            
            {/* 2-Column Layout: Image and Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
              {/* Image */}
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Woman balancing work and life" 
                  className="w-full rounded-lg shadow-md"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              </div>
              
              {/* Text Content */}
              <div className="space-y-6">
                {/* Flexibility */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[color:var(--color-teal)] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-2">Flexibility</h3>
                    <p className="text-[color:var(--color-gray-900)] leading-relaxed">
                      Work that adapts as life changes
                    </p>
                  </div>
                </div>

                {/* Independence */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[color:var(--color-cta)] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[color:var(--color-cta-text)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-2">Independence</h3>
                    <p className="text-[color:var(--color-gray-900)] leading-relaxed">
                      Creating a role that reflects your values and passions
                    </p>
                  </div>
                </div>

                {/* Impact */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[color:var(--color-navy)] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-2">Impact</h3>
                    <p className="text-[color:var(--color-gray-900)] leading-relaxed">
                      Turning your skills into meaningful work, at your own pace
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Real Stories Section */}
      {/* <section className="py-16 md:py-24 bg-[color:var(--color-gray-50)]" id="stories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Real Stories, Real Blending of Life & Work</h2>
            <p className="text-xl text-[color:var(--color-gray-900)] max-w-3xl mx-auto">
              Meet women who've transformed their career breaks into opportunities for growth and fulfillment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Anjali" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Anjali</h3>
                <p className="text-[color:var(--color-teal)] font-medium mb-4">HR Coach</p>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Found professional growth while prioritising family time through her flexible coaching practice.
                </p>
                <a href="#anjali-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read her story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Meera" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Meera</h3>
                <p className="text-[color:var(--color-teal)] font-medium mb-4">Online Educator</p>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Empowering hundreds online while managing personal goals through her digital education platform.
                </p>
                <a href="#meera-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read her story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Radhika" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Radhika</h3>
                <p className="text-[color:var(--color-teal)] font-medium mb-4">UX Designer</p>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Balances creative work with personal wellness through her remote UX consultancy.
                </p>
                <a href="#radhika-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read her story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-xl text-[color:var(--color-gray-900)] italic max-w-3xl mx-auto">
              Their breakthroughs brought work and life closer—on their own terms.
            </p>
          </div>
        </div>
      </section> */}

      {/* Support Toolkit Section */}
      <section className="py-16 md:py-24 bg-white" id="toolkit">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Your Support Toolkit</h2>
            <p className="text-xl text-[color:var(--color-gray-900)] max-w-3xl mx-auto">
              Everything you need to build a career that works with your life, not against it.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-yellow)] bg-opacity-50 p-4 rounded-full">
                  <Download className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Passion Rediscovery Guide (Free)</h3>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Explore new directions that fit your life with our step-by-step workbook designed specifically for women returning from career breaks.
                </p>
                <button 
                  onClick={() => setIsSupportToolkitFormOpen(true)}
                  className="text-[color:var(--color-yellow-dark)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Download Now <Download className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-navy)] bg-opacity-50 p-4 rounded-full">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">1:1 Mentorship</h3>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Get tailored guidance from mentors who understand the unique challenges of balancing career and personal priorities.
                </p>
                <button 
                  onClick={() => setIsMentorFormOpen(true)}
                  className="text-[color:var(--color-navy)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center"
                >
                  Book a Session <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-teal)] bg-opacity-50 p-4 rounded-full">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Launchpad Course</h3>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Follow our step-by-step program to launch a brand and business that works for your life circumstances.
                </p>
                <a 
                  href="/course" 
                  className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center"
                >
                  Join the Course <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Peer Community Section */}
      <section className="py-12 md:py-16 bg-[color:var(--color-light-blue)] relative">
        {/* Decorative separator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[color:var(--color-navy)] to-transparent opacity-30"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white bg-opacity-80 p-6 md:p-8 rounded-xl shadow-lg">
              <div className="flex justify-center mb-6">
                <div className="bg-[color:var(--color-navy)] p-6 rounded-full shadow-lg">
                  <svg className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4ZM8 4C10.2 4 12 5.8 12 8C12 10.2 10.2 12 8 12C5.8 12 4 10.2 4 8C4 5.8 5.8 4 8 4ZM16 14C18.7 14 24 15.3 24 18V20H8V18C8 15.3 13.3 14 16 14ZM8 14C5.3 14 0 15.3 0 18V20H8V18C8 15.3 2.7 14 8 14Z"/>
                    <circle cx="16" cy="8" r="2" fill="var(--color-cta)"/>
                    <circle cx="8" cy="8" r="2" fill="var(--color-cta)"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[color:var(--color-navy)]">Women Who Build, Together</h2>
              <p className="text-lg mb-6 leading-relaxed text-[color:var(--color-gray-900)]">
                Join a WhatsApp-led community designed for women like you — a safe, supportive circle where experiences are shared, questions are welcomed, and every milestone is celebrated.
              </p>
              <a 
                href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij?mode=ems_copy_t" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[color:var(--color-navy)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[color:var(--color-cta)] hover:text-[color:var(--color-cta-text)] transition-all duration-300"
              >
                Join the Women's WhatsApp Community <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Discovery Call CTA */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isStickyCTAVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <button 
          onClick={() => setIsDiscoveryCallFormOpen(true)}
          className="flex items-center bg-[color:var(--color-navy)] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[color:var(--color-cta)] transition-all duration-300 group"
          aria-label="Set up a discovery call"
        >
          <Phone className="h-6 w-6 mr-2" />
          <span className="font-medium whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out">
            Set up a discovery call
          </span>
        </button>
      </div>
    </div>
  );
};

export default WomenEntrepreneursPage;
