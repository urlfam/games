'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game, MinimalGame } from '@/lib/games';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import { isCloudinaryImage } from '@/lib/imageUtils';

interface MobileHeroCardProps {
  game: Game | MinimalGame;
  priority?: boolean;
}

export default function MobileHeroCard({ game, priority = false }: MobileHeroCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Card is in view (at least 60%)
            setIsPlaying(true);
            if (!hasStarted) setHasStarted(true);
            if (videoRef.current) {
                videoRef.current.play().catch(() => {
                    // Autoplay might fail (low power mode etc)
                    setIsPlaying(false);  
                });
            }
          } else {
            // Card is out of view
            setIsPlaying(false);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0; // Reset
            }
          }
        });
      },
      {
        threshold: 0.6, // Trigger when 60% of the card is visible
      }
    );

    const element = containerRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasStarted]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg group bg-slate-900">
      <Link href={`/game/${game.slug}`} className="block w-full h-full relative">
        
        {/* Loading Spinner / Background */}
        <div className="absolute inset-0 bg-slate-800 z-0 flex items-center justify-center">
          {!isImageLoaded && (
            <div className="w-8 h-8 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
          )}
        </div>

        {/* Video Layer - Only mounts if video_url exists */}
        {game.video_url && (
             <video
                ref={videoRef}
                src={hasStarted ? `/previews/${game.slug}.mp4` : undefined}
                preload="none"
                poster={game.image_url}
                muted
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
             />
        )}

        {/* Static Image Layer - Visible when not playing or if no video */}
        <Image
            loader={isCloudinaryImage(game.image_url) ? cloudinaryLoader : undefined}
            src={game.image_url}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            priority={priority}
            {...(priority ? { fetchPriority: 'high' } : {})}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
            onLoad={() => setIsImageLoaded(true)}
            className={`object-cover z-20 transition-opacity duration-500 ${isPlaying && game.video_url ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Overlay Gradients - Visible only when playing */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none z-30 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />

        {/* Content Overlay - Visible only when playing */}
        <div className={`absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-40 transition-all duration-500 ${isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow-md flex-shrink-0 relative bg-slate-800">
                <Image
                    loader={isCloudinaryImage(game.mobile_1x1_url) ? cloudinaryLoader : undefined}
                    src={game.mobile_1x1_url || game.image_url} 
                    alt={`${game.title} Icon`}
                    fill
                    sizes="48px"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col">
                <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 shadow-black drop-shadow-md">
                {game.title}
                </h3>
                <span className="text-gray-300 text-sm">
                {game.category}
                </span>
            </div>
            </div>
            <button className="bg-purple-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-purple-900/50 flex items-center gap-1 pointer-events-auto">
            Play
            </button>
        </div>
      </Link>
    </div>
  );
}
