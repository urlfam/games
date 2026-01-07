'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Play,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Share2,
  Flag,
  Maximize2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import cloudinaryLoader from '@/lib/cloudinaryLoader';

interface GamePlayerWithSplashProps {
  gameTitle: string;
  gameUrl: string;
  gameImage: string;
  gameSlug: string;
  gameCategory?: string;
  imageAlt?: string;
  imageTitle?: string;
}

export default function GamePlayerWithSplash({
  gameTitle,
  gameUrl,
  gameImage,
  gameSlug,
  gameCategory = 'Casual',
  imageAlt,
  imageTitle,
}: GamePlayerWithSplashProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const supabase = createClient();

  // Calculate rating based on likes and dislikes
  const calculateRating = () => {
    const total = likeCount + dislikeCount;
    if (total === 0) return 10.0; // Default rating
    const ratio = likeCount / total;
    // Scale from 5.0 to 10.0 based on like ratio
    return Math.max(5.0, Math.min(10.0, 5.0 + ratio * 5.0));
  };

  const rating = calculateRating().toFixed(1);

  // Detect mobile and fullscreen changes
  useEffect(() => {
    // Detect if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);

      // If exiting fullscreen on mobile, stop playing to show splash again
      if (!isCurrentlyFullscreen && isMobile) {
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange,
      );
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange,
      );
    };
  }, [isMobile]);

  // Load game stats and local preferences
  useEffect(() => {
    loadGameStats();
    loadLocalPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSlug]);

  // Load user preferences from localStorage
  const loadLocalPreferences = () => {
    if (typeof window !== 'undefined') {
      const reactions = JSON.parse(
        localStorage.getItem('game_reactions') || '{}',
      );
      const favorites = JSON.parse(
        localStorage.getItem('game_favorites') || '[]',
      );

      const reaction = reactions[gameSlug];
      if (reaction === 'like') {
        setIsLiked(true);
        setIsDisliked(false);
      } else if (reaction === 'dislike') {
        setIsLiked(false);
        setIsDisliked(true);
      } else {
        setIsLiked(false);
        setIsDisliked(false);
      }

      setIsFavorite(favorites.includes(gameSlug));
    }
  };

  const loadGameStats = async () => {
    console.log('[loadGameStats] Fetching stats for:', gameSlug);
    const { data, error } = await supabase
      .from('game_stats')
      .select('likes, dislikes')
      .eq('game_slug', gameSlug)
      .single();

    if (data) {
      console.log('[loadGameStats] Stats loaded:', data);
      setLikeCount(data.likes || 0);
      setDislikeCount(data.dislikes || 0);
    } else if (error && error.code === 'PGRST116') {
      // No stats yet, initialize
      console.log('[loadGameStats] No stats found, initializing...');
      await supabase.from('game_stats').insert({
        game_slug: gameSlug,
        game_name: gameTitle,
        likes: 0,
        dislikes: 0,
      });
      setLikeCount(0);
      setDislikeCount(0);
    } else if (error) {
      console.error('[loadGameStats] Error loading stats:', error);
    }
    setStatsLoaded(true);
  };

  const handlePlay = async () => {
    setIsLoading(true);
    setIsPlaying(true);

    // Auto fullscreen on mobile after a short delay to let iframe load
    setTimeout(async () => {
      const container = document.getElementById('game-container');
      if (container && window.innerWidth <= 768) {
        try {
          // Request fullscreen first
          if (container.requestFullscreen) {
            await container.requestFullscreen();
          } else if ((container as any).webkitRequestFullscreen) {
            await (container as any).webkitRequestFullscreen();
          } else if ((container as any).mozRequestFullScreen) {
            await (container as any).mozRequestFullScreen();
          }

          // Lock screen orientation to landscape AFTER entering fullscreen
          setTimeout(async () => {
            if (screen.orientation && (screen.orientation as any).lock) {
              try {
                await (screen.orientation as any).lock('landscape');
                console.log('Screen locked to landscape');
              } catch (e) {
                console.log('Orientation lock not supported:', e);
              }
            }
          }, 300);
        } catch (err) {
          console.log('Fullscreen request failed:', err);
        }
      }
    }, 500);
  };

  const handleFullscreen = () => {
    const container = document.getElementById('game-container');
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      }
    }
  };

  const handleLike = async () => {
    const newLikedState = !isLiked;
    const wasDisliked = isDisliked;

    // Optimistic update
    setIsLiked(newLikedState);
    if (wasDisliked) setIsDisliked(false);

    if (newLikedState) {
      setLikeCount((prev) => prev + 1);
      if (wasDisliked) setDislikeCount((prev) => Math.max(0, prev - 1));
    } else {
      setLikeCount((prev) => Math.max(0, prev - 1));
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const reactions = JSON.parse(
        localStorage.getItem('game_reactions') || '{}',
      );
      if (newLikedState) {
        reactions[gameSlug] = 'like';
      } else {
        delete reactions[gameSlug];
      }
      localStorage.setItem('game_reactions', JSON.stringify(reactions));
    }

    try {
      // Update game stats in database
      if (newLikedState) {
        if (wasDisliked) {
          console.log('[handleLike] Switching from dislike to like');
          const { error } = await supabase.rpc('update_game_reaction', {
            p_game_slug: gameSlug,
            p_old_reaction: 'dislike',
            p_new_reaction: 'like',
          });
          if (error) console.error('[handleLike] RPC error:', error);
        } else {
          console.log('[handleLike] Incrementing like');
          const { error } = await supabase.rpc('increment_like', {
            p_game_slug: gameSlug,
          });
          if (error) console.error('[handleLike] RPC error:', error);
        }
      } else {
        console.log('[handleLike] Decrementing like');
        const { error } = await supabase.rpc('decrement_like', {
          p_game_slug: gameSlug,
        });
        if (error) console.error('[handleLike] RPC error:', error);
      }

      console.log('[handleLike] Database updated successfully');
      // Ne PAS recharger les stats ici car on a déjà fait la mise à jour optimiste
      // Les stats seront rechargées au prochain refresh de la page
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update on error
      setIsLiked(!newLikedState);
      if (wasDisliked) setIsDisliked(true);
      // Recharger les stats depuis la DB en cas d'erreur
      await loadGameStats();
    }
  };

  const handleDislike = async () => {
    const newDislikedState = !isDisliked;
    const wasLiked = isLiked;

    // Optimistic update
    setIsDisliked(newDislikedState);
    if (wasLiked) setIsLiked(false);

    if (newDislikedState) {
      setDislikeCount((prev) => prev + 1);
      if (wasLiked) setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      setDislikeCount((prev) => Math.max(0, prev - 1));
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const reactions = JSON.parse(
        localStorage.getItem('game_reactions') || '{}',
      );
      if (newDislikedState) {
        reactions[gameSlug] = 'dislike';
      } else {
        delete reactions[gameSlug];
      }
      localStorage.setItem('game_reactions', JSON.stringify(reactions));
    }

    try {
      // Update game stats in database
      if (newDislikedState) {
        if (wasLiked) {
          await supabase.rpc('update_game_reaction', {
            p_game_slug: gameSlug,
            p_old_reaction: 'like',
            p_new_reaction: 'dislike',
          });
        } else {
          await supabase.rpc('increment_dislike', { p_game_slug: gameSlug });
        }
      } else {
        await supabase.rpc('decrement_dislike', { p_game_slug: gameSlug });
      }

      // Ne PAS recharger les stats ici car on a déjà fait la mise à jour optimiste
      // Les stats seront rechargées au prochain refresh de la page
    } catch (error) {
      console.error('Error updating dislike:', error);
      // Revert optimistic update on error
      setIsDisliked(!newDislikedState);
      if (wasLiked) setIsLiked(true);
      // Recharger les stats depuis la DB en cas d'erreur
      await loadGameStats();
    }
  };

  const handleFavorite = async () => {
    const newFavoriteState = !isFavorite;

    // Optimistic update
    setIsFavorite(newFavoriteState);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(
        localStorage.getItem('game_favorites') || '[]',
      );
      if (newFavoriteState) {
        if (!favorites.includes(gameSlug)) {
          favorites.push(gameSlug);
        }
      } else {
        const index = favorites.indexOf(gameSlug);
        if (index > -1) {
          favorites.splice(index, 1);
        }
      }
      localStorage.setItem('game_favorites', JSON.stringify(favorites));
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `Play ${gameTitle} on Puzzio.io`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out ${gameTitle} - Play it now for free!`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('🔗 Link copied to clipboard!');
      } catch (error) {
        // Manual fallback
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('🔗 Link copied to clipboard!');
      }
    }
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  return (
    <>
      <div
        id="game-container"
        className="relative w-full overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800"
        style={{ minHeight: '70vh' }}
      >
        {!isPlaying ? (
          isMobile ? (
            // MOBILE-ONLY Splash Screen (optimized & compact)
            <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-purple-950 via-slate-900 to-black z-10">
              {/* Large Game Image - Perfectly fitted */}
              <div className="relative flex items-center justify-center overflow-hidden pt-4 pb-2">
                {/* Background blur */}
                <div className="absolute inset-0 opacity-30 blur-2xl">
                  <Image
                    loader={
                      gameImage.includes('res.cloudinary.com')
                        ? cloudinaryLoader
                        : undefined
                    }
                    src={gameImage}
                    alt={imageAlt || gameTitle}
                    title={imageTitle || gameTitle}
                    fill
                    className="object-cover scale-110"
                    priority
                  />
                </div>

                {/* Main Game Image - Compact, no empty spaces */}
                <div className="relative z-10 w-full max-w-[300px] aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-800">
                  {/* Loading Spinner */}
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-0">
                      <div className="w-8 h-8 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <Image
                    loader={
                      gameImage.includes('res.cloudinary.com')
                        ? cloudinaryLoader
                        : undefined
                    }
                    src={gameImage}
                    alt={imageAlt || gameTitle}
                    title={imageTitle || gameTitle}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      !isImageLoaded ? 'opacity-0' : 'opacity-100'
                    }`}
                    priority
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </div>
              </div>

              {/* Bottom Section - Compact */}
              <div className="relative z-10 px-5 pb-6 pt-3 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  {/* Game Title */}
                  <h1 className="text-2xl font-bold text-white text-center leading-tight">
                    {gameTitle}
                  </h1>

                  {/* Rating & Category - Dynamic & Real */}
                  <div className="flex items-center justify-center gap-4 text-white/90">
                    <div className="flex items-center gap-1.5 bg-yellow-500/20 px-2.5 py-1 rounded-full">
                      <span className="text-lg">⭐</span>
                      <span className="text-sm font-bold text-yellow-400">
                        {rating}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-purple-500/20 px-2.5 py-1 rounded-full">
                      <span className="text-sm">🎮</span>
                      <span className="text-sm font-semibold text-purple-300">
                        {gameCategory}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Play Now Button - Compact */}
                <button
                  onClick={handlePlay}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-98 text-white font-bold text-lg rounded-full shadow-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>Play Now</span>
                </button>

                {/* Action Buttons Row - Compact & in frame */}
                <div className="flex items-center justify-center gap-7">
                  {/* Like */}
                  <button
                    onClick={handleLike}
                    className="flex flex-col items-center gap-1 transition-transform active:scale-95"
                  >
                    <ThumbsUp
                      className={`w-6 h-6 transition-all ${
                        isLiked
                          ? 'fill-purple-500 text-purple-500 scale-110'
                          : 'text-white/80 hover:text-white'
                      }`}
                    />
                    <span className="text-white/90 text-[10px] font-bold">
                      {likeCount}
                    </span>
                  </button>

                  {/* Dislike */}
                  <button
                    onClick={handleDislike}
                    className="flex flex-col items-center gap-1 transition-transform active:scale-95"
                  >
                    <ThumbsDown
                      className={`w-6 h-6 transition-all ${
                        isDisliked
                          ? 'fill-purple-500 text-purple-500 scale-110'
                          : 'text-white/80 hover:text-white'
                      }`}
                    />
                    <span className="text-white/90 text-[10px] font-bold">
                      {dislikeCount}
                    </span>
                  </button>

                  {/* Favorite */}
                  <button
                    onClick={handleFavorite}
                    className="flex flex-col items-center gap-1 transition-transform active:scale-95"
                  >
                    <Heart
                      className={`w-6 h-6 transition-all ${
                        isFavorite
                          ? 'fill-red-500 text-red-500 scale-110'
                          : 'text-white/80 hover:text-white'
                      }`}
                    />
                    <span className="text-white/90 text-[10px] font-medium">
                      Save
                    </span>
                  </button>

                  {/* Report */}
                  <button
                    onClick={handleReport}
                    className="flex flex-col items-center gap-1 transition-transform active:scale-95"
                  >
                    <Flag className="w-6 h-6 text-white/80 hover:text-white transition-colors" />
                    <span className="text-white/90 text-[10px] font-medium">
                      Report
                    </span>
                  </button>

                  {/* Share */}
                  <button
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 transition-transform active:scale-95"
                  >
                    <Share2 className="w-6 h-6 text-white/80 hover:text-white transition-colors" />
                    <span className="text-white/90 text-[10px] font-medium">
                      Share
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // DESKTOP Splash Screen (original)
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/90 via-slate-900/95 to-black/95 backdrop-blur-sm z-10">
              {/* Game Image Background */}
              <div className="absolute inset-0 opacity-20">
                <Image
                  loader={
                    gameImage.includes('res.cloudinary.com')
                      ? cloudinaryLoader
                      : undefined
                  }
                  src={gameImage}
                  alt={imageAlt || gameTitle}
                  title={imageTitle || gameTitle}
                  fill
                  className="object-cover blur-xl"
                  priority
                />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-8 p-8 w-full max-w-4xl">
                {/* Game Thumbnail */}
                <div className="relative w-96 aspect-video rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-500/50 transition-all bg-slate-800">
                  {/* Loading Spinner */}
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-0">
                      <div className="w-10 h-10 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <Image
                    loader={
                      gameImage.includes('res.cloudinary.com')
                        ? cloudinaryLoader
                        : undefined
                    }
                    src={gameImage}
                    alt={imageAlt || gameTitle}
                    title={imageTitle || gameTitle}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      !isImageLoaded ? 'opacity-0' : 'opacity-100'
                    }`}
                    priority
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </div>

                {/* Game Title - Extended width */}
                <h2 className="text-4xl lg:text-5xl font-bold text-white text-center drop-shadow-2xl whitespace-nowrap">
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
                    Powered by{' '}
                    <span className="text-purple-400 font-semibold">
                      Puzzio.io
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )
        ) : (
          // Game Iframe with Custom Toolbar
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white text-xl font-semibold">
                    Loading {gameTitle}...
                  </p>
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
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-purple-500/50 bg-slate-800">
              <Image
                loader={
                  gameImage.includes('res.cloudinary.com')
                    ? cloudinaryLoader
                    : undefined
                }
                src={gameImage}
                alt={imageAlt || gameTitle}
                title={imageTitle || gameTitle}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            <h3 className="text-white font-semibold text-lg truncate">
              {gameTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isLiked
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title="Like"
            >
              <ThumbsUp className="w-5 h-5" />
              {statsLoaded && (
                <span className="text-sm font-medium">{likeCount}</span>
              )}
            </button>

            {/* Dislike Button */}
            <button
              onClick={handleDislike}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isDisliked
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title="Dislike"
            >
              <ThumbsDown className="w-5 h-5" />
              {statsLoaded && (
                <span className="text-sm font-medium">{dislikeCount}</span>
              )}
            </button>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isFavorite
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title="Add to favorites"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
              />
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

      {/* Report Modal/Sidebar */}
      {showReportModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="bg-slate-900 rounded-2xl w-full max-w-md p-6 border border-purple-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    What issue did you find in
                  </h3>
                  <p className="text-purple-400 font-semibold">{gameTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Report Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const issue = formData.get('issue');
                const email = formData.get('email');
                const description = formData.get('description');

                console.log('Report submitted:', {
                  gameSlug,
                  gameTitle,
                  issue,
                  email,
                  description,
                });
                alert(
                  `Thank you for reporting! We'll look into this issue with ${gameTitle}.`,
                );
                setShowReportModal(false);
              }}
            >
              {/* Issue Type Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What issue did you find?
                </label>
                <select
                  name="issue"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select an issue...</option>
                  <option value="not-loading">Game not loading</option>
                  <option value="broken">Game is broken/buggy</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="wrong-info">Wrong information</option>
                  <option value="performance">Performance issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Email (Optional) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe the bug...
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Please provide details about the issue you encountered..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
              >
                Send Report
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
