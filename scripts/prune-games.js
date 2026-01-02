const fs = require('fs');
const path = require('path');

const GAMES_FILE = path.join(__dirname, '../data/games.json');

try {
  const rawData = fs.readFileSync(GAMES_FILE, 'utf-8');
  let games = JSON.parse(rawData);

  console.log(`Total games before pruning: ${games.length}`);

  // Sort by importedAt ascending (oldest first)
  games.sort((a, b) => new Date(a.importedAt) - new Date(b.importedAt));

  // Calculate how many to remove (half)
  const removeCount = Math.floor(games.length / 2);
  
  console.log(`Removing ${removeCount} oldest games...`);

  // Keep only the second half (newest)
  const keptGames = games.slice(removeCount);

  console.log(`Total games after pruning: ${keptGames.length}`);

  fs.writeFileSync(GAMES_FILE, JSON.stringify(keptGames, null, 2));
  console.log('Successfully updated games.json');

} catch (error) {
  console.error('Error pruning games:', error);
}
