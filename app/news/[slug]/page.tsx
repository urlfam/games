import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ARTICLES_DATA } from '@/lib/articles';
import Breadcrumbs from '@/components/Breadcrumbs';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Générer metadata SEO pour chaque article
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = ARTICLES_DATA.find((a) => a.slug === params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Puzzio.io`,
    description: article.excerpt,
    keywords: [article.title, article.category, ...article.tags],
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.featuredImage }],
      type: 'article',
      publishedTime: article.publishDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
    },
    alternates: {
      canonical: `/news/${params.slug}`,
    },
  };
}

// Générer toutes les pages d'articles au build
export async function generateStaticParams() {
  return ARTICLES_DATA.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = ARTICLES_DATA.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  // Articles de même catégorie (recommandations)
  const relatedArticles = ARTICLES_DATA.filter(
    (a) => a.category === article.category && a.id !== article.id,
  ).slice(0, 3);

  // ✅ NOUVEAU - Schema.org structured data

  // 1. NewsArticle Schema
  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://puzzio.io/news/${article.slug}`,
    },
    headline: article.title,
    description: article.excerpt,
    keywords: article.tags.join(', '),
    image: {
      '@type': 'ImageObject',
      url: article.featuredImage,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: `https://puzzio.io/news/author/${encodeURIComponent(
        article.author.name,
      )}`,
      image: article.author.avatar,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Puzzio.io',
      logo: {
        '@type': 'ImageObject',
        url: 'https://puzzio.io/logo.png',
        width: 600,
        height: 60,
      },
    },
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    articleBody: article.content,
    articleSection: article.category,
    // optional: basic word count derived from content
    wordCount: article.content ? article.content.trim().split(/\s+/).length : 0,
  };

  // 2. Author Schema
  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: article.author.name,
    description: article.author.bio,
    image: article.author.avatar,
  };

  // 3. BreadcrumbList Schema
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
        name: 'News',
        item: 'https://puzzio.io/news',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category,
        item: `https://puzzio.io/news/category/${article.category
          .toLowerCase()
          .replace(/\s+/g, '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: `https://puzzio.io/news/${article.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ✅ NOUVEAU - Inject Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ...existing code... */}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'News', href: '/news' },
            {
              label: article.category,
              href: `/news/category/${article.category
                .toLowerCase()
                .replace(/\s+/g, '-')}`,
            },
            { label: article.title, href: `/news/${article.slug}` },
          ]}
        />

        {/* Article Header */}
        <article className="mt-8">
          {/* Category Badge */}
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
              {article.category}
            </span>
            <time className="text-gray-400 text-sm">
              {new Date(article.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {article.title}
          </h1>

          {/* Featured Image */}
          <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          {/* Author Info */}
          <div className="bg-slate-800 rounded-xl p-6 mb-8 flex gap-4">
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <a
                href={`/news/author/${encodeURIComponent(article.author.name)}`}
                className="font-bold text-white mb-1 hover:underline"
              >
                {article.author.name}
              </a>
              <p className="text-gray-400 text-sm">{article.author.bio}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-800 text-gray-300 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
              {article.content}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mb-12 border-t border-gray-700 pt-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/news/${relatedArticle.slug}`}
                    className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={relatedArticle.featuredImage}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded mb-2">
                        {relatedArticle.category}
                      </span>
                      <h3 className="text-white font-bold mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back to News */}
          <div className="text-center border-t border-gray-700 pt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to News
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
