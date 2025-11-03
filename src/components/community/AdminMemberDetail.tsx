import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, User, Mail, Calendar, MapPin, Briefcase, Save, Ban, Trash2, Mail as MailIcon, Users, Clock } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import { notificationService } from '../../lib/notifications/notificationService';
import type { CommunityMember } from '../../lib/supabase';

const AdminMemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<CommunityMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suspending, setSuspending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [extendingTrial, setExtendingTrial] = useState(false);
  const [trialExtensionDays, setTrialExtensionDays] = useState<number>(7);
  const [formData, setFormData] = useState({
    vetting_status: 'pending' as 'pending' | 'approved' | 'rejected' | 'vetted' | 'suspended',
    role: 'solopreneur' as 'solopreneur' | 'mentor' | 'admin',
    admin_notes: '',
    free_sessions_per_month: null as number | null,
    can_host_courses: false,
  });

  useEffect(() => {
    checkAdminAccess();
    loadMember();
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

  const loadMember = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setMember(data);
      setFormData({
        vetting_status: data.vetting_status || 'pending',
        role: data.role,
        admin_notes: data.vetting_notes || '',
        free_sessions_per_month: data.free_sessions_per_month ?? null,
        can_host_courses: data.can_host_courses || false,
      });
    } catch (error) {
      console.error('Error loading member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !member) return;

    try {
      setSaving(true);
      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updateData: any = {
        vetting_status: formData.vetting_status,
        role: formData.role,
        vetting_notes: formData.admin_notes || null,
        updated_at: new Date().toISOString(),
      };

      // Mentor-specific settings
      if (formData.role === 'mentor') {
        updateData.free_sessions_per_month = formData.free_sessions_per_month;
        updateData.can_host_courses = formData.can_host_courses;
      } else {
        // Clear mentor settings if role is not mentor
        updateData.free_sessions_per_month = null;
        updateData.can_host_courses = false;
      }

      if (formData.vetting_status === 'vetted' || formData.vetting_status === 'approved') {
        updateData.vetting_date = new Date().toISOString();
        updateData.vetting_admin_id = user.id;
        // Keep the status as-is (approved or vetted)
      }

      // Track if vetting status changed
      const oldStatus = member.vetting_status;
      const newStatus = formData.vetting_status;
      const statusChanged = oldStatus !== newStatus;

      const { error } = await supabase
        .from('community_members')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Send notification if vetting status changed
      if (statusChanged && member.user_id) {
        try {
          await notificationService.sendVettingStatusNotification(
            member.user_id,
            formData.vetting_status as any,
            formData.role,
            formData.admin_notes || undefined,
            formData.vetting_status === 'rejected' ? formData.admin_notes || undefined : undefined
          );
        } catch (notifError) {
          console.error('Error sending vetting notification:', notifError);
          // Don't fail the save if notification fails
        }
      }

      alert('Member updated successfully!');
      navigate('/community/admin/members');
    } catch (error: any) {
      console.error('Error saving member:', error);
      alert(error.message || 'Failed to update member');
    } finally {
      setSaving(false);
    }
  };

  const handleSuspend = async () => {
    if (!id || !member) return;
    const isSuspended = member.is_suspended || false;
    
    if (!confirm(`Are you sure you want to ${isSuspended ? 'unsuspend' : 'suspend'} this member?`)) {
      return;
    }

    try {
      setSuspending(true);
      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updateData: any = {
        is_suspended: !isSuspended,
        updated_at: new Date().toISOString(),
      };

      if (!isSuspended) {
        // Suspending
        updateData.suspended_at = new Date().toISOString();
        updateData.suspended_by = user.id;
        updateData.vetting_status = 'suspended';
      } else {
        // Unsuspending - restore previous status if it was suspended
        if (member.vetting_status === 'suspended') {
          // Restore to a default status (you might want to track original status)
          updateData.vetting_status = 'vetted';
        }
        updateData.suspended_at = null;
        updateData.suspended_by = null;
      }

      const { error } = await supabase
        .from('community_members')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Send notification for suspend/unsuspend
      if (member.user_id) {
        try {
          await notificationService.sendVettingStatusNotification(
            member.user_id,
            !isSuspended ? 'suspended' : 'vetted',
            member.role || 'solopreneur',
            formData.admin_notes || undefined
          );
        } catch (notifError) {
          console.error('Error sending suspend notification:', notifError);
          // Don't fail the save if notification fails
        }
      }

      alert(`Member ${isSuspended ? 'unsuspended' : 'suspended'} successfully!`);
      loadMember(); // Reload to show updated status
    } catch (error: any) {
      console.error('Error suspending member:', error);
      alert(error.message || 'Failed to suspend member');
    } finally {
      setSuspending(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !member) return;
    
    if (!confirm(`Are you sure you want to delete this member? This will soft-delete their account. They will lose access but data will be preserved.`)) {
      return;
    }

    if (!confirm('This action cannot be easily undone. Are you absolutely sure?')) {
      return;
    }

    try {
      setDeleting(true);
      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('community_members')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      alert('Member deleted successfully!');
      navigate('/community/admin/members');
    } catch (error: any) {
      console.error('Error deleting member:', error);
      alert(error.message || 'Failed to delete member');
    } finally {
      setDeleting(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    try {
      setInviting(true);
      
      // Use Supabase Auth admin API to invite user
      // Note: This requires the service_role key on the backend
      // For now, we'll show a message with the invite link
      const inviteLink = `${window.location.origin}/community?invite=true`;
      
      alert(`Invitation link: ${inviteLink}\n\nSend this link to ${inviteEmail} to invite them to join the community.\n\nNote: Full email invitation functionality requires backend integration.`);
      
      // TODO: Integrate with email service or Supabase invite API
      // For now, admins can manually share the community link
      
      setShowInviteModal(false);
      setInviteEmail('');
    } catch (error: any) {
      console.error('Error sending invite:', error);
      alert(error.message || 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleExtendTrial = async () => {
    if (!id || !member) return;
    if (trialExtensionDays <= 0) {
      alert('Please enter a valid number of days');
      return;
    }

    if (!confirm(`Extend trial period by ${trialExtensionDays} days for ${member.display_name || member.full_name}?`)) {
      return;
    }

    try {
      setExtendingTrial(true);
      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current expiration or use current date
      const currentExpiration = member.membership_expires_at 
        ? new Date(member.membership_expires_at)
        : new Date();

      // Extend by the specified days
      const newExpiration = new Date(currentExpiration.getTime() + trialExtensionDays * 24 * 60 * 60 * 1000);

      const { error } = await supabase
        .from('community_members')
        .update({
          membership_expires_at: newExpiration.toISOString(),
          trial_extension_count: (member.trial_extension_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      alert(`Trial extended successfully! New expiration date: ${newExpiration.toLocaleDateString()}`);
      loadMember(); // Reload member data
    } catch (error: any) {
      console.error('Error extending trial:', error);
      alert(error.message || 'Failed to extend trial');
    } finally {
      setExtendingTrial(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading member...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Member Not Found</h2>
          <button
            onClick={() => navigate('/community/admin/members')}
            className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Back to Member Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/community/admin/members')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1D3A6B] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Member Management
          </button>
          <h1 className="text-3xl font-bold text-[#1D3A6B]">Member Vetting</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Member Info */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Member Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{member.display_name || member.full_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{member.email}</p>
              </div>
              {member.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">{member.location}</p>
                </div>
              )}
              {member.industry && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <p className="text-gray-900">{member.industry}</p>
                </div>
              )}
              {member.business_stage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Stage</label>
                  <p className="text-gray-900">{member.business_stage}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined</label>
                <p className="text-gray-900">{new Date(member.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            {member.bio && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <p className="text-gray-900">{member.bio}</p>
              </div>
            )}
          </div>

          {/* Vetting Form */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Vetting Decision</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vetting Status
                  <span className="text-xs text-gray-500 ml-2 font-normal">
                    (See descriptions below)
                  </span>
                </label>
                <select
                  value={formData.vetting_status}
                  onChange={(e) => setFormData({ ...formData, vetting_status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                >
                  <option value="pending">Pending - Not yet reviewed</option>
                  <option value="approved">Approved - View-only access (can browse, cannot post/comment/register)</option>
                  <option value="vetted">Vetted - Full access (can post, comment, register for events)</option>
                  <option value="suspended">Suspended - Temporarily suspended (no access)</option>
                  <option value="rejected">Rejected - Application denied</option>
                </select>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p><strong>Pending:</strong> Awaiting review</p>
                  <p><strong>Approved:</strong> Member can view content but cannot interact</p>
                  <p><strong>Vetted:</strong> Member has full community access</p>
                  <p><strong>Suspended:</strong> Member is temporarily suspended (no access)</p>
                  <p><strong>Rejected:</strong> Application was denied</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                >
                  <option value="solopreneur">Solopreneur</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Mentor-Specific Settings */}
              {formData.role === 'mentor' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Mentor-Specific Settings</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Free Sessions Per Month
                      <span className="text-xs text-gray-500 ml-2 font-normal">
                        (Override default platform setting)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.free_sessions_per_month ?? ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        free_sessions_per_month: e.target.value ? parseInt(e.target.value) : null 
                      })}
                      placeholder="Leave empty to use platform default"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Set custom limit for this mentor. Leave empty to use platform default ({member?.free_sessions_per_month ?? 'N/A'}).
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.can_host_courses}
                        onChange={(e) => setFormData({ ...formData, can_host_courses: e.target.checked })}
                        className="w-4 h-4 text-[#1D3A6B] border-gray-300 rounded focus:ring-[#1D3A6B]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Allow Course Hosting
                      </span>
                    </label>
                    <p className="mt-1 text-xs text-gray-500 ml-6">
                      Enable this mentor to host courses without reaching the points threshold. 
                      {formData.can_host_courses ? ' (Currently enabled)' : ' (Currently disabled)'}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={formData.admin_notes}
                  onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                  rows={4}
                  placeholder="Add notes about this member..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>

              {/* Trial Period Extension */}
              {member.vetting_status !== 'vetted' && member.vetting_status !== 'admin' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-900">Trial Period Management</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Expiration Date
                      </label>
                      <p className="text-gray-900">
                        {member.membership_expires_at 
                          ? new Date(member.membership_expires_at).toLocaleDateString()
                          : 'Not set'}
                      </p>
                      {member.trial_extension_count && member.trial_extension_count > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Extended {member.trial_extension_count} time(s)
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={trialExtensionDays}
                        onChange={(e) => setTrialExtensionDays(parseInt(e.target.value) || 7)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                        placeholder="Days to extend"
                      />
                      <button
                        onClick={handleExtendTrial}
                        disabled={extendingTrial}
                        className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Clock className="h-4 w-4" />
                        {extendingTrial ? 'Extending...' : 'Extend Trial'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Extend the trial period by the specified number of days from the current expiration date.
                    </p>
                  </div>
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
                  onClick={() => navigate('/community/admin/members')}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200 mt-6">
            <h2 className="text-xl font-bold text-[#1D3A6B] mb-4">Member Actions</h2>
            <div className="flex flex-wrap gap-3">
              {member.is_suspended ? (
                <button
                  onClick={handleSuspend}
                  disabled={suspending}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4" />
                  {suspending ? 'Unsuspending...' : 'Unsuspend Member'}
                </button>
              ) : (
                <button
                  onClick={handleSuspend}
                  disabled={suspending}
                  className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ban className="h-4 w-4" />
                  {suspending ? 'Suspending...' : 'Suspend Member'}
                </button>
              )}
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MailIcon className="h-4 w-4" />
                Invite Member
              </button>
              {!member.deleted_at && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? 'Deleting...' : 'Delete Member'}
                </button>
              )}
              {member.deleted_at && (
                <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                  Member deleted on {new Date(member.deleted_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#1D3A6B] mb-4">Invite Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleInvite}
                  disabled={inviting || !inviteEmail.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MailIcon className="h-4 w-4" />
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                  }}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberDetail;
