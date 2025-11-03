import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Clock, FileText, BarChart3, Settings, UserPlus, Bell, Database, AlertTriangle, HardDrive, RefreshCw } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface VettingStats {
  submitted: number;
  reviewed: number;
  callScheduled: number;
  approved: number;
  rejected: number;
}

interface CommunityStats {
  totalMembers: number;
  vettedMembers: number;
  pendingMembers: number;
  mentors: number;
  admins: number;
}

interface PlanUsage {
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  storageUsed: number; // bytes
  storageLimit: number; // bytes
  storagePercentage: number;
  bandwidthUsed?: number; // bytes (estimated)
  bandwidthLimit?: number; // bytes
  apiRequestsUsed?: number;
  apiRequestsLimit?: number;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [vettingStats, setVettingStats] = useState<VettingStats>({
    submitted: 0,
    reviewed: 0,
    callScheduled: 0,
    approved: 0,
    rejected: 0,
  });
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalMembers: 0,
    vettedMembers: 0,
    pendingMembers: 0,
    mentors: 0,
    admins: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [planUsage, setPlanUsage] = useState<PlanUsage | null>(null);
  const [loadingPlanUsage, setLoadingPlanUsage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    loadStats();
    loadPlanUsage();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        setAuthError('You must be signed in to access the admin dashboard.');
        setTimeout(() => navigate('/community'), 2000);
        return;
      }

