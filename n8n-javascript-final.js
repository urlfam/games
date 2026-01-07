// ===================================================================
// Script JavaScript pour n8n - Remplacement des placeholders
// À copier-coller dans un nœud "Code" après le nœud Gemini
// ===================================================================

// ============================================================================
// RÉCUPÉRATION DES DONNÉES
// ============================================================================
// Le nœud Gemini ne préserve pas les données d'entrée, donc on doit
// récupérer les données du jeu depuis le nœud "Code in JavaScript2"

const geminiData = $input.item.json;
const gameData = $('Code in JavaScript2').item.json;

console.log(
  '🔍 Gemini Data:',
  JSON.stringify(geminiData, null, 2).substring(0, 300),
);
console.log('🔍 Game Data from Code2:', JSON.stringify(gameData, null, 2));

// ============================================================================
// ÉTAPE 1: Extraire la description générée par Gemini
// ============================================================================
let generatedDescription = '';

// Gemini retourne la structure: { content: { parts: [{ text: "..." }] } }
if (geminiData && geminiData.content) {
  const content = geminiData.content;

  if (
    content.parts &&
    Array.isArray(content.parts) &&
    content.parts.length > 0
  ) {
    generatedDescription = content.parts[0].text || '';
    console.log(
      '✅ Description Gemini extraite:',
      generatedDescription.length,
      'caractères',
    );
  }
}

// ============================================================================
// ÉTAPE 2: Récupérer les données du jeu depuis le nœud Code2
// ============================================================================
// Le nœud Gemini ne préserve pas les données, donc on les récupère du nœud précédent
const currentTitle = gameData.title || 'Untitled Game';
const currentCategory = gameData.category || 'Driving';
const currentPageUrl = gameData.page_url || '';
const currentIframeUrl = gameData.iframe_url || '';
const currentImageUrl = gameData.image_url || '';
const currentVideoUrl = gameData.video_url || '';

console.log('✅ Données du jeu:');
console.log('🎮 Title:', currentTitle);
console.log('📁 Category:', currentCategory);
console.log('🔗 Page URL:', currentPageUrl);

// Charger tous les jeux depuis games.json
const gamesJsonPath = '/data/games.json';
let allGames = [];

console.log('📂 Tentative de lecture de:', gamesJsonPath);

try {
  // Essayer avec require() standard (pas $require)
  const fs = require('fs');
  console.log('✅ Module fs chargé avec require()');

  const gamesData = fs.readFileSync(gamesJsonPath, 'utf8');
  console.log('✅ Fichier lu, taille:', gamesData.length, 'caractères');

  allGames = JSON.parse(gamesData);
  console.log('✅ JSON parsé ! Nombre de jeux:', allGames.length);
} catch (error) {
  console.error('❌ ERREUR lors de la lecture de games.json:', error.message);
  console.error('❌ Stack:', error.stack);
  // Continue avec une liste vide (fallback mode)
}

console.log('📊 Total jeux chargés:', allGames.length);

// Fonction pour extraire le slug d'une URL
function extractSlug(pageUrl) {
  if (!pageUrl) return '';
  const parts = pageUrl.split('/');
  return parts[parts.length - 1];
}

// Fonction pour trouver des jeux similaires
function findRelatedGames(currentGame, allGames, count = 2) {
  const sameCategory = allGames.filter(
    (game) =>
      game.category === currentGame.category &&
      game.title !== currentGame.title,
  );

  sameCategory.sort((a, b) => {
    const dateA = new Date(a.importedAt || 0);
    const dateB = new Date(b.importedAt || 0);
    return dateB - dateA;
  });

  return sameCategory.slice(0, count);
}

// Fonction pour créer un lien HTML
function createGameLink(game) {
  const slug = extractSlug(game.page_url);
  return `<a href="/play/${slug}" class="text-purple-400 hover:text-purple-300 underline transition-colors">${game.title}</a>`;
}

// Traiter la description
// S'assurer que c'est une string
let finalDescription = String(generatedDescription || '');

if (allGames && allGames.length > 0) {
  console.log(
    '🔍 Recherche de jeux similaires dans la catégorie:',
    currentCategory,
  );

  // Trouver 2 jeux similaires
  const relatedGames = findRelatedGames(
    {
      category: currentCategory,
      title: currentTitle,
    },
    allGames,
    2,
  );

  console.log('🎯 Jeux similaires trouvés:', relatedGames.length);

  // Remplacer RELATED_GAME_1
  if (relatedGames.length >= 1) {
    const link1 = createGameLink(relatedGames[0]);
    finalDescription = finalDescription.replace(/__RELATED_GAME_1__/g, link1);
    console.log('✅ RELATED_GAME_1 remplacé par:', relatedGames[0].title);
  } else {
    finalDescription = finalDescription.replace(
      /__RELATED_GAME_1__/g,
      'other exciting games',
    );
    console.log('⚠️  Aucun jeu similaire #1, fallback utilisé');
  }

  // Remplacer RELATED_GAME_2
  if (relatedGames.length >= 2) {
    const link2 = createGameLink(relatedGames[1]);
    finalDescription = finalDescription.replace(/__RELATED_GAME_2__/g, link2);
    console.log('✅ RELATED_GAME_2 remplacé par:', relatedGames[1].title);
  } else {
    finalDescription = finalDescription.replace(
      /__RELATED_GAME_2__/g,
      'similar titles',
    );
    console.log('⚠️  Aucun jeu similaire #2, fallback utilisé');
  }
} else {
  console.log('⚠️  Aucun jeu chargé, utilisation des fallbacks');
  // Fallback si games.json n'est pas accessible
  finalDescription = finalDescription
    .replace(/__RELATED_GAME_1__/g, 'other exciting games')
    .replace(/__RELATED_GAME_2__/g, 'similar titles');
}

// Remplacer le lien catégorie (toujours possible)
const categorySlug = (currentCategory || 'action').toLowerCase();
const categoryLink = `<a href="/play?category=${categorySlug}" class="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors">${currentCategory} games collection</a>`;
finalDescription = finalDescription.replace(/__CATEGORY_LINK__/g, categoryLink);

// Retourner le résultat pour n8n
// En mode "Run Once for Each Item", retourner directement l'objet (sans tableau)
return {
  title: currentTitle,
  description: finalDescription,
  category: currentCategory,
  tags: gameData.tags || [],
  page_url: currentPageUrl,
  iframe_url: currentIframeUrl,
  image_url: currentImageUrl,
  video_url: currentVideoUrl,
};
