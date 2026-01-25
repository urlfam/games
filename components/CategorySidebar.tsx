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
  Mail,
  Info,
  FileText,
  Shield,
  Gamepad,
} from 'lucide-react';

// Category configuration with icons
const categories = [
  { name: 'Home', slug: 'all', icon: Home },
  { name: 'Recently played', slug: 'recent', icon: Clock },
  { name: 'New', slug: 'new', icon: Sparkles },
  { name: 'Popular Games', slug: 'trending', icon: Flame },
  { name: 'Updated', slug: 'updated', icon: RefreshCw },
  { name: 'Originals', slug: 'originals', icon: Gamepad2 },
  { name: 'Multiplayer', slug: 'multiplayer', icon: Users },
  { name: '2 Player', slug: '2-player', icon: UsersRound },
  { name: 'Action', slug: 'action', icon: Sword },
  { name: 'Adventure', slug: 'adventure', icon: Compass },
  { name: 'Basketball', slug: 'basketball', icon: Dumbbell },
  { name: 'Pool', slug: 'pool', icon: Circle },
  { name: 'Card', slug: 'cards', icon: Spade },
  { name: 'Casual', slug: 'casual', icon: PersonStanding },
  { name: 'Clicker', slug: 'clicker', icon: MousePointer2 },
  { name: 'Driving', slug: 'driving', icon: Car },
  { name: 'Tower Defense', slug: 'tower-defense', icon: Castle },
  { name: 'Escape', slug: 'escape', icon: PanelLeft },
  { name: 'Flash', slug: 'flash', icon: Music },
  { name: 'Soccer', slug: 'soccer', icon: Trophy },
  { name: 'Horror', slug: 'horror', icon: Ghost },
  { name: '.io', slug: 'io', icon: Circle },
  { name: 'Mahjong', slug: 'mahjong', icon: Palette },
  { name: 'Shooting', slug: 'shooting', icon: Crosshair },
  { name: 'Puzzle', slug: 'puzzle', icon: Gem },
];

export default function CategorySidebar() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category')?.toLowerCase() || 'all';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Inject custom CSS to hide on mobile */}
      <style jsx>{`
        @media (max-width: 767px) {
          .category-sidebar {
            display: none !important;
          }
        }
      `}</style>

      <aside
        className={`category-sidebar fixed top-0 left-0 h-full bg-[#1a1d29] flex flex-col py-4 transition-all duration-300 z-[100] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent ${
          isHovered ? 'w-56' : 'w-16'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Categories */}
        <nav className="flex flex-col gap-1 mt-16 px-2 flex-1">
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
                    ? '/'
                    : category.slug === 'new'
                      ? '/new'
                      : category.slug === 'trending'
                        ? '/trending'
                        : `/c/${category.slug}`
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
                    isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                  }`}
                >
                  {category.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Contact Button & Links */}
        <div className="px-2 mt-4 border-t border-gray-700 pt-4">
          {/* Contact Us Button */}
          <Link
            href="/contact"
            className={`flex items-center gap-2 mb-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full transition-all duration-200 font-semibold ${
              isHovered
                ? 'justify-start px-4 py-3'
                : 'justify-center w-12 h-12 mx-auto'
            }`}
            title="Contact us"
          >
            <Mail size={20} className="flex-shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              Contact us
            </span>
          </Link>

          {/* Footer Links */}
          <div className="flex flex-col gap-1">
            <Link
              href="/about-us"
              className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              title="About"
            >
              <Info size={18} className="flex-shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                About
              </span>
            </Link>

            <Link
              href="/terms"
              className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              title="Terms & conditions"
            >
              <FileText size={18} className="flex-shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                Terms & conditions
              </span>
            </Link>

            <Link
              href="/privacy"
              className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              title="Privacy"
            >
              <Shield size={18} className="flex-shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                Privacy
              </span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              title="All games"
            >
              <Gamepad size={18} className="flex-shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                All games
              </span>
            </Link>
          </div>

          {/* Copyright */}
          <div className="mt-4 px-3">
            <p
              className={`text-gray-500 text-xs transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              © 2025 Puzzio.io
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
