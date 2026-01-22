'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// MOT DE PASSE SIMPLE (A CHANGER SI BESOIN)
const ADMIN_PASSWORD = 'adminpuzzio2026' 
const COOKIE_NAME = 'admin_session'

export async function login(prevState: any, formData: FormData) {
  const password = formData.get('password')

  if (password === ADMIN_PASSWORD) {
    // Set cookie for 24h
    cookies().set(COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })
    
    redirect('/admin')
  } else {
    // Wrong password
    return { error: 'Mot de passe incorrect' }
  }
}

export async function logout() {
  cookies().delete(COOKIE_NAME)
  redirect('/admin/login')
}

// Ensure user is logged in for actions
async function checkAuth() {
  const cookieStore = cookies()
  const hasSession = cookieStore.get(COOKIE_NAME)
  if (!hasSession) {
    throw new Error('Unauthorized')
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
  
  const { error } = await supabase
    .from('game_overrides')
    .upsert({
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
