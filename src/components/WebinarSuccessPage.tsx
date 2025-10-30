import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const WebinarSuccessPage: React.FC = () => {
  const location = useLocation();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Extract payment data from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const paymentId = urlParams.get('payment_id');
    const status = urlParams.get('status');
    const amount = urlParams.get('amount');
    
    if (status === 'success' && paymentId) {
      setPaymentData({ paymentId, status, amount });
      
      // Get user data from localStorage (stored before payment)
      const storedUserData = localStorage.getItem('webinarUserData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }

    return () => {};
  }, [location]);


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8 lg:py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1a1f36] rounded-full mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1a1f36] mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            You've secured your ₹499 bundle
          </p>
          <p className="text-base text-gray-600">
            We’ll send your webinar invite via email and WhatsApp shortly.
          </p>
          <p className="text-sm text-gray-500">If you don’t receive it within 24 hours, contact <a href="mailto:support@startsolo.in" className="text-blue-600 hover:underline">support@startsolo.in</a>.</p>
        </div>

        {/* Payment Details */}
        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-base font-semibold text-[#1a1f36] mb-3">Payment Confirmation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Payment ID:</span>
                <p className="text-gray-600 text-xs">{paymentData.paymentId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <p className="text-gray-600">₹499</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className="text-green-600 font-medium">Confirmed</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default WebinarSuccessPage;
