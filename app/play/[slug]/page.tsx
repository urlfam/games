import { notFound } from 'next/navigation';
import { getAllGames, getGameBySlug } from '@/lib/games';
import RecommendedGamesSidebar from '@/components/RecommendedGamesSidebar';
import GameComments from '@/components/GameComments';
import GamePlayerWithSplash from '@/components/GamePlayerWithSplash';
import { Metadata } from 'next';
import Link from 'next/link';

interface GamePageProps {
  params: { slug: string };
}

// Generate dynamic metadata for SEO - THIS WORKS PERFECTLY in real-time
export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
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

// We are keeping the page dynamic (SSR) by removing generateStaticParams

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameBySlug(params.slug);
  const allGames = await getAllGames();

  if (!game) {
    notFound();
  }

  const recommendedGames = allGames
    .filter((g) => g.category === game.category && g.id !== game.id)
    .slice(0, 12);

  // Construire l'URL pour le proxy Nginx
  // Note: Assurez-vous que votre variable d'environnement est définie.
  const proxyBaseUrl =
    process.env.NEXT_PUBLIC_PROXY_URL || `http://147.93.7.103:9999`;
  const gameProxyUrl = `${proxyBaseUrl}/game/${game.slug}`;

  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content (Game, Description, Comments) */}
        <div className="lg:col-span-3">
          {/* Game Player with Splash Screen */}
          <div className="mb-6">
            <GamePlayerWithSplash
              gameTitle={game.title}
              gameUrl={gameProxyUrl}
              gameImage={game.image_url}
            />
          </div>

          {/* Game Info Header */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {game.title}
            </h1>
            <Link
              href={`/play?category=${game.category.toLowerCase()}`}
              className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
            >
              Category:{' '}
              <span className="font-semibold text-purple-400">
                {game.category}
              </span>
            </Link>
          </div>

          {/* Game Description */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-bold text-white mb-3">Description</h2>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>{game.description}</p>
            </div>
          </div>

          {/* Comments Section */}
          <GameComments gameId={game.id.toString()} />
        </div>

        {/* Recommended Games Sidebar */}
        <div className="lg:col-span-1">
          <RecommendedGamesSidebar games={recommendedGames} />
        </div>
      </div>
    </div>
  );
}
