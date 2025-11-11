'use client';

import { GAMES_DATA } from '@/lib/constants';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CategorySidebar from '@/components/CategorySidebar';

export default function PlayPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category')?.toLowerCase() || 'all';

  const filteredGames =
    categoryParam === 'all'
      ? GAMES_DATA
      : GAMES_DATA.filter(
          (game) => game.category.toLowerCase() === categoryParam,
        );

  const featuredGame =
    filteredGames.length > 0
      ? filteredGames.reduce((prev, current) =>
          prev.popularity > current.popularity ? prev : current,
        )
      : GAMES_DATA[0];

  const trendingGames = [...filteredGames]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-900">
      <CategorySidebar />

      <main className="pl-16 transition-all duration-300">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center h-full gap-8">
            <div className="w-1/2 max-w-xl">
              <span className="inline-block px-3 py-1 bg-purple-500 rounded-full text-white text-sm font-medium mb-4">
                Featured Game
              </span>
              <h1 className="text-5xl font-bold text-white mb-4">
                {featuredGame.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                {featuredGame.description}
              </p>
              <Link href={`/play/${featuredGame.slug}`}>
                <button className="px-8 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors">
                  Play Now →
                </button>
              </Link>
            </div>

            <div className="hidden md:block w-1/2 h-full rounded-lg overflow-hidden">
              <img
                src={featuredGame.thumbnail}
                alt={featuredGame.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* Trending Games */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              🔥 Trending Games
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded mb-2">
                      {game.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {game.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {game.description}
                    </p>
                    <Link href={`/play/${game.slug}`}>
                      <button className="w-full py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors">
                        Play
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Games */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">All Games</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded mb-2">
                      {game.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {game.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {game.description}
                    </p>
                    <Link href={`/play/${game.slug}`}>
                      <button className="w-full py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors">
                        Play
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
