import HomePage from '@/app/page';
import { getCategories } from '@/lib/games';

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

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  // Reuse the HomePage component but inject the category into searchParams
  // The HomePage component logic handles filtering by categoryParam
  const newSearchParams = { ...searchParams, category: params.slug };

  return <HomePage searchParams={newSearchParams} />;
}
