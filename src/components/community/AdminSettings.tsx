import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Save, ArrowLeft, DollarSign, Users, Mail, MessageCircle, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface AdminSetting {
  id: string;
  key: string;
  value: string | number | boolean;
  description: string;
}

interface PointsConfig {
  id: string;
  action_key: string;
  action_name: string;
  action_description: string;
  points: number;
  is_active: boolean;
  category: string;
}

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [pointsConfig, setPointsConfig] = useState<PointsConfig[]>([]);
  const [showAddPointsModal, setShowAddPointsModal] = useState(false);
  const [editingPoint, setEditingPoint] = useState<PointsConfig | null>(null);
  const [newPointAction, setNewPointAction] = useState({ action_key: '', action_name: '', action_description: '', points: 10, category: 'engagement' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    loadSettings();
    loadPointsConfig();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        setAuthError('You must be signed in to access admin settings.');
        setTimeout(() => navigate('/community'), 2000);
        return;
      }

      const { data: member } = await supabase
        .from('community_members')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!member || member.role !== 'admin') {
        setAuthError('Access denied. Only admins can access this page.');
        setTimeout(() => navigate('/community/admin'), 2000);
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      setAuthError('Error checking admin access.');
      setTimeout(() => navigate('/community/admin'), 2000);
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('key');

      if (error) throw error;

      const formattedSettings = (data || []).map(setting => ({
        id: setting.id,
        key: setting.key,
        value: typeof setting.value === 'object' ? JSON.stringify(setting.value) : setting.value,
        description: setting.description || '',
      }));

      setSettings(formattedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPointsConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('points_config')
        .select('*')
        .order('category, action_name');

      if (error) throw error;
      setPointsConfig(data || []);
    } catch (error) {
      console.error('Error loading points config:', error);
    }
  };

  const handleSavePoints = async (point: PointsConfig) => {
    try {
      const { error } = await supabase
        .from('points_config')
        .update({
          points: point.points,
          is_active: point.is_active,
          action_name: point.action_name,
          action_description: point.action_description,
          category: point.category,
        })
        .eq('id', point.id);

      if (error) throw error;
      setSuccessMessage('Points configuration updated successfully');
      await loadPointsConfig();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setAuthError(error.message || 'Failed to update points configuration');
      setTimeout(() => setAuthError(null), 5000);
    }
  };

  const handleAddPoint = async () => {
    try {
      if (!newPointAction.action_key || !newPointAction.action_name) {
        setAuthError('Action key and name are required');
        setTimeout(() => setAuthError(null), 3000);
        return;
      }

      const { error } = await supabase
        .from('points_config')
        .insert({
          action_key: newPointAction.action_key,
          action_name: newPointAction.action_name,
          action_description: newPointAction.action_description,
          points: newPointAction.points,
          category: newPointAction.category,
          is_active: true,
        });

      if (error) throw error;
      setSuccessMessage('New point action added successfully');
      setShowAddPointsModal(false);
      setNewPointAction({ action_key: '', action_name: '', action_description: '', points: 10, category: 'engagement' });
      await loadPointsConfig();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setAuthError(error.message || 'Failed to add point action');
      setTimeout(() => setAuthError(null), 5000);
    }
  };

  const handleDeletePoint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this point configuration?')) return;

    try {
      const { error } = await supabase
        .from('points_config')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Point configuration deleted successfully');
      await loadPointsConfig();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      setAuthError(error.message || 'Failed to delete point configuration');
      setTimeout(() => setAuthError(null), 5000);
    }
  };

  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessMessage(null);
      setAuthError(null);

      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update each setting
      for (const setting of settings) {
        // Parse value based on type
        let parsedValue: any = setting.value;
        
        // Try to parse as number if it looks like a number
        if (typeof setting.value === 'string' && !isNaN(Number(setting.value)) && setting.value.trim() !== '') {
          parsedValue = Number(setting.value);
        }
        // Try to parse as boolean
        else if (setting.value === 'true' || setting.value === 'false') {
          parsedValue = setting.value === 'true';
        }
        // Keep as string otherwise
        else {
          parsedValue = setting.value.toString();
        }

        const { error } = await supabase
          .from('admin_settings')
          .update({
            value: parsedValue,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq('key', setting.key);

        if (error) throw error;
      }

      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setAuthError(error.message || 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      course_commission_rate: 'Course Commission Rate (%)',
      session_commission_rate: 'Session Commission Rate (%)',
      event_product_commission_rate: 'Event Product Commission Rate (%)',
      monthly_free_sessions_limit: 'Monthly Free Sessions Limit',
      course_hosting_points_threshold: 'Course Hosting Points Threshold',
      email_notifications_enabled: 'Email Notifications Enabled',
      whatsapp_notifications_enabled: 'WhatsApp Notifications Enabled',
      max_notifications_per_day: 'Max Notifications Per Day',
    };
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getSettingType = (key: string): 'number' | 'boolean' | 'text' => {
    if (key.includes('rate') || key.includes('threshold') || key.includes('limit') || key.includes('max')) {
      return 'number';
    }
    if (key.includes('enabled')) {
      return 'boolean';
    }
    return 'text';
  };

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
            onClick={() => navigate('/community/admin')}
            className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/community/admin')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#1D3A6B] flex items-center gap-3">
                <Settings className="h-8 w-8" />
                Platform Settings
              </h1>
              <p className="text-gray-600 mt-2">Configure commission rates, limits, and notification settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}
        {authError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {authError}
          </div>
        )}

        {/* Commission Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-6 w-6 text-[#1D3A6B]" />
            <h2 className="text-xl font-bold text-[#1D3A6B]">Commission Rates</h2>
          </div>
          
          <div className="space-y-4">
            {settings
              .filter(s => s.key.includes('commission_rate'))
              .map(setting => {
                const type = getSettingType(setting.key);
                return (
                  <div key={setting.key} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {getSettingLabel(setting.key)}
                      </label>
                      {setting.description && (
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      )}
                    </div>
                    {type === 'number' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={setting.value as number}
                          onChange={(e) => handleSettingChange(setting.key, parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                        />
                        <span className="text-gray-600">%</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Mentor Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-[#1D3A6B]" />
            <h2 className="text-xl font-bold text-[#1D3A6B]">Mentor Settings</h2>
          </div>
          
          <div className="space-y-4">
            {settings
              .filter(s => s.key.includes('free_sessions') || s.key.includes('course_hosting'))
              .map(setting => {
                const type = getSettingType(setting.key);
                return (
                  <div key={setting.key} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {getSettingLabel(setting.key)}
                      </label>
                      {setting.description && (
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      )}
                    </div>
                    {type === 'number' ? (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={setting.value as number}
                        onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value) || 0)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                      />
                    ) : (
                      <input
                        type="text"
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-6 w-6 text-[#1D3A6B]" />
            <h2 className="text-xl font-bold text-[#1D3A6B]">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            {settings
              .filter(s => s.key.includes('notification'))
              .map(setting => {
                const type = getSettingType(setting.key);
                return (
                  <div key={setting.key} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {getSettingLabel(setting.key)}
                      </label>
                      {setting.description && (
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      )}
                    </div>
                    {type === 'boolean' ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.value === true || setting.value === 'true'}
                          onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1D3A6B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1D3A6B]"></div>
                      </label>
                    ) : type === 'number' ? (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={setting.value as number}
                        onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value) || 0)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                      />
                    ) : (
                      <input
                        type="text"
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Points Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-[#1D3A6B]" />
              <h2 className="text-xl font-bold text-[#1D3A6B]">Points Configuration</h2>
            </div>
            <button
              onClick={() => setShowAddPointsModal(true)}
              className="flex items-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Action
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pointsConfig.map((point) => (
                  <tr key={point.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{point.action_name}</div>
                      <div className="text-xs text-gray-500">{point.action_key}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{point.action_description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        value={point.points}
                        onChange={(e) => {
                          const updated = { ...point, points: parseInt(e.target.value) || 0 };
                          setPointsConfig(prev => prev.map(p => p.id === point.id ? updated : p));
                          handleSavePoints(updated);
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={point.category}
                        onChange={(e) => {
                          const updated = { ...point, category: e.target.value };
                          setPointsConfig(prev => prev.map(p => p.id === point.id ? updated : p));
                          handleSavePoints(updated);
                        }}
                        className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                      >
                        <option value="engagement">Engagement</option>
                        <option value="achievement">Achievement</option>
                        <option value="milestone">Milestone</option>
                        <option value="special">Special</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={point.is_active}
                          onChange={(e) => {
                            const updated = { ...point, is_active: e.target.checked };
                            setPointsConfig(prev => prev.map(p => p.id === point.id ? updated : p));
                            handleSavePoints(updated);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1D3A6B]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1D3A6B]"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeletePoint(point.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate('/community/admin')}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Add Points Modal */}
      {showAddPointsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-[#1D3A6B] mb-4">Add New Point Action</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Key *</label>
                <input
                  type="text"
                  value={newPointAction.action_key}
                  onChange={(e) => setNewPointAction({ ...newPointAction, action_key: e.target.value })}
                  placeholder="e.g., create_post"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier (lowercase, underscores)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Name *</label>
                <input
                  type="text"
                  value={newPointAction.action_name}
                  onChange={(e) => setNewPointAction({ ...newPointAction, action_name: e.target.value })}
                  placeholder="e.g., Create Post"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newPointAction.action_description}
                  onChange={(e) => setNewPointAction({ ...newPointAction, action_description: e.target.value })}
                  placeholder="Description of when points are awarded"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                  <input
                    type="number"
                    min="0"
                    value={newPointAction.points}
                    onChange={(e) => setNewPointAction({ ...newPointAction, points: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newPointAction.category}
                    onChange={(e) => setNewPointAction({ ...newPointAction, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                  >
                    <option value="engagement">Engagement</option>
                    <option value="achievement">Achievement</option>
                    <option value="milestone">Milestone</option>
                    <option value="special">Special</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowAddPointsModal(false);
                  setNewPointAction({ action_key: '', action_name: '', action_description: '', points: 10, category: 'engagement' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPoint}
                className="px-4 py-2 bg-[#1D3A6B] text-white rounded-lg hover:bg-[#152A4F] transition-colors"
              >
                Add Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;

