
const fs = require('fs');
const path = require('path');

const gamesPath = path.join(process.cwd(), 'data', 'games.json');

try {
  if (!fs.existsSync(gamesPath)) {
    console.log('games.json not found at', gamesPath);
    process.exit(0);
  }

  const data = fs.readFileSync(gamesPath, 'utf8');
  const games = JSON.parse(data);

  console.log(`Checking ${games.length} games...`);

  let invalidGames = 0;
  games.forEach((game, index) => {
    if (!game.title) {
        console.error(`Game at index ${index} (ID: ${game.id}) has missing title!`);
        console.log(JSON.stringify(game, null, 2));
        invalidGames++;
    } else if (typeof game.title !== 'string') {
        console.error(`Game at index ${index} (ID: ${game.id}) has invalid title type: ${typeof game.title}`);
        invalidGames++;
    }
  });

  if (invalidGames === 0) {
      console.log('All games have valid titles.');
  } else {
      console.log(`Found ${invalidGames} games with invalid titles.`);
  }

} catch (err) {
  console.error('Error reading/parsing games.json:', err);
}
