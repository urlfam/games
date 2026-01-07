import HomePage from '@/app/page';

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
