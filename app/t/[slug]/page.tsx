import Link from 'next/link';
import Image from 'next/image';
import GameCard from '@/components/GameCard';
import Pagination from '@/components/Pagination';
import FAQAccordion from '@/components/FAQAccordion';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getGamesByTag, getAllTags, getTrendingGames, minimizeGame } from '@/lib/games';
import { stripHtml } from '@/lib/utils';
import { Metadata } from 'next';
import { getSeoData } from '@/lib/seo';
import ExpandableText from '@/components/ExpandableText';
import MobileHeroCard from '@/components/MobileHeroCard';
import MobileGridItem from '@/components/MobileGridItem';

// ISR: Regenerate this page every 60 seconds
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

interface TagPageProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | undefined };
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

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tagSlug = params.slug;
  const tags = await getAllTags();
  const tag = tags.find((t) => t.slug === tagSlug);

  if (!tag) {
    notFound();
  }

  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 60;

  const allGames = await getGamesByTag(tagSlug);
  
  // Get SEO Data
  const seoData = await getSeoData(tagSlug, 'Tag');

  // Pagination
  const totalGames = allGames.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGames = allGames.slice(startIndex, endIndex);

  // minimize for client
  const minimizedPaginatedGames = paginatedGames.map(minimizeGame);

  // CollectionPage Schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tag.name} Games`,
    description: `Play the best ${tag.name} games online for free on Puzzio.`,
    url: `https://puzzio.io/t/${tagSlug}`,
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
    itemListElement: paginatedGames.map((game, index) => ({
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
        name: `${tag.name} Games`,
        item: `https://puzzio.io/t/${tagSlug}`,
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
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 capitalize px-1">
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

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-3">
          {minimizedPaginatedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {/* Mobile View (Custom Layout: 6 Hero + Rest 1x1) */}
        <div className="md:hidden space-y-6">
          <div className="space-y-6">
            {minimizedPaginatedGames
              .slice(0, 6)
              .map((game, index) => (
                <MobileHeroCard
                  key={game.id}
                  game={game}
                  priority={index === 0}
                />
              ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {minimizedPaginatedGames.slice(6).map((game) => (
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

        {/* FAQ Section & Schema */}
        {seoData?.faq_schema && seoData.faq_schema.length > 0 && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: seoData.faq_schema.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: item.answer,
                    },
                  })),
                }),
              }}
            />

            <div className="mt-8 mb-12">
              <FAQAccordion items={seoData.faq_schema} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
