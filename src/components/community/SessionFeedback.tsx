import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Send, X, CheckCircle } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface SessionFeedbackProps {
  sessionId: string;
  userRole: 'mentor' | 'mentee';
  onSubmit: () => void;
}

const SessionFeedback: React.FC<SessionFeedbackProps> = ({ sessionId, userRole, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    checkExistingFeedback();
  }, [sessionId, userRole]);

  const checkExistingFeedback = async () => {
    try {
      const { data: session } = await supabase
        .from('mentor_sessions')
        .select(userRole === 'mentee' 
          ? 'mentee_feedback_rating, mentee_feedback_text' 
          : 'mentor_feedback_rating, mentor_feedback_text'
        )
        .eq('id', sessionId)
        .single();

      if (session) {
        const existingRating = userRole === 'mentee' 
          ? session.mentee_feedback_rating 
          : session.mentor_feedback_rating;
        const existingFeedback = userRole === 'mentee' 
          ? session.mentee_feedback_text 
          : session.mentor_feedback_text;

        if (existingRating || existingFeedback) {
          setRating(existingRating || 0);
          setFeedback(existingFeedback || '');
          setSubmitted(true);
        }
      }
    } catch (error) {
      console.error('Error checking existing feedback:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    try {
      setSubmitting(true);

      const updateData: any = {};
      if (userRole === 'mentee') {
        updateData.mentee_feedback_rating = rating;
        updateData.mentee_feedback_text = feedback.trim() || null;
        updateData.mentee_feedback_submitted_at = new Date().toISOString();
      } else {
        updateData.mentor_feedback_rating = rating;
        updateData.mentor_feedback_text = feedback.trim() || null;
        updateData.mentor_feedback_submitted_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('mentor_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) throw error;

      setSubmitted(true);
      onSubmit();
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Thank you for your feedback!</span>
        </div>
        {feedback && (
          <div className="mt-3 text-sm text-green-700">
            <p className="font-medium mb-1">Your feedback:</p>
            <p className="italic">{feedback}</p>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate this session
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MessageSquare className="inline h-4 w-4 mr-1" />
          Share your feedback (optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          placeholder={`What did you think about this session? What went well? What could be improved?`}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default SessionFeedback;

