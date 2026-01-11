'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function Pagination({ totalItems, itemsPerPage, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Show pagination only if there is more than one page
  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Helper to generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, current, and surrounding
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
      {/* Previous Button */}
      <Link
        href={createPageURL(currentPage > 1 ? currentPage - 1 : 1)}
        className={`p-2 rounded-lg transition-colors ${
          currentPage <= 1 
            ? 'text-gray-600 pointer-events-none' 
            : 'text-white hover:bg-slate-700 bg-slate-800'
        }`}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft size={20} />
      </Link>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            );
          }
          
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`px-3 py-2 rounded-lg transition-colors min-w-[40px] text-center ${
                currentPage === page
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-gray-300 hover:bg-slate-700 bg-slate-800'
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      <Link
        href={createPageURL(currentPage < totalPages ? currentPage + 1 : totalPages)}
        className={`p-2 rounded-lg transition-colors ${
          currentPage >= totalPages 
            ? 'text-gray-600 pointer-events-none' 
            : 'text-white hover:bg-slate-700 bg-slate-800'
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
