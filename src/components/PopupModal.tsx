import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PopupModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent popup click when closing
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300); // Wait for animation to complete
  };

  const handlePopupClick = () => {
    // Redirect to the kickoff workshop
    window.open('http://kickoffworkshop.startsolo.in/', '_blank');
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      {/* Popup Container */}
      <div 
        className={`relative max-w-[800px] w-full max-h-[90vh] transition-all duration-300 transform ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={handlePopupClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handlePopupClick();
          }
        }}
        aria-label="Click to visit Kickoff Workshop"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200 group"
          aria-label="Close popup"
        >
          <X className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Creative Image */}
        <div className="relative overflow-hidden rounded-xl shadow-2xl cursor-pointer group">
          <img
            src="https://res.cloudinary.com/dnm2ejglr/image/upload/v1749549808/instagram_ad_2_ygmgl4.png"
            alt="Kickoff Workshop - Start Solo"
            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ maxHeight: '80vh' }}
            loading="eager"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 px-4 py-2 rounded-lg">
              <span className="text-gray-800 font-medium">Click to Learn More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;