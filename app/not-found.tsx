import Link from 'next/link';
import { Home, Sparkles, TrendingUp, Shuffle } from 'lucide-react';
import { getTrendingGames, minimizeGame } from '@/lib/games';
import GameCard from '@/components/GameCard';

export default async function NotFound() {
  // Get popular games for the 404 page
  let popularGames: any[] = [];
  try {
    const games = await getTrendingGames(12);
    popularGames = games.map(minimizeGame);
  } catch (e) {
    // Fallback to empty if fetch fails
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center px-4 py-8">
      {/* GAME OVER Title with glitch effect */}
      <div className="text-center mb-6 mt-8">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white relative select-none">
          <span className="relative inline-block">
            <span className="absolute -left-1 top-0 text-cyan-400 opacity-70 blur-[1px]">GAME</span>
            <span className="absolute left-1 top-0 text-pink-500 opacity-70 blur-[1px]">GAME</span>
            <span className="relative text-white">GAME</span>
          </span>
          <br />
          <span className="relative inline-block">
            <span className="absolute -left-1 top-0 text-cyan-400 opacity-70 blur-[1px]">OVER</span>
            <span className="absolute left-1 top-0 text-pink-500 opacity-70 blur-[1px]">OVER</span>
            <span className="relative text-white">OVER</span>
          </span>
        </h1>
      </div>

      {/* Error message */}
      <div className="text-center mb-8">
        <p className="text-gray-300 text-lg md:text-xl mb-1">
          Oops, you&apos;ve reached a dead end!
        </p>
        <p className="text-gray-400 text-base md:text-lg">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>

      {/* Go back home button */}
      <Link
        href="/"
        className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-colors mb-10"
      >
        <Home className="w-5 h-5" />
        Go back home
      </Link>

      {/* Popular games section */}
      {popularGames.length > 0 && (
        <div className="w-full max-w-4xl">
          <p className="text-center text-gray-300 text-lg mb-6">
            ...or try some of our most popular games:
          </p>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-3 mb-8">
            {popularGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <Link
          href="/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full border border-slate-600 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          New games
        </Link>
        <Link
          href="/trending"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full border border-slate-600 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Trending games
        </Link>
        <Link
          href="/?random=1"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full border border-slate-600 transition-colors"
        >
          <Shuffle className="w-4 h-4" />
          Random game
        </Link>
      </div>
    </div>
  );
}
