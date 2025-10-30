import React, { useState } from 'react';

const WebinarPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    sessionDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.sessionDate.trim() !== ''
    );
  };

  const handlePaymentClick = () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields (Full Name, Email, and Phone Number) before proceeding.');
      return;
    }

    // Store user data before payment
    localStorage.setItem('webinarUserData', JSON.stringify({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      sessionDate: formData.sessionDate,
      sessionTime: '12PM to 1:30PM'
    }));

    // Submit to Netlify to capture lead + selection
    const encode = (data: Record<string, string>) =>
      Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
    try {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'webinar-registration',
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          sessionDate: formData.sessionDate,
          sessionTime: '12PM to 1:30PM'
        })
      });
    } catch (e) {
      // no-op; do not block payment flow
    }
    
    console.log('Get This Bundle clicked');
    // Updated Razorpay link with success URL
    window.open('https://rzp.io/rzp/fcigSpq?redirect_url=https://startsolo.in/webinar/success', '_blank', 'noopener,noreferrer');
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill in all required fields (Full Name, Email, and Phone Number) before proceeding.');
      return;
    }

    setIsSubmitting(true);

    // Persist for success page
    localStorage.setItem('webinarUserData', JSON.stringify({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      sessionDate: formData.sessionDate,
      sessionTime: '12PM to 1:30PM'
    }));

    // Submit to Netlify Forms reliably before payment
    const encode = (data: Record<string, string>) =>
      Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'webinar-registration',
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          sessionDate: formData.sessionDate,
          sessionTime: '12PM to 1:30PM'
        })
      });
    } catch (err) {
      // continue to payment even if tracking fails
    }

    setIsSubmitting(false);
    handlePaymentClick();
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Exact Hootsuite Layout */}
      <section id="webinar-form" className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 lg:gap-20 items-start">
          {/* Left Column - Image and Content */}
          <div className="space-y-8">
            {/* Hero Image - Collage style like Hootsuite */}
            <div className="relative">
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl overflow-hidden">
                <img 
                  src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1761727110/start_solo_hero_banner_800x600_t2hjjo.png" 
                  alt="Start Solo - Launch Your Solo Business" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* On-demand Tag */}
            <div>
              <span className="inline-block bg-[#1a1f36] text-white px-4 py-2 text-sm font-semibold rounded-md">
                Webinar
              </span>
            </div>

            {/* Title - Large and bold like Hootsuite */}
            <h1 className="text-[2.75rem] lg:text-[3.5rem] font-bold text-[#1a1f36] leading-[1.1] tracking-tight">
              Launch Your Solo Business: Live with Diksha Sethi
            </h1>
            <p className="text-xl text-gray-700 mt-6 leading-relaxed">
              Launch Your Solo Business in Just 2 Weeks: With around 40 hours of focused learning and practical exercises, you'll be ready with a clear 1-pager business plan to start and grow your solo venture confidently.
            </p>
          </div>

          {/* Right Column - Registration Form */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-[#1a1f36] mb-3">
                Please complete the form to register
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                * indicates required fields
              </p>
              
              <form 
                name="webinar-registration" 
                method="POST" 
                data-netlify="true" 
                data-netlify-honeypot="bot-field"
                className="space-y-4"
                onSubmit={handleFormSubmit}
              >
                <input type="hidden" name="form-name" value="webinar-registration" />
                <div style={{ display: 'none' }}>
                  <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Session Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Your Session Date *
                  </label>
                  <select
                    name="sessionDate"
                    value={formData.sessionDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="" disabled>-- Select a date --</option>
                    <option value="Nov 2, 2025">Nov 2, 2025</option>
                    <option value="Nov 8, 2025">Nov 8, 2025</option>
                  </select>
                  {/* Fixed time captured for Netlify */}
                  <input type="hidden" name="sessionTime" value="12PM to 1:30PM" />
                  <p className="mt-2 text-xs text-gray-600">Time: 12PM to 1:30PM</p>
                </div>


                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">What You'll Get:</h3>
                  
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center text-sm">
                      <span className="text-green-600 mr-2">✅</span>
                      <span className="text-gray-800">90-min Live Webinar — <span className="line-through text-gray-500">₹999</span></span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-green-600 mr-2">✅</span>
                      <span className="text-gray-800">Idea Generator Toolkit — <span className="line-through text-gray-500">₹499</span></span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-green-600 mr-2">✅</span>
                      <span className="text-gray-800">Niche Finder Framework — <span className="line-through text-gray-500">₹499</span></span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-green-600 mr-2">✅</span>
                      <span className="text-gray-800">Mentorship Q&A — <span className="line-through text-gray-500">₹999</span></span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-2.5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-700">Total Value:</span>
                      <span className="text-sm font-bold text-gray-500 line-through">₹2,996</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-green-600">🎉 Your Price:</span>
                      <span className="text-lg font-bold text-green-600">₹499</span>
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-sm font-bold text-green-600">(Save ₹2,497!)</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full py-2.5 px-5 rounded-lg font-semibold transition-colors duration-200 ${
                    isFormValid() && !isSubmitting
                      ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Processing…' : 'Get This Bundle @ ₹499'}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  I agree to the{' '}
                  <a href="/policies/terms" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>
                  {' '}and{' '}
                  <a href="/policies/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  . I consent to receive course materials and updates via email.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section - Light Gray Background, LEFT ALIGNED like Hootsuite */}
      <section className="bg-gray-50 py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1f36] mb-8">Who Should Attend:</h2>
          
          {/* Program Info Box */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-[#1a1f36] mb-1">Duration</p>
                <p className="text-gray-700">3 hours</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1f36] mb-1">Cost</p>
                <p className="text-gray-700">Bundle cost ₹499</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <ul className="text-gray-700 text-lg leading-relaxed space-y-4">
              <li className="flex items-start">
                <span className="text-[#1a1f36] mr-3 text-xl">•</span>
                <span>Working professionals planning to go independent (especially women and engineers)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1a1f36] mr-3 text-xl">•</span>
                <span>Recent graduates wanting to build their own business instead of following the traditional job route</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1a1f36] mr-3 text-xl">•</span>
                <span>Freelancers ready to grow beyond project to project</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1a1f36] mr-3 text-xl">•</span>
                <span>Side hustlers ready to become full-time Solopreneurs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1a1f36] mr-3 text-xl">•</span>
                <span>Creators building personal brands</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-[#1a1f36] mb-6">About the Workshop:</h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Do you have a skill or idea, but no clue where to start?<br/>
                This hands-on session is your gateway to building a solo business—practically, affordably, and with expert mentorship.
              </p>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Learn how Start Solo's Launchpad course guides you from "maybe someday" to "I'm doing it"— without the need for funding, a big team, or years of trial and error.
              </p>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed font-semibold">
                Get a sneak peek into the entire Launchpad journey, including:
              </p>
              <ul className="text-gray-700 text-lg leading-relaxed space-y-2">
                <li className="flex items-start">
                  <span className="text-[#1a1f36] mr-3 text-xl">•</span>
                  <span>Structured video modules</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a1f36] mr-3 text-xl">•</span>
                  <span>Real-world frameworks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a1f36] mr-3 text-xl">•</span>
                  <span>Live mentorship sessions with Diksha Sethi and Start Solo mentors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#1a1f36] mr-3 text-xl">•</span>
                  <span>A clear path and community support to keep you accountable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section - White Background, LEFT ALIGNED like Hootsuite */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1f36] mb-10">What you'll learn</h2>
          <ul className="space-y-6">
            <li className="flex items-start">
              <span className="text-[#1a1f36] mr-4 text-xl">•</span>
              <div>
                <p className="text-[#1a1f36] font-semibold text-lg mb-1">Discover Your Big Idea</p>
                <p className="text-gray-700 text-base leading-relaxed">Find what you're truly good at — and learn how to turn it into something people will actually pay for.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#1a1f36] mr-4 text-xl">•</span>
              <div>
                <p className="text-[#1a1f36] font-semibold text-lg mb-1">Build Something People Want</p>
                <p className="text-gray-700 text-base leading-relaxed">Create a simple offer that solves a real problem and makes others say, "I need this!"</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#1a1f36] mr-4 text-xl">•</span>
              <div>
                <p className="text-[#1a1f36] font-semibold text-lg mb-1">Get Your First Paying Client</p>
                <p className="text-gray-700 text-base leading-relaxed">Follow a clear, step-by-step plan to land your first customer within 90 days.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#1a1f36] mr-4 text-xl">•</span>
              <div>
                <p className="text-[#1a1f36] font-semibold text-lg mb-1">Make your Brand Memorable</p>
                <p className="text-gray-700 text-base leading-relaxed">Learn how to talk about yourself and your business with clarity and confidence — no fancy marketing needed</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#1a1f36] mr-4 text-xl">•</span>
              <div>
                <p className="text-[#1a1f36] font-semibold text-lg mb-1">Launch and Grow Smoothly</p>
                <p className="text-gray-700 text-base leading-relaxed">Use Start Solo's practical tools and community support to test your idea, learn fast, and grow your business your way.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Share Section - LEFT ALIGNED like Hootsuite */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h3 className="text-lg font-bold text-[#1a1f36] mb-4">Share this webinar</h3>
          <div className="flex gap-3">
          <button 
            onClick={() => {
              const url = encodeURIComponent(window.location.href);
              const text = encodeURIComponent('Launch Your Solo Business: Live with Diksha Sethi - Get this amazing bundle for just ₹499!');
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
            }}
            className="bg-[#1877f2] text-white p-2 rounded hover:bg-[#0d65d9] transition-colors"
            title="Share on Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button 
            onClick={() => {
              const url = encodeURIComponent(window.location.href);
              const text = encodeURIComponent('Launch Your Solo Business: Live with Diksha Sethi - Get this amazing bundle for just ₹499!');
              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank', 'width=600,height=400');
            }}
            className="bg-[#0a66c2] text-white p-2 rounded hover:bg-[#084d92] transition-colors"
            title="Share on LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
          <button 
            onClick={() => {
              const url = encodeURIComponent(window.location.href);
              const text = encodeURIComponent('Launch Your Solo Business: Live with Diksha Sethi - Get this amazing bundle for just ₹499!');
              window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
            }}
            className="bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors"
            title="Share on X (Twitter)"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
          </div>
        </div>
      </section>

      {/* Trainers Section - Center Aligned */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1f36] mb-12">Meet your Trainers</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Trainer 1 - Diksha */}
            <div className="text-center">
              <img 
                src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361534/Diksha_800x600_tztawn.png" 
                alt="Diksha Sethi" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="font-bold text-[#1a1f36] mb-1 text-lg">Diksha Sethi</p>
              <p className="text-sm text-gray-600 mb-4">Co-founder, Start Solo</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                A communications strategist and seasoned mentor, Diksha has guided over 2,000 aspiring Solopreneurs and worked with leading global brands. She delivers practical, action-driven learning and helps first-time founders build businesses step by step.
              </p>
            </div>
            {/* Trainer 2 - Vishal */}
            <div className="text-center">
              <img 
                src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1741361539/vishal_800x600_uatsxz.png" 
                alt="Vishal Sharma" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="font-bold text-[#1a1f36] mb-1 text-lg">Vishal Sharma</p>
              <p className="text-sm text-gray-600 mb-4">Co-founder, Start Solo</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                A product innovator and architect behind ArkReach One (Start Solo's AI video platform), Vishal specialises in entrepreneurial frameworks and brings real-world experience in building scalable education products for self-starters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Take the First Step Section - Blue Background, LEFT ALIGNED like Hootsuite */}
      <section className="bg-blue-50 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1f36] mb-6">Ready to Take the First Step?</h2>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed max-w-3xl">
            "Someday" is too expensive. Your dream of an independent, flexible business is ready for takeoff—with the right planning and mentorship
          </p>
          <button 
            onClick={() => {
              document.getElementById('webinar-form')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="bg-[#1a1f36] text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#2a3f56] transition-colors"
          >
            Secure Your Spot for the Next Workshop
          </button>
        </div>
      </section>

      {/* About Start Solo Section - LEFT ALIGNED like Hootsuite */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1f36] mb-6">About Start Solo</h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">
            Start Solo functions as an incubator for solo entrepreneurs, helping individuals transform ideas into profitable businesses. Participants receive guidance at every step - through skills training, 1:1 mentorship, and a live community of fellow Solopreneurs.
          </p>
        </div>
      </section>
    </div>
  );
};

export default WebinarPage;
