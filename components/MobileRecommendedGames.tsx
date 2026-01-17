'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/games';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import { ChevronDown } from 'lucide-react';

interface MobileRecommendedGamesProps {
  games: Game[];
}

export default function MobileRecommendedGames({ games }: MobileRecommendedGamesProps) {
  const [visibleCount, setVisibleCount] = useState(9);
  
  if (!games || games.length === 0) return null;

  const visibleGames = games.slice(0, visibleCount);
  const hasMore = visibleCount < games.length;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, games.length));
  };

  return (
    <div className="mt-8 mb-8 lg:hidden">
      <div className="flex justify-center mb-6 animate-bounce">
        <ChevronDown className="w-8 h-8 text-gray-400" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {visibleGames.map((game) => (
          <Link 
            key={game.id} 
            href={`/game/${game.slug}`}
            className="flex flex-col gap-1 group"
          >
            <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-800 shadow-md">
              <Image
                loader={game.mobile_1x1_url?.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
                src={game.mobile_1x1_url || game.image_url} 
                alt={game.title}
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
            <span className="text-gray-300 text-[10px] leading-tight font-medium text-center line-clamp-2 px-1">
              {game.title}
            </span>
          </Link>
        ))}
      </div>

      {hasMore && (
        <button 
          onClick={handleShowMore}
          className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span>Show More Games</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
