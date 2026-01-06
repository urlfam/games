import { getAllGames } from '@/lib/games';
import { NextResponse } from 'next/server';

// Prevent caching so we get a "true" random game each request
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const games = await getAllGames();
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;
    
    if (!games || games.length === 0) {
      return NextResponse.redirect(`${origin}/`);
    }

    const randomIndex = Math.floor(Math.random() * games.length);
    const randomGame = games[randomIndex];
    
    // Redirect to the random game
    return NextResponse.redirect(`${origin}/game/${randomGame.slug}`);
    
  } catch (error) {
    console.error('Error finding random game:', error);
    // Fallback if request available, otherwise hardcoded
    try {
        const url = new URL(request.url);
        return NextResponse.redirect(`${url.origin}/`);
    } catch {
        return NextResponse.redirect('https://puzzio.io');
    }
  }
}
