import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Edit, Eye, Users, Clock, DollarSign, CheckCircle, XCircle, Globe, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Course {
  id: string;
  title: string;
  short_description: string;
  category: string;
  price: number;
  status: string;
  enrollment_count: number;
  created_at: string;
}

interface MentorCoursesListProps {
  mentorId: string | null;
}

const MentorCoursesList: React.FC<MentorCoursesListProps> = ({ mentorId }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mentorId) {
      loadCourses();
    }
  }, [mentorId]);

  const loadCourses = async () => {
    if (!mentorId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mentor_courses')
        .select('id, title, short_description, category, price, status, enrollment_count, created_at')
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (courseId: string, currentStatus: string) => {
    try {
      setPublishing(courseId);
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      
      const { error } = await supabase
        .from('mentor_courses')
        .update({ status: newStatus })
        .eq('id', courseId);

      if (error) throw error;

      // Reload courses
      await loadCourses();
    } catch (error: any) {
      console.error('Error toggling publish status:', error);
      alert(error.message || 'Failed to update course status');
    } finally {
      setPublishing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
      published: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Published',
        icon: <Globe className="h-3 w-3" />
      },
      draft: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        label: 'Draft',
        icon: <Lock className="h-3 w-3" />
      },
      pending_approval: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        label: 'Pending Approval',
        icon: <Clock className="h-3 w-3" />
      },
      rejected: { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Rejected',
        icon: <XCircle className="h-3 w-3" />
      },
    };
    const badge = badges[status] || badges.draft;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
        <p className="mt-2 text-gray-600">Loading courses...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
        <p className="text-gray-600 mb-4">Create your first course to start teaching!</p>
        <button
          onClick={() => navigate('/community/courses/create')}
          className="inline-flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
        >
          <BookOpen className="h-5 w-5" />
          Create Your First Course
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map(course => (
        <div
          key={course.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-[#1D3A6B]">{course.title}</h3>
                {getStatusBadge(course.status)}
              </div>
              <p className="text-gray-600 text-sm mb-3">{course.short_description || 'No description'}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.enrollment_count} enrolled</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{course.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">
                    Created {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => navigate(`/community/courses/${course.id}`)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="View Course"
              >
                <Eye className="h-5 w-5" />
              </button>
              {course.status === 'draft' && (
                <button
                  onClick={() => navigate(`/community/courses/create?edit=${course.id}`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Course"
                >
                  <Edit className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => handlePublishToggle(course.id, course.status)}
                disabled={publishing === course.id || course.status === 'pending_approval' || course.status === 'rejected'}
                className={`p-2 rounded-lg transition-colors ${
                  course.status === 'published'
                    ? 'text-orange-600 hover:bg-orange-50'
                    : 'text-green-600 hover:bg-green-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={course.status === 'published' ? 'Unpublish Course' : 'Publish Course'}
              >
                {publishing === course.id ? (
                  <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : course.status === 'published' ? (
                  <Lock className="h-5 w-5" />
                ) : (
                  <Globe className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MentorCoursesList;

