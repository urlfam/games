'use client';

import { useState } from 'react';
import type { Game } from '@/lib/games';
import { logout, deleteGameAction, deleteAllGamesAction } from './actions';
import { Search, Edit, LogOut, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardClient({
  games = [],
}: {
  games: Game[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (slug: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce jeu ?')) return;

    setIsDeleting(true);
    try {
      await deleteGameAction(slug);
    } catch (e) {
      alert('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (
      !confirm(
        'ATTENTION : Voulez-vous vraiment TOUT supprimer ? Cette action est irréversible.',
      )
    )
      return;
    if (!confirm('Confirmation finale : Supprimer TOUS les jeux ?')) return;

    setIsDeleting(true);
    try {
      await deleteAllGamesAction();
    } catch (e) {
      alert('Erreur lors de la suppression totale');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter games safely
  const filteredGames = (games || []).filter(
    (g) =>
      (g.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.slug || '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDeleteAll}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-900 rounded text-sm transition-colors text-white font-bold"
          >
            <Trash2 className="w-4 h-4" />
            TOUT SUPPRIMER
          </button>
          <Link
            href="/admin/seo"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors text-white font-bold"
          >
            <FileText className="w-4 h-4" />
            Manage Category SEO
          </Link>
          <form action={logout}>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors text-white">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search games by title or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredGames.slice(0, 100).map((game) => (
            <li key={game.slug || game.id || Math.random()}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {game.image_url ? (
                      <img
                        src={game.image_url}
                        alt={game.title || 'Game Icon'}
                        className="h-10 w-10 rounded-md object-cover mr-4 bg-gray-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-700 mr-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                        {game.title || 'Untitled'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                        /{game.slug || 'no-slug'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {game.seo_title && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      SEO Active
                    </span>
                  )}
                  <Link
                    href={`/admin/games/${game.slug}`}
                    className="p-2 text-gray-400 hover:text-white hover:bg-blue-600 rounded-lg transition-all flex items-center gap-2"
                    title="Full Editor"
                  >
                    <span className="text-xs font-bold uppercase hidden md:inline">
                      Edit Full
                    </span>
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(game.slug || '')}
                    disabled={isDeleting}
                    className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-all"
                    title="Delete Game"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filteredGames.length > 100 && (
          <div className="p-4 text-center text-sm text-gray-500">
            Showing first 100 results. Use search to find specific games.
          </div>
        )}
      </div>
    </div>
  );
}
