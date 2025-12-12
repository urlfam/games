import { NextResponse } from 'next/server';
import { getAllGames } from '@/lib/games';

// Force dynamic rendering for N8N workflow
// N8N needs immediate access to latest data to prevent duplicates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const games = await getAllGames();
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}
