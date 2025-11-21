import fs from 'fs/promises';
import path from 'path';

// Define the path to your local "database"
const GAMES_DB_PATH = path.join(process.cwd(), 'lib', 'games.json');

export interface Game {
  id: number;
  importedAt: string;
  title: string;
  description: string;
  iframe_url: string;
  image_url: string;
  category: string;
  page_url: string;
  slug?: string; // We will add this field later
}

/**
 * Reads the games.json file and returns all games.
 * @returns {Promise<Game[]>} A promise that resolves to an array of games.
 */
export async function getAllGames(): Promise<Game[]> {
  try {
    const data = await fs.readFile(GAMES_DB_PATH, 'utf-8');
    const games: Game[] = JSON.parse(data);
    
    // Add a 'slug' to each game based on its page_url for easier linking
    return games.map(game => ({
      ...game,
      slug: game.page_url.substring(game.page_url.lastIndexOf('/') + 1)
    }));
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    console.error("Could not read games.json:", error);
    return [];
  }
}

/**
 * Finds a single game by its slug.
 * @param {string} slug - The slug of the game to find.
 * @returns {Promise<Game | undefined>} A promise that resolves to the game object or undefined if not found.
 */
export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const games = await getAllGames();
  return games.find(game => game.slug === slug);
}
