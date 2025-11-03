import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Mail, MessageSquare, CheckCircle, XCircle, Clock, Filter, RefreshCw } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  channel: 'email' | 'whatsapp' | 'both';
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  scheduled_for: string;
  sent_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  metadata: Record<string, any>;
  created_at: string;
  user_email?: string;
}

const NotificationManagement: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | 'email' | 'whatsapp' | 'both'>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadNotifications();
    }
  }, [isAdmin, filter, typeFilter, channelFilter]);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        navigate('/community');
        return;
      }

      const { data: member } = await supabase
        .from('community_members')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member?.role === 'admin') {
        setIsAdmin(true);
      } else {
        navigate('/community');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/community');
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);

      // Build query
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Apply filters
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      if (channelFilter !== 'all') {
        query = query.eq('channel', channelFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by type if needed
      let filteredData = data || [];
      if (typeFilter !== 'all') {
        filteredData = filteredData.filter((n: Notification) => n.type === typeFilter);
      }

      // Load user emails for display
      const userIds = [...new Set(filteredData.map((n: Notification) => n.user_id))];
      const { data: users } = await supabase
        .from('auth.users')
        .select('id, email')
        .in('id', userIds);

      // Can't directly query auth.users, so get from community_members
      const { data: members } = await supabase
        .from('community_members')
        .select('user_id, email')
        .in('user_id', userIds);

      const emailMap = new Map(members?.map(m => [m.user_id, m.email]) || []);

      const notificationsWithEmail = filteredData.map((n: Notification) => ({
        ...n,
        user_email: emailMap.get(n.user_id) || 'Unknown',
      }));

      setNotifications(notificationsWithEmail);

      // Calculate stats
      const allData = data || [];
      setStats({
        total: allData.length,
        pending: allData.filter((n: Notification) => n.status === 'pending').length,
        sent: allData.filter((n: Notification) => n.status === 'sent').length,
        failed: allData.filter((n: Notification) => n.status === 'failed').length,
      });
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { icon: any; color: string; bg: string }> = {
      pending: { icon: Clock, color: 'text-yellow-800', bg: 'bg-yellow-100' },
      sent: { icon: CheckCircle, color: 'text-green-800', bg: 'bg-green-100' },
      failed: { icon: XCircle, color: 'text-red-800', bg: 'bg-red-100' },
      cancelled: { icon: XCircle, color: 'text-gray-800', bg: 'bg-gray-100' },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'both':
        return (
          <div className="flex gap-1">
            <Mail className="h-4 w-4" />
            <MessageSquare className="h-4 w-4" />
          </div>
        );
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const retryFailedNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          status: 'pending',
          failed_at: null,
          failure_reason: null,
        })
        .eq('id', notificationId);

      if (error) throw error;

      await loadNotifications();
    } catch (error) {
      console.error('Error retrying notification:', error);
      alert('Failed to retry notification. Please try again.');
    }
  };

  const getUniqueTypes = () => {
    const types = new Set(notifications.map(n => n.type));
    return Array.from(types);
  };

  if (!isAdmin) {
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
          <p className="mt-4 text-gray-600">Loading notifications...</p>
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
              <h1 className="text-3xl font-bold text-[#1D3A6B]">Notification Management</h1>
              <p className="text-gray-600 mt-2">View and manage platform notifications</p>
            </div>
            <button
              onClick={() => navigate('/community/admin')}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-[#1D3A6B]">{stats.total}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            >
              <option value="all">All Channels</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="both">Both</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            >
              <option value="all">All Types</option>
              {getUniqueTypes().map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
            <button
              onClick={loadNotifications}
              className="flex items-center gap-2 px-4 py-2 bg-[#1D3A6B] text-white rounded-lg hover:bg-[#152A4F] transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Notifications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No notifications found
                    </td>
                  </tr>
                ) : (
                  notifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.user_email || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {notification.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {notification.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {getChannelIcon(notification.channel)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(notification.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(notification.scheduled_for).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {notification.status === 'failed' && (
                          <button
                            onClick={() => retryFailedNotification(notification.id)}
                            className="text-[#1D3A6B] hover:text-[#152A4F] font-medium"
                          >
                            Retry
                          </button>
                        )}
                        {notification.status === 'sent' && notification.sent_at && (
                          <span className="text-gray-500 text-xs">
                            {new Date(notification.sent_at).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;

