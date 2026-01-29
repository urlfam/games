'use client';

import { useState } from 'react';
import { saveSeoContent } from '../../../actions';
import { Save, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface SeoEditorProps {
  slug: string;
  type: 'Category' | 'Tag';
  initialData: {
    header_desc?: string;
    main_content?: string;
    faq_schema?: { question: string; answer: string }[];
  };
}

export default function SeoEditorClient({
  slug,
  type,
  initialData,
}: SeoEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    initialData.faq_schema || [],
  );

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFaq = (
    index: number,
    field: 'question' | 'answer',
    value: string,
  ) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

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
      } else if (result.error) {
        alert('Error saving: ' + result.error);
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
          <input type="hidden" name="faq_schema" value={JSON.stringify(faqs)} />

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

          {/* FAQ Section */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">FAQ Schema</h2>
                <p className="text-sm text-gray-400">
                  Structured Data for Google & FAQ Accordion on page.
                </p>
              </div>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold transition-colors"
              >
                <Plus size={16} /> Add Question
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-slate-900 p-4 rounded border border-slate-700 flex gap-4 items-start"
                >
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-xs uppercase text-gray-500 font-bold mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) =>
                          updateFaq(index, 'question', e.target.value)
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Is this game free?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 font-bold mb-1">
                        Answer (HTML Supported)
                      </label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) =>
                          updateFaq(index, 'answer', e.target.value)
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:ring-2 focus:ring-blue-500 font-mono"
                        placeholder="Ex: Yes, <b>totally free</b> to play!"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="p-2 text-red-500 hover:bg-red-900/30 rounded transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              {faqs.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed border-gray-700 rounded">
                  No FAQs added yet.
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
