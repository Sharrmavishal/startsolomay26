import React from 'react';
import { Shield, Check, ArrowRight } from 'lucide-react';
import { getPaymentLink } from '../utils/paymentLinks';

const GuaranteeSection = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = getPaymentLink();
  };

  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-primary/10">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="md:w-1/4 bg-primary p-6 flex flex-col items-center justify-center text-white">
                <Shield className="h-16 w-16 mb-3" />
                <h3 className="text-xl font-bold text-center">Our Value Guarantee</h3>
              </div>

              <div className="md:w-3/4 p-6">
                <p className="text-gray-700 mb-4">
                  We're so confident you'll get immense value from the Solo Accelerator Session that we offer a simple guarantee: If you attend the full session and don't feel it was worth your time, we'll refund your ₹99 registration fee and give you access to our "Solo Business Starter Kit" (₹1,997 value) for free as an apology for wasting your time.
                </p>

                <div className="space-y-2 mb-4">
                  {[
                    { title: "No risk to you", description: "attend the session and decide for yourself" },
                    { title: "Actionable strategies", description: "you'll leave with at least 3 tactics you can implement immediately" },
                    { title: "Real-world examples", description: "not theory, but proven strategies from successful entrepreneurs" }
                  ].map((benefit, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-primary/5 p-2 rounded-lg"
                    >
                      <div className="bg-primary/10 rounded-full p-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-gray-700 ml-3 text-sm">
                        <span className="font-medium text-gray-900">{benefit.title}</span> — {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>

                <a 
                  href={getPaymentLink()}
                  onClick={handleClick}
                  className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Risk-Free <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;