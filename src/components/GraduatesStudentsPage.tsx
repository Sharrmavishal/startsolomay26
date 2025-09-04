import React from 'react';
import { ArrowRight, Lightbulb, Target, Rocket, BookOpen, Compass } from 'lucide-react';

const GraduatesStudentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[color:var(--color-gray-50)] to-[color:var(--color-navy)] bg-opacity-10 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <div className="inline-block bg-[color:var(--color-navy)] bg-opacity-20 text-[color:var(--color-navy)] px-4 py-1 rounded-full mb-4 font-medium">
                GRADUATES & STUDENTS
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[color:var(--color-navy)] mb-6 leading-tight">
                Create Your First Break—Don't Just Wait for One
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Whether you're waiting for your first opportunity or feel stuck where you are, Start Solo helps you turn skills and passion into meaningful direction.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a 
                  href="#idea-generator" 
                  className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-3 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
                >
                  Try Free Idea Generator <Lightbulb className="ml-2 h-4 w-4" />
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
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Graduate students collaborating" 
                  className="rounded-lg shadow-xl w-full max-w-md mx-auto md:max-w-full h-auto object-cover"
                  style={{ maxHeight: "450px" }}
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <p className="text-brand-navy font-bold">Join 2,800+ graduates</p>
                  <p className="text-gray-600">who've created their own opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* We Understand This Phase Section */}
      <section className="py-16 md:py-24 bg-white" id="learn-more">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-8">We Understand This Phase</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">No one hires me—I have no experience.</h3>
              <p className="text-gray-700">
                Break the experience paradox by creating your own projects and building a portfolio that speaks for itself.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">My first job feels unfulfilling.</h3>
              <p className="text-gray-700">
                Discover how to align your work with your values and create meaningful impact on your own terms.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Am I wasting time waiting for something better?</h3>
              <p className="text-gray-700">
                Take control of your career path by creating opportunities instead of waiting for them to appear.
              </p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700 italic">
              Your passion and drive can always be trusted. Use them—they're never outdated.
            </p>
          </div>
          
          <div className="mt-16 bg-[color:var(--color-navy)] bg-opacity-5 p-8 md:p-12 rounded-xl shadow-md max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[color:var(--color-navy)] mb-6 text-center">Test what excites you:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="#idea-generator" 
                className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Try the Free Idea Generator <Lightbulb className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#niche-finder" 
                className="border-2 border-[color:var(--color-navy)] bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg hover:bg-[color:var(--color-navy)] hover:text-white transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Use the Niche Finder Tool <Target className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#launchpad" 
                className="bg-[color:var(--color-navy)] text-white px-6 py-4 rounded-lg hover:bg-[color:var(--color-primary)] transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Join Career Launchpad <Rocket className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* A Guided Path to Purpose Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">A Guided Path to Purpose</h2>
              <p className="text-xl text-gray-700">
                With Start Solo, you move from ideas to action:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-yellow)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-8 w-8 text-[color:var(--color-yellow-dark)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Free Idea Generator</h3>
                <p className="text-gray-700">
                  Spark fresh directions tailored to your interests and skills.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-teal)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-[color:var(--color-teal)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Niche Finder Tool</h3>
                <p className="text-gray-700">
                  Find the sweet spot between skills and opportunities.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="bg-[color:var(--color-primary)] bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="h-8 w-8 text-[color:var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--color-navy)] mb-4">Career Launchpad Course</h3>
                <p className="text-gray-700">
                  Build something real—freelance, venture, or brand.
                </p>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <p className="text-xl text-gray-700 font-medium">
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
      </section>

      {/* Stories: Passion Into Possibility Section */}
      <section className="py-16 md:py-24 bg-white" id="stories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--color-navy)] mb-6">Stories: Passion Into Possibility</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Meet graduates who've transformed their skills into meaningful opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
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
                <p className="text-gray-700 mb-4">
                  Transformed his design education into a thriving creative collective that serves multiple clients.
                </p>
                <a href="#aman-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read his story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
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
                <p className="text-gray-700 mb-4">
                  Turned her MBA capstone project into a sustainable social enterprise with real community impact.
                </p>
                <a href="#priya-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read her story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
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
                <p className="text-gray-700 mb-4">
                  Built a freelance development business that now earns more than the entry-level position he was initially offered.
                </p>
                <a href="#rahul-story" className="text-[color:var(--color-teal)] font-medium hover:text-[color:var(--color-primary)] transition flex items-center">
                  Read his story <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-xl text-gray-700 italic max-w-3xl mx-auto">
              They gave themselves permission—and found their niche.
            </p>
          </div>
        </div>
      </section>

      {/* Why Start Solo Works Section */}
      <section className="py-16 md:py-24 bg-[color:var(--color-navy)] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Start Solo Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-[color:var(--color-navy)] bg-opacity-40 p-8 rounded-xl border border-white border-opacity-20">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Compass className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Explore ideas without pressure</h3>
              <p className="text-white text-opacity-90">
                Test concepts and find what resonates with you before making major commitments.
              </p>
            </div>
            <div className="bg-[color:var(--color-navy)] bg-opacity-40 p-8 rounded-xl border border-white border-opacity-20">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Discover the right niche before you commit</h3>
              <p className="text-white text-opacity-90">
                Find the perfect intersection of your skills, market needs, and personal passion.
              </p>
            </div>
            <div className="bg-[color:var(--color-navy)] bg-opacity-40 p-8 rounded-xl border border-white border-opacity-20">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Learn practical tools for real-world success</h3>
              <p className="text-white text-opacity-90">
                Gain actionable skills and strategies that traditional education often misses.
              </p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-2xl font-medium mb-10">
              Don't wait for your first break. Create it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="#idea-generator" 
                className="bg-[color:var(--color-yellow)] hover:bg-[color:var(--color-yellow-dark)] text-brand-gray-900 px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Try the Free Idea Generator <Lightbulb className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#niche-finder" 
                className="bg-white text-[color:var(--color-navy)] px-6 py-4 rounded-lg transition flex items-center justify-center text-sm md:text-base font-semibold hover:bg-[color:var(--color-yellow)] hover:text-brand-gray-900"
              >
                Use Niche Finder <Target className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#launchpad" 
                className="border-2 border-white bg-transparent text-white px-6 py-4 rounded-lg hover:bg-white hover:text-[color:var(--color-navy)] transition flex items-center justify-center text-sm md:text-base font-semibold"
              >
                Join the Career Launchpad <Rocket className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GraduatesStudentsPage;
