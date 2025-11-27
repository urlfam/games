'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // Determine header style - white for news and static pages, dark for play
  const isNewsMain = pathname === '/news';
  const isNewsArticle = pathname.startsWith('/news/');
  const isStaticPage = ['/contact', '/privacy', '/terms', '/about', '/about-us'].includes(pathname);
  const isWhiteHeader = isNewsMain || isStaticPage;

  // Header style
  const headerClass = isWhiteHeader
    ? 'bg-white border-b border-gray-200 sticky top-0 z-50'
    : 'bg-slate-800 border-b border-purple-500/20 sticky top-0 z-50';

  // Logo color
  const logoClass = isWhiteHeader
    ? 'text-2xl font-bold text-gray-900'
    : 'text-2xl font-bold text-white';
  const dotClass = 'text-purple-500';

  // Desktop menu link colors
  const playLinkClass = isWhiteHeader
    ? 'text-gray-600 font-medium hover:text-gray-900 transition-colors'
    : 'text-white font-medium hover:text-purple-400 transition-colors';
  const newsLinkClass = isWhiteHeader
    ? 'text-gray-900 font-medium hover:text-purple-500 transition-colors'
    : 'text-gray-400 font-medium hover:text-white transition-colors';

  // Mobile menu button color
  const mobileMenuBtnClass = isWhiteHeader
    ? 'md:hidden text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors'
    : 'md:hidden text-white p-2 hover:bg-slate-700 rounded-lg transition-colors';

  // Mobile menu dropdown style
  const mobileMenuDropdownClass = isWhiteHeader
    ? 'md:hidden border-t border-gray-200 bg-white'
    : 'md:hidden border-t border-slate-700 bg-slate-800';

  // Mobile menu link colors
  const mobilePlayLinkClass = isWhiteHeader
    ? 'block py-4 px-4 text-gray-900 text-base font-semibold hover:bg-gray-100 rounded-lg transition-colors'
    : 'block py-4 px-4 text-white text-base font-semibold hover:bg-slate-700/50 rounded-lg transition-colors';
  const mobileNewsLinkClass = isWhiteHeader
    ? 'block py-4 px-4 text-purple-600 text-base font-semibold hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors'
    : 'block py-4 px-4 text-gray-300 text-base font-semibold hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors';

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
      router.push(`/play?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={headerClass}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/play" className={logoClass}>
              Puzzio<span className={dotClass}>.io</span>
            </Link>
            {/* Desktop menu */}
            <div className="hidden md:flex gap-6">
              <Link href="/play" className={playLinkClass}>
                PLAY
              </Link>
              <Link href="/news" className={newsLinkClass}>
                NEWS
              </Link>
            </div>
          </div>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className={`hidden md:flex ${searchContainerClass}`}>
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
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
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

            <Link
              href="/play"
              className={mobilePlayLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              PLAY
            </Link>
            <Link
              href="/news"
              className={mobileNewsLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              NEWS
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
