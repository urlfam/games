import { getAllGames } from '@/lib/games';
import { NextResponse } from 'next/server';

// Prevent caching so we get a "true" random game each request
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const games = await getAllGames();
    
    if (!games || games.length === 0) {
      return NextResponse.redirect('/');
    }

    const randomIndex = Math.floor(Math.random() * games.length);
    const randomGame = games[randomIndex];

    // Build the absolute URL if needed, or relative
    // Next.js NextResponse.redirect handles relative paths nicely or absolute URLs.
    // We want to redirect to current_origin/game/[slug]
    const url = new NextResponse('').nextUrl.clone();
    url.pathname = `/game/${randomGame.slug}`;
    
    // Easier way using relative path if on same domain:
    return NextResponse.redirect(new URL(`/game/${randomGame.slug}`, process.env.NEXT_PUBLIC_BASE_URL || 'https://puzzio.io'));
    
  } catch (error) {
    console.error('Error finding random game:', error);
    return NextResponse.redirect(new URL('/', 'https://puzzio.io'));
  }
}
