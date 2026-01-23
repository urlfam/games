'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { saveGame, Game, getGameBySlug } from '@/lib/games';
import { updateSeoData, SeoData } from '@/lib/seo';

// MOT DE PASSE SIMPLE (STOCKÉ MAINTENANT DANS ENV)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpuzzio2026';
const COOKIE_NAME = 'admin_session';

export async function login(prevState: any, formData: FormData) {
  const password = formData.get('password');

  if (password === ADMIN_PASSWORD) {
    // Set cookie for 24h
    cookies().set(COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    redirect('/admin');
  } else {
    // Wrong password
    return { error: 'Mot de passe incorrect' };
  }
}

export async function logout() {
  cookies().delete(COOKIE_NAME);
  redirect('/admin/login');
}

// Ensure user is logged in for actions
async function checkAuth() {
  const cookieStore = cookies();
  const hasSession = cookieStore.get(COOKIE_NAME);
  if (!hasSession) {
    throw new Error('Unauthorized');
  }
}

export async function updateGameMetadata(formData: FormData) {
  await checkAuth();

  const slug = formData.get('slug') as string;
  const seo_title = formData.get('seo_title') as string;
  const seo_description = formData.get('seo_description') as string;

  if (!slug) throw new Error('Slug is required');

  const supabase = await createClient(); // Still need Supabase to save data, but admin access is guarded by password

  // Note: RLS policies on 'game_overrides' must allow ANON writes or we need a service role key.
  // Ideally we use a service role client here if we want to bypass RLS, OR we make sure RLS allows anon updates IF we trust this backend action.
  // Since this is a server action protected by our password check, it is "safe" to act as admin.
  // HOWEVER, the public Supabase client is Anon.

  // OPTION: We will rely on the fact that ONLY this server action calls the update, and we trust it.
  // We need to use SERVICE_ROLE_KEY to bypass RLS if the user isn't logged into Supabase Auth.

  // For simplicity now: We will use the existing client.
  // IMPORTANT: You need to Run the SQL to allow public inserts OR use a secret key here.
  // Let's assume you ran the SQL but let's make it work without Supabase Auth Login.

  // We'll use a Service Role client for Admin actions to bypass RLS
  // But since we don't have it in env vars typically exposed... let's check .env.local

  // Fallback: Just try with the normal client. If it fails due to RLS, we need to adjust RLS.
  // Adjusting SQL is easier for you.

  const { error } = await supabase.from('game_overrides').upsert({
    slug,
    seo_title: seo_title || null,
    seo_description: seo_description || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Update error:', error);
    throw new Error('Failed to update: ' + error.message);
  }

  revalidatePath('/admin');
  revalidatePath(`/game/${slug}`);

  return { success: true };
}

export async function updateGameFull(formData: FormData) {
  await checkAuth();

  const id = Number(formData.get('id'));
  const slug = formData.get('slug') as string;

  if (!slug) throw new Error('Slug is required');

  // Verify existence (optional, saveGame handles it, but good for safety)
  // const existing = await getGameBySlug(slug);

  // Parse Tags
  const tagsString = formData.get('tags') as string;
  const tags = tagsString
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  // Parse FAQ - Handle as JSON string from the editor
  const faqJson = formData.get('faq_schema') as string;
  let faq_schema = [];
  try {
    faq_schema = faqJson ? JSON.parse(faqJson) : [];
  } catch (e) {
    console.error('Invalid FAQ JSON', e);
  }

  // Construct Game Object
  const game: Game = {
    id: id, // if 0 or NaN, saveGame might treat as new if we handle it logic-wise, but here we expect edit
    slug: slug,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    page_url: `https://puzzio.io/game/${slug}`, // Maintain consistency
    iframe_url: formData.get('iframe_url') as string,

    // Media
    image_url: formData.get('image_url') as string,
    mobile_image_url: formData.get('mobile_image_url') as string,
    mobile_1x1_url: formData.get('mobile_1x1_url') as string,
    video_url: formData.get('video_url') as string,
    youtube_video_url: formData.get('youtube_video_url') as string,
    gameplay_screenshot_url: formData.get('gameplay_screenshot_url') as string,
    gameplay_filename: formData.get('gameplay_filename') as string,

    // SEO / Metadata
    seo_title: formData.get('seo_title') as string,
    seo_description: formData.get('seo_description') as string,
    image_alt: formData.get('image_alt') as string,
    image_title: formData.get('image_title') as string,
    image_description: formData.get('image_description') as string,
    image_keywords: (formData.get('image_keywords') as string)
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean),

    tags: tags,
    faq_schema: faq_schema,

    importedAt: new Date().toISOString(), // Should we update this? Maybe keep original?
    // If edits, maybe keep original. Let's try to preserve it if passed, or just don't update if strictly editing.
    // saveGame does a merge.
  } as Game; // Type assertion since we might miss some fields if not careful, but saveGame merges.

  // However, saveGame in lib/games.ts REPLACES the object at index if found.
  // So we must be careful to include EVERYTHING or fetch-merge-save.
  // My saveGame implementation: games[index] = { ...games[index], ...updatedGame };
  // It merges! So we are safe if we omit fields like importedAt.

  await saveGame(game);

  revalidatePath('/admin');
  revalidatePath(`/game/${slug}`);
  revalidatePath(`/admin/games/${slug}`); // Revalidate the editor itself

  return { success: true };
}

export async function saveSeoContent(formData: FormData) {
  await checkAuth();

  const slug = formData.get('slug') as string;
  const type = formData.get('type') as 'Category' | 'Tag';
  const header_desc = formData.get('header_desc') as string;
  const main_content = formData.get('main_content') as string;

  if (!slug || !type) {
    throw new Error('Missing slug or type');
  }

  const seoData: SeoData = {
    slug,
    type,
    header_desc,
    main_content,
  };

  await updateSeoData(seoData);

  // Revalidate relevant paths
  revalidatePath('/admin/seo');
  if (type === 'Category') {
    revalidatePath(`/c/${slug}`);
    revalidatePath(`/`); // Home page handles categories too
  } else {
    revalidatePath(`/tag/${slug}`);
    revalidatePath(`/t/${slug}`);
  }

  return { success: true };
}
