import Link from 'next/link';
import Image from 'next/image';
import GameCard from '@/components/GameCard';
import HorizontalGameSection from '@/components/HorizontalGameSection';
import TrendingSection from '@/components/TrendingSection';
import { getAllGames, getNewGames, getTrendingGames, sortGamesByPlays } from '@/lib/games'; // Import our new function
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
  // Keep track of games for the trending section (before search/sort by date)
  let gamesForTrendingSection: any[] = [];

  if (categoryParam === 'all') {
    filteredGames = await getAllGames();
    // Sort by Newest for "All Games" section
    filteredGames.sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime());
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
    
    // Capture these games for the trending section calculation
    gamesForTrendingSection = [...filteredGames];

    // Sort "All Games" list by Newest (Date)
    filteredGames.sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime());
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

  const isHomePage = categoryParam === 'all' && !searchQuery;

  // --- Logic for Homepage Sections ---
  
  // 1. Trending Games (for horizontal scroll)
  let trendingGames: any[] = [];
  if (isHomePage) {
     // Get more trending games for horizontal scroll
     trendingGames = await getTrendingGames(20);
     // Fallback if not enough trending data
     if (trendingGames.length < 20) {
         trendingGames = filteredGames.slice(0, 20);
     }
  } else {
     // For category/search pages, we might use trendingGames differently or not at all
     // But let's keep the variable for consistency if needed
     trendingGames = [];
  }

  // 2. New Games (Next batch)
  // Exclude games already in trending to avoid duplicates on homepage
  const trendingIds = new Set(trendingGames.map((g: any) => g.id));
  const newGames = filteredGames.filter((g) => !trendingIds.has(g.id)).slice(0, 12);

  // 3. Tag Sections
  let tagSections: { tag: string; games: any[] }[] = [];
  if (isHomePage) {
    const tagGroups: Record<string, any[]> = {};
    filteredGames.forEach((game) => {
      // We can include trending games in tags, or exclude them. Let's include them.
      game.tags?.forEach((tag: string) => {
        if (!tagGroups[tag]) tagGroups[tag] = [];
        tagGroups[tag].push(game);
      });
    });

    tagSections = Object.entries(tagGroups)
      .filter(([_, games]) => games.length > 0)
      .sort((a, b) => b[1].length - a[1].length) // Sort by popularity (count)
      .slice(0, 7)
      .map(([tag, games]) => ({ tag, games: games.slice(0, 6) }));
  }

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

  if (filteredGames.length === 0 && !searchQuery) {
     // Handle empty state if needed, but usually we have games.
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {isHomePage ? (
          <>
            {/* Trending Section - Layout CrazyGames (1 grande + 4 petites) */}
            <TrendingSection games={trendingGames} />

            {/* New Games Section - Horizontal Scroll */}
            <HorizontalGameSection
              title="New Games"
              games={newGames}
              viewMoreLink="/play?category=new"
              badgeText="All New Games"
            />

            {/* Dynamic Tag Sections - Horizontal Scroll */}
            {tagSections.map(({ tag, games }) => (
              <HorizontalGameSection
                key={tag}
                title={tag}
                games={games}
                viewMoreLink={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                badgeText={`All ${tag}`}
              />
            ))}
          </>
        ) : (
          /* Standard Grid for Search/Category Pages */
          <section>
             <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 capitalize px-1">
                {searchQuery ? `Search: ${searchQuery}` : (categoryParam === 'all' ? 'All Games' : categoryParam)}
             </h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
             </div>
          </section>
        )}
      </div>
    </>
  );
}
