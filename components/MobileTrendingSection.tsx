'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/games';
import MobileHeroCard from './MobileHeroCard';
import cloudinaryLoader from '@/lib/cloudinaryLoader';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface MobileTrendingSectionProps {
  games: Game[];
}

export default function MobileTrendingSection({ games }: MobileTrendingSectionProps) {
  // Need at least 1 main game and some secondary games
  if (!games || games.length === 0) return null;

  // Split games into blocks of 7 (1 Hero + 6 Grid items)
  const chunkSize = 7;
  const gameChunks = [];
  for (let i = 0; i < games.length; i += chunkSize) {
    if (games.slice(i, i + chunkSize).length > 0) {
      gameChunks.push(games.slice(i, i + chunkSize));
    }
  }

  return (
    <section className="mb-4 md:hidden">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          Top picks for you
        </h2>
      </div>

      <div className="space-y-6">
        {gameChunks.map((chunk, index) => {
          const mainGame = chunk[0];
          const secondaryGames = chunk.slice(1);
          
          return (
            <div key={index} className="space-y-4">
              {/* Main Hero Card */}
              <MobileHeroCard game={mainGame} />

              {/* Grid of Small Cards */}
              {secondaryGames.length > 0 && (
                <div className="grid grid-cols-3 gap-3 px-1">
                  {secondaryGames.map((game) => (
                    <Link 
                      key={game.id} 
                      href={`/game/${game.slug}`}
                      className="flex flex-col gap-2 group"
                    >
                      <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-800 shadow-md">
                        <Image
                          loader={game.mobile_1x1_url?.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
                          src={game.mobile_1x1_url || game.image_url} // Fallback logic handled in rendering
                          alt={game.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-gray-200 text-xs font-medium text-center line-clamp-1">
                        {game.title}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
