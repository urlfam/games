import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { GAMES_DATA } from '@/lib/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategorySidebar from '@/components/CategorySidebar';
import RecommendedGamesSidebar from '@/components/RecommendedGamesSidebar';

const GameComments = dynamic(() => import('@/components/GameComments'), {
  loading: () => <p className="text-center text-white">Loading comments...</p>,
  ssr: false,
});

interface GamePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const game = GAMES_DATA.find((g) => g.slug === params.slug);
  if (!game) {
    return { title: 'Game Not Found' };
  }
  return {
    title: `Play ${game.title} Free Online | Puzzio.io`,
    description: `${game.longDescription.substring(0, 155)}...`,
    keywords: [
      game.title,
      game.category,
      'browser game',
      'free game',
      'online game',
      'play free',
    ],
    openGraph: {
      title: `Play ${game.title} Free Online`,
      description: game.description,
      images: [{ url: game.thumbnail }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Play ${game.title} Free Online`,
      description: game.description,
      images: [game.thumbnail],
    },
    alternates: {
      canonical: `/play/${params.slug}`,
    },
  };
}

export default function GamePage({ params }: GamePageProps) {
  const game = GAMES_DATA.find((g) => g.slug === params.slug);
  if (!game) {
    notFound();
    return null;
  }

  // Find similar games (same category, exclude current)
  const similarGames = GAMES_DATA.filter(
    (g) => g.category === game.category && g.slug !== game.slug,
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.longDescription,
    url: `https://puzzio.io/play/${game.slug}`,
    image: {
      '@type': 'ImageObject',
      url: game.thumbnail,
      width: 1200,
      height: 630,
    },
    genre: game.category,
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    gamePlatform: ['Web browser', 'Desktop', 'Mobile'],
    inLanguage: 'en',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (game.popularity / 10).toFixed(1),
      ratingCount: Math.floor(game.popularity * 100),
      bestRating: '10',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'Puzzio.io',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Puzzio.io',
      logo: {
        '@type': 'ImageObject',
        url: 'https://puzzio.io/logo.png',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://puzzio.io' },
      { '@type': 'ListItem', position: 2, name: 'Play', item: 'https://puzzio.io/play' },
      {
        '@type': 'ListItem',
        position: 3,
        name: game.category,
        item: `https://puzzio.io/play?category=${encodeURIComponent(game.category)}`,
      },
      { '@type': 'ListItem', position: 4, name: game.title, item: `https://puzzio.io/play/${game.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-slate-900">
        {/* Container 1: Breadcrumbs + Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Play', href: '/play' },
              {
                label: game.category,
                href: `/play?category=${encodeURIComponent(game.category)}`,
              },
              { label: game.title, href: `/play/${game.slug}` },
            ]}
          />
          <div className="mt-8 mb-0">
            <div className="flex items-center gap-3 mb-3">
              <a
                href={`/play?category=${encodeURIComponent(game.category)}`}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full hover:underline"
              >
                {game.category}
              </a>
              <span className="text-gray-400 text-sm">
                ⭐ {game.popularity}% Popular
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Play {game.title} Free Online
            </h1>
            <p className="text-xl text-gray-300 mb-0">{game.description}</p>
          </div>
        </div>

        {/* Container 2: Iframe + Sidebar (full-width) */}
        <div className="w-full mb-12">
          <div className="max-w-[1600px] mx-auto px-0 sm:px-2 lg:px-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Category Sidebar (desktop only) */}
              <div className="hidden lg:block w-48 flex-shrink-0">
                <div className="sticky top-20">
                  <CategorySidebar />
                </div>
              </div>
              {/* Game area - takes all available space */}
              <div className="flex-1 min-w-0">
                <div
                  className="relative w-full bg-slate-800 rounded-xl overflow-hidden shadow-2xl"
                  style={{ paddingBottom: '56.25%' }}
                >
                  <iframe
                    src={game.gameUrl}
                    title={game.title}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    allow="gamepad; microphone; camera"
                  />
                </div>
              </div>
              {/* Recommended Games Sidebar: below on mobile, right on desktop */}
              <RecommendedGamesSidebar
                currentGameSlug={game.slug}
                category={game.category}
              />
            </div>
          </div>
        </div>

        {/* Container 3: About, Details, Comments, etc. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About This Game */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              About This Game
            </h2>
            <div className="bg-slate-800 rounded-xl p-6">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {game.longDescription}
              </p>
            </div>
          </section>

          {/* Game Details */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Game Details</h2>
            <div className="bg-slate-800 rounded-xl p-6">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No downloads required - play instantly in your browser
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Works on desktop, tablet, and mobile devices
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  100% free to play - no registration needed
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Category: {game.category}
                </li>
              </ul>
            </div>
          </section>

          {/* Comments */}
          <div className="mt-6">
            <GameComments gameId={params.slug} />
          </div>

          {/* Similar Games Section */}
          {similarGames.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Similar Games You Might Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarGames.map((similarGame) => (
                  <Link
                    key={similarGame.id}
                    href={`/play/${similarGame.slug}`}
                    className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all group"
                  >
                    <div className="relative h-48">
                      <Image
                        src={similarGame.thumbnail}
                        alt={similarGame.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded mb-2">
                        {similarGame.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {similarGame.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {similarGame.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Browse by Category Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {['Puzzle', 'Action', 'Strategy', 'Arcade', 'Adventure'].map(
                (category) => (
                  <Link
                    key={category}
                    href={`/play?category=${category.toLowerCase()}`}
                    className="bg-slate-800 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors"
                  >
                    <span className="text-white font-medium">{category}</span>
                  </Link>
                ),
              )}
            </div>
          </section>

          {/* Browse All Games Button */}
          <div className="text-center">
            <Link
              href="/play"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors mb-8"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Browse All Games
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
