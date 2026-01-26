import Link from 'next/link';
import Image from 'next/image';
import GameCard from '@/components/GameCard';
import { notFound } from 'next/navigation';
import { getGamesByTag, getAllTags, getTrendingGames } from '@/lib/games';
import { stripHtml } from '@/lib/utils';
import { Metadata } from 'next';

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
    openGraph: {
      title,
      description,
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

  // CollectionPage Schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tag.name} Games`,
    description: `Play the best ${tag.name} games online for free on Puzzio.`,
    url: `https://puzzio.io/tag/${tagSlug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Puzzio',
      url: 'https://puzzio.io',
    },
  };

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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://puzzio.io'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${tag.name} Games`,
        item: `https://puzzio.io/tag/${tagSlug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-6 capitalize px-1">
          {tag.name} Games
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
