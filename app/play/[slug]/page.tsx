import { notFound } from 'next/navigation';
import { getAllGames, getGameBySlug } from '@/lib/games';
import RecommendedGamesSidebar from '@/components/RecommendedGamesSidebar';
import GameComments from '@/components/GameComments';
import { Metadata } from 'next';

interface GamePageProps {
  params: { slug: string };
}

// Generate dynamic metadata for SEO - THIS WORKS PERFECTLY in real-time
export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const game = await getGameBySlug(params.slug);

  if (!game) {
    return {
      title: 'Game Not Found',
    };
  }

  return {
    title: `${game.title} - Play on Puzzio.io`,
    description: game.description,
    openGraph: {
      title: game.title,
      description: game.description,
      images: [{ url: game.image_url }],
    },
    twitter: {
      card: 'summary_large_image',
      title: game.title,
      description: game.description,
      images: [game.image_url],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameBySlug(params.slug);
  const allGames = await getAllGames();

  if (!game) {
    notFound();
  }

  const recommendedGames = allGames.filter(g => g.category === game.category && g.id !== game.id).slice(0, 10);

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {/* Main Content */}
      <div className="flex-grow">
        <div className="bg-slate-800 rounded-lg p-4 mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
          <p className="text-sm text-gray-400">Category: <span className="font-semibold text-purple-400">{game.category}</span></p>
        </div>

        {/* Game Iframe */}
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe
            src={game.iframe_url}
            className="w-full h-full rounded-lg"
            allowFullScreen
            title={game.title}
          ></iframe>
        </div>

        {/* Game Description */}
        <div className="bg-slate-800 rounded-lg p-4 mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">Description</h2>
          <p className="text-gray-300">{game.description}</p>
        </div>

        {/* Comments Section */}
        <GameComments gameId={game.id.toString()} />
      </div>

      {/* Recommended Games Sidebar */}
      <aside className="w-full lg:w-80 lg:flex-shrink-0">
        <RecommendedGamesSidebar games={recommendedGames} />
      </aside>
    </div>
  );
}
