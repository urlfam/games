'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Mail, Info, FileText, Shield, Gamepad } from 'lucide-react';
import { getCategoryIcon } from '@/lib/categoryIcons';

interface Category {
  name: string;
  slug: string;
}

interface CategorySidebarClientProps {
  categories: Category[];
}

export default function CategorySidebarClient({
  categories,
}: CategorySidebarClientProps) {
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
      {/* Categories */}
      <nav className="flex flex-col gap-1 mt-16 px-2 flex-1">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.slug);
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
          className={`flex items-center justify-center mb-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full transition-all duration-200 font-semibold ${
            isHovered
              ? 'gap-2 px-4 py-3'
              : 'w-12 h-12 mx-auto'
          }`}
          title="Contact us"
        >
          <Mail size={20} className="flex-shrink-0" />
          {isHovered && (
            <span className="whitespace-nowrap">
              Contact us
            </span>
          )}
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
            href="/play"
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
  );
}
