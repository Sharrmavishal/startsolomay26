import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CourseReviewSectionProps {
  courseId: string;
  studentId: string | null;
  enrollmentId: string | null;
  enrollmentStatus: string | null;
  progressPercentage: number;
  completedAt: string | null;
}

const CourseReviewSection: React.FC<CourseReviewSectionProps> = ({
  courseId,
  studentId,
  enrollmentId,
  enrollmentStatus,
  progressPercentage,
  completedAt,
}) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  useEffect(() => {
    loadCourseRating();
    checkCanReview();
  }, [courseId, studentId, enrollmentStatus, progressPercentage, completedAt]);

  const loadCourseRating = async () => {
    try {
      const { data: course } = await supabase
        .from('mentor_courses')
        .select('average_rating, review_count')
        .eq('id', courseId)
        .single();

      if (course) {
        setAverageRating(course.average_rating || 0);
        setReviewCount(course.review_count || 0);
      }

      // Load user's existing rating
      if (studentId) {
        const { data: review } = await supabase
          .from('course_reviews')
          .select('rating')
          .eq('course_id', courseId)
          .eq('student_id', studentId)
          .maybeSingle();

        if (review) {
          setUserRating(review.rating);
          setHasReviewed(true);
        }
      }
    } catch (error) {
      console.error('Error loading course rating:', error);
    }
  };

  const checkCanReview = async () => {
    if (!studentId || !enrollmentId) {
      setCanReview(false);
      return;
    }

    // Check if completed (100% progress and completed_at set)
    const isCompleted = enrollmentStatus === 'completed' && 
                       progressPercentage === 100 && 
                       completedAt !== null;

    if (!isCompleted) {
      setCanReview(false);
      return;
    }

    // Check if already reviewed
    if (hasReviewed) {
      setCanReview(false);
      return;
    }

    // Verify with database function
    try {
      const { data, error } = await supabase
        .rpc('can_review_course', {
          p_course_id: courseId,
          p_student_id: studentId,
        });

      setCanReview(data === true);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    }
  };

  const handleRatingClick = async (rating: number) => {
    if (!canReview || submitting || !studentId || !enrollmentId) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('course_reviews')
        .insert({
          course_id: courseId,
          enrollment_id: enrollmentId,
          student_id: studentId,
          rating: rating,
        });

      if (error) throw error;

      setUserRating(rating);
      setHasReviewed(true);
      setCanReview(false);
      await loadCourseRating(); // Reload to update averages
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      alert(error.message || 'Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = interactive
            ? (hoveredRating !== null ? star <= hoveredRating : star <= rating)
            : star <= rating;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive || submitting}
              onClick={() => interactive && handleRatingClick(star)}
              onMouseEnter={() => interactive && setHoveredRating(star)}
              onMouseLeave={() => interactive && setHoveredRating(null)}
              className={`${
                interactive
                  ? 'cursor-pointer hover:scale-110 transition-transform disabled:cursor-not-allowed disabled:opacity-50'
                  : 'cursor-default'
              } ${sizeClasses[size]}`}
            >
              <Star
                className={`${
                  isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-[#1D3A6B] mb-4">Course Rating</h3>
      
      {reviewCount > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-[#1D3A6B]">
              {averageRating.toFixed(1)}
            </div>
            <div>
              {renderStars(Math.round(averageRating), false, 'lg')}
              <p className="text-sm text-gray-600 mt-1">
                Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No ratings yet. Be the first to rate this course!</p>
      )}

      {/* User Rating Section */}
      {studentId && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          {hasReviewed ? (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
              {renderStars(userRating!, false, 'md')}
              <p className="text-xs text-gray-500 mt-1">Thank you for your rating!</p>
            </div>
          ) : canReview ? (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Rate this course {submitting && '(Submitting...)'}
              </p>
              {renderStars(0, true, 'md')}
              <p className="text-xs text-gray-500 mt-2">
                Click on a star to rate this course (1-5 stars)
              </p>
            </div>
          ) : enrollmentStatus === 'completed' && progressPercentage < 100 ? (
            <p className="text-sm text-gray-600">
              Complete the course to leave a rating.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CourseReviewSection;

