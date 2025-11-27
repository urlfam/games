'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, ThumbsUp, ThumbsDown, Heart, Share2, Flag, Maximize2 } from 'lucide-react';

interface GamePlayerWithSplashProps {
  gameTitle: string;
  gameUrl: string;
  gameImage: string;
}

export default function GamePlayerWithSplash({
  gameTitle,
  gameUrl,
  gameImage,
}: GamePlayerWithSplashProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  const handleFullscreen = () => {
    const container = document.getElementById('game-container');
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
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
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isLiked ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title="Like"
            >
              <ThumbsUp className="w-5 h-5" />
            </button>

            {/* Dislike Button */}
            <button
              onClick={handleDislike}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isDisliked ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              title="Dislike"
            >
              <ThumbsDown className="w-5 h-5" />
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
