// ===================================================================
// Script JavaScript pour n8n - Version avec fetch()
// ===================================================================

// Récupérer les données
const loopData = $("Loop Over Items").item.json;
const geminiData = $input.item.json;

console.log('🔍 Loop Data:', JSON.stringify(loopData, null, 2).substring(0, 200));

// Extraire la description générée par Gemini
let generatedDescription = '';
if (geminiData && geminiData.content && geminiData.content.parts && geminiData.content.parts[0]) {
  generatedDescription = geminiData.content.parts[0].text || '';
  console.log('✅ Description Gemini extraite:', generatedDescription.length, 'caractères');
}

// Récupérer les données du jeu
const currentTitle = loopData.title || 'Untitled Game';
const currentCategory = loopData.category || 'Driving';
const currentPageUrl = loopData.page_url || '';
const currentIframeUrl = loopData.iframe_url || '';
const currentImageUrl = loopData.image_url || '';

console.log('✅ Données du jeu:');
console.log('🎮 Title:', currentTitle);
console.log('📁 Category:', currentCategory);

// Charger tous les jeux via fetch()
let allGames = [];

try {
  console.log('📡 Chargement des jeux via fetch()...');
  const response = await fetch('http://147.93.7.103:3000/api/all-games');
  allGames = await response.json();
  console.log('✅ Jeux chargés ! Nombre:', allGames.length);
} catch (error) {
  console.log('❌ ERREUR fetch():', error.message);
}

console.log('📊 Nombre total de jeux:', allGames.length);

if (allGames.length > 0) {
  const relatedCategory = allGames.filter(g => g.category === currentCategory);
  console.log('🔍 Jeux de la catégorie', currentCategory + ':', relatedCategory.length);
  
  // Afficher les 3 premiers jeux de la catégorie pour debug
  relatedCategory.slice(0, 3).forEach(g => {
    console.log('  - ' + g.title);
  });
}

// Fonction pour extraire le slug
function extractSlug(pageUrl) {
  if (!pageUrl) return '';
  const parts = pageUrl.split('/');
  return parts[parts.length - 1];
}

// Fonction pour trouver des jeux similaires
function findRelatedGames(currentGame, allGames, count) {
  const sameCategory = allGames.filter(game => 
    game.category === currentGame.category && 
    game.title !== currentGame.title
  );
  
  console.log('🎯 Jeux similaires trouvés:', sameCategory.length);
  
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
  return '<a href="/play/' + slug + '" class="text-purple-400 hover:text-purple-300 underline transition-colors">' + game.title + '</a>';
}

// Traiter la description
let finalDescription = String(generatedDescription || '');

if (allGames && allGames.length > 0) {
  const relatedGames = findRelatedGames({ 
    category: currentCategory, 
    title: currentTitle 
  }, allGames, 2);
  
  if (relatedGames.length >= 1) {
    const link1 = createGameLink(relatedGames[0]);
    finalDescription = finalDescription.replace(/__RELATED_GAME_1__/g, link1);
    console.log('✅ Remplacé RELATED_GAME_1 par:', relatedGames[0].title);
  } else {
    finalDescription = finalDescription.replace(/__RELATED_GAME_1__/g, 'other exciting games');
    console.log('⚠️  Pas de jeu similaire #1, utilisation du fallback');
  }
  
  if (relatedGames.length >= 2) {
    const link2 = createGameLink(relatedGames[1]);
    finalDescription = finalDescription.replace(/__RELATED_GAME_2__/g, link2);
    console.log('✅ Remplacé RELATED_GAME_2 par:', relatedGames[1].title);
  } else {
    finalDescription = finalDescription.replace(/__RELATED_GAME_2__/g, 'similar titles');
    console.log('⚠️  Pas de jeu similaire #2, utilisation du fallback');
  }
} else {
  console.log('⚠️  Aucun jeu trouvé, utilisation des fallbacks');
  finalDescription = finalDescription.replace(/__RELATED_GAME_1__/g, 'other exciting games');
  finalDescription = finalDescription.replace(/__RELATED_GAME_2__/g, 'similar titles');
}

// Remplacer le lien catégorie
const categorySlug = (currentCategory || 'action').toLowerCase();
const categoryLink = '<a href="/play?category=' + categorySlug + '" class="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors">' + currentCategory + ' games collection</a>';
finalDescription = finalDescription.replace(/__CATEGORY_LINK__/g, categoryLink);
console.log('✅ Remplacé CATEGORY_LINK');

// Retourner le résultat
return {
  title: currentTitle,
  description: finalDescription,
  category: currentCategory,
  page_url: currentPageUrl,
  iframe_url: currentIframeUrl,
  image_url: currentImageUrl
};
