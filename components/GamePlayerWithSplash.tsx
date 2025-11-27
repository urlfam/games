'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, ThumbsUp, ThumbsDown, Heart, Share2, Flag, Maximize2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface GamePlayerWithSplashProps {
  gameTitle: string;
  gameUrl: string;
  gameImage: string;
  gameSlug: string;
}

export default function GamePlayerWithSplash({
  gameTitle,
  gameUrl,
  gameImage,
  gameSlug,
}: GamePlayerWithSplashProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [statsLoaded, setStatsLoaded] = useState(false);
  
  const supabase = createClient();

  // Load user and game stats
  useEffect(() => {
    loadUserAndStats();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserReactions(session.user.id);
        loadUserFavorite(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSlug]);

  const loadUserAndStats = async () => {
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);

    // Load game stats
    await loadGameStats();

    // Load user reactions and favorites if logged in
    if (session?.user) {
      await loadUserReactions(session.user.id);
      await loadUserFavorite(session.user.id);
    }
    
    setStatsLoaded(true);
  };

  const loadGameStats = async () => {
    const { data, error } = await supabase
      .from('game_stats')
      .select('likes, dislikes')
      .eq('game_slug', gameSlug)
      .single();

    if (data) {
      setLikeCount(data.likes || 0);
      setDislikeCount(data.dislikes || 0);
    } else if (error && error.code === 'PGRST116') {
      // No stats yet, initialize
      await supabase
        .from('game_stats')
        .insert({ game_slug: gameSlug, game_name: gameTitle, likes: 0, dislikes: 0 });
    }
  };

  const loadUserReactions = async (userId: string) => {
    const { data } = await supabase
      .from('game_reactions')
      .select('reaction_type')
      .eq('user_id', userId)
      .eq('game_slug', gameSlug)
      .single();

    if (data) {
      setIsLiked(data.reaction_type === 'like');
      setIsDisliked(data.reaction_type === 'dislike');
    }
  };

  const loadUserFavorite = async (userId: string) => {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('game_slug', gameSlug)
      .single();

    setIsFavorite(!!data);
  };

  const handlePlay = async () => {
    setIsLoading(true);
    setIsPlaying(true);

    // Track play history if user is logged in
    if (user) {
      await supabase
        .from('play_history')
        .upsert({
          user_id: user.id,
          game_slug: gameSlug,
          game_name: gameTitle,
        }, {
          onConflict: 'user_id,game_slug'
        });
    }
  };

  const handleFullscreen = () => {
    const container = document.getElementById('game-container');
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please sign in to like games!');
      return;
    }

    const newLikedState = !isLiked;
    const wasDisliked = isDisliked;

    // Optimistic update
    setIsLiked(newLikedState);
    if (wasDisliked) setIsDisliked(false);
    
    if (newLikedState) {
      setLikeCount(prev => prev + 1);
      if (wasDisliked) setDislikeCount(prev => Math.max(0, prev - 1));
    } else {
      setLikeCount(prev => Math.max(0, prev - 1));
    }

    try {
      if (newLikedState) {
        // Add or update like
        await supabase
          .from('game_reactions')
          .upsert({
            user_id: user.id,
            game_slug: gameSlug,
            reaction_type: 'like'
          }, {
            onConflict: 'user_id,game_slug'
          });

        // Update game stats
        if (wasDisliked) {
          await supabase.rpc('update_game_reaction', {
            p_game_slug: gameSlug,
            p_old_reaction: 'dislike',
            p_new_reaction: 'like'
          });
        } else {
          await supabase.rpc('increment_like', { game_slug_param: gameSlug });
        }
      } else {
        // Remove like
        await supabase
          .from('game_reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('game_slug', gameSlug);

        await supabase.rpc('decrement_like', { game_slug_param: gameSlug });
      }

      // Reload stats to ensure consistency
      await loadGameStats();
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update on error
      setIsLiked(!newLikedState);
      if (wasDisliked) setIsDisliked(true);
      await loadGameStats();
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert('Please sign in to dislike games!');
      return;
    }

    const newDislikedState = !isDisliked;
    const wasLiked = isLiked;

    // Optimistic update
    setIsDisliked(newDislikedState);
    if (wasLiked) setIsLiked(false);
    
    if (newDislikedState) {
      setDislikeCount(prev => prev + 1);
      if (wasLiked) setLikeCount(prev => Math.max(0, prev - 1));
    } else {
      setDislikeCount(prev => Math.max(0, prev - 1));
    }

    try {
      if (newDislikedState) {
        // Add or update dislike
        await supabase
          .from('game_reactions')
          .upsert({
            user_id: user.id,
            game_slug: gameSlug,
            reaction_type: 'dislike'
          }, {
            onConflict: 'user_id,game_slug'
          });

        // Update game stats
        if (wasLiked) {
          await supabase.rpc('update_game_reaction', {
            p_game_slug: gameSlug,
            p_old_reaction: 'like',
            p_new_reaction: 'dislike'
          });
        } else {
          await supabase.rpc('increment_dislike', { game_slug_param: gameSlug });
        }
      } else {
        // Remove dislike
        await supabase
          .from('game_reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('game_slug', gameSlug);

        await supabase.rpc('decrement_dislike', { game_slug_param: gameSlug });
      }

      // Reload stats to ensure consistency
      await loadGameStats();
    } catch (error) {
      console.error('Error updating dislike:', error);
      // Revert optimistic update on error
      setIsDisliked(!newDislikedState);
      if (wasLiked) setIsLiked(true);
      await loadGameStats();
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      alert('Please sign in to favorite games!');
      return;
    }

    const newFavoriteState = !isFavorite;
    
    // Optimistic update
    setIsFavorite(newFavoriteState);

    try {
      if (newFavoriteState) {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            game_slug: gameSlug,
            game_name: gameTitle,
            game_image: gameImage
          });
      } else {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('game_slug', gameSlug);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      // Revert optimistic update on error
      setIsFavorite(!newFavoriteState);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: gameTitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleReport = () => {
    alert('Report feature coming soon!');
  };

  return (
    <>
      <div id="game-container" className="relative w-full overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800" style={{ minHeight: '70vh' }}>
        {!isPlaying ? (
        // Splash Screen
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/90 via-slate-900/95 to-black/95 backdrop-blur-sm z-10">
          {/* Game Image Background */}
          <div className="absolute inset-0 opacity-20">
            <Image
              src={gameImage}
              alt={gameTitle}
              fill
              className="object-cover blur-xl"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 p-8">
            {/* Game Thumbnail */}
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-500/50">
              <Image
                src={gameImage}
                alt={gameTitle}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Game Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-2xl">
              {gameTitle}
            </h2>

            {/* Play Button */}
            <button
              onClick={handlePlay}
              className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-2xl rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center gap-4"
            >
              <Play className="w-8 h-8 fill-current" />
              <span>Play Now</span>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10"></div>
            </button>

            {/* Puzzio.io Branding */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Powered by <span className="text-purple-400 font-semibold">Puzzio.io</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Game Iframe with Custom Toolbar
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-xl font-semibold">Loading {gameTitle}...</p>
              </div>
            </div>
          )}
          
          {/* Iframe - Full height with hiding CrazyGames bar */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <iframe
              src={gameUrl}
              className="absolute top-0 left-0 w-full border-0"
              style={{ height: 'calc(100% + 60px)' }}
              allowFullScreen
              title={gameTitle}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoading(false)}
            ></iframe>
          </div>
        </>
        )}
      </div>

      {/* Custom Toolbar - Outside and below game container */}
      {isPlaying && (
        <div className="mt-4 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Game Thumbnail */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-purple-500/50">
              <Image
                src={gameImage}
                alt={gameTitle}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            <h3 className="text-white font-semibold text-lg truncate">{gameTitle}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isLiked ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title="Like"
            >
              <ThumbsUp className="w-5 h-5" />
              {statsLoaded && <span className="text-sm font-medium">{likeCount}</span>}
            </button>

            {/* Dislike Button */}
            <button
              onClick={handleDislike}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isDisliked ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title="Dislike"
            >
              <ThumbsDown className="w-5 h-5" />
              {statsLoaded && <span className="text-sm font-medium">{dislikeCount}</span>}
            </button>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isFavorite ? 'bg-pink-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title="Add to favorites"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 bg-slate-800 text-gray-400 hover:text-white rounded-lg transition-all duration-200 hover:scale-110"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Report Button */}
            <button
              onClick={handleReport}
              className="p-2 bg-slate-800 text-gray-400 hover:text-white rounded-lg transition-all duration-200 hover:scale-110"
              title="Report a bug"
            >
              <Flag className="w-5 h-5" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={handleFullscreen}
              className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all duration-200 hover:scale-110"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
