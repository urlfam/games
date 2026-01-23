'use client';

import { useRouter } from 'next/navigation';

export default function SeoSelector({
  items,
  type,
}: {
  items: { name: string; slug: string; count: number }[];
  type: 'Category' | 'Tag';
}) {
  const router = useRouter();

  return (
    <select
      className="bg-slate-900 border border-slate-700 rounded p-2 text-white max-w-xs"
      onChange={(e) => {
        if (e.target.value) {
          router.push(`/admin/seo/${type}/${e.target.value}`);
        }
      }}
    >
      <option value="">Select a {type} to Edit...</option>
      {items.map((item) => (
        <option key={item.slug} value={item.slug}>
          {item.name} ({item.count})
        </option>
      ))}
    </select>
  );
}
