'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Send, MessageSquare } from 'lucide-react';

// Type definitions
interface Comment {
  id: string;
  author: string;
  text: string;
  rating: number;
  likes: number;
  created_at: string;
}

// Mock comments (remove when connecting to Supabase)
const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Alice',
    text: 'Super jeu! Graphismes magnifiques et gameplay addictif. Je recommande vivement!',
    rating: 5,
    likes: 24,
    created_at: '2025-11-08T10:30:00',
  },
  {
    id: '2',
    author: 'Bob',
    text: 'Pas mal mais un peu difficile au début. Après quelques essais ça devient fun.',
    rating: 4,
    likes: 12,
    created_at: '2025-11-07T15:20:00',
  },
  {
    id: '3',
    author: 'Charlie',
    text: 'Excellent! Mon nouveau jeu préféré. Les niveaux sont bien pensés.',
    rating: 5,
    likes: 18,
    created_at: '2025-11-06T09:45:00',
  },
];

interface GameCommentsProps {
  gameId: string;
}

export default function GameComments({ gameId }: GameCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Format date (English)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Less than 1h ago';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Submit comment (mock - replace with Supabase later)
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create mock comment
    const mockNewComment: Comment = {
      id: Date.now().toString(),
      author,
      text: newComment,
      rating: newRating,
      likes: 0,
      created_at: new Date().toISOString(),
    };

    setComments([mockNewComment, ...comments]);
    setNewComment('');
    setAuthor('');
    setNewRating(5);
    setLoading(false);
  };

  // Like comment (mock - replace with Supabase later)
  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c,
      ),
    );
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 space-y-6 mb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare size={24} />
          Comments & Reviews ({comments.length})
        </h2>

        {/* Sort buttons */}
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1 rounded transition-colors ${
              sortBy === 'recent'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-gray-400 hover:text-white'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1 rounded transition-colors ${
              sortBy === 'popular'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-gray-400 hover:text-white'
            }`}
          >
            Popular
          </button>
        </div>
      </div>

      {/* Comment form */}
      <form
        onSubmit={handleSubmitComment}
        className="bg-slate-700 rounded-lg p-4 space-y-3"
      >
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full bg-slate-600 text-white rounded px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <textarea
          placeholder="Share your thoughts about this game..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full bg-slate-600 text-white rounded px-3 py-2 placeholder-gray-400 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          maxLength={500}
        />

        <div className="flex justify-between items-center">
          {/* Rating stars */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setNewRating(i)}
                className={`transition-transform hover:scale-110 ${
                  i <= newRating ? 'text-yellow-400' : 'text-gray-600'
                }`}
              >
                <Star
                  size={22}
                  fill={i <= newRating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-5 py-2 rounded flex gap-2 items-center transition-colors"
          >
            <Send size={18} /> {loading ? 'Sending...' : 'Post'}
          </button>
        </div>

        <p className="text-xs text-gray-400">
          {newComment.length}/500 characters
        </p>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No comments yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Be the first to share your review!
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-700 rounded-lg p-4 space-y-3 hover:bg-slate-650 transition-colors"
            >
              {/* Author and rating */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">{comment.author}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < comment.rating
                            ? 'text-yellow-400'
                            : 'text-gray-600'
                        }
                        fill={i < comment.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-gray-400 text-sm">
                  {formatDate(comment.created_at)}
                </span>
              </div>

              {/* Comment text */}
              <p className="text-gray-300 leading-relaxed">{comment.text}</p>

              {/* Like button */}
              <button
                onClick={() => handleLikeComment(comment.id)}
                className="flex gap-2 items-center text-gray-400 hover:text-purple-400 transition-colors group"
              >
                <ThumbsUp
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-medium">{comment.likes}</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Info footer */}
      <div className="border-t border-slate-600 pt-4">
        <p className="text-xs text-gray-400 text-center">
          ℹ️ Comments are moderated before publication
        </p>
      </div>
    </div>
  );
}
