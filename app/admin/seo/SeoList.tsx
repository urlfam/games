'use client';

import Link from 'next/link';
import { Edit, Folder, Tag as TagIcon } from 'lucide-react';

interface SeoEntry {
  slug: string;
  type: 'Category' | 'Tag';
  hasHeader: boolean;
  hasContent: boolean;
}

export default function SeoList({ entries }: { entries: SeoEntry[] }) {
  // Sort: Categories first, then Tags
  const sorted = [...entries].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'Category' ? -1 : 1;
    return a.slug.localeCompare(b.slug);
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md mt-6">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {sorted.map((entry) => (
          <li key={`${entry.type}-${entry.slug}`}>
            <div className="px-4 py-4 flex items-center justify-between sm:px-6">
              <div className="flex items-center min-w-0 flex-1">
                <div className="flex-shrink-0 mr-4">
                  {entry.type === 'Category' ? (
                    <Folder className="h-6 w-6 text-purple-400" />
                  ) : (
                    <TagIcon className="h-6 w-6 text-blue-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                    {entry.slug}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {entry.type} •{' '}
                    {entry.hasHeader ? 'Header set' : 'No Header'} •{' '}
                    {entry.hasContent ? 'Content set' : 'No Content'}
                  </p>
                </div>
              </div>
              <Link
                href={`/admin/seo/${entry.type}/${entry.slug}`}
                className="p-2 text-gray-400 hover:text-white hover:bg-blue-600 rounded-lg transition-all flex items-center gap-2"
              >
                <span className="text-xs font-bold uppercase hidden md:inline">
                  Edit
                </span>
                <Edit className="h-5 w-5" />
              </Link>
            </div>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="px-4 py-8 text-center text-gray-500">
            No SEO overrides found yet. Start by editing a category via the
            button above.
          </li>
        )}
      </ul>
    </div>
  );
}
