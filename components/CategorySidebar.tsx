'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  Clock,
  Sparkles,
  Flame,
  RefreshCw,
  Gamepad2,
  Users,
  UsersRound,
  Sword,
  Compass,
  Dumbbell,
  Crosshair,
  Spade,
  PersonStanding,
  MousePointer2,
  Car,
  Gem,
  Trophy,
  Ghost,
  Circle,
  Castle,
  PanelLeft,
  Music,
  Palette,
} from 'lucide-react';

// Category configuration with icons
const categories = [
  { name: 'Accueil', slug: 'all', icon: Home },
  { name: 'Joué récemment', slug: 'recent', icon: Clock },
  { name: 'Nouveaux', slug: 'new', icon: Sparkles },
  { name: 'Tendance', slug: 'trending', icon: Flame },
  { name: 'Mis à jour', slug: 'updated', icon: RefreshCw },
  { name: 'Originals', slug: 'originals', icon: Gamepad2 },
  { name: 'Multiplayer', slug: 'multiplayer', icon: Users },
  { name: '2 joueurs', slug: '2-player', icon: UsersRound },
  { name: 'Action', slug: 'action', icon: Sword },
  { name: 'Aventure', slug: 'adventure', icon: Compass },
  { name: 'Basketball', slug: 'basketball', icon: Dumbbell },
  { name: 'Billard', slug: 'billard', icon: Circle },
  { name: 'Cartes', slug: 'cards', icon: Spade },
  { name: 'Casual', slug: 'casual', icon: PersonStanding },
  { name: 'Clicker', slug: 'clicker', icon: MousePointer2 },
  { name: 'Conduite', slug: 'driving', icon: Car },
  { name: 'Défense de Tour', slug: 'tower-defense', icon: Castle },
  { name: 'Evasion', slug: 'escape', icon: PanelLeft },
  { name: 'Flash', slug: 'flash', icon: Music },
  { name: 'Football', slug: 'football', icon: Trophy },
  { name: 'Horreur', slug: 'horror', icon: Ghost },
  { name: '.io', slug: 'io', icon: Circle },
  { name: 'Mahjong', slug: 'mahjong', icon: Palette },
  { name: 'Tir', slug: 'shooting', icon: Crosshair },
  { name: 'Beauté', slug: 'beauty', icon: Gem },
];

export default function CategorySidebar() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category')?.toLowerCase() || 'all';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#1a1d29] flex flex-col py-4 transition-all duration-300 z-20 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent ${
        isHovered ? 'w-56' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <nav className="flex flex-col gap-1 mt-16 px-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive =
            activeCategory === category.slug ||
            (category.slug === 'all' && activeCategory === 'all');

          return (
            <Link
              key={category.slug}
              href={
                category.slug === 'all'
                  ? '/play'
                  : `/play?category=${category.slug}`
              }
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#7c3aed] text-white'
                  : 'text-gray-400 hover:bg-[#252836] hover:text-white'
              }`}
              title={category.name}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isHovered
                    ? 'opacity-100 w-auto'
                    : 'opacity-0 w-0'
                }`}
              >
                {category.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
