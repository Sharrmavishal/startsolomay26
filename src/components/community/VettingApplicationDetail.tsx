import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, Mail, Phone, Calendar, User, Save } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import { notificationService } from '../../lib/notifications/notificationService';

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
}

const VettingApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<VettingApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    status: 'submitted' as VettingApplication['status'],
    admin_notes: '',
    vetting_call_scheduled_at: '',
    vetting_call_notes: '',
    rejection_reason: '',
  });

  useEffect(() => {
    checkAdminAccess();
    loadApplication();
  }, [id]);

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

  const loadApplication = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_vetting')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setApplication(data);
      setFormData({
        status: data.status,
        admin_notes: data.admin_notes || '',
        vetting_call_scheduled_at: data.vetting_call_scheduled_at ? new Date(data.vetting_call_scheduled_at).toISOString().slice(0, 16) : '',
        vetting_call_notes: data.vetting_call_notes || '',
        rejection_reason: data.rejection_reason || '',
      });
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !application) return;

    try {
      setSaving(true);
      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updateData: any = {
        status: formData.status,
        admin_notes: formData.admin_notes || null,
        reviewed_by: user.id,
        updated_at: new Date().toISOString(),
      };

      if (formData.vetting_call_scheduled_at) {
        updateData.vetting_call_scheduled_at = new Date(formData.vetting_call_scheduled_at).toISOString();
      }

      if (formData.vetting_call_notes) {
        updateData.vetting_call_notes = formData.vetting_call_notes;
      }

      if (formData.status === 'rejected') {
        updateData.rejection_reason = formData.rejection_reason || null;
        updateData.decision_date = new Date().toISOString();
      }

      if (formData.status === 'approved') {
        updateData.decision_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('admin_vetting')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // If approved, update community_members vetting_status to 'approved' (view-only)
      if (formData.status === 'approved') {
        await updateMemberVettingStatus(application.applicant_email, 'approved', application.role_requested || 'solopreneur');
      }

      // Send notification if status changed
      if (application.status !== formData.status) {
        // Find member by email to get user_id
        const { data: memberData } = await supabase
          .from('community_members')
          .select('user_id, role')
          .eq('email', application.applicant_email)
          .maybeSingle();

        if (memberData?.user_id) {
          try {
            await notificationService.sendVettingStatusNotification(
              memberData.user_id,
              formData.status === 'approved' ? 'approved' : formData.status === 'rejected' ? 'rejected' : 'pending',
              application.role_requested || memberData.role || 'solopreneur',
              formData.admin_notes || undefined,
              formData.rejection_reason || undefined
            );
          } catch (notifError) {
            console.error('Error sending vetting notification:', notifError);
            // Don't fail the save if notification fails
          }
        }
      }

      alert('Application updated successfully!');
      navigate('/community/admin/vetting');
    } catch (error: any) {
      console.error('Error saving application:', error);
      alert(error.message || 'Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  const updateMemberVettingStatus = async (email: string, status: string, role: string) => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) return;

      // Find member by email
      const { data: member } = await supabase
        .from('community_members')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (member) {
        const { error } = await supabase
          .from('community_members')
          .update({
            vetting_status: status,
            vetting_date: new Date().toISOString(),
            vetting_admin_id: user.id,
            role: role,
          })
          .eq('id', member.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating member vetting status:', error);
      // Don't throw - approval can still succeed even if member update fails
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <button
            onClick={() => navigate('/community/admin/vetting')}
            className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Back to Vetting Queue
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/community/admin/vetting')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1D3A6B] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vetting Queue
          </button>
          <h1 className="text-3xl font-bold text-[#1D3A6B]">Application Review</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Applicant Info */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Applicant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{application.applicant_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{application.applicant_email}</p>
              </div>
              {application.applicant_phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{application.applicant_phone}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Requested</label>
                <p className="text-gray-900">{application.role_requested || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Source</label>
                <p className="text-gray-900">{application.application_source}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applied On</label>
                <p className="text-gray-900">{formatDate(application.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Application Data */}
          {application.application_data && Object.keys(application.application_data).length > 0 && (
            <div className="mb-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Application Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(application.application_data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Admin Review Form */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Review & Decision</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                  <span className="text-xs text-gray-500 ml-2 font-normal">
                    (See descriptions below)
                  </span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as VettingApplication['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                >
                  <option value="submitted">Submitted - Awaiting review</option>
                  <option value="reviewed">Under Review - Being evaluated</option>
                  <option value="call-scheduled">Call Scheduled - Vetting call arranged</option>
                  <option value="approved">Approved - View-only access granted (cannot post/comment/register)</option>
                  <option value="rejected">Rejected - Application denied</option>
                </select>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p><strong>Approved:</strong> Member can view content but cannot interact</p>
                  <p><strong>Note:</strong> To grant full access, update member's vetting_status to 'vetted' in Member Management</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={formData.admin_notes}
                  onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                  rows={4}
                  placeholder="Add notes about this application..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>

              {formData.status === 'call-scheduled' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Call Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.vetting_call_scheduled_at}
                      onChange={(e) => setFormData({ ...formData, vetting_call_scheduled_at: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Call Notes</label>
                    <textarea
                      value={formData.vetting_call_notes}
                      onChange={(e) => setFormData({ ...formData, vetting_call_notes: e.target.value })}
                      rows={4}
                      placeholder="Notes from the vetting call..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {formData.status === 'rejected' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                  <textarea
                    value={formData.rejection_reason}
                    onChange={(e) => setFormData({ ...formData, rejection_reason: e.target.value })}
                    rows={3}
                    placeholder="Reason for rejection..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => navigate('/community/admin/vetting')}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VettingApplicationDetail;
