import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Bookmark, Eye, Clock, User, Hash } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import type { CommunityPost, PostCategory } from '../../lib/supabase';

interface ForumHomeProps {
  currentMemberId?: string;
  vettingStatus?: string;
}

const ForumHome: React.FC<ForumHomeProps> = ({ currentMemberId, vettingStatus }) => {
  const [posts, setPosts] = useState<(CommunityPost & { author_name?: string; author_avatar?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories: { value: PostCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All Posts', icon: <MessageSquare className="h-4 w-4" /> },
    { value: 'getting-started', label: 'Getting Started', icon: <Hash className="h-4 w-4" /> },
    { value: 'business-strategy', label: 'Business Strategy', icon: <Hash className="h-4 w-4" /> },
    { value: 'marketing', label: 'Marketing', icon: <Hash className="h-4 w-4" /> },
    { value: 'funding', label: 'Funding', icon: <Hash className="h-4 w-4" /> },
    { value: 'success-stories', label: 'Success Stories', icon: <Hash className="h-4 w-4" /> },
    { value: 'q-and-a', label: 'Q&A', icon: <Hash className="h-4 w-4" /> },
    { value: 'general', label: 'General', icon: <Hash className="h-4 w-4" /> },
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          author:community_members!community_posts_author_id_fkey(display_name, full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to include author info
      const postsWithAuthor = (data || []).map((post: any) => ({
        ...post,
        author_name: post.author?.display_name || post.author?.full_name || 'Anonymous',
        author_avatar: post.author?.avatar_url || null,
      }));

      setPosts(postsWithAuthor);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Post Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1D3A6B]">Community Discussions</h2>
        {vettingStatus === 'vetted' ? (
          <button
            onClick={() => navigate('/community/forum/create')}
            className="bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            New Post
          </button>
        ) : vettingStatus === 'approved' ? (
          <div className="px-4 py-2 text-sm text-gray-500 bg-blue-50 rounded-lg cursor-not-allowed">
            View-only access (vetted members can post)
          </div>
        ) : (
          <div className="px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
            Vetting required to create posts
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-[#1D3A6B] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
          />
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Be the first to start a discussion!'}
          </p>
          {!searchQuery && vettingStatus === 'vetted' && (
            <button
              onClick={() => navigate('/community/forum/create')}
              className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
            >
              Create First Post
            </button>
          )}
          {!searchQuery && vettingStatus === 'approved' && (
            <p className="text-sm text-blue-600">You have view-only access. Contact an admin to be upgraded to vetted status for full access.</p>
          )}
          {!searchQuery && vettingStatus !== 'vetted' && vettingStatus !== 'approved' && (
            <p className="text-sm text-gray-500">You need to be vetted to create posts.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/community/forum/${post.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PostCardProps {
  post: CommunityPost & { author_name?: string; author_avatar?: string };
  onClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {post.author_avatar ? (
            <img
              src={post.author_avatar}
              alt={post.author_name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1D3A6B] flex items-center justify-center text-white font-semibold flex-shrink-0">
              {post.author_name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">{post.author_name || 'Anonymous'}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>
        {post.is_pinned && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium flex-shrink-0">
            Pinned
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-[#1D3A6B] mb-2">{post.title}</h3>

      <p className="text-gray-700 mb-4 line-clamp-2">
        {post.content}
      </p>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          {post.reply_count || 0} replies
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          {post.upvotes || 0} upvotes
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {post.views || 0} views
        </div>
        {post.best_answer_id && (
          <div className="flex items-center gap-1 text-green-600">
            <span className="h-4 w-4">✓</span>
            Answered
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumHome;
