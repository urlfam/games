// Script JavaScript OPTIMISÉ pour n8n - Nœud "Code"
// Ce script lit games.json depuis le container Docker pour avoir tous les jeux

// Récupérer les données du jeu actuel
const generatedDescription = $json.description || $json.message || $json.text;
const currentTitle = $json.title;
const currentCategory = $json.category;
const currentPageUrl = $json.page_url;

// Lire games.json depuis le container Docker
// Note: Le volume est monté dans /data (voir guide d'installation)
const gamesJsonPath = '/data/games.json';

let allGames = [];
try {
  // Dans n8n, utiliser $require au lieu de require
  const fs = $require('fs');
  const gamesData = fs.readFileSync(gamesJsonPath, 'utf8');
  allGames = JSON.parse(gamesData);
} catch (error) {
  console.error('Erreur lors de la lecture de games.json:', error);
  // Continuer avec une liste vide si le fichier n'est pas accessible
}

// FONCTION: Extraire le slug d'une URL
function extractSlug(pageUrl) {
  if (!pageUrl) return '';
  const parts = pageUrl.split('/');
  return parts[parts.length - 1];
}

// FONCTION: Trouver des jeux similaires
function findRelatedGames(currentGame, allGames, count = 2) {
  // 1. Filtrer les jeux de la même catégorie (exclure le jeu actuel)
  const sameCategory = allGames.filter(
    (game) =>
      game.category === currentGame.category &&
      game.title !== currentGame.title,
  );

  // 2. Trier par date (les plus récents en premier)
  sameCategory.sort((a, b) => {
    const dateA = new Date(a.importedAt || 0);
    const dateB = new Date(b.importedAt || 0);
    return dateB - dateA;
  });

  // 3. Prendre les N premiers
  return sameCategory.slice(0, count);
}

// FONCTION: Créer un lien HTML avec style
function createGameLink(game) {
  const slug = extractSlug(game.page_url);
  return `<a href="/play/${slug}" class="text-purple-400 hover:text-purple-300 underline transition-colors">${game.title}</a>`;
}

// Traiter la description
let finalDescription = generatedDescription;

if (allGames && allGames.length > 0) {
  // Trouver 2 jeux similaires
  const relatedGames = findRelatedGames(
    {
      category: currentCategory,
      title: currentTitle,
    },
    allGames,
    2,
  );

  // Remplacer RELATED_GAME_1
  if (relatedGames.length >= 1) {
    const link1 = createGameLink(relatedGames[0]);
    finalDescription = finalDescription.replace(
      /\{\{RELATED_GAME_1\}\}/g,
      link1,
    );
  } else {
    finalDescription = finalDescription.replace(
      /\{\{RELATED_GAME_1\}\}/g,
      'other exciting games',
    );
  }

  // Remplacer RELATED_GAME_2
  if (relatedGames.length >= 2) {
    const link2 = createGameLink(relatedGames[1]);
    finalDescription = finalDescription.replace(
      /\{\{RELATED_GAME_2\}\}/g,
      link2,
    );
  } else {
    finalDescription = finalDescription.replace(
      /\{\{RELATED_GAME_2\}\}/g,
      'similar titles',
    );
  }
} else {
  // Fallback si games.json n'est pas accessible
  finalDescription = finalDescription
    .replace(/\{\{RELATED_GAME_1\}\}/g, 'other exciting games')
    .replace(/\{\{RELATED_GAME_2\}\}/g, 'similar titles');
}

// Remplacer le lien catégorie (toujours possible)
const categorySlug = currentCategory.toLowerCase();
const categoryLink = `<a href="/play?category=${categorySlug}" class="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors">${currentCategory} games collection</a>`;
finalDescription = finalDescription.replace(
  /\{\{CATEGORY_LINK\}\}/g,
  categoryLink,
);

// Retourner toutes les données avec la description mise à jour
// Dans n8n, retourner un array d'objets
return {
  json: {
    title: currentTitle,
    description: finalDescription,
    category: currentCategory,
    tags: $json.tags || [],
    page_url: currentPageUrl,
    iframe_url: $json.iframe_url,
    image_url: $json.image_url,
  },
};
