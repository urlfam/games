'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/games';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import { ChevronDown } from 'lucide-react';
import MobileGridItem from './MobileGridItem';

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
          <MobileGridItem key={game.id} game={game} />
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
