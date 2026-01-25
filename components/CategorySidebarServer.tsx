import { getCategories } from '@/lib/games';
import CategorySidebarClient from '@/components/CategorySidebarClient';
import { Suspense } from 'react';

export default async function CategorySidebar() {
  // Get real categories from games
  let realCategories = await getCategories();

  // Fallback if no categories found (e.g. static build or DB error)
  if (!realCategories || realCategories.length === 0) {
    realCategories = [
      { name: 'Action', slug: 'action', count: 0 },
      { name: 'Adventure', slug: 'adventure', count: 0 },
      { name: 'Beauty', slug: 'beauty', count: 0 },
      { name: 'Casual', slug: 'casual', count: 0 },
      { name: 'Clicker', slug: 'clicker', count: 0 },
      { name: 'Driving', slug: 'driving', count: 0 },
      { name: 'Puzzle', slug: 'puzzle', count: 0 },
      { name: 'Shooting', slug: 'shooting', count: 0 },
      { name: 'Simulation', slug: 'simulation', count: 0 },
      { name: 'Sports', slug: 'sports', count: 0 },
      { name: '.io', slug: '.io', count: 0 },
      { name: '2 Player', slug: '2-player', count: 0 },
      { name: '3D', slug: '3d', count: 0 },
    ];
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
    <Suspense fallback={<div className="w-16 md:w-64 bg-slate-900 border-r border-white/10 hidden md:block" />}>
      <CategorySidebarClient categories={allCategories} />
    </Suspense>
  );
}
