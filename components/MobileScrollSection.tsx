'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game, MinimalGame } from '@/lib/games';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import { isCloudinaryImage } from '@/lib/imageUtils';
import { ChevronRight } from 'lucide-react';

interface MobileScrollSectionProps {
  title: string;
  games: (Game | MinimalGame)[];
  viewMoreLink: string;
  useVerticalCards?: boolean;
}

function MobileScrollItem({ game, useVerticalCards }: { game: Game | MinimalGame, useVerticalCards: boolean }) {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <Link 
            href={`/game/${game.slug}`}
            className={`flex-shrink-0 snap-start relative group rounded-xl overflow-hidden bg-slate-800 shadow-md ${
                useVerticalCards ? 'w-[140px] aspect-[2/3]' : 'w-[100px] flex flex-col gap-2 bg-transparent shadow-none !overflow-visible'
            }`}
        >
            {useVerticalCards ? (
                // Vertical Card (New Games Style)
                <>
                    {/* Spinner */}
                    {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-0">
                            <div className="w-5 h-5 border-2 border-slate-600 border-t-purple-400 rounded-full animate-spin"></div>
                        </div>
                    )}
                    <Image
                        loader={isCloudinaryImage(game.mobile_image_url) ? cloudinaryLoader : undefined}
                        src={game.mobile_image_url || game.image_url} 
                        alt={game.title}
                        fill
                        sizes="160px"
                        onLoad={() => setIsLoaded(true)}
                        className={`object-cover transition-transform duration-300 group-hover:scale-110 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
                    />
                    {/* Dark gradient overlay at bottom for legibility if we were to put text, but screenshot shows full image card often having text embedded or clean */}
                </>
            ) : (
                // Square 1x1 Card (Other Sections Style)
                <>
                    <div className="aspect-square relative rounded-xl overflow-hidden w-full bg-slate-800 shadow-md">
                        {/* Spinner */}
                        {!isLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-0">
                                <div className="w-5 h-5 border-2 border-slate-600 border-t-purple-400 rounded-full animate-spin"></div>
                            </div>
                        )}
                        <Image
                            loader={isCloudinaryImage(game.mobile_1x1_url) ? cloudinaryLoader : undefined}
                            src={game.mobile_1x1_url || game.image_url} 
                            alt={game.title}
                            fill
                            sizes="120px"
                            onLoad={() => setIsLoaded(true)}
                            className={`object-cover transition-transform duration-300 group-hover:scale-110 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
                        />
                    </div>
                    <span className="text-gray-200 text-xs font-medium text-center line-clamp-1 w-full block">
                        {game.title}
                    </span>
                </>
            )}
        </Link>
    );
}

export default function MobileScrollSection({ 
    title, 
    games, 
    viewMoreLink,
    useVerticalCards = false
  }: MobileScrollSectionProps) {
  
  if (!games || games.length === 0) return null;

  return (
    <section className="mb-4 md:hidden">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
            {/* Adding sparkle icon logic only if title is "New games" to match screenshot */}
            {title === "New Games" && <span className="text-yellow-400">✨</span>}
            {title}
        </h2>
        <Link 
          href={viewMoreLink}
          className="text-gray-400 text-sm font-medium flex items-center hover:text-white transition-colors"
        >
          View more
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-2 -mx-2 px-2 scrollbar-hide snap-x">
        {games.map((game) => (
            <MobileScrollItem key={game.id} game={game} useVerticalCards={!!useVerticalCards} />
        ))}
        
        {/* "View More" Card at the end of scroll */}
        <Link 
            href={viewMoreLink}
            className={`flex-shrink-0 snap-start flex items-center justify-center bg-slate-800 rounded-xl border-2 border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white transition-colors ${
                useVerticalCards ? 'w-[140px] aspect-[2/3]' : 'w-[100px] aspect-sqaure h-[100px]' // Fix h for square view more
            }`}
        >
             <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-slate-700 rounded-full">
                    <ChevronRight size={20} />
                </div>
                <span className="text-xs font-medium">View all</span>
            </div>
        </Link>
      </div>
    </section>
  );
}
