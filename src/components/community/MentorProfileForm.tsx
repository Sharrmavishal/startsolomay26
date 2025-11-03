import React, { useState, useEffect } from 'react';
import { Award, GraduationCap, Trophy, Plus, X, Save, Edit } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface Achievement {
  title: string;
  description: string;
  year: number;
  url?: string;
}

interface Education {
  degree: string;
  institution: string;
  year: number;
  field?: string;
}

interface AwardItem {
  name: string;
  organization: string;
  year: number;
  description?: string;
}

interface MentorProfileFormProps {
  mentorId: string;
  onSave?: () => void;
}

const MentorProfileForm: React.FC<MentorProfileFormProps> = ({ mentorId, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);

  useEffect(() => {
    loadProfile();
  }, [mentorId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_members')
        .select('mentor_achievements, mentor_education, mentor_awards')
        .eq('id', mentorId)
        .single();

      if (error) throw error;

      setAchievements(data.mentor_achievements || []);
      setEducation(data.mentor_education || []);
      setAwards(data.mentor_awards || []);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('community_members')
        .update({
          mentor_achievements: achievements,
          mentor_education: education,
          mentor_awards: awards,
        })
        .eq('id', mentorId);

      if (error) throw error;
      if (onSave) onSave();
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addAchievement = () => {
    setAchievements([...achievements, { title: '', description: '', year: new Date().getFullYear() }]);
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: any) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    setAchievements(updated);
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: new Date().getFullYear() }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addAward = () => {
    setAwards([...awards, { name: '', organization: '', year: new Date().getFullYear() }]);
  };

  const updateAward = (index: number, field: keyof AwardItem, value: any) => {
    const updated = [...awards];
    updated[index] = { ...updated[index], [field]: value };
    setAwards(updated);
  };

  const removeAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1D3A6B] flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </h3>
          <button
            onClick={addAchievement}
            className="flex items-center gap-1 text-sm text-[#1D3A6B] hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={achievement.title}
                  onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={achievement.year}
                  onChange={(e) => updateAchievement(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="Description (optional)"
                value={achievement.description}
                onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent mb-3"
              />
              <input
                type="url"
                placeholder="URL (optional)"
                value={achievement.url || ''}
                onChange={(e) => updateAchievement(index, 'url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent mb-3"
              />
              <button
                onClick={() => removeAchievement(index)}
                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No achievements added yet</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1D3A6B] flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </h3>
          <button
            onClick={addEducation}
            className="flex items-center gap-1 text-sm text-[#1D3A6B] hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Degree (e.g., MBA, B.Tech)"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Field of study (optional)"
                  value={edu.field || ''}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
              <button
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
          ))}
          {education.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No education added yet</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1D3A6B] flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Awards & Recognition
          </h3>
          <button
            onClick={addAward}
            className="flex items-center gap-1 text-sm text-[#1D3A6B] hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        <div className="space-y-3">
          {awards.map((award, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Award name"
                  value={award.name}
                  onChange={(e) => updateAward(index, 'name', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={award.organization}
                  onChange={(e) => updateAward(index, 'organization', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="number"
                  placeholder="Year"
                  value={award.year}
                  onChange={(e) => updateAward(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={award.description || ''}
                  onChange={(e) => updateAward(index, 'description', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
              </div>
              <button
                onClick={() => removeAward(index)}
                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Remove
              </button>
            </div>
          ))}
          {awards.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No awards added yet</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

export default MentorProfileForm;

