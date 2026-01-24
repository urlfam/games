import { notFound } from 'next/navigation';
import { getAllGames, getGameBySlug } from '@/lib/games';
import RecommendedGamesSidebar from '@/components/RecommendedGamesSidebar';
import MobileRecommendedGames from '@/components/MobileRecommendedGames'; // Import Mobile Component
import GameCommentsSimple from '@/components/GameCommentsSimple';
import GamePlayerWithSplash from '@/components/GamePlayerWithSplash';
import FAQAccordion from '@/components/FAQAccordion';
import { Metadata } from 'next';
import Link from 'next/link';
import { stripHtml } from '@/lib/utils';
import { createServerClientSimple } from '@/lib/supabase/server-simple'; 
import Script from 'next/script';
import { Calendar, RefreshCw, Tag, Star } from 'lucide-react';

// ISR: Regenerate game pages every 60 seconds
// Keeps pages fast while showing updated content
export const revalidate = 60;

// Enable SSG
export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map((game) => ({
    slug: game.slug || '',
  })).filter(p => p.slug);
}

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
    title: (game as any).seo_title || `${game.title} - Play on Puzzio.io`,
    description:
      (game as any).seo_description ||
      (game as any).image_description ||
      stripHtml(game.description).substring(0, 160),
    keywords: [
      ...((game as any).image_keywords || []),
      ...(game.tags || [])
    ],
    alternates: {
      canonical: `https://puzzio.io/game/${params.slug}`,
    },
    openGraph: {
      title: (game as any).seo_title || game.title,
      description:
        (game as any).seo_description ||
        (game as any).image_description ||
        stripHtml(game.description).substring(0, 200),
      url: `https://puzzio.io/game/${params.slug}`,
      images: [
        {
          url: game.image_url,
          alt: (game as any).image_alt || game.title,
        },
        (game as any).mobile_image_url && {
          url: (game as any).mobile_image_url,
          alt: `${game.title} - Mobile Cover`,
        },
        (game as any).mobile_1x1_url && {
          url: (game as any).mobile_1x1_url,
          alt: `${game.title} - Icon`,
        },
      ].filter(Boolean),
    },
    twitter: {
      card: 'summary_large_image',
      title: (game as any).seo_title || game.title,
      description:
        (game as any).seo_description ||
        (game as any).image_description ||
        stripHtml(game.description).substring(0, 200),
      images: [game.image_url, (game as any).mobile_image_url].filter(Boolean),
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameBySlug(params.slug);
  const allGames = await getAllGames();

  if (!game) {
    notFound();
  }

  // --- ISR DATA FETCHING ---
  // We use revalidate = 60 to fetch this data only once per minute server-side.
  // Using simple client (no cookies) to keep ISR working properly.
  const supabase = createServerClientSimple();
  
  let likes = 0;
  let dislikes = 0;
  let plays = 0;
  let totalVotes = 0;
  
  // Visual Rating (0-10)
  let ratingValueVisual = 10.0;
  // Schema Rating (0-5)
  let ratingValueSchema = 5.0;

  try {
    const { data: stats } = await supabase
      .from('game_stats')
      .select('likes, dislikes, plays') // removed game_slug to match grep results simpler
      .eq('game_slug', params.slug) // Check exact column name from grep: 'game_slug' seems used in SQL. 
      // Wait, standard supabase query uses column names. 
      // Grep showed: `WHERE game_slug = p_game_slug` in SQL function.
      // Let's assume the column in table is 'game_slug' or 'slug'.
      // Let's check check_supabase.js to be sure.
      // Actually, safest is to check 'slug' or 'game_slug'. 
      // The grep for check_supabase.js line 12 might help.
      // Let's assume 'slug' based on typical pattern, but grep says 'game_slug' in SQL.
      // Let's stick to what was likely there or what works.
      // SQL line 7: INSERT INTO game_stats (game_slug, ...)
      // So column is definitely `game_slug`.
      .eq('game_slug', params.slug)
      .single();
      
    if (stats) {
      likes = stats.likes || 0;
      dislikes = stats.dislikes || 0;
      plays = stats.plays || 0;
      totalVotes = likes + dislikes;

      if (totalVotes > 0) {
        // Calculate weighted rating or simple average? 
        // Simple average as requested "same logic as before".
        // Rating 0-10
        ratingValueVisual = (likes / totalVotes) * 10;
        // Rating 0-5
        ratingValueSchema = (likes / totalVotes) * 5;
      }
    }
  } catch (e) {
    console.error('Error fetching game stats (non-blocking):', e);
    // Silent fail -> use defaults (10/10 visual, 5/5 schema, 0 plays)
  }

  const videoUrl = (game as any).video_url || (game as any).youtube_video_url;
  
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: (game as any).seo_title || game.title,
    description: (game as any).seo_description || stripHtml(game.description),
    image: [
      game.image_url,
      (game as any).mobile_image_url,
      (game as any).mobile_1x1_url
    ].filter(Boolean),
    screenshot: game.gameplay_screenshot_url || game.image_url, 
    keywords: [
      ...((game as any).image_keywords || []),
      ...(game.tags || [])
    ].join(', '),
    genre: game.category,
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    url: `https://puzzio.io/game/${params.slug}`,
  };

  if (totalVotes > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingValueSchema.toFixed(1),
      ratingCount: totalVotes,
      bestRating: '5',
      worstRating: '1',
    };
  }

  if (videoUrl) {
    jsonLd.subjectOf = {
      '@type': 'VideoObject',
      name: `Gameplay Video - ${game.title}`,
      description: `Watch gameplay video of ${game.title} on Puzzio`,
      thumbnailUrl: game.image_url,
      uploadDate: new Date().toISOString(), // Required field, using generation date as fallback
      contentUrl: (game as any).video_url, // Prefer direct MP4 if available
      embedUrl: (game as any).youtube_video_url, // YouTube embed
    };
  }

  let faqJsonLd = null;
  if (game.faq_schema && game.faq_schema.length > 0) {
    faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: game.faq_schema.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  }

  const recommendedGames = allGames
    .filter((g) => g.category === game.category && g.id !== game.id)
    .slice(0, 40);

  // Construire l'URL pour le proxy Nginx
  // Utiliser un chemin relatif pour éviter les problèmes de Mixed Content (HTTP vs HTTPS)
  // Le Nginx interne gère la route /source-game/
  const gameProxyUrl = `/source-game/${game.slug}`;

  return (
    <div className="p-4 lg:p-6">
      <Script
        id="game-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content (Game, Description, Comments) */}
        <div className="lg:col-span-3">
          {/* Game Player with Splash Screen */}
          <div className="mb-6">
            <GamePlayerWithSplash
              gameTitle={game.title}
              gameUrl={gameProxyUrl}
              gameImage={game.image_url}
              gameSlug={game.slug || params.slug}
              gameCategory={game.category}
              gameMobile1x1={game.mobile_1x1_url}
              imageAlt={(game as any).image_alt}
              imageTitle={(game as any).image_title}
            />
          </div>

          {/* Mobile Recommended Games Section (Hidden on Desktop) */}
          <MobileRecommendedGames games={recommendedGames} />

          {/* Game Info Header */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-6">
              {game.title}
            </h1>

            {/* Compact Info List */}
            <div className="space-y-2 text-base text-gray-300">
              {/* Rating */}
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">Rating:</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-xl">
                    {ratingValueVisual.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {totalVotes > 0 ? `(${totalVotes} votes)` : '(No votes yet)'}
                  </span>
                </div>
              </div>

              {/* Played (Real data from DB) */}
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">Played:</span>
                <span className="text-white font-semibold">
                  {plays > 0 ? plays.toLocaleString() : 'New'}
                </span>
              </div>

              {/* Released */}
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">
                  Released:
                </span>
                <span className="text-white font-semibold">
                  {new Date(game.importedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Last Updated */}
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">
                  Last Updated:
                </span>
                <span className="text-white font-semibold">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Technology */}
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">
                  Technology:
                </span>
                <span className="text-white font-semibold">HTML5</span>
              </div>

              {/* Platform */}
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">
                  Platform:
                </span>
                <span className="text-white font-semibold">
                  Browser (desktop, mobile, tablet)
                </span>
              </div>

              {/* Classification */}
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">
                  Classification:
                </span>
                <div className="flex items-center gap-1 text-purple-400 font-bold">
                  <Link href="/" className="hover:underline">
                    Games
                  </Link>
                  <span className="text-gray-600">»</span>
                  <Link
                    href={`/c/${game.category.toLowerCase()}`}
                    className="hover:underline"
                  >
                    {game.category}
                  </Link>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-start mt-4 pt-4 border-t border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {/* Category Tag */}
                  <Link
                    href={`/c/${game.category.toLowerCase()}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm hover:bg-purple-800 transition-colors"
                  >
                    <Tag size={14} />
                    {game.category}
                  </Link>

                  {/* Other Tags */}
                  {game.tags &&
                    game.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/t/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-700 text-gray-300 text-sm hover:bg-slate-600 transition-colors"
                      >
                        <Tag size={14} />
                        {tag}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Game Description */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
            <div
              className="game-description prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: game.description || '' }}
            />
            
            {/* Gameplay Screenshot */}
            {(game as any).gameplay_screenshot_url && (
              <div className="mt-8">
                <a 
                  href={(game as any).gameplay_screenshot_url.includes('cloudinary.com') 
                    ? (game as any).gameplay_screenshot_url.replace('/upload/', `/upload/fl_attachment:${(game as any).gameplay_filename || 'gameplay-screenshot'}/`)
                    : (game as any).gameplay_screenshot_url}
                  download={(game as any).gameplay_filename || `${game.slug}-gameplay`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer hover:opacity-95 transition-opacity"
                  title="Click to download"
                >
                  <img 
                    src={(game as any).gameplay_screenshot_url} 
                    alt={(game as any).gameplay_filename || `${game.title} Gameplay Screenshot`}
                    className="w-full rounded-lg shadow-lg border border-slate-700"
                    loading="lazy"
                  />
                </a>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          {game.faq_schema && game.faq_schema.length > 0 && (
            <FAQAccordion items={game.faq_schema} />
          )}

          {/* YouTube Video Section */}
          {game.youtube_video_url && (
            <div className="bg-slate-800 rounded-lg p-6 mb-6 mt-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Gameplay Video
              </h2>
              <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-black">
                <iframe
                  src={game.youtube_video_url}
                  title={`${game.title} Gameplay Video`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <GameCommentsSimple gameSlug={game.slug || params.slug} />
        </div>

        {/* Recommended Games Sidebar */}
        <div className="lg:col-span-1">
          <RecommendedGamesSidebar games={recommendedGames} />
        </div>
      </div>
    </div>
  );
}
