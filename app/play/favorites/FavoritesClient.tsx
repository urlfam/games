'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { stripHtml } from '@/lib/utils';
import { Game } from '@/lib/games';
import { Heart } from 'lucide-react';

interface FavoritesClientProps {
  games: Game[];
}

export default function FavoritesClient({ games }: FavoritesClientProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('game_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const favoriteGames = games.filter((g) => favorites.includes(g.slug || ''));

  if (favoriteGames.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-slate-800 p-6 rounded-full mb-6">
          <Heart className="w-12 h-12 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Click the heart icon on any game to add it to your favorites list and
          play it later.
        </p>
        <Link
          href="/play"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          Browse Games
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-0">
      {favoriteGames.map((game) => (
        <div
          key={game.id}
          className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
        >
          <div className="relative h-40 sm:h-60 overflow-hidden">
            <Image
              src={game.image_url}
              alt={game.image_alt || game.title}
              title={game.image_title || game.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
          <div className="p-3 sm:p-4">
            <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded mb-2">
              {game.category}
            </span>
            <h3 className="text-sm sm:text-lg font-bold text-white mb-2 line-clamp-1 sm:line-clamp-2">
              {game.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 hidden sm:line-clamp-3">
              {stripHtml(game.description)}
            </p>
            <Link href={`/play/${game.slug}`}>
              <button className="w-full py-1.5 sm:py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors">
                Play
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
