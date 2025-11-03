import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Edit } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface EditProfileFormProps {
  memberId: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ memberId, onSave, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    full_name: '',
    bio: '',
    industry: '',
    business_stage: '',
    location: '',
    skills: [] as string[],
    avatar_url: '',
  });
  const [currentSkill, setCurrentSkill] = useState('');

  useEffect(() => {
    loadProfile();
  }, [memberId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_members')
        .select('display_name, full_name, bio, industry, business_stage, location, skills, avatar_url')
        .eq('id', memberId)
        .single();

      if (error) throw error;

      setFormData({
        display_name: data.display_name || '',
        full_name: data.full_name || '',
        bio: data.bio || '',
        industry: data.industry || '',
        business_stage: data.business_stage || '',
        location: data.location || '',
        skills: data.skills || [],
        avatar_url: data.avatar_url || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Calculate profile completeness
      let completeness = 0;
      if (formData.display_name) completeness += 15;
      if (formData.bio) completeness += 20;
      if (formData.industry) completeness += 15;
      if (formData.business_stage) completeness += 15;
      if (formData.location) completeness += 10;
      if (formData.skills.length > 0) completeness += 15;
      if (formData.full_name) completeness += 10;

      const { error } = await supabase
        .from('community_members')
        .update({
          display_name: formData.display_name,
          full_name: formData.full_name,
          bio: formData.bio,
          industry: formData.industry,
          business_stage: formData.business_stage,
          location: formData.location,
          skills: formData.skills,
          avatar_url: formData.avatar_url || null,
          profile_completeness: Math.min(completeness, 100),
          updated_at: new Date().toISOString(),
        })
        .eq('id', memberId);

      if (error) throw error;
      if (onSave) onSave();
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const industries = [
    'Technology', 'E-commerce', 'Consulting', 'Education', 'Healthcare',
    'Finance', 'Marketing', 'Food & Beverage', 'Fashion', 'Services',
    'Real Estate', 'Other'
  ];

  const businessStages = [
    'Ideation', 'Validation', 'MVP Development', 'Early Traction',
    'Scaling', 'Established'
  ];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#1D3A6B] mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name *
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              placeholder="How you want to be known"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              placeholder="Your full legal name"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Stage
            </label>
            <select
              value={formData.business_stage}
              onChange={(e) => setFormData(prev => ({ ...prev, business_stage: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            >
              <option value="">Select stage</option>
              {businessStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            placeholder="City, Country"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL (optional)
          </label>
          <input
            type="url"
            value={formData.avatar_url}
            onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
            placeholder="https://example.com/avatar.jpg"
          />
          {formData.avatar_url && (
            <img
              src={formData.avatar_url}
              alt="Preview"
              className="mt-2 w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills & Expertise
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              placeholder="Add a skill"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-[#1D3A6B] text-white rounded-lg hover:bg-[#152A4F] transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1D3A6B] rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !formData.display_name}
          className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditProfileForm;

