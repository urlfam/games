'use client';

import { useState } from 'react';
import { Game } from '@/lib/games';
import { updateGameFull } from '../../actions';
import {
  Save,
  ChevronLeft,
  Image as ImageIcon,
  Search,
  Layout,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function GameEditor({ game }: { game: Game }) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateGameFull(formData);
      if (result.success) {
        alert('Game saved successfully!');
      }
    } catch (err) {
      alert(
        'Error saving game: ' +
          (err instanceof Error ? err.message : 'Unknown error'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const InputGroup = ({
    label,
    name,
    defaultValue,
    type = 'text',
    required = false,
    help = '',
  }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && '*'}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={5}
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:ring-2 focus:ring-purple-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:ring-2 focus:ring-purple-500"
        />
      )}
      {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
    </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <ChevronLeft />
            </Link>
            <h1 className="text-3xl font-bold">
              Edit Game: <span className="text-purple-400">{game.title}</span>
            </h1>
          </div>
          <button
            type="submit"
            form="game-form"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <form
          id="game-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'basic', label: 'Basic Info', icon: Layout },
              { id: 'media', label: 'Media & Images', icon: ImageIcon },
              { id: 'seo', label: 'SEO & Metadata', icon: Search },
              { id: 'advanced', label: 'Advanced & FAQ', icon: HelpCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}

            <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="font-bold text-gray-300 mb-2">Technical Info</h3>
              <div className="text-xs text-gray-500 space-y-1">
                <p>ID: {game.id}</p>
                <p>
                  Last Import: {new Date(game.importedAt).toLocaleDateString()}
                </p>
                <input type="hidden" name="id" value={game.id} />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            {/* TAB: BASIC INFO */}
            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
                <Layout className="text-purple-400" /> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <InputGroup
                    label="Game Title"
                    name="title"
                    defaultValue={game.title}
                    required
                  />
                </div>
                <InputGroup
                  label="Slug (URL Path)"
                  name="slug"
                  defaultValue={game.slug}
                  required
                  help="Changing this changes the URL!"
                />
                <InputGroup
                  label="Category"
                  name="category"
                  defaultValue={game.category}
                  required
                />
                <div className="col-span-2">
                  <InputGroup
                    label="Tags (Comma separated)"
                    name="tags"
                    defaultValue={game.tags?.join(', ')}
                  />
                </div>
                <div className="col-span-2">
                  <InputGroup
                    label="Description (HTML Supported)"
                    name="description"
                    defaultValue={game.description}
                    type="textarea"
                  />
                  <div className="mt-2 p-4 bg-slate-900 rounded text-sm text-gray-400 h-40 overflow-y-auto border border-slate-700">
                    <p className="mb-2 font-bold text-xs uppercase tracking-wider">
                      Preview:
                    </p>
                    <div
                      dangerouslySetInnerHTML={{ __html: game.description }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TAB: MEDIA */}
            <div className={activeTab === 'media' ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
                <ImageIcon className="text-purple-400" /> Media & Assets
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <InputGroup
                      label="Iframe URL (Game Source)"
                      name="iframe_url"
                      defaultValue={game.iframe_url}
                    />
                  </div>
                </div>

                <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
                  <h3 className="font-bold text-gray-300 mb-4">Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup
                      label="Main Image URL"
                      name="image_url"
                      defaultValue={game.image_url}
                    />
                    <InputGroup
                      label="Mobile Cover (2x3)"
                      name="mobile_image_url"
                      defaultValue={game.mobile_image_url}
                    />
                    <InputGroup
                      label="Mobile Icon (1x1)"
                      name="mobile_1x1_url"
                      defaultValue={game.mobile_1x1_url}
                    />
                  </div>
                </div>

                <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
                  <h3 className="font-bold text-gray-300 mb-4">
                    Video & Gameplay
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup
                      label="Video URL (MP4)"
                      name="video_url"
                      defaultValue={game.video_url}
                    />
                    <InputGroup
                      label="YouTube Embed URL"
                      name="youtube_video_url"
                      defaultValue={game.youtube_video_url}
                    />
                    <InputGroup
                      label="Gameplay Screenshot URL"
                      name="gameplay_screenshot_url"
                      defaultValue={game.gameplay_screenshot_url}
                    />
                    <InputGroup
                      label="Gameplay Filename"
                      name="gameplay_filename"
                      defaultValue={game.gameplay_filename}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TAB: SEO */}
            <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
                <Search className="text-purple-400" /> SEO Optimization
              </h2>

              <div className="space-y-4">
                <InputGroup
                  label="SEO Title (Page Title)"
                  name="seo_title"
                  defaultValue={(game as any).seo_title}
                  help="Defaults to 'Title - Play on Puzzio.io' if empty"
                />
                <InputGroup
                  label="SEO Description (Meta)"
                  name="seo_description"
                  defaultValue={(game as any).seo_description}
                  type="textarea"
                />

                <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50 mt-6">
                  <h3 className="font-bold text-gray-300 mb-4">
                    Image Metadata
                  </h3>
                  <InputGroup
                    label="Image Alt Text"
                    name="image_alt"
                    defaultValue={game.image_alt}
                  />
                  <InputGroup
                    label="Image Title Attribute"
                    name="image_title"
                    defaultValue={game.image_title}
                  />
                  <InputGroup
                    label="Image Long Description"
                    name="image_description"
                    defaultValue={game.image_description}
                    type="textarea"
                  />
                  <InputGroup
                    label="Image Keywords (Comma separated)"
                    name="image_keywords"
                    defaultValue={game.image_keywords?.join(', ')}
                  />
                </div>
              </div>
            </div>

            {/* TAB: ADVANCED */}
            <div className={activeTab === 'advanced' ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
                <HelpCircle className="text-purple-400" /> Advanced & FAQ
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  FAQ Schema (JSON Format)
                </label>
                <textarea
                  name="faq_schema"
                  defaultValue={JSON.stringify(game.faq_schema || [], null, 2)}
                  rows={15}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-4 text-green-400 font-mono text-sm focus:ring-2 focus:ring-purple-500"
                  spellCheck={false}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Must be a valid list of &#123; &quot;question&quot;:
                  &quot;...&quot;, &quot;answer&quot;: &quot;...&quot; &#125;
                  objects.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
