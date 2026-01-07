// ===================================================================
// Script JavaScript pour n8n - Version SANS fs (compatible Cloud)
// À copier-coller dans un nœud "Code" après le nœud Gemini
// ===================================================================

// ============================================================================
// RÉCUPÉRATION DES DONNÉES
// ============================================================================
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
// ÉTAPE 2: Récupérer les données du jeu
// ============================================================================
const currentTitle = gameData.title || 'Untitled Game';
const currentCategory = gameData.category || 'Driving';
const currentPageUrl = gameData.page_url || '';
const currentIframeUrl = gameData.iframe_url || '';
const currentImageUrl = gameData.image_url || '';

console.log('✅ Données du jeu:');
console.log('🎮 Title:', currentTitle);
console.log('📁 Category:', currentCategory);

// ============================================================================
// ÉTAPE 3: Charger tous les jeux depuis le contexte du workflow
// ============================================================================
// Les jeux doivent être chargés AVANT le loop et stockés dans le workflow context
let allGames = [];

// Essayer de récupérer les jeux depuis le workflow context
try {
  console.log("🔍 Tentative d'accès au nœud HTTP Request1...");

  // Méthode 1: Via $node avec tous les items
  const httpNode = $node['HTTP Request1'];
  console.log('📦 HTTP Request1 node type:', typeof httpNode);

  if (httpNode && httpNode.all) {
    console.log(
      "📦 HTTP Request1.all() disponible, nombre d'items:",
      httpNode.all().length,
    );
    // Essayer de prendre le premier item qui contient le tableau complet
    const firstItem = httpNode.all()[0];
    if (firstItem && firstItem.json) {
      const data = firstItem.json;
      if (Array.isArray(data)) {
        allGames = data;
        console.log(
          '✅ Jeux chargés via all()[0].json (array):',
          allGames.length,
        );
      }
    }
  }

  // Méthode 2: Accès direct à .json
  if (allGames.length === 0 && httpNode && httpNode.json) {
    const data = httpNode.json;
    if (Array.isArray(data)) {
      allGames = data;
      console.log('✅ Jeux chargés via .json (array):', allGames.length);
    }
  }

  // Méthode 3: Via $items - COLLECTER TOUS LES ITEMS
  if (allGames.length === 0 && typeof $items === 'function') {
    const allItems = $items('HTTP Request1');
    console.log('📦 $items found:', allItems ? allItems.length : 0, 'items');

    if (allItems && allItems.length > 0) {
      // Cas 1: Premier item contient un tableau de tous les jeux
      if (Array.isArray(allItems[0].json)) {
        allGames = allItems[0].json;
        console.log(
          '✅ Jeux chargés via $items()[0].json (array):',
          allGames.length,
        );
      }
      // Cas 2: Chaque item est un jeu individuel - COLLECTER TOUS
      else if (allItems[0].json && allItems[0].json.title) {
        allGames = allItems.map((item) => item.json);
        console.log(
          '✅ Jeux collectés depuis tous les items:',
          allGames.length,
        );
      }
    }
  }
} catch (error) {
  console.log('⚠️  Erreur chargement workflow:', error.message);
  console.log('⚠️  Stack:', error.stack);
}

// Si pas de jeux chargés, essayer l'API (mais ça ne marchera pas dans le loop)
if (allGames.length === 0) {
  console.log(
    '⚠️  Aucun jeu chargé - les jeux doivent être chargés AVANT le loop',
  );
  console.log(
    '📝 Instructions: Ajoutez un nœud HTTP Request AVANT "Loop Over Items"',
  );
  console.log('   GET http://147.93.7.103:3000/api/all-games');
  console.log('   Nommez-le "Load All Games"');
}

console.log('📊 Total jeux disponibles:', allGames.length);

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
let finalDescription = String(generatedDescription || '');

if (allGames && allGames.length > 0) {
  console.log('🔍 Recherche de jeux similaires dans:', currentCategory);

  const relatedGames = findRelatedGames(
    { category: currentCategory, title: currentTitle },
    allGames,
    2,
  );

  console.log('🎯 Jeux similaires trouvés:', relatedGames.length);

  if (relatedGames.length >= 1) {
    const link1 = createGameLink(relatedGames[0]);
    finalDescription = finalDescription.replace(/__RELATED_GAME_1__/g, link1);
    console.log('✅ RELATED_GAME_1:', relatedGames[0].title);
  } else {
    finalDescription = finalDescription.replace(
      /__RELATED_GAME_1__/g,
      'other exciting games',
    );
  }

  if (relatedGames.length >= 2) {
    const link2 = createGameLink(relatedGames[1]);
    finalDescription = finalDescription.replace(/__RELATED_GAME_2__/g, link2);
    console.log('✅ RELATED_GAME_2:', relatedGames[1].title);
  } else {
    finalDescription = finalDescription.replace(
      /__RELATED_GAME_2__/g,
      'similar titles',
    );
  }
} else {
  console.log('⚠️  Mode fallback activé');
  finalDescription = finalDescription
    .replace(/__RELATED_GAME_1__/g, 'other exciting games')
    .replace(/__RELATED_GAME_2__/g, 'similar titles');
}

// Remplacer le lien catégorie
const categorySlug = (currentCategory || 'action').toLowerCase();
const categoryLink = `<a href="/play?category=${categorySlug}" class="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors">${currentCategory} games collection</a>`;
finalDescription = finalDescription.replace(/__CATEGORY_LINK__/g, categoryLink);

// Retourner le résultat
return {
  title: currentTitle,
  description: finalDescription,
  category: currentCategory,
  tags: gameData.tags || [],
  page_url: currentPageUrl,
  iframe_url: currentIframeUrl,
  image_url: currentImageUrl,
};
