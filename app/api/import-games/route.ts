import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// The data directory is now inside the container, at a writable location.
const DATA_DIR = path.join(process.cwd(), 'data');
const GAMES_DB_PATH = path.join(DATA_DIR, 'games.json');
const PREVIEWS_DIR = path.join(process.cwd(), 'public', 'previews');

// This is a simple file-based lock to prevent race conditions.
let isWriting = false;

/**
 * API Route to import a new game.
 * This is a POST request handler.
 * @param {Request} req - The incoming request object.
 */
export async function POST(req: Request) {
  console.error('[ImportAuth] Request received');
  
  // 1. --- Security Check ---
  let authHeader = req.headers.get('Authorization') || '';
  
  // Cleanup incoming header: remove 'Bearer' prefix (case insensitive)
  // We do this BEFORE removing quotes to handle cases like "Bearer TOKEN"
  authHeader = authHeader.replace(/^Bearer\s+/i, '').trim();

  // Remove surrounding quotes if the user configured n8n with "Value"
  if ((authHeader.startsWith('"') && authHeader.endsWith('"')) || 
      (authHeader.startsWith("'") && authHeader.endsWith("'"))) {
    authHeader = authHeader.slice(1, -1);
  }
  
  // Final trim just in case
  const clientToken = authHeader.trim();
  
  // Normalize server token
  // FALLBACK: Hardcoded token if env var is missing (Emergency fix)
  let serverToken = process.env.N8N_SECRET_TOKEN || 'changeMe_a1b2c3d4e5f6_make_this_secret_and_long';
  
  // Aggressive cleanup: remove surrounding quotes, trim whitespace/newlines
  serverToken = serverToken.trim();
  if ((serverToken.startsWith('"') && serverToken.endsWith('"')) || 
      (serverToken.startsWith("'") && serverToken.endsWith("'"))) {
    serverToken = serverToken.slice(1, -1);
  }
  
  // Helper to handle potential double-escaping in some environments
  serverToken = serverToken.replace(/\\"/g, '"');

  if (!serverToken || clientToken !== serverToken) {
    const msg = `[ImportAuth] FAILED: Tokens do not match. Client len=${clientToken.length}, Server len=${serverToken.length}`;
    console.error(msg);
    return NextResponse.json({ 
      message: 'Unauthorized', 
      debug_info: msg + `. Server token exists: ${!!serverToken}`
    }, { status: 401 });
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

    // --- FIX: Sanitize Tags (Handle malformed n8n/scraper output) ---
    // Correction pour les tags mal formatés (ex: '["Mobile"', '"2D"')
    if (newGame.tags && Array.isArray(newGame.tags)) {
      newGame.tags = newGame.tags.map((tag: any) => {
        if (typeof tag !== 'string') return tag;
        let clean = tag.trim();
        // Cas 1: Le tag commence par [" (artefact de split incorrect)
        if (clean.startsWith('["')) clean = clean.substring(2);
        // Cas 2: Le tag finit par "]
        if (clean.endsWith('"]')) clean = clean.substring(0, clean.length - 2);
        // Cas 3: Le tag a des guillemets autour
        if (clean.startsWith('"')) clean = clean.substring(1);
        if (clean.endsWith('"')) clean = clean.substring(0, clean.length - 1);
        // Cas 4: Guillemets échappés résiduels
        clean = clean.replace(/\\"/g, '"');
        return clean;
      });
    }

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

    // Ensure slug is present and saved
    if (!gameToSave.slug && gameToSave.page_url) {
      gameToSave.slug = gameToSave.page_url.substring(
        gameToSave.page_url.lastIndexOf('/') + 1,
      );
    }

    // Process video if available
    if (newGame.video_url) {
      const slug = gameToSave.slug;
      const processedVideoUrl = await processVideo(newGame.video_url, slug);
      if (processedVideoUrl) {
        gameToSave.video_url = processedVideoUrl;
      }
    }

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
      { message: 'An internal server error occurred.', error: String(error) },
      { status: 500 },
    );
  } finally {
    isWriting = false; // Unlock the file
  }
}

async function saveGames(games: any) {
  // Ensure the directory exists before writing the file
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(GAMES_DB_PATH, JSON.stringify(games, null, 2), 'utf-8');
}

async function processVideo(
  videoUrl: string,
  slug: string,
): Promise<string | null> {
  try {
    // Ensure previews directory exists
    await fs.mkdir(PREVIEWS_DIR, { recursive: true });

    const outputPath = path.join(PREVIEWS_DIR, `${slug}.mp4`);
    const publicPath = `/previews/${slug}.mp4`;

    // Check if file already exists
    try {
      await fs.access(outputPath);
      return publicPath; // File exists, return path
    } catch {
      // File doesn't exist, proceed with download and compression
    }

    console.log(`Processing video for ${slug}...`);

    // FFmpeg command:
    // -i "${videoUrl}" : Input URL
    // -vf "scale=480:-2" : Resize to 480px width, keep aspect ratio (height divisible by 2)
    // -b:v 800k : Max video bitrate 800kbps
    // -an : Remove audio
    // -movflags +faststart : Optimize for web streaming
    // -y : Overwrite output file
    const command = `ffmpeg -i "${videoUrl}" -vf "scale=480:-2" -b:v 800k -an -movflags +faststart -y "${outputPath}"`;

    await execPromise(command);
    console.log(`Video processed successfully: ${outputPath}`);
    return publicPath;
  } catch (error) {
    console.error(`Error processing video for ${slug}:`, error);
    return null;
  }
}
