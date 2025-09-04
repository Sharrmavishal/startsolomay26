import React from 'react';
import { ArrowRight, Download, Calendar, Users, BookOpen } from 'lucide-react';

const WomenEntrepreneursPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[color:var(--color-gray-50)] to-[color:var(--color-teal)] bg-opacity-10 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <div className="inline-block bg-[color:var(--color-teal)] bg-opacity-20 text-[color:var(--color-teal)] px-4 py-1 rounded-full mb-4 font-medium">
                WOMEN RETURNING FROM A CAREER BREAK
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[color:var(--color-navy)] mb-6 leading-tight">
                From Career Break to Breakthrough
              </h1>
              <h2 className="text-2xl md:text-3xl text-[color:var(--color-teal)] mb-6 font-medium">
                Welcome to Work That Moves With Your Life
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Your pause wasn't a setback—it was part of your journey. With Start Solo, rediscover your purpose and shape a career that grows with you, not against you.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Life and work can flow together. Your skills and ambitions are always relevant, ready for new possibilities.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a 
                  href="#download-guide" 
                  className="bg-[color:var(--color-cta)] text-[color:var(--color-cta-text)] px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
                >
                  <span className="absolute inset-0 bg-[color:var(--color-cta-dark)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 transition-colors duration-300 flex items-center">
                    Download Free Guide <Download className="ml-2 h-4 w-4" />
                  </span>
                </a>
                <a 
                  href="#learn-more" 
                  className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
                >
                  <span className="absolute inset-0 bg-[color:var(--color-navy)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Woman entrepreneur working" 
                  className="rounded-lg shadow-xl w-full max-w-md mx-auto md:max-w-full h-auto object-cover"
                  style={{ maxHeight: "450px" }}
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <p className="text-brand-navy font-bold">Join 2,800+ women</p>
                  <p className="text-gray-600">who've transformed their career breaks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* We See You. We Hear You. Section */}
      <section className="py-16 md:py-24 bg-white" id="learn-more">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-8">We See You. We Hear You.</h2>
            <p className="text-xl text-gray-700 mb-8">
              Maybe you stepped back for caregiving, learning, or rest.
            </p>
            <p className="text-xl text-gray-700">
              Today you might ask:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Can my career fit into my life, not the other way around?</h3>
              <p className="text-gray-700">
                Find flexibility that adapts to your changing needs and priorities.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Are my skills still meaningful?</h3>
              <p className="text-gray-700">
                Discover how your unique expertise remains valuable and can be leveraged in new ways.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">How do I rebuild confidence and momentum?</h3>
              <p className="text-gray-700">
                Access tools and community support to regain your professional footing at your own pace.
              </p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700 italic">
              At Start Solo, we believe your experience enriches both your work and your life. You never have to choose just one.
            </p>
          </div>
        </div>
      </section>

      {/* Design a Career Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Design a Career That Lives Alongside What Matters Most</h2>
              <p className="text-xl text-gray-700">
                Solopreneurship means creating work that complements your life, not competes with it.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[color:var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Flexibility</h3>
                <p className="text-gray-700">
                  Work adapts and grows with your life's changes
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[color:var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Independence</h3>
                <p className="text-gray-700">
                  Craft a role that expresses your values and passions
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[color:var(--color-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Impact</h3>
                <p className="text-gray-700">
                  Transform your skills into meaningful work, at your pace
                </p>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <p className="text-xl text-gray-700 font-medium">
                Shape both: a thriving career and a fulfilling life.
              </p>
            </div>
            
            <div className="bg-[color:var(--color-navy)] bg-opacity-5 p-8 md:p-12 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-[color:var(--color-navy)] mb-6 text-center">Ready to rediscover your strengths?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a 
                  href="#download-guide" 
                  className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Download the Free Passion Rediscovery Guide <Download className="ml-2 h-4 w-4" />
                </a>
                <a 
                  href="#mentorship" 
                  className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Book a 1:1 Mentorship <Calendar className="ml-2 h-4 w-4" />
                </a>
                <a 
                  href="#launchpad" 
                  className="bg-[color:var(--color-navy)] text-white px-6 py-4 rounded-lg hover:bg-[color:var(--color-primary)] transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Join the Launchpad Course <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Stories Section */}
      <section className="py-16 md:py-24 bg-gray-50" id="stories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Real Stories, Real Blending of Life & Work</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
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
                <p className="text-gray-700 mb-4">
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
                <p className="text-gray-700 mb-4">
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
                <p className="text-gray-700 mb-4">
                  Balances creative work with personal wellness through her remote UX consultancy.
                </p>
                <a href="#radhika-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read her story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-xl text-gray-700 italic max-w-3xl mx-auto">
              Their breakthroughs brought work and life closer—on their own terms.
            </p>
          </div>
        </div>
      </section>

      {/* Support Toolkit Section */}
      <section className="py-16 md:py-24 bg-white" id="toolkit">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Your Support Toolkit</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Everything you need to build a career that works with your life, not against it.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-yellow)] bg-opacity-20 p-4 rounded-full">
                  <Download className="h-8 w-8 text-[color:var(--color-yellow-dark)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Passion Rediscovery Guide (Free)</h3>
                <p className="text-gray-700 mb-4">
                  Explore new directions that fit your life with our step-by-step workbook designed specifically for women returning from career breaks.
                </p>
                <a 
                  href="#download-guide" 
                  className="text-[color:var(--color-yellow-dark)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Download Now <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-navy)] bg-opacity-20 p-4 rounded-full">
                  <Calendar className="h-8 w-8 text-[color:var(--color-navy)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">1:1 Mentorship</h3>
                <p className="text-gray-700 mb-4">
                  Get tailored guidance from mentors who understand the unique challenges of balancing career and personal priorities.
                </p>
                <a 
                  href="#mentorship" 
                  className="text-[color:var(--color-navy)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center"
                >
                  Book a Session <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 p-4 rounded-full">
                  <BookOpen className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Launchpad Course</h3>
                <p className="text-gray-700 mb-4">
                  Follow our step-by-step program to launch a brand and business that works for your life circumstances.
                </p>
                <a 
                  href="#launchpad" 
                  className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center"
                >
                  Join the Course <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-primary)] bg-opacity-20 p-4 rounded-full">
                  <Users className="h-8 w-8 text-[color:var(--color-primary)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Peer Community</h3>
                <p className="text-gray-700 mb-4">
                  Connect with a supportive network of women who understand your journey and celebrate every aspect of it.
                </p>
                <a 
                  href="#community" 
                  className="text-[color:var(--color-primary)] font-medium hover:text-[color:var(--color-primary-dark)] transition flex items-center"
                >
                  Join the Community <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-[color:var(--color-navy)] bg-opacity-5 p-8 md:p-12 rounded-xl shadow-md max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[color:var(--color-navy)] mb-6 text-center">Take your next step toward a career-life blend:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="#download-guide" 
                className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Download Guide <Download className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#mentorship" 
                className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Book Mentorship <Calendar className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#launchpad" 
                className="bg-[color:var(--color-navy)] text-white px-6 py-4 rounded-lg hover:bg-[color:var(--color-primary)] transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Join Launchpad <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-16 md:py-24 bg-[color:var(--color-navy)] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join a Community That Gets You</h2>
            <p className="text-xl mb-10">
              Thousands of women have shaped careers that move and grow with life—with Start Solo's flexible tools and support.
            </p>
            <p className="text-2xl font-medium mb-12">
              Your life and career—flourishing, together.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <a 
                href="#download-guide" 
                className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Download
              </a>
              <a 
                href="#mentorship" 
                className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Book
              </a>
              <a 
                href="#launchpad" 
                className="bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold hover:bg-[color:var(--color-yellow)] hover:text-brand-gray-900"
              >
                Join
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WomenEntrepreneursPage;
