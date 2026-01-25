'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  Search,
  Mail,
  Info,
  FileText,
  Shield,
  Heart,
  Gamepad2,
  Newspaper,
  AlignLeft,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { useSidebar } from '@/components/SidebarContext';

interface Category {
  name: string;
  slug: string;
}

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category')?.toLowerCase() || 'all';
  const { toggleSidebar } = useSidebar();

  // Determine header style - white for news and static pages, dark for play
  const isNewsMain = pathname === '/news';
  const isNewsArticle = pathname.startsWith('/news/');
  // Static pages should now use the dark header as requested
  const isStaticPage = false;
  const isWhiteHeader = isNewsMain;

  // Header style
  const headerClass = isWhiteHeader
    ? 'bg-white border-b border-gray-200 sticky top-0 z-[110]'
    : 'bg-slate-800 border-b border-purple-500/20 sticky top-0 z-[110]';

  // Logo color
  const logoClass = isWhiteHeader
    ? 'text-2xl font-bold text-gray-900'
    : 'text-2xl font-bold text-white';
  const dotClass = 'text-purple-500';

  // Desktop menu link colors
  const playLinkClass = isWhiteHeader
    ? 'flex items-center gap-2 px-5 py-2 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-all shadow-md'
    : 'flex items-center gap-2 px-5 py-2 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/20';
  const newsLinkClass = isWhiteHeader
    ? 'flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-all'
    : 'flex items-center gap-2 px-5 py-2 bg-slate-700/50 text-gray-200 font-bold rounded-full hover:bg-slate-700 transition-all border border-slate-600/50';

  // Mobile menu button color
  const mobileMenuBtnClass = isWhiteHeader
    ? 'md:hidden text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors'
    : 'md:hidden text-white p-2 hover:bg-slate-700 rounded-lg transition-colors';

  // Mobile menu dropdown style
  const mobileMenuDropdownClass = isWhiteHeader
    ? 'md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto'
    : 'md:hidden fixed inset-0 top-16 bg-slate-800 z-40 overflow-y-auto';

  // Mobile menu link colors
  const mobilePlayLinkClass = isWhiteHeader
    ? 'flex items-center justify-center w-full py-3 px-4 bg-purple-600 text-white text-base font-bold rounded-xl hover:bg-purple-700 transition-all shadow-md mb-3'
    : 'flex items-center justify-center w-full py-3 px-4 bg-purple-600 text-white text-base font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/20 mb-3';
  const mobileNewsLinkClass = isWhiteHeader
    ? 'flex items-center justify-center w-full py-3 px-4 bg-gray-100 text-gray-900 text-base font-bold rounded-xl hover:bg-gray-200 transition-all border border-gray-200'
    : 'flex items-center justify-center w-full py-3 px-4 bg-slate-700/50 text-gray-200 text-base font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-600/50';

  // Search bar styles
  const searchContainerClass = isWhiteHeader
    ? 'relative flex-1 max-w-md mx-4'
    : 'relative flex-1 max-w-md mx-4';

  const searchInputClass = isWhiteHeader
    ? 'w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
    : 'w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all';

  const searchIconColor = isWhiteHeader ? '#6b7280' : '#9ca3af';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={headerClass}>
      <nav className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button (Desktop) */}
            <button
              onClick={toggleSidebar}
              className={`hidden md:flex p-2 rounded-lg transition-colors ${
                isWhiteHeader
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-300 hover:bg-slate-700'
              }`}
              aria-label="Toggle Sidebar"
            >
              <AlignLeft size={24} />
            </button>

            <Link href="/" className="flex items-center">
              <Image
                src="/puzzio.webp"
                alt="Puzzio"
                width={132}
                height={56}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>
            {/* Desktop menu - Hidden for now (Uncomment to reactivate) */}
            {/* <div className="hidden md:flex items-center gap-4">
              <Link href="/" className={playLinkClass}>
                <Gamepad2 size={18} />
                PLAY
              </Link>
              <Link href="/news" className={newsLinkClass}>
                <Newspaper size={18} />
                NEWS
              </Link>
            </div> */}
          </div>

          {/* Search bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className={`hidden md:flex ${searchContainerClass}`}
          >
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              color={searchIconColor}
            />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchInputClass}
            />
          </form>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={mobileMenuBtnClass}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} color={isWhiteHeader ? '#222' : '#fff'} />
            ) : (
              <Menu size={24} color={isWhiteHeader ? '#222' : '#fff'} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className={mobileMenuDropdownClass}>
          <div className="max-w-7xl mx-auto px-4 py-4 pb-24 space-y-3">
            {/* Mobile search bar */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                color={searchIconColor}
              />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={searchInputClass}
              />
            </form>

            {/* Hidden for now (Uncomment to reactivate) */}
            {/*
            <Link
              href="/"
              className={mobilePlayLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Gamepad2 size={20} className="mr-2" />
              PLAY
            </Link>
            <Link
              href="/news"
              className={mobileNewsLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Newspaper size={20} className="mr-2" />
              NEWS
            </Link>
            */}

            {/* Divider */}
            <div
              className={`my-2 border-t ${
                isWhiteHeader ? 'border-gray-200' : 'border-slate-700'
              }`}
            ></div>

            {/* Categories - Mobile only */}
            <div className="grid grid-cols-2 gap-2 mt-2">
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
                        ? '/'
                        : category.slug === 'new'
                          ? '/new'
                          : category.slug === 'trending'
                            ? '/trending'
                            : `/c/${category.slug}`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : isWhiteHeader
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium truncate">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div
              className={`my-4 border-t ${
                isWhiteHeader ? 'border-gray-200' : 'border-slate-700'
              }`}
            ></div>

            {/* Legal Pages - Mobile only */}
            <div className="flex flex-col gap-2">
              <Link
                href="/favorites"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isWhiteHeader
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart size={18} className="text-pink-500" />
                <span>My Favorites</span>
              </Link>
              <Link
                href="/contact"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isWhiteHeader
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Mail size={18} />
                <span>Contact us</span>
              </Link>
              <Link
                href="/about-us"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isWhiteHeader
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Info size={18} />
                <span>About</span>
              </Link>
              <Link
                href="/terms"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isWhiteHeader
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText size={18} />
                <span>Terms & conditions</span>
              </Link>
              <Link
                href="/privacy"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isWhiteHeader
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield size={18} />
                <span>Privacy</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
