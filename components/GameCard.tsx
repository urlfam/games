'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/games';
import { stripHtml } from '@/lib/utils';

interface GameCardProps {
  game: Game;
  priority?: boolean;
  className?: string;
}

export default function GameCard({ game, priority = false, className = '' }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (game.video_url) {
      setVideoSrc(`/previews/${game.slug}.mp4`);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsVideoReady(false);
    setVideoSrc(undefined); // Unload video
  };

  return (
    <Link 
      href={`/game/${game.slug}`}
      className={`block group relative bg-slate-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all shadow-lg ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 h-full">
        {/* Loading Spinner (Visible until image loads) */}
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="w-8 h-8 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Static Image (Always present, z-index 10 to stay on top) */}
        <Image
          src={game.image_url}
          alt={game.image_alt || game.title}
          title={game.image_title || game.title}
          fill
          className={`object-cover transition-opacity duration-300 z-10 ${
            isVideoReady || !isImageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* Video Preview (Only rendered when hovered and src is set) */}
        {game.video_url && videoSrc && (
           <video
            src={videoSrc}
            poster={game.image_url}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setIsVideoReady(true)}
            className="absolute inset-0 w-full h-full object-cover z-0"
            onError={(e) => {
              if (videoSrc) {
                console.error('Video load error:', videoSrc);
              }
              e.currentTarget.style.display = 'none';
              setIsVideoReady(false);
            }}
          />
        )}
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 pointer-events-none">
          <h3 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-md">
            {game.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
