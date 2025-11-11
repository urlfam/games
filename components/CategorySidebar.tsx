'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
}

const categories: Category[] = [
  {
    id: 'all',
    label: 'All Games',
    emoji: '🏠',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'puzzle',
    label: 'Puzzle',
    emoji: '🧩',
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    id: 'action',
    label: 'Action',
    emoji: '⚔️',
    gradient: 'from-red-500 to-pink-600',
  },
  {
    id: 'strategy',
    label: 'Strategy',
    emoji: '🎯',
    gradient: 'from-green-400 to-green-600',
  },
  {
    id: 'arcade',
    label: 'Arcade',
    emoji: '🕹️',
    gradient: 'from-pink-400 to-purple-600',
  },
  {
    id: 'adventure',
    label: 'Adventure',
    emoji: '🗺️',
    gradient: 'from-indigo-400 to-indigo-600',
  },
];

export default function CategorySidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  return (
    <aside
      className="fixed left-0 top-16 h-[calc(100vh-64px)] bg-slate-800 border-r border-purple-500/20 transition-all duration-300 ease-out z-20"
      style={{
        width: isExpanded ? '256px' : '64px',
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="flex flex-col gap-2 p-2 h-full overflow-y-auto scrollbar-thin">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const href =
            category.id === 'all' ? '/play' : `/play?category=${category.id}`;

          return (
            <Link
              key={category.id}
              href={href}
              className={`
                relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                ${
                  isActive
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg scale-110`
                    : 'bg-slate-700/50 text-gray-400 hover:text-white hover:bg-slate-700'
                }
              `}
              title={category.label}
            >
              {/* Icon */}
              <span className="text-2xl flex-shrink-0 transition-transform group-hover:scale-110">
                {category.emoji}
              </span>

              {/* Label (visible on expanded) */}
              <span
                className="text-sm font-medium whitespace-nowrap transition-all duration-200"
                style={{
                  opacity: isExpanded ? 1 : 0,
                  pointerEvents: isExpanded ? 'auto' : 'none',
                }}
              >
                {category.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
