import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowLeft, Users, MessageSquare, Calendar, BookOpen, TrendingUp, Award } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface AnalyticsStats {
  totalPosts: number;
  totalComments: number;
  totalEvents: number;
  totalEnrollments: number;
  activeMembers: number;
  topContributors: Array<{
    id: string;
    display_name: string;
    points: number;
    posts_count: number;
  }>;
  postsByCategory: Record<string, number>;
  eventsByStatus: Record<string, number>;
}

const AdminAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    loadAnalytics();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        setTimeout(() => navigate('/community'), 2000);
        return;
      }

      const { data: member } = await supabase
        .from('community_members')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member?.role !== 'admin') {
        setTimeout(() => navigate('/community'), 2000);
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Load posts count
      const { count: postsCount } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true });

      // Load comments count
      const { count: commentsCount } = await supabase
        .from('community_comments')
        .select('*', { count: 'exact', head: true });

      // Load events count
      const { count: eventsCount } = await supabase
        .from('community_events')
        .select('*', { count: 'exact', head: true });

      // Load enrollments count
      const { count: enrollmentsCount } = await supabase
        .from('course_enrollments')
        .select('*', { count: 'exact', head: true });

      // Load active members (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { data: activeMembersData } = await supabase
        .from('community_members')
        .select('id')
        .gte('last_active_at', thirtyDaysAgo.toISOString());

      // Load top contributors
      const { data: topContributorsData } = await supabase
        .from('community_members')
        .select('id, display_name, points')
        .order('points', { ascending: false })
        .limit(10);

      // Load posts by category
      const { data: postsData } = await supabase
        .from('community_posts')
        .select('category');

      const postsByCategory: Record<string, number> = {};
      (postsData || []).forEach(post => {
        postsByCategory[post.category] = (postsByCategory[post.category] || 0) + 1;
      });

      // Load events by status
      const { data: eventsData } = await supabase
        .from('community_events')
        .select('status');

      const eventsByStatus: Record<string, number> = {};
      (eventsData || []).forEach(event => {
        eventsByStatus[event.status] = (eventsByStatus[event.status] || 0) + 1;
      });

      // Get post counts for top contributors
      const contributorIds = (topContributorsData || []).map(c => c.id);
      const { data: contributorPostsData } = await supabase
        .from('community_posts')
        .select('author_id')
        .in('author_id', contributorIds);

      const postsCountByAuthor: Record<string, number> = {};
      (contributorPostsData || []).forEach(post => {
        postsCountByAuthor[post.author_id] = (postsCountByAuthor[post.author_id] || 0) + 1;
      });

      const topContributors = (topContributorsData || []).map(contributor => ({
        id: contributor.id,
        display_name: contributor.display_name || 'Unknown',
        points: contributor.points || 0,
        posts_count: postsCountByAuthor[contributor.id] || 0,
      }));

      setStats({
        totalPosts: postsCount || 0,
        totalComments: commentsCount || 0,
        totalEvents: eventsCount || 0,
        totalEnrollments: enrollmentsCount || 0,
        activeMembers: activeMembersData?.length || 0,
        topContributors,
        postsByCategory,
        eventsByStatus,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">Only admins can access analytics.</p>
          <button
            onClick={() => navigate('/community')}
            className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/community/admin')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1D3A6B] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Dashboard
            </button>
          </div>
          <h1 className="text-3xl font-bold text-[#1D3A6B]">Community Analytics</h1>
          <p className="text-gray-600 mt-2">Insights into community engagement and activity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Posts</p>
                    <p className="text-3xl font-bold text-[#1D3A6B]">{stats.totalPosts}</p>
                  </div>
                  <MessageSquare className="h-12 w-12 text-blue-500 opacity-50" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Comments</p>
                    <p className="text-3xl font-bold text-green-600">{stats.totalComments}</p>
                  </div>
                  <MessageSquare className="h-12 w-12 text-green-500 opacity-50" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Events</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalEvents}</p>
                  </div>
                  <Calendar className="h-12 w-12 text-purple-500 opacity-50" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Course Enrollments</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.totalEnrollments}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-orange-500 opacity-50" />
                </div>
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-[#1D3A6B]" />
                <h2 className="text-xl font-bold text-[#1D3A6B]">Active Members (Last 30 Days)</h2>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.activeMembers}</p>
              <p className="text-sm text-gray-600 mt-1">Members who have been active in the past 30 days</p>
            </div>

            {/* Top Contributors */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-[#1D3A6B]" />
                <h2 className="text-xl font-bold text-[#1D3A6B]">Top Contributors</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.topContributors.map((contributor, index) => (
                      <tr key={contributor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contributor.display_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contributor.points}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contributor.posts_count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Posts by Category */}
            {Object.keys(stats.postsByCategory).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Posts by Category</h2>
                <div className="space-y-2">
                  {Object.entries(stats.postsByCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700 capitalize">{category.replace('-', ' ')}</span>
                      <span className="font-bold text-[#1D3A6B]">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events by Status */}
            {Object.keys(stats.eventsByStatus).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Events by Status</h2>
                <div className="space-y-2">
                  {Object.entries(stats.eventsByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700 capitalize">{status}</span>
                      <span className="font-bold text-[#1D3A6B]">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;

