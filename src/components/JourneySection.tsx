import React from 'react';
import { Calendar, Video, BookOpen, ArrowRight, CheckCircle, Clock, Users } from 'lucide-react';
import { useContent } from './ContentProvider';
import { smoothScrollTo } from '../utils/scrollUtils';

const JourneySection = () => {
  const { journey, general } = useContent();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      smoothScrollTo(href.substring(1));
    }
  };
  
  // Get cohort start date from CMS or use fallback
  const cohortStartDate = general?.cohortStartDate || "June 15, 2025";

  return (
    <section id="journey" className="py-16 bg-gradient-to-br from-secondary-light/10 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-secondary-light/20 text-secondary-dark px-4 py-1 rounded-full mb-4 font-medium">
            YOUR JOURNEY
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Path to Success</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understand exactly how our two-step approach helps you build a successful solo business
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Journey Steps */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary to-primary transform -translate-x-1/2 hidden md:block"></div>
            
            {/* Step 1: Accelerator Session */}
            <div className="relative z-10 mb-8">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 text-center md:text-right">
                  <div className="inline-block bg-secondary-light/20 text-secondary-dark px-4 py-1 rounded-full mb-4 font-medium">
                    STEP 1
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Join the Solo Accelerator Session</h3>
                  <p className="text-gray-600 mb-4">
                    Join our 90-minute session for just ₹99 where you'll learn key strategies and get a taste of our complete framework.
                  </p>
                </div>
                <div className="md:w-24 flex justify-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white">
                    1
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center mb-4">
                      <Video className="h-6 w-6 text-secondary mr-2" />
                      <span className="font-semibold text-gray-900">Solo Accelerator Session</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">90-minute interactive session</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Learn essential course material</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Live Q&A with the trainer</span>
                      </li>
                    </ul>
                    <div className="mt-4 bg-secondary-light/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-secondary mr-2" />
                          <span className="text-gray-700 font-medium">Next session: {cohortStartDate}</span>
                        </div>
                        <span className="bg-white px-3 py-1 rounded-full text-secondary font-bold border border-secondary">
                          Just ₹99
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2: Full Course */}
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-2 md:order-1">
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-6 w-6 text-primary mr-2" />
                      <span className="font-semibold text-gray-900">Complete Course</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">12-15 hours of in-depth Live lessons</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Comprehensive workbooks & templates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Community support & expert sessions</span>
                      </li>
                    </ul>
                    <div className="mt-4 bg-primary-light/10 p-4 rounded-lg">
                      <span className="bg-white px-3 py-1 rounded-full text-primary font-bold border border-primary">
                        Special discount for session participants
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:w-24 flex justify-center order-1 md:order-2">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white">
                    2
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 text-center md:text-left order-3">
                  <div className="inline-block bg-primary-light/20 text-primary-dark px-4 py-1 rounded-full mb-4 font-medium">
                    STEP 2
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Enroll in the Full Course</h3>
                  <p className="text-gray-600 mb-4">
                    After attending the Solo Accelerator Session, you'll have the opportunity to enroll in our comprehensive Level 1 course with a special discount.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Card */}
          <div className="mt-12 bg-white rounded-xl p-8 shadow-lg border border-tertiary/20">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Our Commitment to Transparency</h3>
            <p className="text-gray-700 text-center mb-6">
              We believe in being completely transparent about our offerings. The Solo Accelerator Session provides genuine value on its own, while also introducing you to our more comprehensive course. There's no obligation to purchase the course after attending the session.
            </p>
            <div className="flex justify-center">
              <a 
                href="#webinar-dates"
                onClick={handleClick}
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition flex items-center"
              >
                Register for Session - Just ₹99 <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;