import React, { useState } from 'react';
import { ArrowRight, Download, Calendar, Users, BookOpen, Briefcase, Code, LineChart } from 'lucide-react';
import LeadMagnetForm from './LeadMagnetForm';
import { OptimizedImage } from './OptimizedImage';
import MentorForm from './MentorForm';
import DiscoveryCallForm from './DiscoveryCallForm';

const LaidOffEngineersPage: React.FC = () => {
  const [isLeadMagnetFormOpen, setIsLeadMagnetFormOpen] = useState(false);
  const [isSkillMatchFormOpen, setIsSkillMatchFormOpen] = useState(false);
  const [isMentorFormOpen, setIsMentorFormOpen] = useState(false);
  const [isDiscoveryCallFormOpen, setIsDiscoveryCallFormOpen] = useState(false);

  const handleLeadMagnetFormClose = () => {
    setIsLeadMagnetFormOpen(false);
  };

  const handleSkillMatchFormClose = () => {
    setIsSkillMatchFormOpen(false);
  };

  const handleMentorFormClose = () => {
    setIsMentorFormOpen(false);
  };

  const handleDiscoveryCallFormClose = () => {
    setIsDiscoveryCallFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[color:var(--color-gray-50)] to-[color:var(--color-navy)] bg-opacity-10 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 lg:pr-8 xl:pr-12 mb-8 sm:mb-10 lg:mb-0">
              <div className="inline-block bg-[color:var(--color-navy)] text-white px-3 sm:px-4 py-1 rounded-full mb-4 font-medium uppercase text-xs sm:text-sm">
                ENGINEERS IN CAREER TRANSITION
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--color-navy)] mb-4 sm:mb-5 md:mb-6 leading-tight">
                Your Skills Aren't Outdated. Just Your Job.
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl text-[color:var(--color-teal)] mb-4 sm:mb-5 md:mb-6 font-medium">
                Losing a job never erases your value.
              </h2>
              <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] mb-6 sm:mb-7 md:mb-8 leading-relaxed">
                At Start Solo, your expertise becomes a launchpad for independence—no company can take away your future.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setIsLeadMagnetFormOpen(true)}
                  className="bg-[#1D3A6B] hover:bg-[#152A4F] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg transition flex items-center justify-center text-sm sm:text-base font-semibold w-full sm:w-auto"
                >
                  Explore 10 Low-Risk Solo Businesses <Download className="ml-2 h-4 w-4" />
                </button>
                <button 
                  onClick={() => setIsDiscoveryCallFormOpen(true)} 
                  className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm sm:text-base font-semibold w-full sm:w-auto"
                >
                  Set up a Discovery Call <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://res.cloudinary.com/ddrztw5i1/image/upload/v1758175545/engineers_qaozjl.png" 
                  alt="Professional working on laptop" 
                  className="rounded-lg shadow-xl w-full max-w-sm sm:max-w-md mx-auto lg:max-w-full h-auto object-contain"
                />
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white p-3 sm:p-4 rounded-lg shadow-lg hidden sm:block">
                  <p className="text-brand-navy font-bold text-sm sm:text-base">Join 600+ professionals</p>
                  <p className="text-[color:var(--color-gray-900)] text-xs sm:text-sm">who've transformed layoffs into opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* We Understand the Uncertainty You're Facing Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[color:var(--color-gray-50)] to-white relative overflow-hidden" id="learn-more">
        {/* Decorative elements */}
        <div className="absolute top-5 right-5 w-20 h-20 bg-[color:var(--color-sky)] rounded-full opacity-5 blur-2xl"></div>
        <div className="absolute bottom-5 left-5 w-16 h-16 bg-[color:var(--color-cta)] rounded-full opacity-5 blur-xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Compact Header */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-4 leading-tight">
              We Understand the Uncertainty You're Facing
            </h2>
            <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] mb-6">
              You're never starting from zero. Career transitions can feel overwhelming, but your technical expertise and problem-solving skills are more valuable than ever. At Start Solo, we help you channel that uncertainty into opportunity.
            </p>
          </div>
          
          {/* Compact 3-column layout */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Question 1 */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-sky)] relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[color:var(--color-sky)] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">1</span>
                </div>
                <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-3 leading-tight">
                  What if I don't find another job soon?
                </h3>
                <p className="text-[color:var(--color-gray-900)] text-sm leading-relaxed">
                Create your own opportunity instead of waiting for someone else to provide one.
              </p>
            </div>
              
              {/* Question 2 */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-cta)] relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[color:var(--color-cta)] rounded-full flex items-center justify-center">
                  <span className="text-[color:var(--color-cta-text)] font-bold text-xs">2</span>
                </div>
                <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-3 leading-tight">
                  Are my skills still relevant?
                </h3>
                <p className="text-[color:var(--color-gray-900)] text-sm leading-relaxed">
                Your expertise has inherent value that transcends any single employer or role.
              </p>
            </div>
              
              {/* Question 3 */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-navy)] relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[color:var(--color-navy)] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">3</span>
                </div>
                <h3 className="text-lg font-bold text-[color:var(--color-navy)] mb-3 leading-tight">
                  How can I secure my career and income again?
                </h3>
                <p className="text-[color:var(--color-gray-900)] text-sm leading-relaxed">
                Build income streams you control, creating stability that no employer can take away.
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Skills Deserve a Fresh Direction Section */}
      <section className="py-12 md:py-16 bg-[color:var(--color-gray-50)]" id="fresh-direction">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--color-navy)] mb-4 leading-tight">
              Your Skills Deserve a Fresh Direction
            </h2>
            <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] max-w-2xl mx-auto">
              Losing a job doesn't mean losing your edge. At Start Solo, we help you bounce back fast by turning your expertise into a solo business.
            </p>
          </div>
          
          {/* Timeline/Path Layout */}
          <div className="max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[color:var(--color-yellow)]">
                  <div className="flex items-center mb-3">
                    <div className="bg-[color:var(--color-yellow)] w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-[color:var(--color-navy)]">Fast Idea-to-Market Guidance</h3>
                  </div>
                  <p className="text-[color:var(--color-gray-900)] mb-4 text-sm leading-relaxed">
                    Identify opportunities you can launch in weeks, not months. Turn your technical expertise into market-ready solutions quickly.
                  </p>
                  <button 
                    onClick={() => setIsSkillMatchFormOpen(true)}
                    className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-4 py-2 rounded-lg transition flex items-center w-fit text-sm font-semibold"
                  >
                    Match My Skills with a Business Idea <Download className="ml-1 h-3 w-3" />
                  </button>
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
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-[color:var(--color-navy)]">Confidence Reboot</h3>
                  </div>
                  <p className="text-[color:var(--color-gray-900)] mb-4 text-sm leading-relaxed">
                    Mentorship that helps you see your skills as assets, not setbacks. Rebuild your professional confidence with expert guidance.
                  </p>
                  <a 
                    href="/course" 
                    className="bg-[color:var(--color-teal)] hover:bg-[#4A8B85] text-white px-4 py-2 rounded-lg transition flex items-center w-fit text-sm font-semibold"
                  >
                    Join Career Launchpad Course <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
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
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-[color:var(--color-navy)]">Engineer-to-Entrepreneur Tools</h3>
                  </div>
                  <p className="text-[color:var(--color-gray-900)] mb-4 text-sm leading-relaxed">
                    Simple frameworks to test, validate, and scale your offering. Clear targeting and go-to-market playbook for landing your first client.
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

      {/* Let's Put Your Skills Back to Work Section - HIDDEN */}
      {/* <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Let's Put Your Skills Back to Work—For You</h2>
              <p className="text-lg md:text-xl text-[color:var(--color-gray-900)]">
                Start Solo helps you:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Turn Expertise Into Services</h3>
                <p className="text-[color:var(--color-gray-900)]">
                  Transform your knowledge into consulting, training, or new services
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Launch Products</h3>
                <p className="text-[color:var(--color-gray-900)]">
                  Create products based on your real-world strengths and expertise
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LineChart className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Diversify Income</h3>
                <p className="text-[color:var(--color-gray-900)]">
                  Build multiple income streams so your career is in your hands
                </p>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] font-medium">
                You don't have to wait. Begin building the life that fits you, today.
              </p>
            </div>
            
            <div className="bg-[color:var(--color-navy)] bg-opacity-5 p-8 md:p-12 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-[color:var(--color-navy)] mb-6 text-center">Want support in building new income streams?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a 
                  href="#mentorship" 
                  className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Book a Mentorship <Calendar className="ml-2 h-4 w-4" />
                </a>
                <a 
                  href="#launchpad" 
                  className="bg-[color:var(--color-navy)] text-white px-6 py-4 rounded-lg hover:bg-[color:var(--color-primary)] transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Try the Launchpad Course <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a 
                  href="#download-guide" 
                  className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Download the Free Guide <Download className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* From Layoff to Take-Off Section */}
      {/* <section className="py-16 md:py-24 bg-[color:var(--color-gray-50)]" id="stories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">From Layoff to Take-Off: Genuine Stories</h2>
            <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] max-w-3xl mx-auto">
              Meet professionals who've transformed unexpected career changes into opportunities for growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1600878459138-e1123b37cb30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Arjun" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Arjun</h3>
                <p className="text-[color:var(--color-teal)] font-medium mb-4">Software Engineer to Three-Startup Consultant</p>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Leveraged his technical expertise to help multiple startups build their engineering teams and processes.
                </p>
                <a href="#arjun-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read his story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Nisha" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Nisha</h3>
                <p className="text-[color:var(--color-teal)] font-medium mb-4">Data Analyst to Ed-Tech Entrepreneur</p>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Created an online platform teaching data skills to professionals looking to upskill in the digital economy.
                </p>
                <a href="#nisha-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read her story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Suresh" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Suresh</h3>
                <p className="text-[color:var(--color-teal)] font-medium mb-4">Project Manager to Leadership Coach</p>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Transformed his project management experience into a coaching practice helping tech leaders excel.
                </p>
                <a href="#suresh-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read his story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] italic max-w-3xl mx-auto">
              They built futures by relying on their skills and passion.
            </p>
          </div>
        </div>
      </section> */}

      {/* Your Breakthrough Toolkit Section - HIDDEN */}
      {/* <section className="py-16 md:py-24 bg-white" id="toolkit">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Your Breakthrough Toolkit</h2>
            <p className="text-lg md:text-xl text-[color:var(--color-gray-900)] max-w-3xl mx-auto">
              Everything you need to transform your professional expertise into independent success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-yellow)] bg-opacity-20 p-4 rounded-full">
                  <Download className="h-8 w-8 text-[color:var(--color-yellow-dark)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Passion Rediscovery Guide (Free)</h3>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Uncover new possibilities and directions for your career with our step-by-step workbook designed for professionals in transition.
                </p>
                <a 
                  href="#download-guide" 
                  className="text-[color:var(--color-yellow-dark)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Download Now <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-navy)] bg-opacity-20 p-4 rounded-full">
                  <Calendar className="h-8 w-8 text-[color:var(--color-navy)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">1:1 Mentorship</h3>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Get tailored guidance from seasoned experts who can help you navigate your professional pivot with confidence.
                </p>
                <a 
                  href="#mentorship" 
                  className="text-[color:var(--color-navy)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center"
                >
                  Book a Session <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 p-4 rounded-full">
                  <BookOpen className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Launchpad Course</h3>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Follow our step-by-step program to winning your first client and building a sustainable independent career.
                </p>
                <a 
                  href="#launchpad" 
                  className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center"
                >
                  Join the Course <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-[color:var(--color-gray-50)] p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-primary)] bg-opacity-20 p-4 rounded-full">
                  <Users className="h-8 w-8 text-[color:var(--color-primary)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Peer Community</h3>
                <p className="text-[color:var(--color-gray-900)] mb-4">
                  Connect with a supportive network of professionals who understand your journey and have been there themselves.
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
            <h3 className="text-2xl font-bold text-[color:var(--color-navy)] mb-6 text-center">Your journey can start now:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Sign Up For Launchpad <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#download-guide" 
                className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Download the Guide <Download className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section> */}


      {/* Peer Community Section */}
      <section className="py-12 md:py-16 bg-[color:var(--color-light-blue)] relative">
        {/* Decorative separator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[color:var(--color-navy)] to-transparent opacity-30"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white bg-opacity-80 p-6 md:p-8 rounded-xl shadow-lg">
              <div className="flex justify-center mb-6">
                <div className="bg-[color:var(--color-navy)] p-6 rounded-full shadow-lg">
                  <Users className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[color:var(--color-navy)]">The Engineers' Reboot Hub</h2>
              <p className="text-lg md:text-xl mb-6 leading-relaxed text-[color:var(--color-gray-900)]">
                Connect with a supportive network of professionals who understand your journey and have been there themselves. Join engineers who are building their own paths forward.
              </p>
              <a 
                href="https://chat.whatsapp.com/CcUxmN9Rlb9E0sfnIZ6HZa?mode=ems_copy_t" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[color:var(--color-navy)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[color:var(--color-cta)] hover:text-[color:var(--color-cta-text)] transition-all duration-300"
              >
                The Engineers' Reboot Hub <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Form */}
      {isLeadMagnetFormOpen && (
        <LeadMagnetForm
          isOpen={isLeadMagnetFormOpen}
          onClose={handleLeadMagnetFormClose}
          leadMagnet={{
            title: "10 Low-Risk Solo Businesses",
            fileName: "10_Solopreneur_Models_That_Don_t_Need_VC.pdf",
            downloadUrl: "https://res.cloudinary.com/ddrztw5i1/image/upload/v1758279942/10_Solopreneur_Models_That_Don_t_Need_VC_spn4wp.pdf"
          }}
        />
      )}

      {/* Skill Match Form */}
      {isSkillMatchFormOpen && (
        <LeadMagnetForm
          isOpen={isSkillMatchFormOpen}
          onClose={handleSkillMatchFormClose}
          leadMagnet={{
            title: "Skills to Solo Business Idea Generator",
            fileName: "Skills_to_Solo_Business_Idea_Generator.docx",
            downloadUrl: "https://res.cloudinary.com/ddrztw5i1/raw/upload/v1758279948/Skills_to_Solo_Business_Idea_Generator_ww5qqd.docx"
          }}
        />
      )}

      {/* Mentor Form */}
      {isMentorFormOpen && (
        <MentorForm
          isOpen={isMentorFormOpen}
          onClose={handleMentorFormClose}
        />
      )}

  {/* Discovery Call Form */}
  {isDiscoveryCallFormOpen && (
    <DiscoveryCallForm onClose={handleDiscoveryCallFormClose} audience="engineers" />
  )}
    </div>
  );
};

export default LaidOffEngineersPage;
