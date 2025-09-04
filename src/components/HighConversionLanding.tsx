import React from "react";

// This is a standalone, high-conversion landing page variation for UI/UX review only.
// It does not use any app context or dependencies except React and Tailwind (or global styles).
// All content, colors, and sections are placeholder and can be customized later.

const testimonials = [
  {
    name: "Priya S.",
    text: "I launched my solo business in 6 weeks! The support and roadmap were game-changers.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Rahul D.",
    text: "Doubled my income and gained total freedom. Best investment ever!",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  }
];

const faqs = [
  {
    q: "Is this right for me?",
    a: "If you're ready to start or scale your solo business, this program is designed for you."
  },
  {
    q: "What if I have a full-time job?",
    a: "Many members start part-time and transition as their business grows."
  },
  {
    q: "Is there a guarantee?",
    a: "Yes! 14-day money-back guarantee if you don't love it."
  }
];

const HighConversionLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gradient-landing text-brand-gray-900 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-brand-white/80 shadow-md sticky top-0 z-20">
        <div className="text-2xl font-bold text-brand-blue-700">StartSolo</div>
        <a href="#cta" className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold relative overflow-hidden group hover:shadow-lg z-0">
          <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Join Now
          </span>
        </a>
      </header>

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto text-center py-20 px-4">
        <div className="text-xs uppercase tracking-widest text-brand-blue-500 font-bold mb-2">Limited Seats</div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Build Your Solo Business. <span className="text-brand-blue-600">Achieve Freedom.</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-brand-gray-700">
          Join India’s #1 Solo Business Accelerator. Get the roadmap, mentorship, and community to launch and grow your dream business in 90 days.
        </p>
        <a id="cta" href="#" className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold shadow-lg mb-4 relative overflow-hidden group hover:shadow-lg z-0">
          <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Reserve My Spot
          </span>
        </a>
        <div className="mt-2 text-sm text-brand-gray-500">2,800+ graduates · 4.9/5 avg rating</div>
        {/* Countdown timer placeholder */}
        <div className="mt-6 text-brand-red-600 font-semibold text-lg">Next cohort starts in: <span className="font-mono">05d 12h 34m</span></div>
      </section>

      {/* Trust Bar */}
      <section className="flex flex-wrap justify-center gap-8 items-center py-6 bg-brand-white/60 border-brand-y border-brand-blue-100">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Googleplex-Patio-Aug-2014.JPG" alt="As seen in" className="h-8 grayscale opacity-70" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_TED.svg" alt="As seen in" className="h-8 grayscale opacity-70" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Forbes_logo.svg" alt="As seen in" className="h-8 grayscale opacity-70" />
      </section>

      {/* Benefits Section */}
      <section className="max-w-4xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-brand-blue-600 text-3xl mb-2">🚀</div>
          <h3 className="font-bold text-lg mb-2">Proven Roadmap</h3>
          <p>Step-by-step system to go from idea to income—no guesswork.</p>
        </div>
        <div>
          <div className="text-brand-blue-600 text-3xl mb-2">🤝</div>
          <h3 className="font-bold text-lg mb-2">Mentorship & Community</h3>
          <p>Weekly live calls, peer support, and 1:1 feedback to keep you on track.</p>
        </div>
        <div>
          <div className="text-brand-blue-600 text-3xl mb-2">📈</div>
          <h3 className="font-bold text-lg mb-2">Results-Driven</h3>
          <p>Real success stories—see how members have launched and scaled.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-blue-50 py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">What Our Graduates Say</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 max-w-xs text-left">
              <div className="flex items-center mb-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full mr-3" />
                <div className="font-semibold">{t.name}</div>
              </div>
              <div className="text-brand-gray-700 italic">“{t.text}”</div>
            </div>
          ))}
        </div>
      </section>

      {/* Program Overview */}
      <section className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold mb-4">What You’ll Get</h2>
        <ul className="grid gap-4 md:grid-cols-2 text-left list-disc list-inside mx-auto max-w-xl">
          <li>90-day step-by-step curriculum</li>
          <li>Weekly live mentorship calls</li>
          <li>Private founder community</li>
          <li>Templates, checklists, and tools</li>
          <li>Lifetime access to all materials</li>
          <li>Bonus: 1:1 launch strategy session</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-4">
        <h2 className="text-xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto grid gap-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-l-4 border-blue-600 bg-brand-blue-50 p-4 rounded">
              <div className="font-semibold mb-1">{f.q}</div>
              <div className="text-brand-gray-700 text-sm">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-xl mx-auto text-center py-16 px-4">
        <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
        <a href="#" className="bg-cta text-cta-text px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm md:text-base font-semibold inline-block text-xl shadow-lg mb-2 relative overflow-hidden group hover:shadow-lg z-0">
          <span className="absolute inset-0 bg-cta-text transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-[-1]"></span>
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Join the Next Cohort
          </span>
        </a>
        <div className="text-brand-gray-500 mt-2">14-day money-back guarantee · Secure checkout</div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-brand-gray-400 text-sm">
        &copy; {new Date().getFullYear()} StartSolo. All rights reserved.
      </footer>
    </div>
  );
};

export default HighConversionLanding;
