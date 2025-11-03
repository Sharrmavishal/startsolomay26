import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, DollarSign, Users, TrendingUp, Settings, Plus, ArrowRight, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import MentorCoursesList from './MentorCoursesList';
import RateCardManagement from './RateCardManagement';
import MentorSessionManagement from './MentorSessionManagement';
import CourseAnalytics from './CourseAnalytics';
import MentorAvailability from './MentorAvailability';
import MentorProfileForm from './MentorProfileForm';
import CourseBundleManagement from './CourseBundleManagement';

interface MentorStats {
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  totalEarnings: number;
  totalCommission: number;
  netEarnings: number;
}

const MentorDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MentorStats>({
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    totalCommission: 0,
    netEarnings: 0,
  });
  const [isMentor, setIsMentor] = useState(false);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'sessions' | 'rate-cards' | 'earnings' | 'analytics' | 'availability' | 'profile' | 'bundles'>('overview');
  const navigate = useNavigate();

  useEffect(() => {
    checkMentorAccess();
  }, []);

  useEffect(() => {
    if (mentorId) {
      loadStats();
    }
  }, [mentorId]);

  const checkMentorAccess = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await auth.getUser();
      if (!user) {
        navigate('/community');
        return;
      }

      const { data: member, error } = await supabase
        .from('community_members')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking mentor access:', error);
        navigate('/community');
        return;
      }

      if (!member || member.role !== 'mentor') {
        console.log('Not a mentor:', { member, role: member?.role });
        navigate('/community');
        return;
      }

      setIsMentor(true);
      setMentorId(member.id);
    } catch (error) {
      console.error('Error checking mentor access:', error);
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!mentorId) return;

    try {
      setLoading(true);

      // Load course stats
      const { data: courses, count: totalCourses } = await supabase
        .from('mentor_courses')
        .select('id, status', { count: 'exact', head: false })
        .eq('mentor_id', mentorId);

      const publishedCourses = courses?.filter(c => c.status === 'published').length || 0;

      // Load enrollment stats
      const { count: totalEnrollments } = await supabase
        .from('course_enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', courses?.map(c => c.id) || [])
        .eq('payment_status', 'paid');

      // Load session stats
      const { data: sessions } = await supabase
        .from('mentor_sessions')
        .select('status, mentor_payout, commission_amount, scheduled_at, payment_status')
        .eq('mentor_id', mentorId);

      const upcomingSessions = sessions?.filter(s => 
        s.status === 'confirmed' || s.status === 'pending'
      ).length || 0;

      const completedSessions = sessions?.filter(s => 
        s.status === 'completed'
      ).length || 0;

      // Calculate earnings
      const courseEarnings = await supabase
        .from('course_enrollments')
        .select('mentor_payout, commission_amount')
        .in('course_id', courses?.map(c => c.id) || [])
        .eq('payment_status', 'paid');

      const sessionEarnings = sessions?.filter(s => s.payment_status === 'paid') || [];

      const totalCourseEarnings = courseEarnings.data?.reduce((sum, e) => sum + (parseFloat(e.mentor_payout) || 0), 0) || 0;
      const totalSessionEarnings = sessionEarnings.reduce((sum, s) => sum + (parseFloat(s.mentor_payout) || 0), 0);
      const totalEarnings = totalCourseEarnings + totalSessionEarnings;

      const totalCourseCommission = courseEarnings.data?.reduce((sum, e) => sum + (parseFloat(e.commission_amount) || 0), 0) || 0;
      const totalSessionCommission = sessionEarnings.reduce((sum, s) => sum + (parseFloat(s.commission_amount) || 0), 0);
      const totalCommission = totalCourseCommission + totalSessionCommission;

      setStats({
        totalCourses: totalCourses || 0,
        publishedCourses,
        totalEnrollments: totalEnrollments || 0,
        totalSessions: sessions?.length || 0,
        upcomingSessions,
        completedSessions,
        totalEarnings,
        totalCommission,
        netEarnings: totalEarnings,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMentor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-3xl font-bold text-[#1D3A6B]">Mentor Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your courses, sessions, and earnings</p>
            </div>
            <button
              onClick={() => navigate('/community')}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Community
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'courses'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'sessions'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            My Sessions
          </button>
          <button
            onClick={() => setActiveTab('rate-cards')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'rate-cards'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            Rate Cards
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'earnings'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            Earnings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'analytics'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'availability'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            Availability
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('bundles')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'bundles'
                ? 'border-[#1D3A6B] text-[#1D3A6B]'
                : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Bundles
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold text-[#1D3A6B] mt-1">{stats.totalCourses}</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.publishedCourses} published</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Enrollments</p>
                    <p className="text-2xl font-bold text-[#1D3A6B] mt-1">{stats.totalEnrollments}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Sessions</p>
                    <p className="text-2xl font-bold text-[#1D3A6B] mt-1">{stats.upcomingSessions}</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.completedSessions} completed</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-[#1D3A6B] mt-1">₹{stats.netEarnings.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">After commission</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/community/courses/create')}
                className="bg-[#1D3A6B] text-white p-6 rounded-lg hover:bg-[#152A4F] transition-colors text-left flex items-center gap-4"
              >
                <Plus className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Create New Course</h3>
                  <p className="text-sm opacity-90">Host a course and earn revenue</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('sessions')}
                className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-left flex items-center gap-4"
              >
                <Calendar className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Manage Sessions</h3>
                  <p className="text-sm opacity-90">View and manage session requests</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('rate-cards')}
                className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-left flex items-center gap-4"
              >
                <Settings className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Manage Rate Cards</h3>
                  <p className="text-sm opacity-90">Set your session pricing</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1D3A6B]">My Courses</h2>
              <button
                onClick={() => navigate('/community/courses/create')}
                className="flex items-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Course
              </button>
            </div>
            <MentorCoursesList mentorId={mentorId} />
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <MentorSessionManagement mentorId={mentorId} />
          </div>
        )}

        {/* Rate Cards Tab */}
        {activeTab === 'rate-cards' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <RateCardManagement mentorId={mentorId} />
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1D3A6B] mb-6">Earnings Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">₹{(stats.totalEarnings + stats.totalCommission).toLocaleString()}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 mb-1">Platform Commission</p>
                  <p className="text-2xl font-bold text-red-900">₹{stats.totalCommission.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 mb-1">Net Earnings</p>
                  <p className="text-2xl font-bold text-blue-900">₹{stats.netEarnings.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Breakdown</h3>
                <p className="text-gray-600">Detailed earnings history coming soon...</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CourseAnalytics mentorId={mentorId} />
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <MentorAvailability mentorId={mentorId} />
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && mentorId && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Mentor Profile</h2>
            <p className="text-gray-600 text-sm mb-6">
              Add your achievements, education, and awards to showcase your expertise. These details will appear on your mentor profile.
            </p>
            <MentorProfileForm mentorId={mentorId} onSave={() => loadStats()} />
          </div>
        )}

        {/* Bundles Tab */}
        {activeTab === 'bundles' && (
          <CourseBundleManagement />
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;

