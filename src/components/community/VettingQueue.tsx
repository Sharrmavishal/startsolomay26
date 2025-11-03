import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, FileText, Mail, Phone, Calendar, User } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface VettingApplication {
  id: string;
  applicant_email: string;
  applicant_name: string;
  applicant_phone: string | null;
  application_source: string;
  application_data: Record<string, any>;
  role_requested: 'solopreneur' | 'mentor' | null;
  status: 'submitted' | 'reviewed' | 'call-scheduled' | 'approved' | 'rejected';
  admin_notes: string | null;
  vetting_call_scheduled_at: string | null;
  vetting_call_completed_at: string | null;
  vetting_call_notes: string | null;
  calendly_event_id: string | null;
  assigned_admin_id: string | null;
  reviewed_by: string | null;
  decision_date: string | null;
  rejection_reason: string | null;
  invite_sent: boolean;
  invite_sent_at: string | null;
  created_at: string;
  updated_at: string;
  type?: 'application' | 'member'; // To distinguish between admin_vetting and community_members
  member_id?: string; // For direct member vetting
}

const VettingQueue: React.FC = () => {
  const [applications, setApplications] = useState<VettingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'reviewed' | 'call-scheduled' | 'approved' | 'rejected'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    loadApplications();
  }, [filter]);

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
        .single();

      if (!member || member.role !== 'admin') {
        navigate('/community');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/community');
    }
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      
      // Load applications from admin_vetting table
      let vettingQuery = supabase
        .from('admin_vetting')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        vettingQuery = vettingQuery.eq('status', filter);
      }

      const { data: vettingData, error: vettingError } = await vettingQuery;
      if (vettingError) throw vettingError;

      // Load ALL members from community_members table (except admins)
      // Then filter to show only those that need vetting
      const shouldShowMembers = filter === 'all' || filter === 'submitted' || filter === 'approved';
      
      let membersData: any[] = [];
      if (shouldShowMembers) {
        // Load ALL members except admins (more permissive query)
        const { data: allMembers, error: membersError } = await supabase
          .from('community_members')
          .select('id, email, full_name, display_name, role, vetting_status, created_at, updated_at')
          .neq('role', 'admin')
          .order('created_at', { ascending: false });

        if (membersError) {
          console.error('Error loading members for vetting:', membersError);
          alert(`Error loading members: ${membersError.message}. Check browser console for details.`);
        } else if (allMembers) {
          console.log('Loaded members for vetting:', allMembers.length, allMembers);
          
          // Filter to only show non-vetted, non-rejected members
          const filteredMembers = allMembers.filter(m => {
            const status = m.vetting_status;
            // Show if: pending, approved, or NULL (treat NULL as pending)
            // Hide if: vetted or rejected
            return status !== 'vetted' && status !== 'rejected';
          });
          
          console.log('Filtered members needing vetting:', filteredMembers.length, filteredMembers);
          
          // Convert members to application format
          membersData = filteredMembers.map(member => {
            const status = member.vetting_status || 'pending';
            return {
              id: member.id,
              applicant_email: member.email,
              applicant_name: member.display_name || member.full_name,
              applicant_phone: null,
              application_source: 'direct-signup',
              application_data: {},
              role_requested: member.role === 'mentor' ? 'mentor' : 'solopreneur',
              status: (status === 'approved' ? 'approved' : 'submitted') as const,
              admin_notes: null,
              vetting_call_scheduled_at: null,
              vetting_call_completed_at: null,
              vetting_call_notes: null,
              calendly_event_id: null,
              assigned_admin_id: null,
              reviewed_by: null,
              decision_date: null,
              rejection_reason: null,
              invite_sent: false,
              invite_sent_at: null,
              created_at: member.created_at,
              updated_at: member.updated_at,
              type: 'member' as const,
              member_id: member.id,
            };
          });
        }
      }

      // Combine both sources
      let allApplications = [
        ...(vettingData || []).map(app => ({ ...app, type: 'application' as const })),
        ...membersData,
      ];

      // Apply filter if not 'all'
      if (filter !== 'all') {
        allApplications = allApplications.filter(app => {
          if (filter === 'submitted') {
            return app.status === 'submitted' || (app.type === 'member' && app.status === 'submitted');
          } else if (filter === 'approved') {
            return app.status === 'approved';
          } else {
            return app.status === filter;
          }
        });
      }

      // Sort by created_at descending
      allApplications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setApplications(allApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      'call-scheduled': 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="h-4 w-4" />;
      case 'reviewed':
        return <FileText className="h-4 w-4" />;
      case 'call-scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading vetting queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/community/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1D3A6B] mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </button>
          <h1 className="text-3xl font-bold text-[#1D3A6B]">Vetting Queue</h1>
          <p className="text-gray-600 mt-2">Review and manage member applications</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'submitted', 'reviewed', 'call-scheduled', 'approved', 'rejected'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-[#1D3A6B] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption === 'all' ? 'All' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No applications found.' 
                : `No ${filter} applications found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                onClick={() => {
                  if (application.type === 'member') {
                    // For direct members, navigate to member detail page with vetting option
                    navigate(`/community/admin/members/${application.member_id}`);
                  } else {
                    // For applications, navigate to application detail
                    navigate(`/community/admin/vetting/${application.id}`);
                  }
                }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      {application.type === 'member' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          Direct Signup
                        </span>
                      )}
                      {application.role_requested && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {application.role_requested === 'mentor' ? 'Mentor' : 'Solopreneur'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#1D3A6B] mb-1">{application.applicant_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {application.applicant_email}
                      </div>
                      {application.applicant_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {application.applicant_phone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {application.type === 'member' ? 'Joined' : 'Applied'} {formatDate(application.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
                {application.admin_notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Admin Notes:</strong> {application.admin_notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VettingQueue;
