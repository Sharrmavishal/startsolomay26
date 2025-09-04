import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import MentorForm from './MentorForm';

const WorkshopMentorshipSection: React.FC = () => {
  const [isMentorFormOpen, setIsMentorFormOpen] = useState(false);

  const handleMentorFormOpen = () => {
    setIsMentorFormOpen(true);
  };

  const handleMentorFormClose = () => {
    setIsMentorFormOpen(false);
  };

  return (
    <>
      <section id="workshop-mentorship" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Workshops Card */}
            <div className="bg-gradient-to-br from-white to-brand-yellow/10 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-cta p-2 rounded-full mr-3">
                    <Calendar className="h-6 w-6 text-brand-navy" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy">Workshops Overview</h3>
                </div>
                <h4 className="text-xl font-semibold mb-4 text-navy">Build smart. Grow solo.</h4>
                <p className="text-gray-700 mb-6">
                  Our workshops combine structure, mentorship, and accountability to help you launch confidently—in weeks, not years.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="bg-cta rounded-full p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-brand-navy" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Live Q&A and interactive sessions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-cta rounded-full p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-brand-navy" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Actionable frameworks to get your first clients fast</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-cta rounded-full p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-brand-navy" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Personalised feedback and community support</span>
                  </li>
                </ul>
                <a 
                  href="/workshops" 
                  className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
                  data-tracking="workshops-cta"
                >
                  <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                    Learn about the Courses
                  </span>
                </a>
              </div>
            </div>

            {/* Mentorship Card */}
            <div className="bg-gradient-to-br from-white to-brand-navy/10 rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-navy p-2 rounded-full mr-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy">1:1 Mentorship</h3>
                </div>
                <h4 className="text-xl font-semibold mb-4 text-navy">Stuck? Let's get you unstuck — together.</h4>
                <p className="text-gray-700 mb-6">
                  If you're building solo but feeling stuck, our affordable mentorship delivers clarity, strategy, and the confidence boost you need.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="bg-navy rounded-full p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Personalized 1:1 guidance from experienced mentors</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-navy rounded-full p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Focused strategy sessions to overcome specific challenges</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-navy rounded-full p-1 mr-3 mt-1">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Tailored advice for your unique business journey</span>
                  </li>
                </ul>
                <button 
                  onClick={handleMentorFormOpen}
                  className="border-2 border-navy bg-white text-navy px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0"
                  data-tracking="mentorship-cta"
                >
                  <span className="absolute inset-0 bg-navy transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                    Apply for 1:1 Mentorship
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {isMentorFormOpen && <MentorForm onClose={handleMentorFormClose} />}
    </>
  );
};

export default WorkshopMentorshipSection;
