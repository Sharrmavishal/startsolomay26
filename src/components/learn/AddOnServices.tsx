import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Addon {
  title: string;
  hook: string;
  forWho: string;
  description: string;
  price: number;
  originalPrice?: number;
  savings?: number;
  ctaText: string;
  ctaUrl: string;
}

interface Props {
  addons: Addon[];
}

const AddOnServices: React.FC<Props> = ({ addons }) => {
  return (
    <section id="addons" data-section="addons" className="scroll-mt-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Add-On Services
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Supercharge your growth with these targeted services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {addons.map((addon, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {addon.title}
              </h3>
              <p className="text-primary font-medium mb-4">{addon.hook}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-gray-900">Perfect for:</span> {addon.forWho}
                </p>
                <p className="text-gray-600 text-sm">{addon.description}</p>
              </div>
              
              <div className="flex items-end mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{addon.price.toLocaleString()}
                </span>
                {addon.originalPrice && (
                  <>
                    <span className="text-lg line-through text-gray-500 ml-2">
                      ₹{addon.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-green-600 ml-2">
                      Save ₹{addon.savings?.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              
              <a
                href={addon.ctaUrl}
                className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition w-full justify-center"
              >
                {addon.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AddOnServices;