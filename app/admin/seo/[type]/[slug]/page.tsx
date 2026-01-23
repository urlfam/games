import { getSeoData } from '@/lib/seo';
import SeoEditorClient from './SeoEditorClient';

export default async function EditSeoPage({
  params,
}: {
  params: { type: string; slug: string };
}) {
  const type = params.type as 'Category' | 'Tag';
  const slug = params.slug;

  const data = await getSeoData(slug, type);

  return <SeoEditorClient slug={slug} type={type} initialData={data || {}} />;
}
