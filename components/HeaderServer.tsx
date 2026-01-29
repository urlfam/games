import { getCategories } from '@/lib/games';
import HeaderClient from '@/components/HeaderClient';
import { Suspense } from 'react';

export default async function Header() {
  let realCategories: Array<{ name: string; count: number; slug: string }> = [];

  try {
    // Get real categories from games
    realCategories = await getCategories();
  } catch (error) {
    console.warn('Header failed to load categories', error);
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
      name: cat.name,
      slug: cat.slug,
    })),
  ];

  return (
    <Suspense fallback={<div className="h-16 w-full bg-[#1a1b26] border-b border-white/10" />}>
      <HeaderClient categories={allCategories} />
    </Suspense>
  );
}
