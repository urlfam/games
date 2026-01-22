'use client';

import { useState } from 'react';
import { Game } from '@/lib/games';
import { updateGameMetadata, logout } from './actions';
import { Search, Edit, Loader2, LogOut } from 'lucide-react';

export default function AdminDashboardClient({ games }: { games: Game[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filter games
  const filteredGames = games.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (formData: FormData) => {
    setIsSaving(true);
    try {
      const result = await updateGameMetadata(formData);
      if (result.success) {
        setEditingGame(null);
        // Ideally we would update the local state here too, but revalidatePath in action triggers a refresh
      }
    } catch (e) {
      alert('Failed to save settings. ' + (e instanceof Error ? e.message : ''));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <form action={logout}>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors text-white">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </form>
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
            <li key={game.slug || game.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={game.image_url}
                      alt={game.title}
                      className="h-10 w-10 rounded-md object-cover mr-4 bg-gray-200"
                    />
                  </div>
                  <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                        {game.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                        /{game.slug}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {game.seo_title && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      On Override
                    </span>
                  )}
                  <button
                    onClick={() => setEditingGame(game)}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Edit className="h-5 w-5" />
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

      {editingGame && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
              Edit Metadata: {editingGame.title}
            </h3>
            <form action={handleSave}>
              <input type="hidden" name="slug" value={editingGame.slug} />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SEO Title
                </label>
                <input
                  name="seo_title"
                  defaultValue={editingGame.seo_title || editingGame.title}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm p-2 border"
                  placeholder="Page Title"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Will replace the default title tag.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SEO Description
                </label>
                <textarea
                  name="seo_description"
                  defaultValue={
                    editingGame.seo_description ||
                    editingGame.description?.substring(0, 160)
                  }
                  rows={4}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm p-2 border"
                  placeholder="Meta Description"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
