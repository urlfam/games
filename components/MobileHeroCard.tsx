'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/games';
import cloudinaryLoader from '@/lib/cloudinaryLoader';

interface MobileHeroCardProps {
  game: Game;
}

export default function MobileHeroCard({ game }: MobileHeroCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasStarted]);

  return (
    <div ref={containerRef} className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg group bg-slate-900">
      <Link href={`/game/${game.slug}`} className="block w-full h-full relative">
        
        {/* Helper for loading state / background */}
        <div className="absolute inset-0 bg-slate-800 animate-pulse z-0" />

        {/* Video Layer - Only mounts if video_url exists */}
        {game.video_url && (
             <video
                ref={videoRef}
                src={`/previews/${game.slug}.mp4`}
                poster={game.image_url}
                muted
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
             />
        )}

        {/* Static Image Layer - Visible when not playing */}
        <Image
            loader={game.image_url?.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
            src={game.image_url}
            alt={game.title}
            fill
            className={`object-cover z-20 transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
            priority
        />

        {/* Overlay Gradients - Visible only when playing */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none z-30 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />

        {/* Content Overlay - Visible only when playing */}
        <div className={`absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-40 transition-all duration-500 ${isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow-md flex-shrink-0 relative bg-slate-800">
                <Image
                    loader={game.mobile_1x1_url?.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
                    src={game.mobile_1x1_url || game.image_url} 
                    alt={`${game.title} Icon`}
                    fill
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
