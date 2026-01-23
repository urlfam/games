import { getAllSeoData } from '@/lib/seo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SeoList from './SeoList';
import SeoSelector from './SeoSelector';
import { getCategories, getAllTags } from '@/lib/games';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  const overrides = await getAllSeoData();
  const categories = await getCategories();
  const tags = await getAllTags();

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft />
          </Link>
          <h1 className="text-3xl font-bold">Category & Tag SEO</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex items-center gap-2 justify-center">
            <SeoSelector items={categories} type="Category" />
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">Tags</h2>
          <div className="flex items-center gap-2 justify-center">
            <SeoSelector items={tags} type="Tag" />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Existing Overrides</h2>
      <SeoList entries={overrides} />
    </div>
  );
}
