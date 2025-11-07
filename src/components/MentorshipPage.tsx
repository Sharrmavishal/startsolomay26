import React from 'react';
import { useNavigate } from 'react-router-dom';
import MentorForm from './MentorForm';
import Footer from './Footer';

const MentorshipPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    // Navigate back to home page when form is closed
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <MentorForm onClose={handleClose} standalone={true} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MentorshipPage;

