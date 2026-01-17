'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import GameCard from './GameCard';
import { Game, MinimalGame } from '@/lib/games';

interface HorizontalGameSectionProps {
  title: string;
  games: (Game | MinimalGame)[];
  viewMoreLink?: string;
  viewMoreText?: string;
  badgeText?: string;
  maxGames?: number;
  showViewMore?: boolean;
  showBadge?: boolean;
  smallCards?: boolean;
}

export default function HorizontalGameSection({
  title,
  games,
  viewMoreLink,
  viewMoreText = 'View more',
  badgeText,
  maxGames = 40,
  showViewMore = true,
  showBadge = true,
  smallCards = false,
}: HorizontalGameSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      // Hide arrow if we're close to the end (within 10px)
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-2 px-1">
        <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
        {showViewMore && viewMoreLink && (
          <Link
            href={viewMoreLink}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            {viewMoreText}
          </Link>
        )}
      </div>
      <div className="relative group -mx-1 px-1">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2 pt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {games.slice(0, maxGames).map((game) => (
            <div
              key={game.id}
              className={`flex-shrink-0 p-0.5 ${
                smallCards
                  ? 'w-[160px] sm:w-[180px] md:w-[200px]'
                  : 'w-[200px] sm:w-[240px] md:w-[280px]'
              }`}
            >
              <GameCard game={game} />
            </div>
          ))}
          {/* View All Badge - Same size as game cards */}
          {showBadge && viewMoreLink && badgeText && (
            <Link
              href={viewMoreLink}
              className={`flex-shrink-0 p-0.5 ${
                smallCards
                  ? 'w-[160px] sm:w-[180px] md:w-[200px]'
                  : 'w-[200px] sm:w-[240px] md:w-[280px]'
              }`}
            >
              <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all cursor-pointer shadow-lg">
                <span className="text-white font-bold text-sm sm:text-base text-center px-2">
                  {badgeText}
                </span>
              </div>
            </Link>
          )}
        </div>
        {/* Scroll Arrow Right */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="hidden group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 bg-slate-900/90 hover:bg-slate-800 text-white p-3 rounded-full shadow-lg z-10 items-center justify-center"
            aria-label="Scroll right"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
