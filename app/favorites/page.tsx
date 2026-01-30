import { getAllGames, minimizeGame } from '@/lib/games';
import FavoritesClient from './FavoritesClient';
import { Metadata } from 'next';

export const revalidate = 0; // Ensure this page is always fresh

export const metadata: Metadata = {
  title: 'My Favorites | Puzzio',
  description: 'Your collection of favorite games on Puzzio.io',
};

export default async function FavoritesPage() {
  const games = await getAllGames();
  // Minimize games for client component
  const minimizedGames = games.map(minimizeGame);

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-2 sm:space-y-4">
      <section>
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 capitalize px-1">
          My Favorites
        </h1>
        <FavoritesClient games={games} minimizedGames={minimizedGames} />
      </section>
    </div>
  );
}