      const { data: member, error: memberError } = await supabase
        .from('community_members')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberError) {
        console.error('Error checking member:', memberError);
        setAuthError('Error checking your member status. Please try again.');
        setTimeout(() => navigate('/community'), 3000);
        return;
      }

      if (!member) {
        setAuthError('You need to complete your profile first. Redirecting...');
        setTimeout(() => navigate('/community'), 2000);
        return;
      }

      if (member.role !== 'admin') {
        setAuthError(`Access denied. Your current role is: ${member.role}. Only admins can access this page.`);
        setTimeout(() => navigate('/community'), 3000);
        return;
      }

      setIsAdmin(true);
      setAuthError(null);
    } catch (error) {
      console.error('Error checking admin access:', error);
      setAuthError('An error occurred while checking admin access.');
      setTimeout(() => navigate('/community'), 3000);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);

      // Load vetting stats from admin_vetting table (if exists)
      let vettingData: any[] = [];
      try {
        const { data } = await supabase
          .from('admin_vetting')
          .select('status');
        vettingData = data || [];
      } catch (err) {
        console.log('admin_vetting table may not exist, using only community_members');
      }

      // Count pending members (these are the profiles that need vetting)
      const { count: pendingMembersCount } = await supabase
        .from('community_members')
        .select('id', { count: 'exact', head: true })
        .eq('vetting_status', 'pending');

      const stats: VettingStats = {
        submitted: 0,
        reviewed: 0,
        callScheduled: 0,
        approved: 0,
        rejected: 0,
      };

      (vettingData || []).forEach((item) => {
        if (item.status in stats) {
          stats[item.status as keyof VettingStats]++;
        }
      });

      // Add pending members to submitted count
      stats.submitted += pendingMembersCount || 0;

      setVettingStats(stats);

      // Load community stats
      const { data: members } = await supabase
        .from('community_members')
        .select('vetting_status, role')
        .is('deleted_at', null); // Exclude deleted members

      const commStats: CommunityStats = {
        totalMembers: members?.length || 0,
        vettedMembers: members?.filter(m => m.vetting_status === 'vetted').length || 0,
        pendingMembers: members?.filter(m => m.vetting_status === 'pending').length || 0,
        mentors: members?.filter(m => m.role === 'mentor').length || 0,
        admins: members?.filter(m => m.role === 'admin').length || 0,
      };

      setCommunityStats(commStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlanUsage = async () => {
    try {
      setLoadingPlanUsage(true);
      
      // Calculate storage usage from all buckets
      const buckets = ['course-pdfs', 'course-audio', 'course-videos', 'course-files', 'certificates', 'community-avatars'];
      let totalStorageUsed = 0;
      
      for (const bucketName of buckets) {
        try {
          const { data: files, error } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });
          
          if (!error && files) {
            // Calculate total size of files in this bucket
            const bucketSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
            totalStorageUsed += bucketSize;
          }
        } catch (err) {
          // Bucket might not exist, continue
          console.log(`Bucket ${bucketName} not accessible or doesn't exist`);
        }
      }
      
      // Free plan limits (Supabase Free Plan)
      // TODO: Update when upgrading to Pro plan
      const FREE_PLAN_STORAGE_LIMIT = 50 * 1024 * 1024; // 50MB
      
      const usage: PlanUsage = {
        plan: 'free', // TODO: Determine actual plan from settings or API
        storageUsed: totalStorageUsed,
        storageLimit: FREE_PLAN_STORAGE_LIMIT,
        storagePercentage: (totalStorageUsed / FREE_PLAN_STORAGE_LIMIT) * 100,
      };
      
      setPlanUsage(usage);
    } catch (error) {
      console.error('Error loading plan usage:', error);
    } finally {
      setLoadingPlanUsage(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStorageWarningLevel = (percentage: number): 'none' | 'warning' | 'critical' => {
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'none';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          {authError ? (
            <p className="text-gray-700 mb-6">{authError}</p>
          ) : (
            <p className="text-gray-700 mb-6">Checking admin access...</p>
          )}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1D3A6B]">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage community members and vetting applications</p>
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => navigate('/community/admin/vetting')}
            className="bg-[#1D3A6B] text-white p-6 rounded-lg hover:bg-[#152A4F] transition-colors text-left shadow-md"
          >
            <FileText className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold mb-1">Vetting Queue</h3>
            <p className="text-sm opacity-90">{vettingStats.submitted + communityStats.pendingMembers} pending review</p>
            <p className="text-xs opacity-75 mt-1">Click to approve members</p>
          </button>
          <button
            onClick={() => navigate('/community/admin/members')}
            className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-left"
          >
            <Users className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold mb-1">Member Management</h3>
            <p className="text-sm opacity-90">{communityStats.totalMembers} total members</p>
          </button>
          <button
            onClick={() => navigate('/community/admin/notifications')}
            className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition-colors text-left"
          >
            <Bell className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold mb-1">Notifications</h3>
            <p className="text-sm opacity-90">View & manage notifications</p>
          </button>
          <button
            onClick={() => navigate('/community/admin/analytics')}
            className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-left"
          >
            <BarChart3 className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold mb-1">Analytics</h3>
            <p className="text-sm opacity-90">View community insights</p>
          </button>
          <button
            onClick={() => navigate('/community/admin/settings')}
            className="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition-colors text-left"
          >
            <Settings className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold mb-1">Platform Settings</h3>
            <p className="text-sm opacity-90">Commission rates & configuration</p>
          </button>
        </div>

        {/* Invite Member Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              const email = prompt('Enter email address to invite:');
              if (email) {
                const inviteLink = `${window.location.origin}/community?invite=true`;
                alert(`Invitation link: ${inviteLink}\n\nSend this link to ${email} to invite them to join the community.\n\nNote: Full email invitation functionality requires backend integration.`);
              }
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Invite New Member
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Vetting Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Vetting Applications</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-700">Submitted</span>
                </div>
                <span className="font-bold text-gray-900">{vettingStats.submitted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">Under Review</span>
                </div>
                <span className="font-bold text-gray-900">{vettingStats.reviewed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-700">Call Scheduled</span>
                </div>
                <span className="font-bold text-gray-900">{vettingStats.callScheduled}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Approved</span>
                </div>
                <span className="font-bold text-gray-900">{vettingStats.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-gray-700">Rejected</span>
                </div>
                <span className="font-bold text-gray-900">{vettingStats.rejected}</span>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Community Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Members</span>
                <span className="font-bold text-gray-900">{communityStats.totalMembers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Vetted Members</span>
                <span className="font-bold text-green-600">{communityStats.vettedMembers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Pending Vetting</span>
                <span className="font-bold text-yellow-600">{communityStats.pendingMembers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Mentors</span>
                <span className="font-bold text-purple-600">{communityStats.mentors}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Admins</span>
                <span className="font-bold text-blue-600">{communityStats.admins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supabase Plan Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1D3A6B] flex items-center gap-2">
              <Database className="h-5 w-5" />
              Supabase Plan Usage
            </h2>
            <div className="flex items-center gap-3">
              {planUsage && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  planUsage.plan === 'free' 
                    ? 'bg-gray-100 text-gray-700' 
                    : planUsage.plan === 'pro'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {planUsage.plan.toUpperCase()} Plan
                </span>
              )}
              <button
                onClick={() => loadPlanUsage()}
                disabled={loadingPlanUsage}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#1D3A6B] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh plan usage"
              >
                <RefreshCw className={`h-4 w-4 ${loadingPlanUsage ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {loadingPlanUsage ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
              <p className="mt-2 text-gray-600">Loading usage data...</p>
            </div>
          ) : planUsage ? (
            <div className="space-y-6">
              {/* Storage Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Storage</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatBytes(planUsage.storageUsed)} / {formatBytes(planUsage.storageLimit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      getStorageWarningLevel(planUsage.storagePercentage) === 'critical'
                        ? 'bg-red-600'
                        : getStorageWarningLevel(planUsage.storagePercentage) === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(planUsage.storagePercentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {planUsage.storagePercentage.toFixed(1)}% used
                  </span>
                  {getStorageWarningLevel(planUsage.storagePercentage) !== 'none' && (
                    <div className={`flex items-center gap-1 ${
                      getStorageWarningLevel(planUsage.storagePercentage) === 'critical'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">
                        {getStorageWarningLevel(planUsage.storagePercentage) === 'critical'
                          ? 'Critical: Upgrade plan soon'
                          : 'Warning: Approaching limit'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Limits Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Current Plan Limits (Free Plan)</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Storage:</span>
                    <span className="font-medium">50MB total</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bandwidth:</span>
                    <span className="font-medium">2GB/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Requests:</span>
                    <span className="font-medium">2M/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Size:</span>
                    <span className="font-medium">500MB</span>
                  </div>
                </div>
                {planUsage.storagePercentage >= 75 && (
                  <div className="mt-3 pt-3 border-t border-blue-300">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> You're approaching your storage limit. Consider upgrading to Pro plan for more storage (100GB) and higher limits.
                    </p>
                  </div>
                )}
              </div>

              {/* Upgrade Prompt */}
              {planUsage.storagePercentage >= 90 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1">Storage Limit Near Capacity</h3>
                      <p className="text-sm text-red-800 mb-2">
                        Your storage is {planUsage.storagePercentage.toFixed(1)}% full. Upgrade to Pro plan to continue uploading content.
                      </p>
                      <a
                        href="https://supabase.com/pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm font-medium text-red-600 hover:text-red-700 underline"
                      >
                        View Supabase Pricing →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <p>Unable to load plan usage data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
