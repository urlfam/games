import { getCategories } from '@/lib/games';
import CategorySidebarClient from '@/components/CategorySidebarClient';
import { Suspense } from 'react';

// Fallback categories in case Supabase fails
const FALLBACK_CATEGORIES = [
  { name: 'Action', slug: 'action' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Puzzle', slug: 'puzzle' },
  { name: 'Casual', slug: 'casual' },
  { name: 'Clicker', slug: 'clicker' },
  { name: 'Driving', slug: 'driving' },
  { name: '.io', slug: 'io' },
  { name: 'Shooting', slug: 'shooting' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Beauty', slug: 'beauty' },
];

export default async function CategorySidebar() {
  // Get real categories from games (with error handling)
  let realCategories = [];
  try {
    realCategories = await getCategories();
  } catch (error) {
    console.error('Failed to load categories from Supabase, using fallback:', error);
    realCategories = FALLBACK_CATEGORIES;
  }

  // If no categories returned, use fallback
  if (!realCategories || realCategories.length === 0) {
    realCategories = FALLBACK_CATEGORIES;
  }

  // Define special categories (always shown at top)
  const specialCategories = [
    { name: 'Home', slug: 'all' },
    { name: 'New', slug: 'new' },
    { name: 'Popular Games', slug: 'trending' },
  ];

  // Combine special + real categories
  const allCategories = [
    ...specialCategories,
    ...realCategories.map((cat) => ({
      name: cat.name || cat.slug,
      slug: cat.slug,
    })),
  ];

  return (
    <Suspense fallback={<div className="w-16 md:w-64 bg-slate-900 border-r border-white/10 hidden md:block" />}>
      <CategorySidebarClient categories={allCategories} />
    </Suspense>
  );
}
