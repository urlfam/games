// Test du script de remplacement des placeholders
const fs = require('fs');

// Simuler les données d'un jeu (comme si elles venaient de Gemini)
const testGame = {
  title: "Card Solitaire: Word Game",
  category: "Puzzle",
  page_url: "https://www.crazygames.com/game/card-solitaire-word-game",
  iframe_url: "https://games.crazygames.com/en_US/card-solitaire-word-game/index.html",
  image_url: "https://imgs.crazygames.com/card-solitaire-word-game_16x9/20251202095711/card-solitaire-word-game_16x9-cover",
  description: `<h3>What is Card Solitaire: Word Game?</h3>
<p>Card Solitaire: Word Game is a clever logic game that trains your brain. Ready to test your skills?</p>

<p>Think you can handle the challenge? Play Card Solitaire: Word Game now! If you love Puzzle games, you might also enjoy {{RELATED_GAME_1}} and {{RELATED_GAME_2}}, or explore our complete {{CATEGORY_LINK}} for even more exciting challenges!</p>`
};

// Charger games.json
const gamesJsonPath = '/data/games.json';
let allGames = [];
try {
  const gamesData = fs.readFileSync(gamesJsonPath, 'utf8');
  allGames = JSON.parse(gamesData);
  console.log(`✅ Chargé ${allGames.length} jeux depuis games.json`);
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}

// Fonction pour extraire le slug
function extractSlug(pageUrl) {
  if (!pageUrl) return '';
  const parts = pageUrl.split('/');
  return parts[parts.length - 1];
}

// Fonction pour trouver des jeux similaires
function findRelatedGames(currentGame, allGames, count = 2) {
  const sameCategory = allGames.filter(game => 
    game.category === currentGame.category && 
    game.title !== currentGame.title
  );
  
  sameCategory.sort((a, b) => {
    const dateA = new Date(a.importedAt || 0);
    const dateB = new Date(b.importedAt || 0);
    return dateB - dateA;
  });
  
  return sameCategory.slice(0, count);
}

// Fonction pour créer un lien
function createGameLink(game) {
  const slug = extractSlug(game.page_url);
  return `<a href="/play/${slug}" class="text-purple-400 hover:text-purple-300 underline transition-colors">${game.title}</a>`;
}

// Traiter la description
let finalDescription = testGame.description;

const relatedGames = findRelatedGames(
  { 
    category: testGame.category, 
    title: testGame.title 
  }, 
  allGames, 
  2
);

console.log(`\n📋 Jeux similaires trouvés: ${relatedGames.length}`);
relatedGames.forEach((game, i) => {
  console.log(`  ${i+1}. ${game.title} (${game.category})`);
});

// Remplacer les placeholders
if (relatedGames.length >= 1) {
  const link1 = createGameLink(relatedGames[0]);
  finalDescription = finalDescription.replace(/\{\{RELATED_GAME_1\}\}/g, link1);
  console.log(`\n✅ RELATED_GAME_1 remplacé par: ${relatedGames[0].title}`);
}

if (relatedGames.length >= 2) {
  const link2 = createGameLink(relatedGames[1]);
  finalDescription = finalDescription.replace(/\{\{RELATED_GAME_2\}\}/g, link2);
  console.log(`✅ RELATED_GAME_2 remplacé par: ${relatedGames[1].title}`);
}

const categorySlug = testGame.category.toLowerCase();
const categoryLink = `<a href="/play?category=${categorySlug}" class="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors">${testGame.category} games collection</a>`;
finalDescription = finalDescription.replace(/\{\{CATEGORY_LINK\}\}/g, categoryLink);
console.log(`✅ CATEGORY_LINK remplacé par: ${testGame.category} games collection`);

console.log('\n📄 Description finale:');
console.log('='.repeat(80));
console.log(finalDescription);
console.log('='.repeat(80));

console.log('\n✅ Test réussi ! Le script fonctionne correctement.');
