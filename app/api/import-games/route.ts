import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the path to your local "database"
const LIB_DIR = path.join(process.cwd(), 'lib');
const GAMES_DB_PATH = path.join(LIB_DIR, 'games.json');

// This is a simple file-based lock to prevent race conditions.
let isWriting = false;

/**
 * API Route to import a new game.
 * This is a POST request handler.
 * @param {Request} req - The incoming request object.
 */
export async function POST(req: Request) {
  // 1. --- Security Check ---
  const authToken = req.headers.get('Authorization')?.split(' ')[1];
  const N8N_SECRET_TOKEN = process.env.N8N_SECRET_TOKEN;

  if (!N8N_SECRET_TOKEN || authToken !== N8N_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Prevent multiple writes at the same time
  if (isWriting) {
    return NextResponse.json({ message: 'Service busy, try again in a moment.' }, { status: 429 });
  }

  try {
    isWriting = true; // Lock the file

    // 2. --- Get the new game data from the request body ---
    const newGame = await req.json();

    if (!newGame.title || !newGame.iframe_url) {
      return NextResponse.json(
        { message: 'Missing required fields: title and iframe_url' },
        { status: 400 },
      );
    }

    // 3. --- Read existing games ---
    let allGames: any[] = [];
    try {
      await fs.mkdir(LIB_DIR, { recursive: true });
      const data = await fs.readFile(GAMES_DB_PATH, 'utf-8');
      allGames = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, we'll create it.
    }

    // 4. --- Add the new game if it doesn't exist ---
    const gameExists = allGames.some(
      (game: any) => game.title === newGame.title || game.page_url === newGame.page_url
    );

    if (gameExists) {
      return NextResponse.json(
        { message: `Game "${newGame.title}" already exists.` },
        { status: 200 }
      );
    }

    const gameToSave = {
      id: allGames.length > 0 ? Math.max(...allGames.map(g => g.id)) + 1 : 1,
      importedAt: new Date().toISOString(),
      ...newGame,
    };

    allGames.push(gameToSave);

    // 5. --- Write the entire file back ---
    await fs.writeFile(GAMES_DB_PATH, JSON.stringify(allGames, null, 2), 'utf-8');

    console.log(`Successfully imported game: ${newGame.title}`);

    return NextResponse.json(
      { message: `Successfully imported game: ${newGame.title}` },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error importing game:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 },
    );
  } finally {
    isWriting = false; // Unlock the file
  }
}
