import { ARTICLES_DATA } from '@/lib/articles';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const CATEGORY_LABELS: Record<string, string> = {
  'latest-news': 'Latest News',
  reviews: 'Reviews',
  'industry-analysis': 'Industry Analysis',
  interviews: 'Interviews',
};

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  const label = CATEGORY_LABELS[params.category] || 'Category';
  return {
    title: `${label} | News | Puzzio.io`,
    description: `Browse ${label.toLowerCase()} articles on Puzzio.io.`,
  };
}

export default function NewsCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
  const label = CATEGORY_LABELS[category];
  if (!label) return notFound();

  // Map category slug to article category name
  const categoryName = label;
  const filtered = ARTICLES_DATA.filter(
    (article) => article.category === categoryName,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/news' },
          { label, href: `/news/category/${category}` },
        ]}
      />
      <h1 className="text-3xl font-bold mb-8">{label}</h1>
      {filtered.length === 0 ? (
        <p className="text-gray-600">No articles found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Article Image</span>
                )}
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-600 text-sm font-medium rounded mb-3">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-500 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-8 h-8 rounded-full bg-gray-300"
                  />
                  <div className="text-sm">
                    <Link
                      href={`/news/author/${encodeURIComponent(
                        article.author.name,
                      )}`}
                      className="font-medium text-purple-600 hover:underline"
                    >
                      {article.author.name}
                    </Link>
                    <p className="text-gray-600">{article.publishDate}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
