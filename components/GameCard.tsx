'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Game, MinimalGame } from '@/lib/games';
import { stripHtml } from '@/lib/utils';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import { isCloudinaryImage } from '@/lib/imageUtils';

interface GameCardProps {
  game: Game | MinimalGame;
  priority?: boolean;
  className?: string;
}

export default function GameCard({
  game,
  priority = false,
  className = '',
}: GameCardProps) {
  const router = useRouter(); // Initialize router
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Prefetch page on hover for faster navigation
    router.prefetch(`/game/${game.slug}`);

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
      className={`block group/card relative bg-slate-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all shadow-lg ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800 h-full">
        {/* Static Image - Always visible, smooth fade-in on load */}
        <Image
          loader={
            isCloudinaryImage(game.image_url)
              ? cloudinaryLoader
              : undefined
          }
          src={game.image_url}
          alt={game.image_alt || game.title}
          fill
          className={`object-cover transition-opacity duration-200 z-10 ${
            isVideoReady ? 'opacity-0' : isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
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
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 pointer-events-none transition-opacity duration-300 opacity-0 group-hover/card:opacity-100">
          <h3 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-md">
            {game.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
