# 🔄 Alternative : Utiliser un nœud HTTP Request séparé

Si le `$http.get()` ne fonctionne pas dans le code JavaScript, on peut utiliser un **nœud HTTP Request séparé** pour charger les jeux.

## 📋 Structure du workflow modifiée

```
Loop Over Items 
  ↓
Message a model (Gemini)
  ↓
HTTP Request (GET all games) ← NOUVEAU NŒUD
  ↓
Code in JavaScript (simplifié)
  ↓
HTTP Request (POST import)
```

## ⚙️ Configuration du nouveau nœud HTTP Request

### Nœud : HTTP Request (GET all games)

**Settings:**
- **Method**: GET
- **URL**: `http://147.93.7.103:3000/api/all-games`
- **Response Format**: JSON
- **Name**: "Load All Games"

**Options:**
- ✅ Return Full Response: **OFF**
- ✅ Response Data Property Name: `allGames`

## 📝 Code JavaScript simplifié (sans appel HTTP)

Ensuite, dans le nœud "Code in JavaScript", remplace le code par celui-ci :

```javascript
// Récupérer les données du Loop
const loopData = $("Loop Over Items").item.json;

// Récupérer la description de Gemini
const geminiData = $("Message a model").item.json;
let generatedDescription = '';
if (geminiData && geminiData.content && geminiData.content.parts && geminiData.content.parts[0]) {
  generatedDescription = geminiData.content.parts[0].text || '';
}

// Récupérer TOUS les jeux du nœud HTTP Request précédent
const allGames = $input.item.json; // Les jeux viennent du nœud HTTP Request

console.log('✅ Jeux reçus:', Array.isArray(allGames) ? allGames.length : 'PAS UN ARRAY');

// Données du jeu actuel
const currentTitle = loopData.title || 'Untitled Game';
const currentCategory = loopData.category || 'Driving';
const currentPageUrl = loopData.page_url || '';
const currentIframeUrl = loopData.iframe_url || '';
const currentImageUrl = loopData.image_url || '';

// Fonction pour extraire le slug
function extractSlug(pageUrl) {
  if (!pageUrl) return '';
  const parts = pageUrl.split('/');
  return parts[parts.length - 1];
}

// Fonction pour trouver des jeux similaires
function findRelatedGames(currentGame, allGames, count) {
  if (!Array.isArray(allGames)) {
    console.log('❌ allGames n\'est pas un array');
    return [];
  }
  
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

// Fonction pour créer un lien HTML
function createGameLink(game) {
  const slug = extractSlug(game.page_url);
  return '<a href="/play/' + slug + '" class="text-purple-400 hover:text-purple-300 underline transition-colors">' + game.title + '</a>';
}

// Traiter la description
let finalDescription = String(generatedDescription || '');

const relatedGames = findRelatedGames({ 
  category: currentCategory, 
  title: currentTitle 
}, allGames, 2);

console.log('🎯 Jeux similaires trouvés:', relatedGames.length);

if (relatedGames.length >= 1) {
  const link1 = createGameLink(relatedGames[0]);
  finalDescription = finalDescription.replace(/__RELATED_GAME_1__/g, link1);
  console.log('✅ RELATED_GAME_1:', relatedGames[0].title);
} else {
  finalDescription = finalDescription.replace(/__RELATED_GAME_1__/g, 'other exciting games');
}

if (relatedGames.length >= 2) {
  const link2 = createGameLink(relatedGames[1]);
  finalDescription = finalDescription.replace(/__RELATED_GAME_2__/g, link2);
  console.log('✅ RELATED_GAME_2:', relatedGames[1].title);
} else {
  finalDescription = finalDescription.replace(/__RELATED_GAME_2__/g, 'similar titles');
}

// Remplacer le lien catégorie
const categorySlug = (currentCategory || 'action').toLowerCase();
const categoryLink = '<a href="/play?category=' + categorySlug + '" class="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors">' + currentCategory + ' games collection</a>';
finalDescription = finalDescription.replace(/__CATEGORY_LINK__/g, categoryLink);

// Retourner le résultat
return {
  title: currentTitle,
  description: finalDescription,
  category: currentCategory,
  page_url: currentPageUrl,
  iframe_url: currentIframeUrl,
  image_url: currentImageUrl
};
```

## ⚠️ Problème potentiel

Le problème avec cette approche est que le nœud HTTP Request va **faire un appel par jeu dans le loop**, ce qui est inefficace.

## ✅ Meilleure solution : Charger une seule fois

Pour éviter de charger les jeux à chaque itération, il faut **sortir le chargement du loop** :

```
Execute Command (scraper)
  ↓
Wait
  ↓
Code (parse JSON)
  ↓
HTTP Request (Load All Games) ← Charger UNE SEULE FOIS
  ↓
Set (stocker dans variable)
  ↓
Loop Over Items ← Loop APRÈS avoir chargé les jeux
  ↓
Message a model (Gemini)
  ↓
Code (remplacer placeholders - utilise la variable)
  ↓
HTTP Request (POST import)
```

Mais cette approche nécessite des **variables n8n** qui peuvent être plus complexes à configurer.

---

**Pour l'instant, teste le code avec les logs améliorés** et dis-moi ce que tu vois ! 🔍
