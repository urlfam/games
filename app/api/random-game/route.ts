import { getAllGames } from '@/lib/games';
import { NextResponse } from 'next/server';

// Prevent caching so we get a "true" random game each request
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const games = await getAllGames();
    
    // Determine the base URL from the incoming request headers to support proper redirects behind Nginx/Docker
    const host = request.headers.get('host') || '147.93.7.103';
    // Force HTTP as requested for now, or respect header if safer
    const protocol = 'http'; 
    const baseUrl = `${protocol}://${host}`;
    
    if (!games || games.length === 0) {
      return NextResponse.redirect(`${baseUrl}/`);
    }

    const randomIndex = Math.floor(Math.random() * games.length);
    const randomGame = games[randomIndex];
    
    // Redirect to the random game
    return NextResponse.redirect(`${baseUrl}/game/${randomGame.slug}`);
    
  } catch (error) {
    console.error('Error finding random game:', error);
    return NextResponse.redirect('https://puzzio.io');
  }
}
