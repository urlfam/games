import { notFound } from 'next/navigation';
import { getAllGames, getGameBySlug } from '@/lib/games';
import RecommendedGamesSidebar from '@/components/RecommendedGamesSidebar';
import GameComments from '@/components/GameComments';
import { Metadata } from 'next';
import Link from 'next/link';
import GamePlayer from '@/components/GamePlayer';

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

// We are keeping the page dynamic (SSR) by removing generateStaticParams

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameBySlug(params.slug);
  const allGames = await getAllGames();

  if (!game) {
    notFound();
  }

  const recommendedGames = allGames.filter(g => g.category === game.category && g.id !== game.id).slice(0, 12);

  // Allow optional proxy embedding (disabled by default). To enable, set
  // NEXT_PUBLIC_ENABLE_EMBED_PROXY=true (or ENABLE_EMBED_PROXY on the server).
  const enableProxy = process.env.NEXT_PUBLIC_ENABLE_EMBED_PROXY === 'true' || process.env.ENABLE_EMBED_PROXY === 'true';
  const embedSrc = enableProxy
    ? `/api/embed?url=${encodeURIComponent(game.iframe_url)}`
    : game.iframe_url;

  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content (Game, Description, Comments) */}
        <div className="lg:col-span-3">
          
          <GamePlayer 
            embedSrc={embedSrc}
            title={game.title}
            pageUrl={game.page_url}
            enableProxy={enableProxy}
          />

          {/* Small caption / legal note */}
          <div className="text-sm text-gray-400 mb-6">
            Note: the content inside the player is provided by the game host (e.g. CrazyGames).
            Because the iframe content is cross-origin the site cannot modify or remove branding inside that frame.
            If you want a visually &quot;clean&quot; embed (served under your domain) we can enable a server-side proxy —
            this changes how scripts/resources are loaded and may have legal/terms implications. Ask me to enable the proxy and I will add the allowlist and safeguards.
          </div>

          {/* Game Info Header */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{game.title}</h1>
            <Link href={`/play?category=${game.category.toLowerCase()}`} className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
              Category: <span className="font-semibold text-purple-400">{game.category}</span>
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
