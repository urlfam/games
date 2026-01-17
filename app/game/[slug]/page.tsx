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
// import { createClient } from '@/lib/supabase/server'; // Removed for speed
import Script from 'next/script';
import { Calendar, RefreshCw, Tag, Star } from 'lucide-react';
import { headers } from 'next/headers';

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
    title: `${game.title} - Play on Puzzio.io`,
    description:
      (game as any).image_description ||
      stripHtml(game.description).substring(0, 160),
    alternates: {
      canonical: `https://puzzio.io/game/${params.slug}`,
    },
    openGraph: {
      title: game.title,
      description:
        (game as any).image_description ||
        stripHtml(game.description).substring(0, 200),
      url: `https://puzzio.io/game/${params.slug}`,
      images: [
        {
          url: game.image_url,
          alt: (game as any).image_alt || game.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: game.title,
      description:
        (game as any).image_description ||
        stripHtml(game.description).substring(0, 200),
      images: [game.image_url],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameBySlug(params.slug);
  const allGames = await getAllGames();

  if (!game) {
    notFound();
  }

  // NOTE: Moving Supabase calls to client side for instant navigation speed.
  // We use defaults for initial SSR render.
  
  // Default stats for SSR (will be hydrated by client component if needed, 
  // or updated in future background revalidations)
  const likes = 0;
  const dislikes = 0;
  const plays = 0; // Will show "0" or hidden initially, fine for instant feel
  const totalVotes = 0;

  // Defaults for Schema
  const ratingValueSchema = 5.0; // Moderate default
  const ratingValueVisual = 10.0; // Visual default

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: stripHtml(game.description),
    image: game.image_url,
    genre: game.category,
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    url: `https://puzzio.io/game/${params.slug}`,
    // Exclude aggregateRating from initial static HTML if no data,
    // to avoid blocking DB call. Google will see it when it visits if we use ISR properly,
    // but for user speed, we skip the DB wait.
  };

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
  // Note: Assurez-vous que votre variable d'environnement est définie.
  const proxyBaseUrl =
    process.env.NEXT_PUBLIC_PROXY_URL || `http://147.93.7.103:9999`;
  const gameProxyUrl = `${proxyBaseUrl}/source-game/${game.slug}`;

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
                    (Standard)
                  </span>
                </div>
              </div>

              {/* Played (Real data from DB) */}
              <div className="flex items-center">
                <span className="w-32 text-gray-500 font-medium">Played:</span>
                <span className="text-white font-semibold">
                  New
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
              dangerouslySetInnerHTML={{ __html: game.description }}
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
