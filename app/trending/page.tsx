import { Metadata } from 'next';
import { getTrendingGames, minimizeGame, Game } from '@/lib/games';
import GameCard from '@/components/GameCard';
import MobileHeroCard from '@/components/MobileHeroCard';
import MobileGridItem from '@/components/MobileGridItem';
import { getSeoData } from '@/lib/seo';
import ExpandableText from '@/components/ExpandableText';
import { stripHtml } from '@/lib/utils';

// ISR: Regenerate this page every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Trending Games - Most Popular Free Online Games on Puzzio',
  description:
    'Play the most popular and trending games on Puzzio.io. See what everyone is playing right now. Updated daily with the hottest free online games.',
  alternates: {
    canonical: 'https://puzzio.io/trending',
  },
  openGraph: {
    title: 'Trending Games - Puzzio',
    description:
      'Play the most popular and trending games on Puzzio.io. See what everyone is playing right now.',
    url: 'https://puzzio.io/trending',
    type: 'website',
  },
};

export default async function TrendingPage() {
  // 1. Fetch Trending Games (Limit 60, no pagination)
  const games = await getTrendingGames(60);

  // 2. SEO Data
  const seoData = await getSeoData('trending', 'Category');

  // 3. Mimimize for performance
  const minimizedGames = games.map(minimizeGame);

  // CollectionPage Schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Trending Games',
    description:
      'Play the most popular and trending games on Puzzio.io. See what everyone is playing right now.',
    url: 'https://puzzio.io/trending',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Puzzio',
      url: 'https://puzzio.io',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Puzzio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://puzzio.io/puzzio.webp',
        width: 384,
        height: 163,
      },
    },
  };

  // ItemList Schema
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Trending Games on Puzzio',
    description: 'Most popular free online games on Puzzio.io',
    itemListElement: games.map((game: Game, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'VideoGame',
        name: game.title,
        url: `https://puzzio.io/game/${game.slug}`,
        image: {
          '@type': 'ImageObject',
          url: game.image_url,
          description:
            (game as any).image_description || stripHtml(game.description),
          name: (game as any).image_title || game.title,
        },
        description: stripHtml(game.description),
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://puzzio.io',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Trending Games',
        item: 'https://puzzio.io/trending',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-2 sm:space-y-4">
        <section>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 capitalize px-1">
            Trending Games
          </h1>

          {/* SEO Header Description */}
          {seoData?.header_desc ? (
            <ExpandableText
              content={seoData.header_desc}
              className="text-gray-300 mb-6 px-1 text-lg w-full"
              limit={300}
            />
          ) : (
            <p className="text-gray-300 mb-6 px-1 text-lg w-full">
              Check out the most popular games on Puzzio right now! These
              trending titles are the community favorites.
            </p>
          )}

          {/* Desktop View */}
          <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-3">
            {minimizedGames.map((game: any) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {/* Mobile View (Custom Layout: 6 Hero + Rest 1x1) */}
          <div className="md:hidden space-y-6">
            {/* First 6 games as Hero Units */}
            <div className="space-y-6">
              {minimizedGames.slice(0, 6).map((game: any, index: number) => (
                <MobileHeroCard
                  key={game.id}
                  game={game}
                  priority={index === 0}
                />
              ))}
            </div>

            {/* Remaining games as 1x1 Grid */}
            <div className="grid grid-cols-3 gap-3">
              {minimizedGames.slice(6).map((game: any) => (
                <MobileGridItem key={game.id} game={game} />
              ))}
            </div>
          </div>

          {/* No Pagination */}

          {/* SEO Main Content */}
          {seoData?.main_content && (
            <div className="bg-slate-800 rounded-lg p-6 mb-6 mt-12">
              <div
                className="game-description"
                dangerouslySetInnerHTML={{ __html: seoData.main_content }}
              />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
