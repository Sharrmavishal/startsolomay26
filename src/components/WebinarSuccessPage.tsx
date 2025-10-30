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

    // Ensure Calendly widget CSS is present
    if (!document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }

    // Load Calendly script (once)
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {};
  }, [location]);

  const handleCalendlyEventScheduled = (event: any) => {
    console.log('Calendly event scheduled:', event);
    // You can add additional logic here if needed
  };

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
            Now book your webinar slot to complete your registration
          </p>
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

        {/* Calendly Widget */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#1a1f36] mb-3 text-center">
            Book Your Webinar Slot
          </h2>
          <p className="text-gray-600 mb-3 text-center text-sm">
            Select your preferred time for the 90-minute webinar session
          </p>
          
          {(() => {
            const base = 'https://calendly.com/startsolowebinar/startsolowebinar';
            const params = new URLSearchParams({
              hide_landing_page_details: '1',
              hide_gdpr_banner: '1',
              hide_event_type_details: '1'
            });
            if (userData?.name) params.set('name', userData.name);
            if (userData?.email) params.set('email', userData.email);
            if (userData?.phone) params.set('a1', userData.phone);
            const dataUrl = `${base}?${params.toString()}`;
            return (
              <div
                className="calendly-inline-widget"
                data-url={dataUrl}
                style={{ minWidth: '320px', height: '700px' }}
              />
            );
          })()}
        </div>

        {/* What's Next */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-base font-semibold text-[#1a1f36] mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-[#1a1f36] mr-2 text-sm">✓</span>
              <span>You'll receive a calendar invite with joining details</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#1a1f36] mr-2 text-sm">✓</span>
              <span>Access to your bundle materials will be sent via email</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#1a1f36] mr-2 text-sm">✓</span>
              <span>Reminder emails before your webinar session</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default WebinarSuccessPage;
