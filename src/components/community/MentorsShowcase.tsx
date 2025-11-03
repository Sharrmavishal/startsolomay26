import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Award, BookOpen, Users, MessageSquare, Star, Calendar, TrendingUp, Briefcase, MapPin, Filter, Sparkles, GraduationCap, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MentorWithStats {
  id: string;
  display_name: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  industry: string;
  location: string;
  skills: string[];
  badges: string[];
  points: number;
  created_at: string;
  // Stats
  courses_count: number;
  enrollments_count: number;
  sessions_completed: number;
  average_rating?: number;
  total_students: number;
}

const MentorsShowcase: React.FC = () => {
  const [mentors, setMentors] = useState<MentorWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'courses' | 'sessions'>('popular');
  const navigate = useNavigate();

  useEffect(() => {
    loadMentors();
  }, [sortBy]);

  const loadMentors = async () => {
    try {
      setLoading(true);

      // Load all mentors
      const { data: mentorsData, error: mentorsError } = await supabase
        .from('community_members')
        .select('*, mentor_achievements, mentor_education, mentor_awards')
        .eq('role', 'mentor')
        .eq('vetting_status', 'vetted')
        .order('created_at', { ascending: false });

      if (mentorsError) throw mentorsError;

      // Load stats for each mentor
      const mentorsWithStats = await Promise.all(
        (mentorsData || []).map(async (mentor) => {
          // Count courses
          const { count: coursesCount } = await supabase
            .from('mentor_courses')
            .select('*', { count: 'exact', head: true })
            .eq('mentor_id', mentor.id)
            .eq('status', 'published');

          // Count enrollments
          const { data: enrollmentsData } = await supabase
            .from('course_enrollments')
            .select('course_id')
            .in('course_id', 
              (await supabase
                .from('mentor_courses')
                .select('id')
                .eq('mentor_id', mentor.id)
              ).data?.map(c => c.id) || []
            );

          // Count completed sessions
          const { count: sessionsCount } = await supabase
            .from('mentor_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('mentor_id', mentor.id)
            .eq('status', 'completed');

          // Get average rating from session feedback
          const { data: sessionsData } = await supabase
            .from('mentor_sessions')
            .select('session_feedback')
            .eq('mentor_id', mentor.id)
            .eq('status', 'completed')
            .not('session_feedback', 'is', null);

          let averageRating: number | undefined;
          if (sessionsData && sessionsData.length > 0) {
            const ratings = sessionsData
              .map(s => s.session_feedback?.rating)
              .filter(r => typeof r === 'number') as number[];
            if (ratings.length > 0) {
              averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
            }
          }

          // Count unique students
          const uniqueStudents = new Set([
            ...(enrollmentsData?.map(e => e.course_id) || []),
            ...((await supabase
              .from('mentor_sessions')
              .select('mentee_id')
              .eq('mentor_id', mentor.id)
            ).data?.map(s => s.mentee_id) || [])
          ]);

          return {
            ...mentor,
            courses_count: coursesCount || 0,
            enrollments_count: enrollmentsData?.length || 0,
            sessions_completed: sessionsCount || 0,
            average_rating: averageRating,
            total_students: uniqueStudents.size,
          };
        })
      );

      // Sort mentors
      let sorted = [...mentorsWithStats];
      switch (sortBy) {
        case 'popular':
          sorted.sort((a, b) => (b.enrollments_count + b.sessions_completed) - (a.enrollments_count + a.sessions_completed));
          break;
        case 'newest':
          sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'courses':
          sorted.sort((a, b) => b.courses_count - a.courses_count);
          break;
        case 'sessions':
          sorted.sort((a, b) => b.sessions_completed - a.sessions_completed);
          break;
      }

      setMentors(sorted);
    } catch (error) {
      console.error('Error loading mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        (mentor.display_name || mentor.full_name).toLowerCase().includes(query) ||
        mentor.bio?.toLowerCase().includes(query) ||
        mentor.industry?.toLowerCase().includes(query) ||
        mentor.skills?.some(skill => skill.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    if (filterIndustry !== 'all') {
      if (mentor.industry?.toLowerCase() !== filterIndustry.toLowerCase()) return false;
    }

    return true;
  });

  const industries = Array.from(new Set(mentors.map(m => m.industry).filter(Boolean))).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1D3A6B] to-[#152A4F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Our Mentors</h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl">
            Learn from experienced mentors who've helped hundreds succeed.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, industry, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="courses">Most Courses</option>
                <option value="sessions">Most Sessions</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Mentors Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/community/members/${mentor.id}`)}
              >
                {/* Mentor Header */}
                <div className="flex items-start gap-4 mb-4">
                  {mentor.avatar_url ? (
                    <img
                      src={mentor.avatar_url}
                      alt={mentor.display_name || mentor.full_name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#1D3A6B]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1D3A6B] to-[#152A4F] flex items-center justify-center text-white text-2xl font-bold border-2 border-[#1D3A6B]">
                      {(mentor.display_name || mentor.full_name)[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-[#1D3A6B]">
                        {mentor.display_name || mentor.full_name}
                      </h3>
                      {mentor.badges && mentor.badges.length > 0 && (
                        <Award className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    {mentor.industry && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{mentor.industry}</span>
                      </div>
                    )}
                    {mentor.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{mentor.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {mentor.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mentor.bio}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#1D3A6B] mb-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-lg font-bold">{mentor.courses_count}</span>
                    </div>
                    <p className="text-xs text-gray-600">Courses</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-lg font-bold">{mentor.total_students}</span>
                    </div>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-lg font-bold">{mentor.sessions_completed}</span>
                    </div>
                    <p className="text-xs text-gray-600">Sessions</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-lg font-bold">{mentor.enrollments_count}</span>
                    </div>
                    <p className="text-xs text-gray-600">Enrollments</p>
                  </div>
                </div>

                {/* Rating */}
                {mentor.average_rating && mentor.average_rating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(mentor.average_rating!)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {mentor.average_rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({mentor.sessions_completed} reviews)
                    </span>
                  </div>
                )}

                {/* Skills */}
                {mentor.skills && mentor.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{mentor.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Achievements Preview */}
                {mentor.mentor_achievements && mentor.mentor_achievements.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span className="text-xs font-medium text-gray-700">Achievements</span>
                    </div>
                    <div className="space-y-1">
                      {mentor.mentor_achievements.slice(0, 2).map((achievement: any, idx: number) => (
                        <div key={idx} className="text-xs text-gray-600">
                          • {achievement.title} {achievement.year && `(${achievement.year})`}
                        </div>
                      ))}
                      {mentor.mentor_achievements.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{mentor.mentor_achievements.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Education Preview */}
                {mentor.mentor_education && mentor.mentor_education.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700">Education</span>
                    </div>
                    <div className="space-y-1">
                      {mentor.mentor_education.slice(0, 2).map((edu: any, idx: number) => (
                        <div key={idx} className="text-xs text-gray-600">
                          {edu.degree} {edu.institution && `- ${edu.institution}`}
                        </div>
                      ))}
                      {mentor.mentor_education.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{mentor.mentor_education.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/community/courses?mentor=${mentor.id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors text-sm font-medium"
                  >
                    <BookOpen className="h-4 w-4" />
                    View Courses
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/community/sessions/book?mentor=${mentor.id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-[#1D3A6B] text-[#1D3A6B] px-4 py-2 rounded-lg hover:bg-[#1D3A6B] hover:text-white transition-colors text-sm font-medium"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {mentors.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-[#1D3A6B] to-[#152A4F] rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Community Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{mentors.length}</div>
                <div className="text-sm opacity-90">Active Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {mentors.reduce((sum, m) => sum + m.courses_count, 0)}
                </div>
                <div className="text-sm opacity-90">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {mentors.reduce((sum, m) => sum + m.enrollments_count, 0)}
                </div>
                <div className="text-sm opacity-90">Total Enrollments</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {mentors.reduce((sum, m) => sum + m.sessions_completed, 0)}
                </div>
                <div className="text-sm opacity-90">Sessions Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorsShowcase;

