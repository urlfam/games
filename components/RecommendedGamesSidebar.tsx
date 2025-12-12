'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/games'; // Import the Game type

interface RecommendedGamesSidebarProps {
  games: Game[]; // Expect an array of games
}

export default function RecommendedGamesSidebar({
  games,
}: RecommendedGamesSidebarProps) {
  if (!games || games.length === 0) {
    return null;
  }

  return (
    <aside className="block w-full lg:w-64 flex-shrink-0">
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
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/play/${game.slug}`}
                className="group block bg-slate-700/50 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <Image
                    src={game.image_url} // Use image_url
                    alt={game.image_alt || game.title}
                    title={game.image_title || game.title}
                    fill
                    sizes="(max-width: 1280px) 50vw, 128px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
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
      </div>
    </aside>
  );
}
