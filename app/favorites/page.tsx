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
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>
        <FavoritesClient games={games} />
      </div>
    </div>
  );
}
