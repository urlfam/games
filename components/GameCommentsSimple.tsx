'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, Send, User as UserIcon } from 'lucide-react';

interface Comment {
  id: string;
  username: string;
  content: string;
  rating: number | null;
  created_at: string;
}

interface GameCommentsSimpleProps {
  gameSlug: string;
}

export default function GameCommentsSimple({
  gameSlug,
}: GameCommentsSimpleProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [newRating, setNewRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);

  const supabase = createClient();

  // Load username from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUsername = localStorage.getItem('puzzio_username') || '';
      setUsername(savedUsername);
    }
  }, []);

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [gameSlug]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('game_comments_simple')
        .select('*')
        .eq('game_slug', gameSlug)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      } else {
        setComments(data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    // Check if username is set
    if (!username.trim()) {
      setShowUsernamePrompt(true);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('game_comments_simple')
        .insert([
          {
            game_slug: gameSlug,
            username: username.trim(),
            content: newComment.trim(),
            rating: newRating > 0 ? newRating : null,
          },
        ])
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Comment posted successfully:', data);

      // Clear form
      setNewComment('');
      setNewRating(0);

      // Refresh comments
      await fetchComments();
    } catch (error: any) {
      console.error('Error posting comment:', error);
      const errorMessage = error?.message || 'Unknown error';
      alert(`Failed to post comment: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      localStorage.setItem('puzzio_username', username.trim());
      setShowUsernamePrompt(false);
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

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-white mb-6">
        Comments ({comments.length})
      </h3>

      {/* Username Prompt Modal */}
      {showUsernamePrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-purple-500/20">
            <h4 className="text-xl font-bold text-white mb-4">
              Choose a Username
            </h4>
            <p className="text-gray-400 mb-4">
              Enter a username to post your comment:
            </p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              maxLength={20}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
            />
            <div className="flex gap-3">
              <button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
              <button
                onClick={() => setShowUsernamePrompt(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Form */}
      <form
        onSubmit={handleSubmitComment}
        className="mb-8 bg-slate-800/50 rounded-xl p-6 border border-purple-500/20"
      >
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rate this game (optional)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star === newRating ? 0 : star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={
                    star <= (hoverRating || newRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-500 hover:text-gray-400'
                  }
                />
              </button>
            ))}
            {newRating > 0 && (
              <span className="ml-2 text-gray-400 self-center">
                {newRating} / 5
              </span>
            )}
          </div>
        </div>

        {/* Comment Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your comment
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this game..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <div className="text-right text-sm text-gray-400 mt-1">
            {newComment.length} / 500
          </div>
        </div>

        {/* Username Display */}
        {username && (
          <div className="mb-4 text-sm text-gray-400">
            Posting as:{' '}
            <span className="text-purple-400 font-medium">{username}</span>{' '}
            <button
              type="button"
              onClick={() => setShowUsernamePrompt(true)}
              className="text-purple-500 hover:text-purple-400 underline"
            >
              (change)
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Send size={18} />
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
          <p className="text-gray-400 text-lg">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <UserIcon size={20} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-white">
                      {comment.username}
                    </span>
                    {comment.rating && renderStars(comment.rating)}
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
