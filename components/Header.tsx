'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Determine header style for News main vs News article
  const isNewsMain = pathname === '/news';
  const isNewsArticle = pathname.startsWith('/news/');

  // Header style
  const headerClass = isNewsMain
    ? 'bg-white border-b border-gray-200 sticky top-0 z-50'
    : 'bg-slate-800 border-b border-purple-500/20 sticky top-0 z-50';

  // Logo color
  const logoClass = isNewsMain
    ? 'text-2xl font-bold text-gray-900'
    : 'text-2xl font-bold text-white';
  const dotClass = 'text-purple-500';

  // Desktop menu link colors
  const playLinkClass = isNewsMain
    ? 'text-gray-600 font-medium hover:text-gray-900 transition-colors'
    : 'text-white font-medium hover:text-purple-400 transition-colors';
  const newsLinkClass = isNewsMain
    ? 'text-gray-900 font-medium hover:text-purple-500 transition-colors'
    : 'text-gray-400 font-medium hover:text-white transition-colors';

  // Mobile menu button color
  const mobileMenuBtnClass = isNewsMain
    ? 'md:hidden text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors'
    : 'md:hidden text-white p-2 hover:bg-slate-700 rounded-lg transition-colors';

  // Mobile menu dropdown style
  const mobileMenuDropdownClass = isNewsMain
    ? 'md:hidden border-t border-gray-200 bg-white'
    : 'md:hidden border-t border-slate-700 bg-slate-800';

  // Mobile menu link colors
  const mobilePlayLinkClass = isNewsMain
    ? 'block py-4 px-4 text-gray-900 text-base font-semibold hover:bg-gray-100 rounded-lg transition-colors'
    : 'block py-4 px-4 text-white text-base font-semibold hover:bg-slate-700/50 rounded-lg transition-colors';
  const mobileNewsLinkClass = isNewsMain
    ? 'block py-4 px-4 text-purple-600 text-base font-semibold hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors'
    : 'block py-4 px-4 text-gray-300 text-base font-semibold hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors';

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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={mobileMenuBtnClass}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} color={isNewsMain ? '#222' : '#fff'} />
            ) : (
              <Menu size={24} color={isNewsMain ? '#222' : '#fff'} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className={mobileMenuDropdownClass}>
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
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
