import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ARTICLES_DATA } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Gaming News & Reviews | Puzzio',
  description:
    'Stay updated with the latest gaming news, reviews, and industry insights.',
  alternates: {
    canonical: '/news',
  },
};

export default function NewsPage() {
  const featuredArticle = ARTICLES_DATA[0];
  const recentArticles = ARTICLES_DATA.slice(1);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'News Articles',
    description: 'List of the latest news articles on Puzzio.io',
    itemListElement: ARTICLES_DATA.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'NewsArticle',
        headline: article.title,
        url: `https://puzzio.io/news/${article.slug}`,
        image: article.featuredImage,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="min-h-screen bg-white">
        {/* ...existing code... */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Article */}
          <article className="mb-16">
            <div className="relative h-96 rounded-2xl overflow-hidden mb-6 bg-gray-200">
              {featuredArticle.featuredImage ? (
                <Image
                  src={featuredArticle.featuredImage}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
              ) : (
                <span className="text-gray-400 flex items-center justify-center h-full">
                  Featured Image
                </span>
              )}
            </div>
            <span className="inline-block px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium mb-4">
              {featuredArticle.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {featuredArticle.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {featuredArticle.excerpt}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src={featuredArticle.author.avatar}
                  alt={featuredArticle.author.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <Link
                  href={`/news/author/${encodeURIComponent(
                    featuredArticle.author.name,
                  )}`}
                  className="font-medium text-purple-600 hover:underline"
                >
                  {featuredArticle.author.name}
                </Link>
                <p className="text-sm text-gray-600">
                  {featuredArticle.publishDate}
                </p>
              </div>
            </div>
            <Link
              href={`/news/${featuredArticle.slug}`}
              className="inline-block px-8 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors"
            >
              Read Full Article →
            </Link>
          </article>

          {/* Recent Articles */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      />
                    ) : (
                      <span className="text-gray-400 flex items-center justify-center h-full">
                        Article Image
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-600 text-sm font-medium rounded mb-3">
                      {article.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8">
                        <Image
                          src={article.author.avatar}
                          alt={article.author.name}
                          fill
                          className="rounded-full object-cover"
                          sizes="32px"
                        />
                      </div>
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
          </section>

          {/* Newsletter */}
          <section className="bg-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
              Subscribe to our newsletter for the latest gaming news and
              exclusive content.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 text-base sm:text-lg"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors whitespace-nowrap text-base sm:text-lg"
              >
                Subscribe
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
}
