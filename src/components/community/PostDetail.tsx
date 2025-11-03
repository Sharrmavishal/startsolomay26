import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, Bookmark, MessageSquare, Eye, Clock, User, Share2, Flag } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import type { CommunityPost, Comment } from '../../lib/supabase';
import CommentSection from './CommentSection';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<CommunityPost & { author_name?: string; author_avatar?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [vettingStatus, setVettingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadPost();
    loadCurrentUser();
  }, [id]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      // Load vetting status
      const { data: member } = await supabase
        .from('community_members')
        .select('vetting_status')
        .eq('user_id', user.id)
        .maybeSingle();
      if (member) setVettingStatus(member.vetting_status);
    }
  };

  const loadPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:community_members!community_posts_author_id_fkey(display_name, full_name, avatar_url, id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transform to include author info
      const postData = {
        ...data,
        author_name: data.author?.display_name || data.author?.full_name || 'Anonymous',
        author_avatar: data.author?.avatar_url || null,
      };

      setPost(postData);

      // Views are automatically incremented via trigger when viewed
      // For now, we'll manually increment to show immediate feedback
      if (data.views !== undefined) {
        await supabase
          .from('community_posts')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);
      }

      // Check if user upvoted/bookmarked
      if (currentUserId) {
        // TODO: Check user interactions
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!post || !currentUserId) return;

    try {
      const newUpvoted = !upvoted;
      setUpvoted(newUpvoted);

      await supabase
        .from('community_posts')
        .update({
          upvotes: (post.upvotes || 0) + (newUpvoted ? 1 : -1),
        })
        .eq('id', post.id);

      // Reload post to get updated count
      loadPost();
    } catch (error) {
      console.error('Error upvoting:', error);
      setUpvoted(!upvoted); // Revert on error
    }
  };

  const handleBookmark = async () => {
    if (!post || !currentUserId) return;

    try {
      const newBookmarked = !bookmarked;
      setBookmarked(newBookmarked);

      // TODO: Implement bookmark functionality
      // Could use a separate bookmarks table or store in user preferences
    } catch (error) {
      console.error('Error bookmarking:', error);
      setBookmarked(!bookmarked);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">This post doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/community')}
            className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAuthor = currentUserId && post.author_id === currentUserId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/community')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#1D3A6B] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Community
          </button>

          {/* Post Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3 flex-1">
              {post.author_avatar ? (
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#1D3A6B] flex items-center justify-center text-white font-semibold">
                  {post.author_name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900">{post.author_name || 'Anonymous'}</div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatDate(post.created_at)}
                  {post.is_pinned && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                      Pinned
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                  upvoted
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                {post.upvotes || 0}
              </button>
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  bookmarked
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
              {!isAuthor && (
                <button className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  <Flag className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#1D3A6B] mb-4">{post.title}</h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-[#1D3A6B] rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Post Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-200 pt-4">
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
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommentSection postId={post.id} currentUserId={currentUserId} vettingStatus={vettingStatus || undefined} />
      </div>
    </div>
  );
};

export default PostDetail;
