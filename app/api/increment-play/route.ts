import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { gameSlug } = await request.json();

    if (!gameSlug) {
      return NextResponse.json({ error: 'Missing gameSlug' }, { status: 400 });
    }

    const supabase = await createClient();

    // Increment play count using RPC
    const { error } = await supabase.rpc('increment_play_count', {
      p_game_slug: gameSlug,
    });

    if (error) {
      console.error('[API increment-play] RPC error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API increment-play] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
