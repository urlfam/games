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
    
    // Redirect to the random game
    return NextResponse.redirect(new URL(`/game/${randomGame.slug}`, process.env.NEXT_PUBLIC_BASE_URL || 'https://puzzio.io'));
    
  } catch (error) {
    console.error('Error finding random game:', error);
    return NextResponse.redirect(new URL('/', 'https://puzzio.io'));
  }
}
