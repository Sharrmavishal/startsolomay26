import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Search, Star, Users, Clock, DollarSign, Plus } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import CourseBundleDisplay from './CourseBundleDisplay';

interface Course {
  id: string;
  title: string;
  short_description: string;
  description: string;
  category: string;
  price: number;
  cover_image_url: string | null;
  enrollment_count: number;
  max_students: number | null;
  total_duration_hours: number | null;
  tags: string[];
  featured: boolean;
  status: string;
  mentor: {
    id: string;
    display_name: string;
    full_name: string;
  };
}

const MentorCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMentor, setIsMentor] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get mentor filter from URL
  const mentorId = new URLSearchParams(location.search).get('mentor');

  useEffect(() => {
    checkUserRole();
  }, []);

  useEffect(() => {
    if (currentUserId !== null) {
      // Only load courses after we know the user role
      loadCourses();
    }
  }, [filterCategory, searchQuery, mentorId, currentUserId, isMentor]);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) return;

      const { data: member } = await supabase
        .from('community_members')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        setCurrentUserId(member.id);
        setIsMentor(member.role === 'mentor');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('mentor_courses')
        .select(`
          id,
          title,
          short_description,
          description,
          category,
          price,
          cover_image_url,
          enrollment_count,
          max_students,
          total_duration_hours,
          tags,
          featured,
          status,
          mentor_id,
          community_members!mentor_id (
            id,
            display_name,
            full_name
          )
        `)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      // If user is a mentor, show their draft/pending courses too, otherwise only published
      if (isMentor && currentUserId) {
        // Show published courses OR user's own drafts/pending_approval courses
        // Use separate queries and combine
        const publishedQuery = supabase
          .from('mentor_courses')
          .select(`
            id,
            title,
            short_description,
            description,
            category,
            price,
            cover_image_url,
            enrollment_count,
            max_students,
            total_duration_hours,
            tags,
            featured,
            status,
            mentor_id,
            community_members!mentor_id (
              id,
              display_name,
              full_name
            )
          `)
          .eq('status', 'published');
        
        const ownCoursesQuery = supabase
          .from('mentor_courses')
          .select(`
            id,
            title,
            short_description,
            description,
            category,
            price,
            cover_image_url,
            enrollment_count,
            max_students,
            total_duration_hours,
            tags,
            featured,
            status,
            mentor_id,
            community_members!mentor_id (
              id,
              display_name,
              full_name
            )
          `)
          .eq('mentor_id', currentUserId)
          .in('status', ['draft', 'pending_approval']);
        
        // Apply filters
        if (filterCategory !== 'all') {
          publishedQuery.eq('category', filterCategory);
          ownCoursesQuery.eq('category', filterCategory);
        }
        
        if (searchQuery.trim()) {
          const searchFilter = `title.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`;
          publishedQuery.or(searchFilter);
          ownCoursesQuery.or(searchFilter);
        }
        
        if (mentorId) {
          publishedQuery.eq('mentor_id', mentorId);
          ownCoursesQuery.eq('mentor_id', mentorId);
        }
        
        // Execute both queries
        const [publishedRes, ownRes] = await Promise.all([
          publishedQuery.order('featured', { ascending: false }).order('created_at', { ascending: false }),
          ownCoursesQuery.order('created_at', { ascending: false })
        ]);
        
        if (publishedRes.error) throw publishedRes.error;
        if (ownRes.error) throw ownRes.error;
        
        // Combine results, removing duplicates
        const publishedCourses = publishedRes.data || [];
        const ownCourses = ownRes.data || [];
        const combinedCourses = [...publishedCourses];
        
        // Add own courses if not already in published list
        ownCourses.forEach(course => {
          if (!combinedCourses.find(c => c.id === course.id)) {
            combinedCourses.push(course);
          }
        });
        
        const formattedCourses = combinedCourses.map(course => ({
          id: course.id,
          title: course.title,
          short_description: course.short_description,
          description: course.description,
          category: course.category,
          price: course.price,
          cover_image_url: course.cover_image_url,
          enrollment_count: course.enrollment_count || 0,
          max_students: course.max_students,
          total_duration_hours: course.total_duration_hours,
          tags: course.tags || [],
          featured: course.featured,
          status: course.status,
          mentor: {
            id: course.community_members.id,
            display_name: course.community_members.display_name,
            full_name: course.community_members.full_name,
          },
        }));
        
        setCourses(formattedCourses);
        return;
      } else {
        // Non-mentors only see published courses
        // Filter by mentor if specified
        if (mentorId) {
          query = query.eq('mentor_id', mentorId);
        }
        
        query = query.eq('status', 'published');

        if (filterCategory !== 'all') {
          query = query.eq('category', filterCategory);
        }

        if (searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        const formattedCourses = (data || []).map(course => ({
          id: course.id,
          title: course.title,
          short_description: course.short_description,
          description: course.description,
          category: course.category,
          price: course.price,
          cover_image_url: course.cover_image_url,
          enrollment_count: course.enrollment_count || 0,
          max_students: course.max_students,
          total_duration_hours: course.total_duration_hours,
          tags: course.tags || [],
          featured: course.featured,
          status: course.status,
          mentor: {
            id: course.community_members.id,
            display_name: course.community_members.display_name,
            full_name: course.community_members.full_name,
          },
        }));

        setCourses(formattedCourses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'business-strategy', label: 'Business Strategy' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'funding', label: 'Funding & Finance' },
    { value: 'technology', label: 'Technology' },
    { value: 'sales', label: 'Sales' },
    { value: 'operations', label: 'Operations' },
    { value: 'other', label: 'Other' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1D3A6B]">Mentor Courses</h1>
              <p className="text-gray-600 mt-2">Learn from experienced mentors in the community</p>
            </div>
            {isMentor && (
              <button
                onClick={() => navigate('/community/courses/create')}
                className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Course
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bundles Display */}
        <CourseBundleDisplay mentorId={mentorId || null} showAll={!mentorId} />

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              {searchQuery || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to create a course!'}
            </p>
            {isMentor && !searchQuery && filterCategory === 'all' && (
              <button
                onClick={() => navigate('/community/courses/create')}
                className="mt-4 flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors mx-auto"
              >
                <Plus className="h-5 w-5" />
                Create First Course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div
                key={course.id}
                onClick={() => navigate(`/community/courses/${course.id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              >
                {course.cover_image_url && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={course.cover_image_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!course.cover_image_url && (
                  <div className="h-48 bg-gradient-to-br from-[#1D3A6B] to-[#152A4F] flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {course.featured && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-semibold text-yellow-600">Featured</span>
                      </div>
                    )}
                    {course.status === 'draft' && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                        Draft
                      </span>
                    )}
                    {course.status === 'pending_approval' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                        Pending Approval
                      </span>
                    )}
                    {course.status === 'rejected' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        Rejected
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#1D3A6B] mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.short_description || course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollment_count} enrolled</span>
                    </div>
                    {course.total_duration_hours && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.total_duration_hours}h</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">By {course.mentor.display_name || course.mentor.full_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1D3A6B]">₹{course.price}</p>
                    </div>
                  </div>
                  
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {course.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorCourses;

