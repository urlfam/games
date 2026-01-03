'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/games';
import cloudinaryLoader from '@/lib/cloudinaryLoader';

interface TrendingSectionProps {
  games: Game[];
}

export default function TrendingSection({ games }: TrendingSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Helper component for Game Card with Video Preview
  const TrendingGameCard = ({ 
    game, 
    className, 
    priority = false, 
    sizes,
    isMain = false
  }: { 
    game: Game, 
    className?: string, 
    priority?: boolean, 
    sizes: string,
    isMain?: boolean
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
  
    const handleMouseEnter = () => {
      setIsHovered(true);
      if (game.video_url) {
        setVideoSrc(`/previews/${game.slug}.mp4`);
      }
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsVideoReady(false);
      setVideoSrc(undefined);
    };
  
    return (
      <Link 
        href={`/game/${game.slug}`}
        className={`block group/card relative overflow-hidden rounded-lg bg-slate-800 ring-0 hover:ring-2 hover:ring-purple-500 transition-all ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`relative w-full h-full overflow-hidden ${!isMain ? 'aspect-video' : ''}`}>
           {/* Loading Spinner */}
           {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-0 bg-slate-800">
                <div className="w-8 h-8 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
           )}
  
           {/* Image */}
           <Image
              loader={game.image_url.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
              src={game.image_url}
              alt={game.image_alt || game.title}
              title={game.image_title || game.title}
              fill
              sizes={sizes}
              className={`object-cover group-hover/card:scale-105 transition-transform duration-300 z-10 ${
                isVideoReady ? 'opacity-0' : 'opacity-100'
              }`}
              priority={priority}
              onLoad={() => setIsImageLoaded(true)}
              loader={cloudinaryLoader}
           />
  
           {/* Video */}
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
                e.currentTarget.style.display = 'none';
                setIsVideoReady(false);
              }}
            />
          )}
  
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none transition-opacity duration-300 opacity-0 group-hover/card:opacity-100" />
  
          {/* Title Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 z-20 pointer-events-none transition-opacity duration-300 opacity-0 group-hover/card:opacity-100 ${isMain ? 'p-3 sm:p-4' : 'p-2'}`}>
            <h3 className={`text-white font-bold drop-shadow-lg line-clamp-2 ${isMain ? 'text-base sm:text-lg md:text-xl' : 'text-xs sm:text-sm'}`}>
              {game.title}
            </h3>
          </div>
        </div>
      </Link>
    );
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      // Hide arrow if we're close to the end (within 10px)
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  if (games.length < 5) return null;

  // Chunk games into groups of 5, max 6 groups (30 games)
  const chunks: Game[][] = [];
  for (let i = 0; i < Math.min(games.length, 30); i += 5) {
    if (i + 5 <= games.length) {
      chunks.push(games.slice(i, i + 5));
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-2 px-1">
        <h2 className="text-lg sm:text-xl font-bold text-white">Trending Now</h2>
      </div>
      
      <div className="relative group -mx-1 px-1">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 pt-1 px-1" 
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {chunks.map((chunk, index) => {
            const [mainGame, ...smallGames] = chunk;
            return (
              <div 
                key={index} 
                className="flex-shrink-0 w-[85vw] sm:w-[600px] md:w-[800px] grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3"
              >
                {/* Main Game - Spans 2 cols and 2 rows */}
                <TrendingGameCard 
                  game={mainGame}
                  className="col-span-2 row-span-2 h-full"
                  priority={index === 0}
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 600px, 400px"
                  isMain={true}
                />

                {/* Small Games */}
                {smallGames.map((game) => (
                  <TrendingGameCard
                    key={game.id}
                    game={game}
                    className="col-span-1"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 300px, 200px"
                  />
                ))}
              </div>
            );
          })}
        </div>
        
        {/* Scroll Arrow Right */}
        {showRightArrow && (
          <button 
            onClick={scrollRight}
            className="hidden group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 bg-slate-900/90 hover:bg-slate-800 text-white p-3 rounded-full shadow-lg z-10 items-center justify-center"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
