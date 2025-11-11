'use client';

import Link from 'next/link';
import { GAMES_DATA } from '@/lib/constants';

interface RecommendedGamesSidebarProps {
  currentGameSlug: string;
  category: string;
}

export default function RecommendedGamesSidebar({
  currentGameSlug,
  category,
}: RecommendedGamesSidebarProps) {
  // Filter similar games
  // 1. Prioritize same category
  const sameCategoryGames = GAMES_DATA.filter(
    (g) => g.category === category && g.slug !== currentGameSlug,
  ).sort((a, b) => b.popularity - a.popularity);
  // 2. If not enough, add popular games from other categories
  const otherGames = GAMES_DATA.filter(
    (g) => g.category !== category && g.slug !== currentGameSlug,
  ).sort((a, b) => b.popularity - a.popularity);
  // 3. Combine: max 12 games
  const recommendedGames = [...sameCategoryGames, ...otherGames].slice(0, 12);

  if (recommendedGames.length === 0) {
    return null;
  }

  return (
    <aside className="block w-64 flex-shrink-0">
      {/* Sticky container */}
      <div className="sticky top-20 space-y-3">
        {/* Header */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🎮</span>
            Recommended Games
          </h3>
          <p className="text-xs text-gray-400 mt-1">More games</p>
        </div>

        {/* Game grid - CrazyGames style */}
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
            {recommendedGames.map((game) => (
              <Link
                key={game.id}
                href={`/play/${game.slug}`}
                className="group block bg-slate-700/50 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Popularity badge */}
                  {game.popularity >= 90 && (
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-yellow-500 text-black text-[10px] font-bold rounded">
                      ⭐ {game.popularity}%
                    </div>
                  )}
                  {/* Category badge if different */}
                  {game.category !== category && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded">
                      {game.category}
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-purple-600 px-3 py-1 rounded-full transition-opacity">
                      Play →
                    </span>
                  </div>
                </div>
                {/* Title */}
                <div className="p-2">
                  <h4 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-purple-400 transition-colors leading-tight">
                    {game.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer CTA removed as requested */}
      </div>
    </aside>
  );
}
