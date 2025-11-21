import Link from 'next/link';
import Image from 'next/image';
import CategorySidebar from '@/components/CategorySidebar';
import { getAllGames, Game } from '@/lib/games'; // Import our new function

// This is now a Server Component, so we can fetch data directly.
export default async function PlayPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const allGames = await getAllGames();
  const categoryParam = searchParams?.category?.toLowerCase() || 'all';

  const filteredGames =
    categoryParam === 'all'
      ? allGames
      : allGames.filter(
          (game) => game.category.toLowerCase() === categoryParam,
        );

  // Let's define a featured game (e.g., the most recently imported one)
  const featuredGame = filteredGames.length > 0 ? filteredGames[0] : allGames[0];

  // Let's define trending games (e.g., the first 6)
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
        image: game.image_url,
        description: game.description,
      },
    })),
  };

  if (!featuredGame) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>No games found. Please run the import workflow.</p>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="min-h-screen bg-slate-900">
        <CategorySidebar />

        <main className="pl-16 transition-all duration-300">
          {/* Hero Section */}
          <section className="relative h-96 bg-gradient-to-r from-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex items-center h-full gap-8">
              <div className="w-1/2 max-w-xl">
                <span className="inline-block px-3 py-1 bg-purple-500 rounded-full text-white text-sm font-medium mb-4">
                  Featured Game
                </span>
                <h1 className="text-5xl font-bold text-white mb-4">
                  {featuredGame.title}
                </h1>
                <p className="text-xl text-gray-300 mb-6 line-clamp-3">
                  {featuredGame.description}
                </p>
                <Link href={`/play/${featuredGame.slug}`}>
                  <button className="px-8 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors">
                    Play Now →
                  </button>
                </Link>
              </div>

              <div className="relative hidden md:block w-1/2 h-full rounded-lg overflow-hidden">
                <Image
                  src={featuredGame.image_url}
                  alt={featuredGame.title}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  sizes="50vw"
                  priority
                />
              </div>
            </div>
          </section>

          {/* Trending Games */}
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">
                🔥 Trending Games
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingGames.map((game) => (
                  <div
                    key={game.id}
                    className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={game.image_url}
                        alt={game.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded mb-2">
                        {game.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {game.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {game.description}
                      </p>
                      <Link href={`/play/${game.slug}`}>
                        <button className="w-full py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors">
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
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8">All Games</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={game.image_url}
                        alt={game.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded mb-2">
                        {game.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {game.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {game.description}
                      </p>
                      <Link href={`/play/${game.slug}`}>
                        <button className="w-full py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors">
                          Play
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
