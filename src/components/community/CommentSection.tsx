import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Flag, Edit, Trash2 } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';
import type { Comment } from '../../lib/supabase';

interface CommentSectionProps {
  postId: string;
  currentUserId?: string | null;
  vettingStatus?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUserId, vettingStatus }) => {
  const [comments, setComments] = useState<(Comment & { author_name?: string; author_avatar?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          author:community_members!community_comments_author_id_fkey(display_name, full_name, avatar_url, id)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsWithAuthor = (data || []).map((comment: any) => ({
        ...comment,
        author_name: comment.author?.display_name || comment.author?.full_name || 'Anonymous',
        author_avatar: comment.author?.avatar_url || null,
      }));

      setComments(commentsWithAuthor);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;

    try {
      setSubmitting(true);

      // Get member ID
      const { data: { user } } = await auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: member } = await supabase
        .from('community_members')
        .select('id, vetting_status')
        .eq('user_id', user.id)
        .single();

      if (!member) throw new Error('Member profile not found');
      
      if (member.vetting_status !== 'vetted') {
        if (member.vetting_status === 'approved') {
          throw new Error('You have view-only access. Contact an admin to be upgraded to vetted status for full access.');
        } else {
          throw new Error('You must be vetted to post comments. Your application is pending review.');
        }
      }

      const { error: insertError } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          author_id: member.id,
          content: newComment.trim(),
        });

      if (insertError) throw insertError;

      // Points are automatically awarded via trigger
      // Reply count is automatically updated via trigger (update_post_reply_count)

      setNewComment('');
      loadComments();
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      alert(error.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (commentId: string, currentUpvotes: number) => {
    if (!currentUserId) return;

    try {
      await supabase
        .from('community_comments')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', commentId);

      loadComments();
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1D3A6B]">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {currentUserId && vettingStatus === 'vetted' ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3A6B] focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : currentUserId && vettingStatus === 'approved' ? (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 text-center">
          <p className="text-blue-800 text-sm">You have view-only access. Contact an admin to be upgraded to vetted status for full access.</p>
        </div>
      ) : currentUserId && vettingStatus !== 'vetted' && vettingStatus !== 'approved' ? (
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6 text-center">
          <p className="text-yellow-800 text-sm">You need to be vetted to post comments. Your application is pending review.</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-600">Please sign in to leave a comment.</p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3A6B]"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isAuthor = currentUserId && comment.author_id === currentUserId;
            return (
              <div
                key={comment.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start gap-4">
                  {comment.author_avatar ? (
                    <img
                      src={comment.author_avatar}
                      alt={comment.author_name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1D3A6B] flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {comment.author_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">{comment.author_name || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{formatDate(comment.created_at)}</div>
                      </div>
                      {isAuthor && (
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpvote(comment.id, comment.upvotes || 0)}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#1D3A6B] transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {comment.upvotes || 0}
                      </button>
                      {!isAuthor && (
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors">
                          <Flag className="h-4 w-4" />
                          Report
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
