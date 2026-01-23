'use client';

import { useState } from 'react';
import { saveSeoContent } from '../../../actions';
import { Save, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface SeoEditorProps {
  slug: string;
  type: 'Category' | 'Tag';
  initialData: {
    header_desc?: string;
    main_content?: string;
  };
}

export default function SeoEditorClient({
  slug,
  type,
  initialData,
}: SeoEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    formData.append('slug', slug);
    formData.append('type', type);

    try {
      const result = await saveSeoContent(formData);
      if (result.success) {
        alert('SEO Content saved successfully!');
      }
    } catch (err) {
      alert(
        'Error saving: ' +
          (err instanceof Error ? err.message : 'Unknown error'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/seo"
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <ChevronLeft />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit {type} SEO</h1>
              <p className="text-purple-400">/{slug}</p>
            </div>
          </div>
          <button
            type="submit"
            form="seo-form"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <form id="seo-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Header Description</h2>
            <p className="text-sm text-gray-400 mb-2">
              Short text displayed at the top of the {type} page (Expandable).
            </p>
            <textarea
              name="header_desc"
              defaultValue={initialData.header_desc || ''}
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded p-4 text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Main Content (HTML)</h2>
            <p className="text-sm text-gray-400 mb-2">
              Long form content displayed at the bottom of the page. Supports
              full HTML.
            </p>
            <textarea
              name="main_content"
              defaultValue={initialData.main_content || ''}
              rows={20}
              className="w-full bg-slate-900 border border-slate-700 rounded p-4 text-green-400 font-mono text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
