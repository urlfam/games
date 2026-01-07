// Script JavaScript pour n8n - Nœud "Code"
// À placer APRÈS le nœud Gemini et AVANT le nœud HTTP Request

// Récupérer les données
const generatedDescription = $json.description || $json.message || $json.text; // Ajuster selon la sortie de Gemini
const currentTitle = $json.title;
const currentCategory = $json.category;
const currentPageUrl = $json.page_url;

// Charger tous les jeux depuis games.json (simulé ici, à adapter selon ton setup)
// Option 1: Si games.json est accessible via HTTP
// const allGamesResponse = await $http.get('http://147.93.7.103:3000/api/all-games');
// const allGames = allGamesResponse.data;

// Option 2: Si tu as les jeux dans le contexte n8n
// Pour ce script, on va supposer qu'on a accès aux jeux d'une manière ou d'une autre
// Tu devras adapter cette partie selon ton workflow n8n

// FONCTION: Trouver des jeux similaires
function findRelatedGames(currentGame, allGames, count = 2) {
  // 1. Filtrer les jeux de la même catégorie (exclure le jeu actuel)
  const sameCategory = allGames.filter(
    (game) =>
      game.category === currentGame.category &&
      game.page_url !== currentGame.page_url,
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

// FONCTION: Extraire le slug d'une URL
function extractSlug(pageUrl) {
  const parts = pageUrl.split('/');
  return parts[parts.length - 1];
}

// FONCTION: Créer un lien HTML
function createGameLink(game) {
  const slug = extractSlug(game.page_url);
  return `<a href="/play/${slug}" class="text-purple-400 hover:text-purple-300 underline">${game.title}</a>`;
}

// SIMULATION: Si tu n'as pas accès à tous les jeux, voici comment gérer
// Dans un vrai workflow, tu devrais lire games.json ou l'avoir dans le contexte
const allGames = []; // À remplir avec tes vraies données

// Si allGames est vide, on va utiliser une approche alternative:
// On va simplement créer des liens génériques vers la catégorie
let finalDescription = generatedDescription;

if (allGames && allGames.length > 0) {
  // APPROCHE COMPLÈTE: Avec accès à tous les jeux
  const relatedGames = findRelatedGames(
    {
      category: currentCategory,
      page_url: currentPageUrl,
      title: currentTitle,
    },
    allGames,
    2,
  );

  if (relatedGames.length >= 1) {
    const link1 = createGameLink(relatedGames[0]);
    finalDescription = finalDescription.replace('{{RELATED_GAME_1}}', link1);
  } else {
    // Fallback: enlever le placeholder
    finalDescription = finalDescription.replace(
      '{{RELATED_GAME_1}}',
      'other exciting games',
    );
  }

  if (relatedGames.length >= 2) {
    const link2 = createGameLink(relatedGames[1]);
    finalDescription = finalDescription.replace('{{RELATED_GAME_2}}', link2);
  } else {
    // Fallback: enlever le placeholder
    finalDescription = finalDescription.replace(
      '{{RELATED_GAME_2}}',
      'similar titles',
    );
  }
} else {
  // APPROCHE SIMPLIFIÉE: Sans accès aux jeux
  // On remplace par des mentions génériques
  finalDescription = finalDescription
    .replace('{{RELATED_GAME_1}}', 'other exciting games')
    .replace('{{RELATED_GAME_2}}', 'similar titles');
}

// Toujours remplacer le lien catégorie (ça on peut le faire sans données)
const categorySlug = currentCategory.toLowerCase();
const categoryLink = `<a href="/play?category=${categorySlug}" class="text-purple-400 hover:text-purple-300 underline font-semibold">${currentCategory} games collection</a>`;
finalDescription = finalDescription.replace('{{CATEGORY_LINK}}', categoryLink);

// Retourner toutes les données avec la description mise à jour
return {
  ...$json,
  description: finalDescription,
};
