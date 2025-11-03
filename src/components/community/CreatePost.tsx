import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Hash } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import type { PostCategory } from '../../lib/supabase';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general' as PostCategory,
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState('');

  const categories: { value: PostCategory; label: string }[] = [
    { value: 'getting-started', label: 'Getting Started' },
    { value: 'business-strategy', label: 'Business Strategy' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'funding', label: 'Funding' },
    { value: 'success-stories', label: 'Success Stories' },
    { value: 'q-and-a', label: 'Q&A' },
    { value: 'general', label: 'General' },
  ];

  const handleInputChange = (field: string, value: string | PostCategory) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }

      // Get member ID - try with more permissive query first
      const { data: member, error: memberError } = await supabase
        .from('community_members')
        .select('id, user_id, vetting_status')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error if not found

      console.log('Member lookup result:', { member, memberError, userId: user.id });

      if (memberError) {
        console.error('Member lookup error:', {
          code: memberError.code,
          message: memberError.message,
          details: memberError.details,
          hint: memberError.hint
        });
        
        throw new Error(`Profile verification failed: ${memberError.message}. Please contact support if this persists.`);
      }

      if (!member || !member.id) {
        // No profile found - redirect to community to trigger onboarding
        setError('Please complete your profile first. Redirecting...');
        setTimeout(() => navigate('/community'), 2000);
        return;
      }

      if (member.vetting_status !== 'vetted') {
        if (member.vetting_status === 'approved') {
          setError('You have view-only access. Contact an admin to be upgraded to vetted status for full access.');
        } else {
          setError('You must be vetted to create posts. Your application is pending review.');
        }
        setTimeout(() => navigate('/community'), 3000);
        return;
      }

      console.log('Member found:', member.id);

      const { data: post, error: insertError } = await supabase
        .from('community_posts')
        .insert({
          author_id: member.id,
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags: formData.tags,
          status: 'published',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Points are automatically awarded via trigger (award_points_for_post)

      navigate(`/community/forum/${post.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#1D3A6B]">Create New Post</h1>
            <button
              onClick={() => navigate('/community')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as PostCategory)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="What's your question or topic?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                required
                maxLength={200}
              />
              <p className="mt-1 text-xs text-gray-500">{formData.title.length}/200 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={12}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline h-4 w-4 mr-1" />
                Tags (optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-[#1D3A6B] rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
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
                type="button"
                onClick={() => navigate('/community')}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className="flex-1 bg-[#1D3A6B] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
