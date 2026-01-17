import { notFound } from 'next/navigation';
import Image from 'next/image'; // Add Image
import cloudinaryLoader from '@/lib/cloudinaryLoader'; // Add cloudinaryLoader
import { getAllGames, getNewGames, getTrendingGames, Game, minimizeGame } from '@/lib/games';
import GameCard from '@/components/GameCard';
import HorizontalGameSection from '@/components/HorizontalGameSection';
import TrendingSection from '@/components/TrendingSection';
import FooterActions from '@/components/FooterActions';
import Link from 'next/link';
import { stripHtml } from '@/lib/utils';
import { getSeoData } from '@/lib/seo';
import ExpandableText from '@/components/ExpandableText'; // Import ExpandableText
import Pagination from '@/components/Pagination'; // Import Pagination
import MobileTrendingSection from '@/components/MobileTrendingSection'; // Import MobileTrendingSection
import MobileScrollSection from '@/components/MobileScrollSection'; // Import MobileScrollSection
import MobileHeroCard from '@/components/MobileHeroCard';
import MobileGridItem from '@/components/MobileGridItem';

// ISR: Regenerate this page every 60 seconds in the background
// This keeps the site blazing fast while showing fresh content
export const revalidate = 60;

// This is a Server Component
export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const categoryParam = searchParams?.category?.toLowerCase() || 'all';
  const searchQuery = searchParams?.search?.toLowerCase() || '';
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 60;

  // Handle special categories
  let filteredGames;
  // Keep track of games for the trending section (before search/sort by date)
  let gamesForTrendingSection: any[] = [];

  if (categoryParam === 'all') {
    filteredGames = await getAllGames();
    // Sort by Newest for "All Games" section
    filteredGames.sort(
      (a, b) =>
        new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime(),
    );
  } else if (categoryParam === 'new') {
    filteredGames = await getNewGames(1000);
  } else if (categoryParam === 'trending' || categoryParam === 'popular') {
    filteredGames = await getTrendingGames(1000);
  } else {
    // Filter by real category
    const allGames = await getAllGames();
    filteredGames = allGames.filter((game: Game) => {
      const gameCategory = game.category.toLowerCase().replace(/\s+/g, '-');
      return gameCategory === categoryParam;
    });

    // Capture these games for the trending section calculation
    gamesForTrendingSection = [...filteredGames];

    // Sort "All Games" list by Newest (Date)
    filteredGames.sort(
      (a, b) =>
        new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime(),
    );
  }

  // Apply search filter if search query exists
  if (searchQuery) {
    filteredGames = filteredGames.filter((game: Game) => {
      const titleMatch = game.title?.toLowerCase().includes(searchQuery) ?? false;
      const descriptionMatch = game.description?.toLowerCase().includes(searchQuery) ?? false;
      const categoryMatch = game.category?.toLowerCase().includes(searchQuery) ?? false;
      
      return titleMatch || descriptionMatch || categoryMatch;
    });
  }

  const isHomePage = categoryParam === 'all' && !searchQuery && currentPage === 1;

  // SEO Data Retrieval
  const seoData = !isHomePage ? await getSeoData(categoryParam, 'Category') : null;

  // Calculate pagination
  const totalGames = filteredGames.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);

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
  const newGames = filteredGames
    .filter((g: Game) => !trendingIds.has(g.id))
    .slice(0, 12);

  // 3. Custom Sections (Tags & Categories) for Homepage
  // Order: Brain, Battle, Relaxing, Simulation, Puzzle, Action, Casual, Clicker, Driving, Sports, 3D, Mouse
  interface HomeSection {
    title: string;
    games: any[];
    type: 'tag' | 'category';
    slug: string;
  }

  const sectionsConfig = [
    { name: 'Brain', type: 'tag' as const },
    { name: 'Battle', type: 'tag' as const },
    { name: 'Relaxing', type: 'tag' as const },
    { name: 'Simulation', type: 'tag' as const },
    { name: 'Puzzle', type: 'category' as const },
    { name: 'Action', type: 'category' as const },
    { name: 'Casual', type: 'category' as const },
    { name: 'Clicker', type: 'category' as const },
    { name: 'Driving', type: 'category' as const },
    { name: 'Sports', type: 'category' as const },
    { name: '3D', type: 'tag' as const },
    { name: 'Mouse', type: 'tag' as const },
  ];

  let homeSections: HomeSection[] = [];

  if (isHomePage) {
    // Helper to normalize strings for comparison
    const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

    for (const config of sectionsConfig) {
      let sectionGames: any[] = [];

      if (config.type === 'tag') {
        // Filter games that have this tag (case-insensitive check)
        sectionGames = filteredGames.filter((g: Game) => 
          g.tags?.some(tagName => 
            normalize(tagName) === normalize(config.name)
          )
        );
      } else {
        // Filter games that belong to this category
        sectionGames = filteredGames.filter((g: Game) => 
          normalize(g.category) === normalize(config.name)
        );
      }

      // Only add section if it has at least 6 games
      if (sectionGames.length >= 6) {
        homeSections.push({
          title: `${config.name} Games`,
          games: sectionGames.slice(0, 12), // Limit to 12 games per scroll
          type: config.type,
          slug: config.name.toLowerCase().replace(/\s+/g, '-')
        });
      }
    }
  }
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Games List',
    description: 'List of available games on Puzzio.io',
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
          description: game.image_description || stripHtml(game.description),
          name: game.image_title || game.title,
        },
        description: stripHtml(game.description),
        keywords: game.image_keywords?.join(', '),
      },
    })),
  };

  // Optimization: Minimize data passed to client components
  const minimizedPaginatedGames = paginatedGames.map(minimizeGame);
  const minimizedTrendingGames = trendingGames.map(minimizeGame);
  const minimizedNewGames = newGames.map(minimizeGame);
  const minimizedHomeSections = homeSections.map((section) => ({
    ...section,
    games: section.games.map(minimizeGame),
  }));

  if (filteredGames.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-white">No games found</h2>
        <p className="text-slate-400">
          Try adjusting your search for &quot;{searchQuery}&quot;
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Browse All Games
        </Link>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-2 sm:space-y-4">
        {isHomePage ? (
          <>
            {/* --- DESKTOP LAYOUT (Hidden on Mobile) --- */}
            <div className="hidden md:block"> 
                {/* Trending Section - Layout CrazyGames (1 grande + 4 petites) */}
                <TrendingSection games={minimizedTrendingGames} />

                {/* New Games Section - Horizontal Scroll */}
                <HorizontalGameSection
                  title="New Games"
                  games={minimizedNewGames}
                  viewMoreLink="/c/new"
                  badgeText="All New Games"
                />

                {/* Dynamic Custom Sections - Horizontal Scroll */}
                {minimizedHomeSections.map((section) => (
                  <HorizontalGameSection
                    key={section.title}
                    title={section.title}
                    games={section.games}
                    viewMoreLink={
                       section.type === 'category' 
                        ? `/c/${section.slug}` 
                        : `/t/${section.slug}`
                    }
                    badgeText={`All ${section.title}`}
                  />
                ))}
            </div>

            {/* --- MOBILE LAYOUT (Hidden on Desktop) --- */}
             <div className="md:hidden">
                {/* Mobile Trending Section (1 Large + 6 Small Grid) */}
                <MobileTrendingSection games={minimizedTrendingGames.slice(0, 21)} />

                {/* Mobile New Games (Vertical Cards 2x3) */}
                <MobileScrollSection 
                    title="New Games"
                    games={minimizedNewGames}
                    viewMoreLink="/c/new"
                    useVerticalCards={true}
                />

                {/* Mobile Custom Sections (Square Cards 1x1) */}
                {minimizedHomeSections.map((section) => (
                  <MobileScrollSection
                    key={section.title}
                    title={section.title}
                    games={section.games}
                    viewMoreLink={
                       section.type === 'category' 
                        ? `/c/${section.slug}` 
                        : `/t/${section.slug}`
                    }
                  />
                ))}
            </div>

            {/* Footer Actions (Random Game & Back to Top) - Visible on both but styled inside component */}
            <FooterActions />
          </>
        ) : (
          /* Standard Grid for Search/Category Pages */
          <section>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 capitalize px-1">
              {searchQuery
                ? `Search: ${searchQuery}`
                : categoryParam === 'all'
                ? 'All Games'
                : categoryParam}
            </h1>
            
            {/* SEO Header Description */}
            {seoData?.header_desc && (
              <ExpandableText 
                content={seoData.header_desc} 
                className="text-gray-300 mb-6 px-1 text-lg w-full"
                limit={300}
              />
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
                 {minimizedPaginatedGames.slice(0, 6).map((game: any, index: number) => (
                    <MobileHeroCard key={game.id} game={game} priority={index === 0} />
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
            <Pagination 
              totalItems={totalGames} 
              itemsPerPage={itemsPerPage} 
              currentPage={currentPage} 
            />

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
        )}
      </div>
    </>
  );
}
