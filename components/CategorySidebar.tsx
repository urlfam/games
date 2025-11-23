'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Let's define a static list of categories for now.
// In the future, we can generate this dynamically from the games.json file.
const categories = [
  'Action',
  'Adventure',
  'Puzzle',
  'Racing',
  'Sports',
  'Strategy',
  'Tir',
  'Conduite',
  'Casual',
  'Clicker',
  'Beauté',
];

export default function CategorySidebar() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category')?.toLowerCase() || 'all';

  return (
    <aside className="fixed top-0 left-0 h-full w-16 bg-slate-800 flex flex-col items-center py-4 transition-all duration-300 z-20">
      <nav className="flex flex-col gap-4 mt-20">
        <Link
          href="/play"
          className={`p-2 rounded-lg ${
            activeCategory === 'all'
              ? 'bg-purple-500 text-white'
              : 'text-gray-400 hover:bg-slate-700'
          }`}
          title="All Games"
        >
          {/* Replace with a suitable icon if you have an icon library */}
          <span>All</span>
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/play?category=${category.toLowerCase()}`}
            className={`p-2 rounded-lg ${
              activeCategory === category.toLowerCase()
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:bg-slate-700'
            }`}
            title={category}
          >
            {/* Replace with a suitable icon */}
            <span>{category.substring(0, 3)}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
