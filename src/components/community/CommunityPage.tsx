import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, MessageSquare, Calendar, BookOpen, Award, TrendingUp, Home, LogOut, Trophy, Settings, UserCheck, Sparkles } from 'lucide-react';
import { auth, supabase } from '../../lib/supabase';
import AuthGuard from './AuthGuard';
import MemberOnboarding from './MemberOnboarding';
import SupabaseStatus from './SupabaseStatus';
import MemberDirectory from './MemberDirectory';
import ForumHome from './ForumHome';
import EventsHome from './EventsHome';
import Leaderboard from './Leaderboard';
import BadgesDisplay from './BadgesDisplay';
import TrialExpirationBanner from './TrialExpirationBanner';
import type { CommunityMember } from '../../lib/supabase';

type Tab = 'home' | 'members' | 'forum' | 'events' | 'leaderboard';

const CommunityPage: React.FC = () => {
  console.log('🚀 CommunityPage component mounted');
  const [member, setMember] = useState<CommunityMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [stats, setStats] = useState({
    posts: 0,
    members: 0,
    events: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('🔍 CommunityPage: loadMemberProfile useEffect triggered');
    loadMemberProfile();
  }, []);

  useEffect(() => {
    // Set active tab based on route
    if (location.pathname.includes('/members')) {
      setActiveTab('members');
    } else if (location.pathname.includes('/forum')) {
      setActiveTab('forum');
    } else if (location.pathname.includes('/events')) {
      setActiveTab('events');
    } else if (location.pathname.includes('/leaderboard')) {
      setActiveTab('leaderboard');
    } else {
      setActiveTab('home');
    }
  }, [location.pathname]);

  // Load stats - MUST be before any conditional returns
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [postsRes, membersRes, eventsRes] = await Promise.all([
          supabase.from('community_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('community_members').select('id', { count: 'exact', head: true }).eq('vetting_status', 'vetted'),
          supabase.from('community_events').select('id', { count: 'exact', head: true }).in('status', ['upcoming', 'live']),
        ]);

        setStats({
          posts: postsRes.count || 0,
          members: membersRes.count || 0,
          events: eventsRes.count || 0,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        // Don't block page load if stats fail
        setStats({
          posts: 0,
          members: 0,
          events: 0,
        });
      }
    };

    if (member) {
      loadStats();
    } else {
      // Still load stats even if member not loaded yet (for public view)
      loadStats();
    }
  }, [member]);

  const loadMemberProfile = async () => {
    console.log('📋 CommunityPage: loadMemberProfile called');
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await auth.getUser();
      console.log('👤 CommunityPage: getUser result', { user: !!user, error: userError });
      
      if (userError) {
        console.error('User error:', userError);
        setLoading(false);
        return;
      }
      
      if (!user) {
        console.log('No user found, setting loading to false');
        setLoading(false);
        return;
      }

      const { data: memberData, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors

      console.log('📊 CommunityPage: Member query result', { memberData: !!memberData, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading member profile:', error);
        setLoading(false);
        return;
      }

      if (!memberData) {
        console.log('No member data, needs onboarding');
        setNeedsOnboarding(true);
      } else {
        console.log('Member data found, setting member');
        setMember(memberData);
      }
    } catch (error) {
      console.error('❌ Error loading member profile:', error);
    } finally {
      console.log('✅ CommunityPage: loadMemberProfile complete, setting loading to false');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/community');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // Update URL for bookmarking but don't navigate (prevents remount)
    const url = tab === 'home' ? '/community' : `/community/${tab}`;
    window.history.replaceState({}, '', url);
  };

  if (loading) {
    console.log('CommunityPage: Loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    console.log('CommunityPage: Needs onboarding');
    return (
      <MemberOnboarding 
        onComplete={() => {
          setNeedsOnboarding(false);
          loadMemberProfile();
        }}
      />
    );
  }

  console.log('CommunityPage: Rendering main content');
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1D3A6B]">
                  Start Solo Community
                </h1>
                <p className="text-gray-600 mt-1">
                  Connect, learn, and grow with fellow solopreneurs
                </p>
              </div>
              {member && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Welcome back,</div>
                    <div className="font-semibold text-[#1D3A6B]">
                      {member.display_name || member.full_name}
                    </div>
                  </div>
                  {member.avatar_url ? (
                    <img 
                      src={member.avatar_url} 
                      alt={member.display_name || member.full_name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#1D3A6B] flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-[#152A4F] transition-colors"
                      onClick={() => navigate(`/community/members/${member.id}`)}
                    >
                      {(member.display_name || member.full_name)[0].toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5 text-gray-600" />
                  </button>
                  {member?.role === 'admin' && (
                    <button
                      onClick={() => navigate('/community/admin')}
                      className="flex items-center gap-2 px-3 py-2 bg-[#1D3A6B] text-white rounded-lg hover:bg-[#152A4F] transition-colors text-sm font-medium"
                      title="Admin Dashboard"
                    >
                      <Settings className="h-4 w-4" />
                      Admin
                    </button>
                  )}
                  {member?.role === 'mentor' && (
                    <button
                      onClick={() => navigate('/community/mentor')}
                      className="flex items-center gap-2 px-3 py-2 bg-[#1D3A6B] text-white rounded-lg hover:bg-[#152A4F] transition-colors text-sm font-medium"
                      title="Mentor Dashboard"
                    >
                      <BookOpen className="h-4 w-4" />
                      Dashboard
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => handleTabChange('home')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'home'
                    ? 'border-[#1D3A6B] text-[#1D3A6B]'
                    : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </button>
              <button
                onClick={() => handleTabChange('members')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'members'
                    ? 'border-[#1D3A6B] text-[#1D3A6B]'
                    : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
                }`}
              >
                <Users className="h-4 w-4" />
                Members
              </button>
              <button
                onClick={() => handleTabChange('forum')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'forum'
                    ? 'border-[#1D3A6B] text-[#1D3A6B]'
                    : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Forum
              </button>
              <button
                onClick={() => handleTabChange('events')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'events'
                    ? 'border-[#1D3A6B] text-[#1D3A6B]'
                    : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Events
              </button>
              <button
                onClick={() => handleTabChange('leaderboard')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'leaderboard'
                    ? 'border-[#1D3A6B] text-[#1D3A6B]'
                    : 'border-transparent text-gray-600 hover:text-[#1D3A6B]'
                }`}
              >
                <Trophy className="h-4 w-4" />
                Leaderboard
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Trial Expiration Banner */}
          {member && member.vetting_status !== 'vetted' && member.vetting_status !== 'admin' && (
            <TrialExpirationBanner memberId={member.id} />
          )}

          {activeTab === 'home' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Posts</p>
                      <p className="text-2xl font-bold text-[#1D3A6B]">{stats.posts}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Members</p>
                      <p className="text-2xl font-bold text-[#1D3A6B]">{stats.members}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Events</p>
                      <p className="text-2xl font-bold text-[#1D3A6B]">{stats.events}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Courses</p>
                      <p className="text-2xl font-bold text-[#1D3A6B]">1</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Your Points</p>
                      <p className="text-2xl font-bold text-[#1D3A6B]">{member?.points || 0}</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Badges</p>
                      <p className="text-2xl font-bold text-[#1D3A6B]">{member?.badges?.length || 0}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-indigo-500" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {member?.vetting_status === 'vetted' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {member?.role === 'mentor' && (
                  <div
                    onClick={() => navigate('/community/mentor')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm opacity-90 mb-1">Mentor Tools</p>
                        <p className="text-white text-xl font-bold">Mentor Dashboard</p>
                        <p className="text-white text-xs opacity-75 mt-2">Manage courses, sessions & earnings</p>
                      </div>
                      <BookOpen className="h-12 w-12 text-white opacity-50" />
                    </div>
                  </div>
                )}
                <div
                  onClick={() => navigate('/community/mentors')}
                  className="bg-gradient-to-r from-[#1D3A6B] to-[#152A4F] rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm opacity-90 mb-1">Explore</p>
                      <p className="text-white text-xl font-bold">Our Mentors</p>
                      <p className="text-white text-xs opacity-75 mt-2">Learn from experienced mentors</p>
                    </div>
                    <Sparkles className="h-12 w-12 text-white opacity-50" />
                  </div>
                </div>
                <div
                  onClick={() => navigate('/community/sessions/book')}
                  className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm opacity-90 mb-1">Connect with Mentors</p>
                      <p className="text-white text-xl font-bold">Book a Free Session</p>
                      <p className="text-white text-xs opacity-75 mt-2">Get 1:1 guidance from experienced mentors</p>
                    </div>
                    <UserCheck className="h-12 w-12 text-white opacity-50" />
                  </div>
                </div>
                <div
                  onClick={() => navigate('/community/sessions/my-sessions')}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm opacity-90 mb-1">Your Sessions</p>
                      <p className="text-white text-xl font-bold">My Sessions</p>
                      <p className="text-white text-xs opacity-75 mt-2">View and manage your booked sessions</p>
                    </div>
                    <Calendar className="h-12 w-12 text-white opacity-50" />
                  </div>
                </div>
              </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1D3A6B] mb-2">Recent Discussions</h3>
                  <p className="text-gray-600 text-sm mb-4">See what the community is talking about</p>
                  <button
                    onClick={() => handleTabChange('forum')}
                    className="text-[#1D3A6B] hover:underline font-medium"
                  >
                    Browse Forum →
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1D3A6B] mb-2">Meet Members</h3>
                  <p className="text-gray-600 text-sm mb-4">Connect with fellow solopreneurs and mentors</p>
                  <button
                    onClick={() => handleTabChange('members')}
                    className="text-[#1D3A6B] hover:underline font-medium"
                  >
                    Browse Directory →
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1D3A6B] mb-2">Your Badges</h3>
                  <p className="text-gray-600 text-sm mb-4">View your achievements and progress</p>
                  {member && (
                    <BadgesDisplay memberId={member.id} showAll={false} />
                  )}
                </div>
              </div>

              {/* Welcome Message */}
              {member?.vetting_status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                  <p className="text-yellow-800">
                    <strong>Your application is pending review.</strong> You can view community content, but you'll need to be approved or vetted to interact.
                  </p>
                </div>
              )}

              {member?.vetting_status === 'approved' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <p className="text-blue-800">
                    <strong>Your application has been approved!</strong> You can browse the community, but full access (posting, commenting, event registration) requires vetting. Contact an admin to be upgraded to vetted status.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'members' && (
            <MemberDirectory currentMemberId={member?.id} />
          )}

          {activeTab === 'forum' && (
            <ForumHome currentMemberId={member?.id} vettingStatus={member?.vetting_status} />
          )}

          {activeTab === 'events' && (
            <EventsHome currentMemberId={member?.id} vettingStatus={member?.vetting_status} />
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard />
          )}
        </div>

        {/* Development Status Checker */}
        <SupabaseStatus />
      </div>
    </AuthGuard>
  );
};

export default CommunityPage;