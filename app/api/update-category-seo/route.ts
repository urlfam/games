import { NextResponse } from 'next/server';
import { updateSeoData, SeoData } from '@/lib/seo';

export async function POST(req: Request) {
  // 1. --- Security Check ---
  const authToken = req.headers.get('Authorization')?.split(' ')[1];
  const N8N_SECRET_TOKEN = process.env.N8N_SECRET_TOKEN;

  // Ideally user should provide N8N_SECRET_TOKEN in env.
  // If not set in env, it might be unsafe, but we follow the pattern.
  // Warning: If N8N_SECRET_TOKEN is not set in env, this check might fail or be weird depending on logic.
  // But here if (!N8N_SECRET_TOKEN) it returns 401, which is safe failure.
  if (!N8N_SECRET_TOKEN || authToken !== N8N_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Basic validation
    if (!body.slug || !body.type) {
      return NextResponse.json(
        { message: 'Missing slug or type' },
        { status: 400 },
      );
    }

    if (body.type !== 'Category' && body.type !== 'Tag') {
      return NextResponse.json(
        { message: 'Invalid type. Must be Category or Tag' },
        { status: 400 },
      );
    }

    const seoData: SeoData = {
      slug: body.slug,
      type: body.type,
      header_desc: body.header_desc,
      main_content: body.main_content,
      faq_schema:
        typeof body.faq_schema === 'string'
          ? JSON.parse(body.faq_schema)
          : body.faq_schema,
    };

    await updateSeoData(seoData);

    return NextResponse.json({ message: 'SEO data updated successfully' });
  } catch (error) {
    console.error('Error updating SEO data:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
