import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the path to your local "database"
const GAMES_DB_PATH = path.join(process.cwd(), 'lib', 'games.json');

// --- Helper function to read the database ---
async function getGames() {
  try {
    const data = await fs.readFile(GAMES_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    return [];
  }
}

// --- Helper function to write to the database ---
async function saveGames(games: any) {
  await fs.writeFile(GAMES_DB_PATH, JSON.stringify(games, null, 2), 'utf-8');
}

/**
 * API Route to import a new game.
 * This is a POST request handler.
 * @param {Request} req - The incoming request object.
 */
export async function POST(req: Request) {
  // 1. --- Security Check ---
  // Check for a secret token in the authorization header
  const authToken = req.headers.get('Authorization')?.split(' ')[1];
  const N8N_SECRET_TOKEN = process.env.N8N_SECRET_TOKEN;

  if (!N8N_SECRET_TOKEN || authToken !== N8N_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. --- Get the new game data from the request body ---
    const newGame = await req.json();

    // Basic validation
    if (!newGame.title || !newGame.iframe_url) {
      return NextResponse.json(
        { message: 'Missing required fields: title and iframe_url' },
        { status: 400 },
      );
    }

    // 3. --- Add the new game to our "database" ---
    const allGames = await getGames();

    // Check if the game already exists (based on title or page_url)
    const gameExists = allGames.some(
      (game: any) => game.title === newGame.title || game.page_url === newGame.page_url
    );

    if (gameExists) {
      return NextResponse.json(
        { message: `Game "${newGame.title}" already exists.` },
        { status: 200 } // Use 200 OK to not show an error in n8n for duplicates
      );
    }

    // Add a unique ID and import date
    const gameToSave = {
      id: allGames.length + 1,
      importedAt: new Date().toISOString(),
      ...newGame,
    };

    allGames.push(gameToSave);
    await saveGames(allGames);

    console.log(`Successfully imported game: ${newGame.title}`);

    // 4. --- Send a success response ---
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
  }
}
