import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// The data directory is now inside the container, at a writable location.
const DATA_DIR = path.join(process.cwd(), 'data');
const GAMES_DB_PATH = path.join(DATA_DIR, 'games.json');

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
    return NextResponse.json(
      { message: 'Service busy, try again in a moment.' },
      { status: 429 },
    );
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
      await fs.mkdir(DATA_DIR, { recursive: true });
      const data = await fs.readFile(GAMES_DB_PATH, 'utf-8');
      allGames = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, we'll create it.
    }

    // 4. --- Add the new game if it doesn't exist ---
    const gameExists = allGames.some(
      (game: any) =>
        game.title === newGame.title || game.page_url === newGame.page_url,
    );

    if (gameExists) {
      return NextResponse.json(
        { message: `Game "${newGame.title}" already exists.` },
        { status: 200 },
      );
    }

    const gameToSave = {
      id: allGames.length > 0 ? Math.max(...allGames.map((g) => g.id)) + 1 : 1,
      importedAt: new Date().toISOString(),
      ...newGame,
    };

    // Add new game at the beginning of the array (most recent first)
    allGames.unshift(gameToSave);

    // 5. --- Write the entire file back ---
    await saveGames(allGames);

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

async function saveGames(games: any) {
  try {
    // Ensure the directory exists before writing the file
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(GAMES_DB_PATH, JSON.stringify(games, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving games:', error);
  }
}
