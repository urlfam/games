import Link from 'next/link';
import Image from 'next/image';
import { getAllGames, getNewGames, getTrendingGames } from '@/lib/games'; // Import our new function
import { stripHtml } from '@/lib/utils';

// ISR: Regenerate this page every 60 seconds in the background
// This keeps the site blazing fast while showing fresh content
export const revalidate = 60;

// This is a Server Component
export default async function PlayPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const categoryParam = searchParams?.category?.toLowerCase() || 'all';
  const searchQuery = searchParams?.search?.toLowerCase() || '';

  // Handle special categories
  let filteredGames;
  if (categoryParam === 'all') {
    filteredGames = await getAllGames();
  } else if (categoryParam === 'new') {
    filteredGames = await getNewGames(50);
  } else if (categoryParam === 'trending' || categoryParam === 'popular') {
    filteredGames = await getTrendingGames(50);
  } else {
    // Filter by real category
    const allGames = await getAllGames();
    filteredGames = allGames.filter((game) => {
      const gameCategory = game.category.toLowerCase().replace(/\s+/g, '-');
      return gameCategory === categoryParam;
    });
  }

  // Apply search filter if search query exists
  if (searchQuery) {
    filteredGames = filteredGames.filter((game) => {
      const titleMatch = game.title.toLowerCase().includes(searchQuery);
      const descMatch = game.description.toLowerCase().includes(searchQuery);
      const categoryMatch = game.category.toLowerCase().includes(searchQuery);
      return titleMatch || descMatch || categoryMatch;
    });
  }

  const featuredGame = filteredGames.length > 0 ? filteredGames[0] : null;
  const trendingGames = filteredGames.slice(0, 6);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Games List',
    description: 'List of available games on Puzzio.io',
    itemListElement: filteredGames.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'VideoGame',
        name: game.title,
        url: `https://puzzio.io/play/${game.slug}`,
        image: {
          '@type': 'ImageObject',
          url: game.image_url,
          description: game.image_description || stripHtml(game.description),
          name: game.image_title || game.title,
        },
        description: stripHtml(game.description),
        keywords: game.image_keywords?.join(', '),
      },
    })),
  };

  if (!featuredGame) {
    return (
      <div className="flex items-center justify-center p-8 text-white">
        <div className="text-center">
          <p className="text-xl mb-2">
            {searchQuery
              ? `No games found for "${searchQuery}"`
              : 'No games found. Please run the import workflow.'}
          </p>
          {searchQuery && (
            <Link
              href="/play"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Clear search and view all games
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section */}
      <section className="relative h-64 sm:h-96 bg-slate-900 sm:bg-gradient-to-r sm:from-slate-800 sm:to-slate-900 px-0 sm:px-4 lg:px-8 overflow-hidden">
        {/* Mobile Background Image */}
        <div className="absolute inset-0 sm:hidden">
          <Image
            src={featuredGame.image_url}
            alt={featuredGame.image_alt || featuredGame.title}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full sm:max-w-7xl sm:mx-auto flex flex-col justify-center sm:flex-row sm:items-center h-full gap-4 sm:gap-8 px-4 sm:px-0">
          <div className="w-full sm:w-1/2 max-w-xl flex flex-col items-start justify-center">
            <span className="inline-block px-3 py-1 bg-purple-500 rounded-full text-white text-xs sm:text-sm font-medium mb-2 sm:mb-4 shadow-sm">
              Featured Game
            </span>
            <h1 className="text-2xl sm:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-md sm:drop-shadow-none">
              {featuredGame.title}
            </h1>
            <p className="text-xl text-gray-300 mb-6 hidden sm:line-clamp-3">
              {stripHtml(featuredGame.description)}
            </p>
            <Link href={`/play/${featuredGame.slug}`}>
              <button className="px-6 py-2 sm:px-8 sm:py-3 bg-purple-500 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-purple-600 transition-colors shadow-lg">
                Play Now →
              </button>
            </Link>
          </div>

          <div className="relative hidden sm:block w-1/2 h-full rounded-lg overflow-hidden py-4 sm:py-8">
            <Image
              src={featuredGame.image_url}
              alt={featuredGame.image_alt || featuredGame.title}
              title={featuredGame.image_title || featuredGame.title}
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Trending Games */}
      <section className="py-12 px-0 sm:px-6 lg:px-8">
        <div className="w-full sm:max-w-7xl sm:mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 px-2 sm:px-0">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : 'Trending Games'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-0">
            {trendingGames.map((game, index) => (
              <div
                key={game.id}
                className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
              >
                <div className="relative h-40 sm:h-60 overflow-hidden">
                  <Image
                    src={game.image_url}
                    alt={game.image_alt || game.title}
                    title={game.image_title || game.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index < 4 ? "eager" : "lazy"}
                    priority={index < 2}
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded mb-2">
                    {game.category}
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-2 line-clamp-1 sm:line-clamp-2">
                    {game.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 hidden sm:line-clamp-3">
                    {stripHtml(game.description)}
                  </p>
                  <Link href={`/play/${game.slug}`}>
                    <button className="w-full py-1.5 sm:py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors">
                      Play
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Games */}
      <section className="py-12 px-0 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="w-full sm:max-w-7xl sm:mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 px-2 sm:px-0">All Games</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-0">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
              >
                <div className="relative h-40 sm:h-60 overflow-hidden">
                  <Image
                    src={game.image_url}
                    alt={game.image_alt || game.title}
                    title={game.image_title || game.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded mb-2">
                    {game.category}
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold text-white mb-2 line-clamp-1 sm:line-clamp-2">
                    {game.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 hidden sm:line-clamp-3">
                    {stripHtml(game.description)}
                  </p>
                  <Link href={`/play/${game.slug}`}>
                    <button className="w-full py-1.5 sm:py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors">
                      Play
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
