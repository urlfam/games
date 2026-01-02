import { getAllGames } from '@/lib/games';
import FavoritesClient from './FavoritesClient';
import { Metadata } from 'next';

export const revalidate = 0; // Ensure this page is always fresh

export const metadata: Metadata = {
  title: 'My Favorites | Puzzio',
  description: 'Your collection of favorite games on Puzzio.io',
};

export default async function FavoritesPage() {
  const games = await getAllGames();

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-6 capitalize px-1">My Favorites</h1>
        <FavoritesClient games={games} />
      </div>
    </div>
  );
}
