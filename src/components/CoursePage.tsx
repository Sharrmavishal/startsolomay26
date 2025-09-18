import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Clock, Users, ShieldCheck, CheckCircle, ChevronDown, Play, BookOpen, Award, Globe, Calendar, Shield, Rocket, X } from 'lucide-react';

const CoursePage: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasShownPopup) return; // Don't show again if already shown
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / documentHeight) * 100;
      
      if (scrollPercentage >= 45) {
        setShowPopup(true);
        setHasShownPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShownPopup]);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner - Coursera Style */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left: Title/Meta */}
            <div className="lg:col-span-8">
              <div className="mb-3 text-sm text-gray-600">Start Solo • Professional Certificate</div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D3A6B] mb-4 leading-tight">Launchpad: The Start Solo Business Starter Course</h1>
              <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-gray-700">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-[color:var(--color-yellow)] fill-current" />
                  ))}
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">4.9 (1287 ratings)</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm"><Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 2,800+ enrolled</div>
                <div className="flex items-center text-xs sm:text-sm"><Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 4 weeks • Self-paced</div>
                <div className="flex items-center text-xs sm:text-sm"><ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Beginner friendly</div>
              </div>
              <p className="mt-4 sm:mt-6 text-gray-900 max-w-4xl text-base sm:text-lg leading-relaxed">
                This comprehensive self-paced 4-week program prepares you with the practical skills and confidence to launch your solo business. Designed for career changers, returning professionals, and fresh graduates, Launchpad eliminates guesswork and shows you how to build your business independently — no large teams, no VC funding, just your skills and passion.
              </p>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a href="#" className="inline-flex items-center justify-center bg-[#1D3A6B] text-white hover:bg-[#152A4F] px-6 py-3 rounded-lg font-semibold transition-colors min-h-[48px]">
                  Enroll now <ArrowRight className="ml-2 h-4 w-4" />
                </a>
        <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Launchpad: The Start Solo Business Starter Course',
                        text: 'This comprehensive self-paced 4-week program prepares you with the practical skills and confidence to launch your solo business.',
                        url: window.location.origin + '/course'
                      });
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      const shareUrl = window.location.origin + '/course';
                      navigator.clipboard.writeText(shareUrl);
                      alert('Course link copied to clipboard!');
                    }
                  }}
                  className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[48px]"
                >
                  Share
        </button>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[color:var(--color-gray-600)] line-through">₹3999</span>
                  <span className="text-[color:var(--color-cta)] font-bold text-lg sm:text-xl">₹1999</span>
                </div>
                <span className="text-sm text-[color:var(--color-gray-600)]">Special offer.</span>
              </div>
            </div>
            {/* Right: Enrollment Card */}
            <div className="lg:col-span-4">
              <div className="rounded-xl bg-white shadow-xl p-4 sm:p-6 border-l-4 border-l-[color:var(--color-teal)] border border-gray-200 lg:sticky lg:top-8 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base sm:text-lg font-bold text-gray-900 animate-pulse">⚡ Limited-time introductory offer</span>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">Launchpad Course: ₹3999</div>
                    <div className="text-gray-600 text-xs">4 weeks | 35–40 hours, self-paced</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Mentorship Call: ₹599</div>
                      <div className="text-gray-600 text-xs">1 personalized session | 45 minutes</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">Business Niche Finder: ₹299</div>
                      <div className="text-gray-600 text-xs">1.5 hours | Digital toolkit & worksheet</div>
                    </div>
                  </div>
                </div>
                <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-center gap-2 sm:gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[color:var(--color-gray-600)] line-through">₹4897</span>
                    <span className="text-[color:var(--color-cta)] font-bold text-xl sm:text-2xl">₹1999</span>
                  </div>
                  <div className="bg-[color:var(--color-gray-100)] text-[color:var(--color-gray-700)] px-2 py-1 rounded text-xs font-medium border border-[color:var(--color-gray-200)]">
                    Save ₹2898
                  </div>
                </div>
                <a href="#" className="w-full bg-[#1D3A6B] hover:bg-[#152A4F] text-white px-6 py-3 rounded-lg font-semibold mb-2 transition-all duration-300 hover:scale-105 inline-block text-center min-h-[48px] flex items-center justify-center">
                  Grab Offer
                </a>
                <div className="text-xs text-[color:var(--color-gray-600)] text-center">Special Bundle Price Offer.</div>
                <div className="text-xs text-gray-600 text-center">Expert guidance every step of the way. Community support included</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Tools */}
      <section className="py-8 sm:py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#1D3A6B] mb-4">Skills you'll gain</h3>
              <div className="flex flex-wrap gap-2">
                {['Founder Mindset', 'Target Audience Profiling', 'Defining Your Niche', 'Idea Validation', 'Lean Financial Planning', 'Landing Your First Paying Client', 'Smart Content Marketing Strategy', 'One-Pager Business Planning'].map((skill) => (
                  <span key={skill} className="text-xs sm:text-sm bg-[color:var(--color-gray-50)] text-[color:var(--color-gray-700)] px-2 sm:px-3 py-1 rounded-full border border-[color:var(--color-gray-200)]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1D3A6B] mb-4">Tools you'll use</h3>
              <div className="flex flex-wrap gap-2">
                {['Niche Finder', 'Idea Generator', 'Audience Planner', 'MVP Creator', 'SMART Goals'].map((tool) => (
                  <span key={tool} className="text-xs sm:text-sm bg-[color:var(--color-gray-50)] text-[color:var(--color-gray-700)] px-2 sm:px-3 py-1 rounded-full border border-[color:var(--color-gray-200)]">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Outcomes */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D3A6B] mb-4">About This Course</h3>
              <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                Launchpad is a practical, hands-on, self-paced 4-week program designed to guide you step-by-step from idea to launch with confidence. Across 35–40 hours of learning and activities, you will develop a tested business idea, designed around your own skills and passions.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                You will build a complete one-pager business launch plan by the end, including your validated MVP, clear target audience, unique niche, and marketing execution strategy. This course is perfect if you are:
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[color:var(--color-teal)] mr-3 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[color:var(--color-gray-700)] text-sm sm:text-base">Engineers in Career Transition, seeking to pivot confidently</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[color:var(--color-teal)] mr-3 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[color:var(--color-gray-700)] text-sm sm:text-base">Women returning to work after a break, ready to rediscover and monetise their strengths</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-[color:var(--color-teal)] mr-3 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[color:var(--color-gray-700)] text-sm sm:text-base">Fresh graduates eager to start their own venture instead of the traditional job hunt</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-xl border border-gray-200 p-4 sm:p-6 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">What You Will Walk Away With</h4>
                <ul className="space-y-3 text-gray-700 text-xs sm:text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[color:var(--color-teal)] mr-2 mt-0.5 flex-shrink-0" />
                    <span>A solo business idea uniquely suited to your strengths and interests</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[color:var(--color-teal)] mr-2 mt-0.5 flex-shrink-0" />
                    <span>A validated minimum viable product ready to launch confidently</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[color:var(--color-teal)] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Clear niche definition and target customer profiling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[color:var(--color-teal)] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Marketing campaign plan and tools for execution</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[color:var(--color-teal)] mr-2 mt-0.5 flex-shrink-0" />
                    <span>A complete, actionable one-pager business plan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[color:var(--color-teal)] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Confidence and clarity in independent business building</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[color:var(--color-teal)] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Continued mentorship and community support beyond the course</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus (Accordion) */}
      <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1D3A6B] mb-6">Course Structure and Modules</h3>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
              {[
                { 
                  title: 'Skills to Solo Business', 
                  duration: '4 hours', 
                  level: 'Beginner',
                  description: 'Identify skills/passion + business ideas (worksheet included).',
                  learn: [
                    'Discover your strengths and interests that can be monetized.',
                    'Use worksheets for clarity.'
                  ],
                  skills: [
                    'Self-assessment',
                    'Idea generation',
                    'Clarity of direction',
                    'Confidence building'
                  ]
                },
                { 
                  title: 'Define Your Niche', 
                  duration: '4 hours', 
                  level: 'Beginner',
                  description: 'Use niche finder worksheet to narrow down market, audience, and USP.',
                  learn: [
                    'Techniques to identify profitable niches',
                    'How to define your ideal audience',
                    'Pinpointing your USP'
                  ],
                  skills: [
                    'Market research',
                    'Audience profiling',
                    'Positioning',
                    'Analytical thinking'
                  ]
                },
                { 
                  title: 'Create Your MVP & Validate', 
                  duration: '6 hours', 
                  level: 'Beginner to Intermediate',
                  description: 'Build a minimum viable product/service, test the idea, gather feedback.',
                  learn: [
                    'Building a simple, testable MVP',
                    'Collecting feedback and iterating',
                    'Using the MVP and Validation Toolkit'
                  ],
                  skills: [
                    'Rapid prototyping',
                    'Customer feedback analysis',
                    'Iterative improvement',
                    'Validation strategies'
                  ]
                },
                { 
                  title: 'Goals & Audiences', 
                  duration: '4 hours', 
                  level: 'Beginner',
                  description: 'Set measurable business goals, profile your ideal customers.',
                  learn: [
                    'Setting SMART business goals',
                    'Customer segmentation and profiling',
                    'Using planning worksheets effectively'
                  ],
                  skills: [
                    'Goal setting',
                    'Customer profiling',
                    'Strategic planning',
                    'Prioritization'
                  ]
                },
                { 
                  title: 'Campaign Planning', 
                  duration: '8 hours', 
                  level: 'Beginner to Intermediate',
                  description: 'Design your first marketing campaign (worksheet/template).',
                  learn: [
                    'Step-by-step campaign design',
                    'Effective marketing messaging',
                    'Template-driven planning'
                  ],
                  skills: [
                    'Campaign planning',
                    'Content creation',
                    'Marketing fundamentals',
                    'Execution readiness'
                  ]
                },
                { 
                  title: 'Product Pricing Strategy & Lean Financial Planning', 
                  duration: '6-7 hours', 
                  level: 'Intermediate',
                  description: 'Learn to create a pricing strategy and manage business finances leanly.',
                  learn: [
                    'Different methods for pricing your products or services',
                    'Understanding costs, profit margins, and competition',
                    'Budgeting for sustainability',
                    'Managing cash flow and minimizing waste'
                  ],
                  skills: [
                    'Pricing strategy development',
                    'Financial planning and budgeting',
                    'Cost management',
                    'Profit optimization'
                  ]
                },
                { 
                  title: 'One-Pager Launch Blueprint', 
                  duration: '5-6 hours', 
                  level: 'Beginner to Intermediate',
                  description: 'Build and present your business launch plan (template included).',
                  learn: [
                    'Synthesizing your business plan',
                    'Creating an actionable one-pager',
                    'Presenting your roadmap for launch'
                  ],
                  skills: [
                    'Business planning',
                    'Presentation skills',
                    'Launch readiness'
                  ]
                }
              ].map((course, idx) => (
                <details key={idx} className="group border-b last:border-b-0">
                  <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer hover:bg-gray-50 min-h-[60px] sm:min-h-[80px]">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[color:var(--color-gray-100)] text-[color:var(--color-gray-700)] rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mr-3 sm:mr-4 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{course.title}</div>
                        <div className="text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {course.duration}</span>
                          <span className="flex items-center"><Award className="h-3 w-3 mr-1" /> {course.level}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-700 text-xs sm:text-sm leading-relaxed">
                    <p className="mb-4">
                      {course.description}
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">What you'll learn:</h5>
                        <ul className="space-y-1 text-xs sm:text-sm">
                          {course.learn.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Skills you'll gain:</h5>
                        <ul className="space-y-1 text-xs sm:text-sm">
                          {course.skills.map((skill, i) => (
                            <li key={i}>• {skill}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
          </div>
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-8 sm:py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1D3A6B] mb-6">Instructors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                { 
                  name: 'Diksha Sethi', 
                  title: 'Co-founder, Start Solo', 
                  company: 'Start Solo', 
                  imageUrl: 'https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361534/Diksha_800x600_tztawn.png',
                  bio: 'With over 18 years of experience in digital marketing, Diksha is a certified trainer and an award-winning podcaster. She is passionate about empowering solo entrepreneurs through clear, actionable training and mentorship.'
                },
                { 
                  name: 'Vishal Sharma', 
                  title: 'Co-founder, Start Solo', 
                  company: 'Start Solo', 
                  imageUrl: 'https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361539/vishal_800x600_uatsxz.png',
                  bio: 'Vishal brings over 18 years of experience in digital marketing, AI, and data analytics. Known as a tech maverick, he specializes in practical application of tech to drive business growth and entrepreneur success.'
                }
              ].map((instructor, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 p-4 sm:p-6 bg-white">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <img 
                      src={instructor.imageUrl}
                      alt={instructor.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mr-3 sm:mr-4 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{instructor.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{instructor.title}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{instructor.company}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{instructor.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Community */}
      <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D3A6B] mb-6">What learners are saying</h3>
              <div className="space-y-4 sm:space-y-6">
                {[
                  { 
                    text: "This course transformed how I view entrepreneurship. Launchpad's step-by-step modules helped me validate my business idea and gave me the confidence to launch my solo venture within weeks. The mentorship and practical tools were game changers.",
                    author: "Anika Mehta",
                    role: "Software Engineer"
                  },
                  { 
                    text: "The Launchpad program gave me clarity and a structured path at a time when I was uncertain about career options. The business plan templates and community support helped me land my first clients quickly. Highly recommend for anyone starting solo.",
                    author: "Rachit Sharma",
                    role: "Marketing Consultant"
                  }
                ].map((testimonial, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 p-4 sm:p-6 bg-white">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[color:var(--color-gray-100)] rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold text-[color:var(--color-gray-700)] flex-shrink-0">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-700 italic mb-3 text-sm sm:text-base">"{testimonial.text}"</p>
                        <div className="text-xs sm:text-sm">
                          <div className="font-semibold text-gray-900">{testimonial.author}</div>
                          <div className="text-gray-600">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-xl border border-gray-200 p-4 sm:p-6 bg-white">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Join the Solopreneurs' Community</h4>
                <p className="text-xs sm:text-sm text-gray-700 mb-4">
                  Connect with fellow aspiring Solopreneurs, share your progress and get feedback from mentors.
                </p>
                <a href="https://chat.whatsapp.com/CgrHI3AQbb6IX3gWKDa5Ij" target="_blank" rel="noopener noreferrer" className="w-full bg-[color:var(--color-cta)] hover:bg-[color:var(--color-cta-dark)] text-[color:var(--color-cta-text)] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors inline-block text-center min-h-[44px] flex items-center justify-center">
                  Join Community
                </a>
              </div>
              <div className="rounded-xl border border-gray-200 p-4 sm:p-6 bg-white">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Live sessions</h4>
                <p className="text-xs sm:text-sm text-gray-700 mb-4">
                  Attend weekly live Q&A sessions with instructors and guest experts.
                </p>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Every Thursday, 7:30 PM IST
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D3A6B] text-center mb-8 sm:mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                { q: 'How long will it take to complete the Launchpad course?', a: 'The course is designed as a 4-week, self-paced program with approximately 35-40 hours of learning, including videos, worksheets, and practical assignments. You can go at your own pace within this timeframe.' },
                { q: 'Do I need prior experience to enroll?', a: 'No prior business experience is needed. Launchpad is tailored for beginners, career changers, returning professionals, and fresh graduates looking to start a solo business with clear guidance.' },
                { q: 'What kind of support will I receive during the course?', a: 'You will have access to expert mentorship, live Q&A sessions via Zoom, and a supportive community of fellow learners to get feedback and motivation throughout your journey.' },
                { q: 'Will I receive a certificate upon completion?', a: 'Yes, you will receive a shareable professional certificate after completing all course modules and assignments.' },
                { q: 'Can I access course materials after completion?', a: 'Yes, course materials and resources remain accessible so you can revisit lessons anytime as you grow your business.' },
                { q: 'Is there a refund policy if I am not satisfied?', a: 'Please contact our support team within 30 days if you are unsatisfied. We offer refunds as per our refund policy to ensure your confidence in enrolling.' },
                { q: 'Will this course help me find paying customers?', a: 'Yes, the course includes modules on marketing, campaign planning, and strategies for landing your first paying client.' },
                { q: 'How is the course delivered?', a: 'The program is fully online and self-paced, with video lectures, downloadable worksheets, templates, and live mentorship sessions scheduled weekly.' }
              ].map((item, i) => (
                <details key={i} className="group border border-gray-200 rounded-lg">
                  <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 min-h-[60px] sm:min-h-[80px]">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{item.q}</span>
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-700 text-sm sm:text-base">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16" style={{backgroundColor: '#B7D4E6'}}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-gray-800">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">Take the first step toward independence and entrepreneurship today.</h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-700">
              Begin your transformation today.
            </p>
            <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2">
              <span className="text-gray-500 line-through">₹3999</span>
              <span className="text-gray-800 font-bold text-xl sm:text-2xl">₹1999</span>
            </div>
            <a href="#" className="bg-[color:var(--color-teal)] text-white hover:bg-[#4A8B85] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors inline-flex items-center justify-center min-h-[48px] sm:min-h-[56px]">
              Enroll Now <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">Limited-time introductory offer.</div>
          </div>
        </div>
      </section>

      {/* Popup Enrollment Card */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closePopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
            </button>
            </div>
            
            {/* Popup Content */}
            <div className="px-4 pb-6">
              <div className="border-l-4 border-l-[color:var(--color-teal)] border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 animate-pulse">⚡ Limited-time introductory offer</span>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-semibold text-gray-900">Launchpad Course: ₹3999</div>
                    <div className="text-gray-600 text-xs">4 weeks | 35–40 hours, self-paced</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-semibold text-gray-900">Mentorship Call: ₹599</div>
                    <div className="text-gray-600 text-xs">1 personalized session | 45 minutes</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-semibold text-gray-900">Business Niche Finder: ₹299</div>
                    <div className="text-gray-600 text-xs">1.5 hours | Digital toolkit & worksheet</div>
                  </div>
                </div>
                <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-center gap-2 sm:gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[color:var(--color-gray-600)] line-through">₹4897</span>
                    <span className="text-[color:var(--color-cta)] font-bold text-xl sm:text-2xl">₹1999</span>
                  </div>
                  <div className="bg-[color:var(--color-gray-100)] text-[color:var(--color-gray-700)] px-2 py-1 rounded text-xs font-medium border border-[color:var(--color-gray-200)]">
                    Save ₹2898
                  </div>
                </div>
                <a href="#" className="w-full bg-[#1D3A6B] hover:bg-[#152A4F] text-white px-6 py-3 rounded-lg font-semibold mb-2 transition-all duration-300 hover:scale-105 inline-block text-center min-h-[48px] flex items-center justify-center">
                  Grab Offer
                </a>
                <div className="text-xs text-[color:var(--color-gray-600)] text-center">Special Bundle Price Offer.</div>
                <div className="text-xs text-gray-600 text-center">Expert guidance every step of the way. Community support included</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;