import { MetadataRoute } from 'next';
import { getAllGames, getCategories, getAllTags } from '@/lib/games';

// Force dynamic generation - sitemap needs fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://puzzio.io';
  
  // Fetch data with error handling
  let games: Awaited<ReturnType<typeof getAllGames>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let tags: Awaited<ReturnType<typeof getAllTags>> = [];
  
  try {
    games = await getAllGames();
  } catch (e) {
    console.error('Sitemap: Failed to fetch games', e);
  }
  
  try {
    categories = await getCategories();
  } catch (e) {
    console.error('Sitemap: Failed to fetch categories', e);
  }
  
  try {
    tags = await getAllTags();
  } catch (e) {
    console.error('Sitemap: Failed to fetch tags', e);
  }

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/new`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/c/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  // Tag pages
  const tagPages = tags.map((tag) => ({
    url: `${baseUrl}/t/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Game pages
  const gamePages = games.map((game) => ({
    url: `${baseUrl}/game/${game.slug}`,
    lastModified: new Date(game.importedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...tagPages, ...gamePages];
}
