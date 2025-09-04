import React from 'react';
import { ArrowRight, Download, Calendar, Users, BookOpen, Briefcase, Code, LineChart } from 'lucide-react';

const LaidOffEngineersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[color:var(--color-gray-50)] to-[color:var(--color-navy)] bg-opacity-10 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <div className="inline-block bg-[color:var(--color-navy)] bg-opacity-20 text-[color:var(--color-navy)] px-4 py-1 rounded-full mb-4 font-medium">
                LAID-OFF ENGINEERS & PROFESSIONALS
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[color:var(--color-navy)] mb-6 leading-tight">
                Your Skills Aren't Outdated. Just Your Job.
              </h1>
              <h2 className="text-2xl md:text-3xl text-[color:var(--color-teal)] mb-6 font-medium">
                Losing a job never erases your value.
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                At Start Solo, your expertise becomes a launchpad for independence—no company can take away your future.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a 
                  href="#download-guide" 
                  className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-3 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Download Free Guide <Download className="ml-2 h-4 w-4" />
                </a>
                <a 
                  href="#learn-more" 
                  className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-6 py-3 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Professional working on laptop" 
                  className="rounded-lg shadow-xl w-full max-w-md mx-auto md:max-w-full h-auto object-cover"
                  style={{ maxHeight: "450px" }}
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <p className="text-brand-navy font-bold">Join 3,500+ professionals</p>
                  <p className="text-gray-600">who've transformed layoffs into opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* We Know What You're Facing Section */}
      <section className="py-16 md:py-24 bg-white" id="learn-more">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-8">We Know What You're Facing</h2>
            <p className="text-xl text-gray-700">
              You might be asking yourself:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">What if I don't find another job soon?</h3>
              <p className="text-gray-700">
                Create your own opportunity instead of waiting for someone else to provide one.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Are my skills still relevant?</h3>
              <p className="text-gray-700">
                Your expertise has inherent value that transcends any single employer or role.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">How can I secure my career and income again?</h3>
              <p className="text-gray-700">
                Build income streams you control, creating stability that no employer can take away.
              </p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700 italic">
              Layoffs unsettle, but your passion remains reliable—and you're never starting from zero.
            </p>
          </div>
          
          <div className="mt-16 bg-[color:var(--color-navy)] bg-opacity-5 p-8 md:p-12 rounded-xl shadow-md max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[color:var(--color-navy)] mb-6 text-center">Take control of your next step:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Explore the Solopreneur Launchpad <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#download-guide" 
                className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Download the Toolkit <Download className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Let's Put Your Skills Back to Work Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Let's Put Your Skills Back to Work—For You</h2>
              <p className="text-xl text-gray-700">
                Start Solo helps you:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Turn Expertise Into Services</h3>
                <p className="text-gray-700">
                  Transform your knowledge into consulting, training, or new services
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Code className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Launch Products</h3>
                <p className="text-gray-700">
                  Create products based on your real-world strengths and expertise
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LineChart className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Diversify Income</h3>
                <p className="text-gray-700">
                  Build multiple income streams so your career is in your hands
                </p>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <p className="text-xl text-gray-700 font-medium">
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
      </section>

      {/* From Layoff to Take-Off Section */}
      <section className="py-16 md:py-24 bg-gray-50" id="stories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">From Layoff to Take-Off: Genuine Stories</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
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
                <p className="text-gray-700 mb-4">
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
                <p className="text-gray-700 mb-4">
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
                <p className="text-gray-700 mb-4">
                  Transformed his project management experience into a coaching practice helping tech leaders excel.
                </p>
                <a href="#suresh-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read his story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-xl text-gray-700 italic max-w-3xl mx-auto">
              They built futures by relying on their skills and passion.
            </p>
          </div>
        </div>
      </section>

      {/* Your Breakthrough Toolkit Section */}
      <section className="py-16 md:py-24 bg-white" id="toolkit">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Your Breakthrough Toolkit</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Everything you need to transform your professional expertise into independent success.
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
                  Uncover new possibilities and directions for your career with our step-by-step workbook designed for professionals in transition.
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
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 p-4 rounded-full">
                  <BookOpen className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Launchpad Course</h3>
                <p className="text-gray-700 mb-4">
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
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md flex">
              <div className="mr-6">
                <div className="bg-[color:var(--color-primary)] bg-opacity-20 p-4 rounded-full">
                  <Users className="h-8 w-8 text-[color:var(--color-primary)]" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-2">Peer Community</h3>
                <p className="text-gray-700 mb-4">
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
      </section>

      {/* Hundreds Have Transformed Section */}
      <section className="py-16 md:py-24 bg-[color:var(--color-navy)] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Hundreds Have Transformed Layoffs Into Launches</h2>
            <p className="text-xl mb-10">
              With Start Solo, professionals like you find new projects, clients, and career control. Support that lasts—results that prove it.
            </p>
            <p className="text-2xl font-medium mb-12">
              A job may end. Your skills—and your future—don't have to.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <a 
                href="#mentorship" 
                className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Book
              </a>
              <a 
                href="#launchpad" 
                className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Join
              </a>
              <a 
                href="#community" 
                className="bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold hover:bg-[color:var(--color-yellow)] hover:text-brand-gray-900"
              >
                Grow
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaidOffEngineersPage;
