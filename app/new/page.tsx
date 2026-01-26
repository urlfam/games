import { Metadata } from 'next';
import { getNewGames, Game, minimizeGame } from '@/lib/games';
import GameCard from '@/components/GameCard';
import Pagination from '@/components/Pagination';
import MobileHeroCard from '@/components/MobileHeroCard';
import MobileGridItem from '@/components/MobileGridItem'; // Import MobileGridItem
import { Suspense } from 'react';
import { getSeoData } from '@/lib/seo';
import ExpandableText from '@/components/ExpandableText';
import { stripHtml } from '@/lib/utils';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'New Games - Play the Latest Free Online Games on Puzzio',
  description:
    'Discover the newest free online games on Puzzio. Play the latest puzzle, action, and strategy games. Updated daily with the best new web games.',
  alternates: {
    canonical: 'https://puzzio.io/new',
  },
};

export default async function NewGamesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 60;

  // 1. Fetch New Games (Limit 1000 for pagination support)
  const allNewGames = await getNewGames(1000);

  // 2. SEO Data (Try to get specific SEO data for "New Games" category if it exists)
  const seoData = await getSeoData('new-games', 'Category');

  // 3. Pagination Logic
  const totalGames = allNewGames.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGames = allNewGames.slice(startIndex, endIndex);

  // 4. Optimization
  const minimizedPaginatedGames = paginatedGames.map(minimizeGame);

  // CollectionPage Schema for the new games listing
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'New Games',
    description:
      'Discover the newest free online games on Puzzio. Play the latest puzzle, action, and strategy games.',
    url: 'https://puzzio.io/new',
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

  // Schema.org structured data
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'New Games on Puzzio',
    description: 'Latest free online games added to Puzzio.io',
    itemListElement: paginatedGames.map((game: Game, index: number) => ({
      '@type': 'ListItem',
      position: startIndex + index + 1,
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
        name: 'New Games',
        item: 'https://puzzio.io/new',
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
            New Games
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
              Check out the latest additions to Puzzio! We update our collection
              daily with the best new games from around the web.
            </p>
          )}

          {/* Desktop View */}
          <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-3">
            {minimizedPaginatedGames.map((game: any) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {/* Mobile View (Custom Layout: 6 Hero + Rest 1x1) */}
          <div className="md:hidden space-y-6">
            {/* First 6 games as Hero Units */}
            <div className="space-y-6">
              {minimizedPaginatedGames
                .slice(0, 6)
                .map((game: any, index: number) => (
                  <MobileHeroCard
                    key={game.id}
                    game={game}
                    priority={index === 0}
                  />
                ))}
            </div>

            {/* Remaining games as 1x1 Grid */}
            <div className="grid grid-cols-3 gap-3">
              {minimizedPaginatedGames.slice(6).map((game: any) => (
                <MobileGridItem key={game.id} game={game} />
              ))}
            </div>
          </div>

          {/* Pagination Component */}
          <Suspense fallback={null}>
            <Pagination
              totalItems={totalGames}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
            />
          </Suspense>

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
