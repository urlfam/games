'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Sparkles, TrendingUp, Shuffle } from 'lucide-react';

export function GoHomeButton() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <button
      onClick={handleGoHome}
      className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-colors"
    >
      <Home className="w-5 h-5" />
      Go back home
    </button>
  );
}

export function ActionButtons() {
  const router = useRouter();

  const handleRandomGame = () => {
    router.push(`/api/random-game?t=${Date.now()}`);
  };

  return (
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
      <button
        onClick={handleRandomGame}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full border border-slate-600 transition-colors"
      >
        <Shuffle className="w-4 h-4" />
        Random game
      </button>
    </div>
  );
}
