'use client';

import { Shuffle, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export default function FooterActions() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 mb-12 px-4">
      {/* Random Game Button */}
      <Link
        href="/api/random-game"
        prefetch={false} // Don't prefetch random route to keep it fresh
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full font-bold shadow-lg shadow-purple-900/20 transform hover:-translate-y-1 transition-all duration-200 group"
      >
        <Shuffle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        <span>Random Game</span>
      </Link>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full font-bold shadow-lg border border-slate-700 hover:border-slate-600 transform hover:-translate-y-1 transition-all duration-200 group"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
        <span>Back to Top</span>
      </button>
    </div>
  );
}
