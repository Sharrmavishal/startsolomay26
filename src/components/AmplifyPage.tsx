import React from 'react';

const AmplifyPage: React.FC = () => {
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
                <div className="text-4xl font-bold text-blue-600 mb-2">₹65,000</div>
                <div className="text-gray-600 mb-4">3–4 weeks</div>
                <div className="text-sm text-gray-500">Small home brands, bakers, creators looking to streamline their online presence</div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>10 editable social media templates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Logo refresh</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>1-pager landing page</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Channel refresh (bio + cover photo)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>GMB optimizing</span>
                </li>
              </ul>
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
                <div className="text-4xl font-bold text-blue-600 mb-2">₹75,000</div>
                <div className="text-gray-600 mb-4">4–5 weeks</div>
                <div className="text-sm text-gray-500">Growing solo brands seeking expansion</div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Everything in Lite</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>One-page brochure or menu or business card</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Ad campaign setup on Instagram</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Payment gateway</span>
                </li>
              </ul>
            </div>

            {/* AMPLIFY PRO */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AMPLIFY PRO</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">₹85,000</div>
                <div className="text-gray-600 mb-4">5–6 weeks</div>
                <div className="text-sm text-gray-500">Ambitious or retail-ready brands</div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Full suite</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>WhatsApp catalogue</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Ad campaign setup on Instagram</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Nano/micro influencer outreach (up to 2)</span>
                </li>
              </ul>
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
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AmplifyPage;
