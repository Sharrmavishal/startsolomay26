import React, { useState, useEffect } from 'react';
import { User, Briefcase, MapPin, Tag, CheckCircle } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import type { MemberRole } from '../../lib/supabase';

interface MemberOnboardingProps {
  onComplete: () => void;
}

const MemberOnboarding: React.FC<MemberOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    role: 'solopreneur' as MemberRole,
    industry: '',
    businessStage: '',
    location: '',
    skills: [] as string[],
  });

  const [currentSkill, setCurrentSkill] = useState('');

  useEffect(() => {
    // Check if user already has a profile
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) return;

      const { data: member } = await supabase
        .from('community_members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (member) {
        // Profile already exists, skip onboarding
        onComplete();
      }
    } catch (err) {
      console.error('Error checking profile:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const calculateCompleteness = () => {
    let score = 0;
    if (formData.displayName) score += 15;
    if (formData.bio) score += 20;
    if (formData.role) score += 10;
    if (formData.industry) score += 15;
    if (formData.businessStage) score += 15;
    if (formData.location) score += 10;
    if (formData.skills.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error: insertError } = await supabase
        .from('community_members')
        .insert({
          user_id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || formData.displayName,
          display_name: formData.displayName,
          bio: formData.bio,
          role: formData.role,
          industry: formData.industry,
          business_stage: formData.businessStage,
          location: formData.location,
          skills: formData.skills,
          profile_completeness: calculateCompleteness(),
        });

      if (insertError) throw insertError;

      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
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

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1D3A6B] rounded-full mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1D3A6B] mb-2">
              Welcome to Start Solo Community!
            </h1>
            <p className="text-gray-600">
              Let's set up your profile to connect with fellow solopreneurs
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                placeholder="How would you like to be known?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Role *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'solopreneur')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.role === 'solopreneur'
                      ? 'border-[#1D3A6B] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Solopreneur</div>
                  <div className="text-sm text-gray-600">Building my solo business</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'mentor')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.role === 'mentor'
                      ? 'border-[#1D3A6B] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">Mentor</div>
                  <div className="text-sm text-gray-600">Helping others succeed</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              >
                <option value="">Select your industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Stage
              </label>
              <select
                value={formData.businessStage}
                onChange={(e) => handleInputChange('businessStage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              >
                <option value="">Select your stage</option>
                {businessStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.displayName || !formData.role}
                className="flex-1 bg-[#1D3A6B] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="mb-6">
          <button
            onClick={() => setStep(1)}
            className="text-[#1D3A6B] hover:underline text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1D3A6B] mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600">
            Add more details to help others connect with you
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-[#1D3A6B] rounded-full transition-all"
                  style={{ width: `${calculateCompleteness()}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {calculateCompleteness()}%
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
              placeholder="Tell us about yourself, your business, or what you're looking for..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline h-4 w-4 mr-1" />
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                placeholder="Add a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-[#1D3A6B] rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.displayName}
              className="flex-1 bg-[#1D3A6B] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberOnboarding;
