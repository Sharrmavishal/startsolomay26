import React, { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb, Target, Rocket, BookOpen, Compass, Download, Phone } from 'lucide-react';
import MentorForm from './MentorForm';
import LeadMagnetForm from './LeadMagnetForm';
import DiscoveryCallForm from './DiscoveryCallForm';

const GraduatesStudentsPage: React.FC = () => {
  const [isMentorFormOpen, setIsMentorFormOpen] = useState(false);
  const [isLeadMagnetFormOpen, setIsLeadMagnetFormOpen] = useState(false);
  const [isSkillMatchFormOpen, setIsSkillMatchFormOpen] = useState(false);
  const [isDiscoveryCallFormOpen, setIsDiscoveryCallFormOpen] = useState(false);
  const [isStickyCTAVisible, setIsStickyCTAVisible] = useState(false);

  const handleMentorFormClose = () => {
    setIsMentorFormOpen(false);
  };

  const handleLeadMagnetFormClose = () => {
    setIsLeadMagnetFormOpen(false);
  };

  const handleSkillMatchFormClose = () => {
    setIsSkillMatchFormOpen(false);
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
      {isMentorFormOpen && <MentorForm onClose={handleMentorFormClose} />}
      {isLeadMagnetFormOpen && (
        <LeadMagnetForm
          isOpen={isLeadMagnetFormOpen}
          onClose={handleLeadMagnetFormClose}
          leadMagnet={{
            title: "Solo Business Idea Generator",
            downloadUrl: "https://res.cloudinary.com/ddrztw5i1/raw/upload/v1758279948/Skills_to_Solo_Business_Idea_Generator_ww5qqd.docx",
            fileName: "Skills_to_Solo_Business_Idea_Generator.docx"
          }}
        />
      )}
      {isSkillMatchFormOpen && (
        <LeadMagnetForm
          isOpen={isSkillMatchFormOpen}
          onClose={handleSkillMatchFormClose}
          leadMagnet={{
            title: "Solo Business Idea Generator",
            downloadUrl: "https://res.cloudinary.com/ddrztw5i1/raw/upload/v1758279948/Skills_to_Solo_Business_Idea_Generator_ww5qqd.docx",
            fileName: "Skills_to_Solo_Business_Idea_Generator.docx"
          }}
        />
      )}
      {isDiscoveryCallFormOpen && (
        <DiscoveryCallForm
          isOpen={isDiscoveryCallFormOpen}
          onClose={handleDiscoveryCallFormClose}
        />
      )}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[color:var(--color-gray-50)] to-[color:var(--color-navy)] bg-opacity-10 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 lg:pr-8 xl:pr-12 mb-8 sm:mb-10 lg:mb-0">
              <div className="inline-block bg-[color:var(--color-navy)] bg-opacity-20 text-white px-3 sm:px-4 py-1 rounded-full mb-4 font-medium text-xs sm:text-sm">
                FOR STUDENTS
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--color-navy)] mb-4 sm:mb-5 md:mb-6 leading-tight">
                Don't Just Apply for Jobs — Create Your Own First Opportunity
              </h1>
              <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] mb-6 sm:mb-7 md:mb-8 leading-relaxed">
                Start Solo helps graduates design careers beyond traditional jobs — turning passion and skills into solo ventures, or entrepreneurial journeys from day one.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setIsLeadMagnetFormOpen(true)}
                  className="bg-[#1D3A6B] hover:bg-[#152A4F] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg transition flex items-center justify-center text-sm sm:text-base font-semibold w-full sm:w-auto"
                >
                  Start Solo Idea Generator <Download className="ml-2 h-4 w-4" />
                </button>
                <a 
                  href="/course" 
                  className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm sm:text-base font-semibold w-full sm:w-auto"
                >
                  Career Launchpad Course <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://res.cloudinary.com/ddrztw5i1/image/upload/v1758181712/graduates_m60jvm.png" 
                  alt="Graduate students collaborating" 
                  className="rounded-lg shadow-xl w-full max-w-sm sm:max-w-md mx-auto lg:max-w-full h-auto object-contain"
                  loading="lazy"
                />
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-lg shadow-lg hidden sm:block">
                  <p className="text-brand-navy font-bold text-sm sm:text-base">Join 450+ graduates</p>
                  <p className="text-[color:var(--color-gray-900)] text-xs sm:text-sm">who've created their own opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* We Understand This Phase Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[color:var(--color-gray-50)] to-white relative overflow-hidden" id="learn-more">
        {/* Decorative elements */}
        <div className="absolute top-5 right-5 w-20 h-20 bg-[color:var(--color-teal)] rounded-full opacity-5 blur-2xl"></div>
        <div className="absolute bottom-5 left-5 w-16 h-16 bg-[color:var(--color-cta)] rounded-full opacity-5 blur-xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Compact Header */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-4 leading-tight">
              We Understand Some Beginnings Can Be Tough
            </h2>
            <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] mb-6">
              Whether you're waiting for your first opportunity or feel stuck where you are, Start Solo helps you turn skills and passion into meaningful direction. Your passion and drive can always be trusted. Use them—they're never outdated.
            </p>
          </div>
          
          {/* Compact 3-column layout */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Question 1 */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-teal)] relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[color:var(--color-teal)] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">1</span>
                </div>
                <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-3 leading-tight">
                  No one hires me—I have no experience.
                </h3>
                <p className="text-[color:var(--color-gray-900)] text-sm leading-relaxed">
                Break the experience paradox by creating your own projects and building a portfolio that speaks for itself.
              </p>
            </div>
              
              {/* Question 2 */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-cta)] relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[color:var(--color-cta)] rounded-full flex items-center justify-center">
                  <span className="text-[color:var(--color-cta-text)] font-bold text-xs">2</span>
                </div>
                <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-3 leading-tight">
                  My first job feels unfulfilling.
                </h3>
                <p className="text-[color:var(--color-gray-900)] text-sm leading-relaxed">
                Discover how to align your work with your values and create meaningful impact on your own terms.
              </p>
            </div>
              
              {/* Question 3 */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-navy)] relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[color:var(--color-navy)] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">3</span>
                </div>
                <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-3 leading-tight">
                  Am I wasting time waiting for something better?
                </h3>
                <p className="text-[color:var(--color-gray-900)] text-sm leading-relaxed">
                Take control of your career path by creating opportunities instead of waiting for them to appear.
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Students: Start Your Career by Launching Your First Solo Business Section */}
      <section className="py-12 md:py-16 bg-[color:var(--color-gray-50)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--color-navy)] mb-4 leading-tight">
              Start Your Career by Launching Your First Solo Business
            </h2>
            <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] max-w-2xl mx-auto">
              Skip the traditional job hunt. Build something that's uniquely yours from day one.
            </p>
          </div>
          
          {/* Unique Timeline/Path Layout */}
          <div className="max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-yellow)]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[color:var(--color-yellow)] w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[color:var(--color-navy)]">Learn to Think Like a Founder</h3>
                  </div>
                  <p className="text-[color:var(--color-gray-900)] mb-4 text-sm leading-relaxed">
                    Go beyond textbooks and discover how to turn your ideas into a business. Our Solopreneur Program equips you with the skills to create, pitch, and grow your own venture.
                  </p>
                  <a 
                    href="/course" 
                    className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-4 py-2 rounded-lg transition flex items-center w-fit text-sm font-semibold"
                  >
                    Join Career Launchpad Course <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[color:var(--color-yellow)] text-opacity-30 mb-2">01</div>
                  <div className="w-1 h-12 bg-gradient-to-b from-[color:var(--color-yellow)] to-transparent mx-auto"></div>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-12">
              <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-teal)]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[color:var(--color-teal)] w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[color:var(--color-navy)]">Turn Skills into Income</h3>
                  </div>
                  <p className="text-[color:var(--color-gray-900)] mb-4 text-sm leading-relaxed">
                    From freelancing to digital-first ventures, we help you transform what you already know — coding, design, content, or any skill — into a profitable business idea.
                  </p>
                  <button 
                    onClick={() => setIsSkillMatchFormOpen(true)}
                    className="bg-[color:var(--color-teal)] hover:bg-[#4A8B85] text-white px-4 py-2 rounded-lg transition flex items-center w-fit text-sm font-semibold"
                  >
                    Match My Skill with a Business Idea <Download className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[color:var(--color-teal)] text-opacity-30 mb-2">02</div>
                  <div className="w-1 h-12 bg-gradient-to-b from-[color:var(--color-teal)] to-transparent mx-auto"></div>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-navy)]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[color:var(--color-navy)] w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <Rocket className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[color:var(--color-navy)]">Build a Career on Your Terms</h3>
                  </div>
                  <p className="text-[color:var(--color-gray-900)] mb-4 text-sm leading-relaxed">
                    A job isn't the only way to begin. With Start Solo, you'll launch a solo business that adapts to your goals, passions, and lifestyle.
                  </p>
                  <button 
                    onClick={() => setIsMentorFormOpen(true)}
                    className="bg-[color:var(--color-navy)] hover:bg-[color:var(--color-primary)] text-white px-4 py-2 rounded-lg transition flex items-center w-fit text-sm font-semibold"
                  >
                    Speak to a Mentor <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[color:var(--color-navy)] text-opacity-30 mb-2">03</div>
                  <div className="w-1 h-12 bg-gradient-to-b from-[color:var(--color-navy)] to-transparent mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Guided Path to Purpose Section - Hidden */}
      {/* <section className="py-16 md:py-24 bg-[color:var(--color-gray-50)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">A Guided Path to Purpose</h2>
              <p className="text-lg md:text-xl text-[color:var(--color-gray-900)]">
                With Start Solo, you move from ideas to action:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-yellow)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-8 w-8 text-[color:var(--color-yellow-dark)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Free Idea Generator</h3>
                <p className="text-[color:var(--color-gray-900)]">
                  Spark fresh directions tailored to your interests and skills.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Niche Finder Tool</h3>
                <p className="text-[color:var(--color-gray-900)]">
                  Find the sweet spot between skills and opportunities.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-primary)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="h-8 w-8 text-[color:var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Career Launchpad Course</h3>
                <p className="text-[color:var(--color-gray-900)]">
                  Build something real—freelance, venture, or brand.
                </p>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] font-medium">
                Each step builds confidence and clarity.
              </p>
            </div>
            
            <div className="bg-[color:var(--color-navy)] bg-opacity-5 p-8 md:p-12 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-[color:var(--color-navy)] mb-6 text-center">Ready to take real action?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a 
                  href="#idea-generator" 
                  className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Try Idea Generator <Lightbulb className="ml-2 h-4 w-4" />
                </a>
                <a 
                  href="#niche-finder" 
                  className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Find Your Niche <Target className="ml-2 h-4 w-4" />
                </a>
                <a 
                  href="#launchpad" 
                  className="bg-[color:var(--color-navy)] text-white px-6 py-4 rounded-lg hover:bg-[color:var(--color-primary)] transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Join Launchpad <Rocket className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Stories: Passion Into Possibility Section - Hidden */}
      {/* <section className="py-16 md:py-24 bg-white" id="stories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Stories: Passion Into Possibility</h2>
            <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] max-w-3xl mx-auto">
              Meet graduates who've transformed their skills into meaningful opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[color:var(--color-gray-50)] rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Aman" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Aman</h3>
                <p className="text-[color:var(--color-teal)] font-medium mb-4">Design Skills to Creative Collective</p>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Transformed his design education into a thriving creative collective that serves multiple clients.
                </p>
                <a href="#aman-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read his story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-[color:var(--color-gray-50)] rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Priya" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Priya</h3>
                <p className="text-[color:var(--color-teal)] font-medium mb-4">MBA Project to Social Impact Venture</p>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Turned her MBA capstone project into a sustainable social enterprise with real community impact.
                </p>
                <a href="#priya-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read her story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-[color:var(--color-gray-50)] rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600878459138-e1123b37cb30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Rahul" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Rahul</h3>
                <p className="text-[color:var(--color-teal)] font-medium mb-4">Freelance Coder, Earning Beyond First Offer</p>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Built a freelance development business that now earns more than the entry-level position he was initially offered.
                </p>
                <a href="#rahul-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read his story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] italic max-w-3xl mx-auto">
              They gave themselves permission—and found their niche.
            </p>
          </div>
        </div>
      </section> */}

      {/* Why Start Solo Works Section */}
      <section className="py-16 md:py-24 bg-white" id="toolkit">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">How Start Solo Helps You Turn Ideas Into a Successful Solo Business</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-yellow)] bg-opacity-50 p-4 rounded-full">
                <Compass className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Discover & Validate Your Idea</h3>
                <p className="text-[color:var(--color-gray-900)] mb-0">
                  We help you identify the right business idea by mapping your skills, passions, and market opportunities — so you start with confidence.
                </p>
              </div>
            </div>
            
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-navy)] bg-opacity-50 p-4 rounded-full">
                <Target className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Build Your One-Pager Business Launch Plan</h3>
                <p className="text-[color:var(--color-gray-900)] mb-0">
                  Through our Solopreneur Program, you gain practical skills in branding, sales, finance, and digital tools — everything you need to run lean and smart.
                </p>
              </div>
            </div>
            
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-teal)] bg-opacity-50 p-4 rounded-full">
                <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Launch With Expert Guidance</h3>
                <p className="text-[color:var(--color-gray-900)] mb-0">
                  You don’t do it alone. Our mentors, community, and AI-powered resources guide you through your first steps, helping you launch and grow faster.
              </p>
            </div>
          </div>
          
          </div>
        </div>
      </section>

      {/* Get Started CTA Section */}
        <section className="py-16 md:py-20 bg-[color:var(--color-light-blue)] text-[color:var(--color-navy)]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[color:var(--color-navy)]">Ready to Launch Your Solo Business?</h2>
            <p className="text-xl text-[color:var(--color-navy)] text-opacity-80 mb-8">
              Join hundreds of graduates who've turned their ideas into successful solo ventures. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/course" 
                className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-8 py-4 rounded-lg transition flex items-center justify-center text-lg font-semibold w-full sm:w-auto"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="https://chat.whatsapp.com/FN08Rx57pBv5C1TtvikUWU?mode=ems_copy_t" 
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] hover:bg-[color:var(--color-navy)] hover:text-white px-8 py-4 rounded-lg transition flex items-center justify-center text-lg font-semibold w-full sm:w-auto"
              >
                Join Graduates Community <ArrowRight className="ml-2 h-5 w-5" />
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

export default GraduatesStudentsPage;
