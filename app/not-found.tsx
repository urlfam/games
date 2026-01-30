import Link from 'next/link';
import { getTrendingGames, minimizeGame } from '@/lib/games';
import GameCard from '@/components/GameCard';
import MobileGridItem from '@/components/MobileGridItem';
import { GoHomeButton, ActionButtons } from '@/components/NotFoundActions';

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
      <div className="mb-10">
        <GoHomeButton />
      </div>

      {/* Popular games section */}
      {popularGames.length > 0 && (
        <div className="w-full max-w-4xl">
          <p className="text-center text-gray-300 text-lg mb-6">
            ...or try some of our most popular games:
          </p>
          
          {/* Desktop View */}
          <div className="hidden md:grid md:grid-cols-4 gap-3 mb-8">
            {popularGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {/* Mobile View - 1x1 Grid */}
          <div className="md:hidden grid grid-cols-3 gap-2 mb-8">
            {popularGames.map((game) => (
              <MobileGridItem key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <ActionButtons />
    </div>
  );
}
