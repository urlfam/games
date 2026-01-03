'use client';

import { Game } from '@/lib/games';
import GameCard from '@/components/GameCard';

interface RecommendedGamesSidebarProps {
  games: Game[];
}

export default function RecommendedGamesSidebar({
  games,
}: RecommendedGamesSidebarProps) {
  if (!games || games.length === 0) {
    return null;
  }

  return (
    <aside className="block w-full lg:w-[340px] flex-shrink-0">
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

        {/* Game grid */}
        <div className="bg-slate-800 rounded-lg p-2">
          <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50 p-1">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
