import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Simple Supabase client without cookies (for ISR pages)
// This allows using revalidate without triggering dynamic rendering
export function createServerClientSimple() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
