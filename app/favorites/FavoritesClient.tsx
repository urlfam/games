'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Game, MinimalGame } from '@/lib/games';
import { Heart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import GameCard from '@/components/GameCard';
import MobileHeroCard from '@/components/MobileHeroCard';
import MobileGridItem from '@/components/MobileGridItem';

interface FavoritesClientProps {
  games: Game[];
  minimizedGames: MinimalGame[];
}

function FavoritesContent({ games, minimizedGames }: FavoritesClientProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  // Pagination Logic
  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 60;

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

  // Filter minimized games by favorites
  const favoriteMinimizedGames = minimizedGames.filter((g) =>
    favorites.includes(g.slug || ''),
  );

  if (favoriteMinimizedGames.length === 0) {
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
          href="/"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          Browse Games
        </Link>
      </div>
    );
  }

  // Calculate slice
  const totalGames = favoriteMinimizedGames.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGames = favoriteMinimizedGames.slice(startIndex, endIndex);

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-3">
        {paginatedGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Mobile View (Custom Layout: 6 Hero + Rest 1x1) */}
      <div className="md:hidden space-y-6">
        {/* First 6 games as Hero Units */}
        <div className="space-y-6">
          {paginatedGames.slice(0, 6).map((game, index) => (
            <MobileHeroCard key={game.id} game={game} priority={index === 0} />
          ))}
        </div>

        {/* Remaining games as 1x1 Grid */}
        {paginatedGames.length > 6 && (
          <div className="grid grid-cols-3 gap-3">
            {paginatedGames.slice(6).map((game) => (
              <MobileGridItem key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>

      <Pagination
        totalItems={totalGames}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
      />
    </>
  );
}

export default function FavoritesClient({
  games,
  minimizedGames,
}: FavoritesClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      }
    >
      <FavoritesContent games={games} minimizedGames={minimizedGames} />
    </Suspense>
  );
}
