import React from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const MentorshipForm: React.FC<Props> = ({ onClose }) => {
  React.useEffect(() => {
    // Redirect to payment link
    window.location.href = 'https://hub.startsolo.in/l/ca891392d7';
    // Close the modal
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full relative p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="py-8">
          <p className="text-gray-700">
            Redirecting to payment page...
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorshipForm;