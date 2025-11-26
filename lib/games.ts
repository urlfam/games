import fs from 'fs/promises';
import path from 'path';

// The data directory is now inside the container, at a writable location.
const DATA_DIR = path.join(process.cwd(), 'data');
const GAMES_DB_PATH = path.join(DATA_DIR, 'games.json');

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
    return games.map((game) => ({
      ...game,
      slug: game.page_url.substring(game.page_url.lastIndexOf('/') + 1),
    }));
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    console.error('Could not read games.json:', error);
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
  return games.find((game) => game.slug === slug);
}

/**
 * Gets all unique categories from games with their count.
 * @returns {Promise<Array<{name: string, count: number, slug: string}>>} Array of categories with game count.
 */
export async function getCategories(): Promise<
  Array<{ name: string; count: number; slug: string }>
> {
  const games = await getAllGames();
  const categoryMap = new Map<string, number>();

  games.forEach((game) => {
    const category = game.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }))
    .sort((a, b) => b.count - a.count); // Sort by game count descending
}

/**
 * Gets new games (recently imported).
 * @param {number} limit - Maximum number of games to return.
 * @returns {Promise<Game[]>} Array of newest games.
 */
export async function getNewGames(limit: number = 20): Promise<Game[]> {
  const games = await getAllGames();
  return games
    .sort(
      (a, b) =>
        new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime(),
    )
    .slice(0, limit);
}

/**
 * Gets trending/popular games.
 * For now, returns random selection. In future, can use view counts.
 * @param {number} limit - Maximum number of games to return.
 * @returns {Promise<Game[]>} Array of trending games.
 */
export async function getTrendingGames(limit: number = 20): Promise<Game[]> {
  const games = await getAllGames();
  // Shuffle array and take limit
  const shuffled = [...games].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}
