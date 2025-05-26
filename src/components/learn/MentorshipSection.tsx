import React, { useState } from 'react';
import { MessageCircle, FileText, Users, Calendar, ArrowRight } from 'lucide-react';
import MentorForm from '../MentorForm';

const MentorshipSection: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="p-8">
        <p className="text-gray-600 text-center mb-8">
          Sometimes, you don't need another course. You need a conversation with someone who's been there.
        </p>

        <div className="space-y-6 mb-8">
          <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <p className="text-gray-700">Fill out a short request form — Tell us about your challenge or question</p>
          </div>

          <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-gray-700">Get matched — We hand-pick a mentor based on your need</p>
          </div>

          <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <p className="text-gray-700">Book your 1:1 session — You'll receive a link to schedule a 30–45 min consultation</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-dark transition"
          >
            Talk to a Mentor 1:1 <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {showForm && <MentorForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default MentorshipSection;