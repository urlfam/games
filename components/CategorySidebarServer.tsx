import { getCategories } from '@/lib/games';
import CategorySidebarClient from '@/components/CategorySidebarClient';
import { Suspense } from 'react';

export default async function CategorySidebar() {
  try {
    // Get real categories from games
    const realCategories = await getCategories();

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
      <Suspense
        fallback={
          <div className="w-16 md:w-64 bg-slate-900 border-r border-white/10 hidden md:block" />
        }
      >
        <CategorySidebarClient categories={allCategories} />
      </Suspense>
    );
  } catch (error) {
    console.warn('Sidebar failed to load categories, showing defaults only.', error);
    // Fallback minimal sidebar
    const fallbackCategories = [
      { name: 'Home', slug: 'all' },
      { name: 'New', slug: 'new' },
      { name: 'Popular Games', slug: 'trending' },
    ];
    return (
      <Suspense fallback={null}>
        <CategorySidebarClient categories={fallbackCategories} />
      </Suspense>
    );
  }
}
