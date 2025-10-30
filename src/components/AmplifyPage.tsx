import React, { useState } from 'react';

const AmplifyPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encode = (data: Record<string, string>) =>
      Object.keys(data)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');

    try {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'amplify-lead-capture',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        })
      });
    } catch (err) {
      // no-op
    }

    alert('Thank you for your interest! We\'ll get back to you soon.');
    setIsFormOpen(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AMPLIFY
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              A ready-to-launch digital brand kit for small businesses and solo founders. 
              We help you sharpen your story, streamline your visuals, and set up your social media 
              to attract followers, customers, and community — all within 4–6 weeks.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything your brand needs to look credible, sound confident, and grow online — 
              done with you, then handed over to manage on your own.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Choose Your Amplify Package
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* AMPLIFY LITE */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AMPLIFY LITE</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">₹50,000</div>
                <div className="text-gray-600 mb-4">3–4 weeks</div>
                <div className="text-sm text-gray-500">Small home brands, bakers, creators looking to streamline their online presence</div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>10 ready-to-use social media post designs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>A refreshed logo (clean and modern)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>A simple one-page website (your online home)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Social media profile makeover (bio + cover photo)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Get found on Google (Google My Business setup)</span>
                </li>
              </ul>
              <button 
                onClick={() => {
                  console.log('AMPLIFY LITE clicked');
                  window.open('https://rzp.io/rzp/9tgTsMR8', '_blank', 'noopener,noreferrer');
                }}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>

            {/* AMPLIFY PLUS */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-8 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AMPLIFY PLUS</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">₹65,000</div>
                <div className="text-gray-600 mb-4">4–5 weeks</div>
                <div className="text-sm text-gray-500">Growing solo brands seeking expansion</div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>A one-page brochure or menu (for sharing easily on WhatsApp or print)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Instagram ad setup to attract more buyers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Simple online payment link so customers can pay you instantly</span>
                </li>
              </ul>
              <button 
                onClick={() => {
                  console.log('AMPLIFY PLUS clicked');
                  window.open('https://rzp.io/rzp/mwyqVQHL', '_blank', 'noopener,noreferrer');
                }}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>

            {/* AMPLIFY PRO */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AMPLIFY PRO</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">₹75,000</div>
                <div className="text-gray-600 mb-4">5–6 weeks</div>
                <div className="text-sm text-gray-500">Ambitious or retail-ready brands</div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>A complete brand kit (posts, logo, ads — all set for launch)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>WhatsApp product catalogue setup</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Instagram ad campaign (optimized for your audience)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Nano/micro influencer shoutouts (up to 2 collaborations)</span>
                </li>
              </ul>
              <button 
                onClick={() => {
                  console.log('AMPLIFY PRO clicked');
                  window.open('https://rzp.io/rzp/rDGlQlS', '_blank', 'noopener,noreferrer');
                }}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-5 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600 text-sm">You fill a simple brand brief</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design & Direction</h3>
              <p className="text-gray-600 text-sm">2 calls per week for sharing strategic direction and recommendations</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build</h3>
              <p className="text-gray-600 text-sm">Our team creates your templates, content kits, and digital assets</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup</h3>
              <p className="text-gray-600 text-sm">We help you post, engage, and learn the ropes</p>
            </div>

            {/* Step 5 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                5
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Handover</h3>
              <p className="text-gray-600 text-sm">You walk away with everything you need to grow independently</p>
            </div>
          </div>
        </div>
      </section>

      {/* À La Carte Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            À La Carte Services
          </h2>
          <p className="text-center text-gray-600 mb-16">
            Available as add-ons or standalone services
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Photography Services */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Photography & Content</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between">
                  <span>Product / Food photography (with brand styling direction)</span>
                </li>
                <li className="flex justify-between">
                  <span>Brand video / Reels production (2–3 clips)</span>
                </li>
              </ul>
            </div>

            {/* Marketing Services */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing & Outreach</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between">
                  <span>Local influencer collaborations (micro or nano-tier tie-ups)</span>
                </li>
                <li className="flex justify-between">
                  <span>Paid ad setup (Monthly ad spend not included)</span>
                </li>
                <li className="flex justify-between">
                  <span>3-drip series email marketing setup</span>
                </li>
              </ul>
            </div>

            {/* Digital Assets */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Digital Assets</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between">
                  <span>Multi pager website + CTA + payment gateway</span>
                </li>
                <li className="flex justify-between">
                  <span>30-day content calendar</span>
                </li>
                <li className="flex justify-between">
                  <span>Packaging labels / sticker designs</span>
                </li>
                <li className="flex justify-between">
                  <span>POS / price tag / label templates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Amplify Your Brand?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's create a digital presence that truly represents your business
          </p>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Contact Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Get Started Today
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form 
                name="amplify-lead-capture" 
                method="POST" 
                data-netlify="true" 
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="amplify-lead-capture" />
                <div style={{ display: 'none' }}>
                  <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Tell us about your business
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What kind of business do you have? What are your goals?"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmplifyPage;
