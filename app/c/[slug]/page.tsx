import HomePage from '@/app/page';
import { getCategories } from '@/lib/games';
import { Metadata } from 'next';

// ISR: Regenerate this page every 60 seconds
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | undefined };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `Play Free ${categoryName} Games Online - Puzzio.io`,
    description: `Discover the best free ${categoryName} games on Puzzio.io. Play instantly in your browser without downloads. High quality ${categoryName} games for all devices.`,
    alternates: {
      canonical: `https://puzzio.io/c/${params.slug}`,
    },
    openGraph: {
      title: `Free ${categoryName} Games - Puzzio`,
      description: `Play the best collection of ${categoryName} games online for free. No download required.`,
      url: `https://puzzio.io/c/${params.slug}`,
      type: 'website',
    },
  };
}

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  // Reuse the HomePage component but inject the category into searchParams
  // The HomePage component logic handles filtering by categoryParam
  const newSearchParams = { ...searchParams, category: params.slug };

  return <HomePage searchParams={newSearchParams} />;
}
