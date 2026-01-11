import Link from 'next/link';
import Image from 'next/image';
import GameCard from '@/components/GameCard';
import { notFound } from 'next/navigation';
import { getGamesByTag, getAllTags, getTrendingGames } from '@/lib/games';
import { stripHtml } from '@/lib/utils';
import { Metadata } from 'next';
import { getSeoData } from '@/lib/seo';
import ExpandableText from '@/components/ExpandableText'; // Import ExpandableText

// ISR: Regenerate this page every 60 seconds
export const revalidate = 60;

interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const tagSlug = params.slug;
  const tags = await getAllTags();
  const tag = tags.find((t) => t.slug === tagSlug);

  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  const tagName = tag.name;
  const title = `${tagName} Games - Play Free ${tagName} Games Online on Puzzio`;
  const description = `Play the best free ${tagName} games online. We have a great collection of ${tagName} games for you to play.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/t/${tagSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `/t/${tagSlug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tagSlug = params.slug;
  const tags = await getAllTags();
  const tag = tags.find((t) => t.slug === tagSlug);

  if (!tag) {
    notFound();
  }

  const games = await getGamesByTag(tagSlug);
  const trendingGames = await getTrendingGames(6);
  const seoData = await getSeoData(tagSlug, 'Tag');

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${tag.name} Games List`,
    description: `List of available ${tag.name} games on Puzzio.io`,
    itemListElement: games.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
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

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-2 sm:space-y-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      
      {/* Header - Styled like Category Page */}
      <section>
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 capitalize px-1 flex items-center gap-2">
          {tag.name} Games
        </h1>

        {/* SEO Header Description */}
        {seoData?.header_desc && (
           <ExpandableText 
             content={seoData.header_desc} 
             className="text-gray-300 mb-6 px-1 text-lg w-full"
             limit={300}
           />
        )}

        {/* Grid Layout - Standard Grid (Copied from Category/Home Page) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {games.map((game) => (
            <GameCard 
              key={game.id} 
              game={game}
            />
          ))}
        </div>

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
  );
}
