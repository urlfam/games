// ===================================================================
// Script pour le PREMIER nœud Code (après Loop Over Items)
// Ce nœud prépare les données pour Gemini ET les transmet
// ===================================================================

// Récupérer les données du jeu depuis le Loop
const gameData = $input.item.json;

console.log('📦 Données reçues du Loop:', JSON.stringify(gameData, null, 2));

// Extraire les informations du jeu
const title = gameData.title || 'Untitled Game';
const category = gameData.category || 'Driving';
const pageUrl = gameData.page_url || '';
const iframeUrl = gameData.iframe_url || '';
const imageUrl = gameData.image_url || '';

console.log('✅ Jeu à traiter:', title);
console.log('📁 Catégorie:', category);

// Charger le prompt Gemini depuis un fichier ou le définir ici
// IMPORTANT: Ce prompt doit contenir les placeholders __RELATED_GAME_1__, etc.
const geminiPrompt = `You are an expert gaming content writer creating SEO-optimized game descriptions.

Write a comprehensive and engaging description for the game "${title}" in the ${category} category.

STRUCTURE REQUIRED:
1. Opening paragraph (100-150 words): Hook the reader with what makes this game exciting
2. Gameplay mechanics (150-200 words): Explain how to play, core mechanics, and controls
3. Features section (150-200 words): Highlight key features, what makes it unique
4. Strategy tips (100-150 words): Share helpful tips for players
5. Final paragraph with internal links (100 words): MUST end with this exact paragraph:

⚠️⚠️⚠️ ABSOLUTE REQUIREMENT - COPY THIS PARAGRAPH EXACTLY ⚠️⚠️⚠️

"Ready to test your skills? Start playing ${title} now and experience the thrill of ${category} games! Looking for more challenges? Try __RELATED_GAME_1__ for similar excitement, or explore __RELATED_GAME_2__ for a fresh take on the genre. Discover even more in our __CATEGORY_LINK__!"

🚨 CRITICAL: The placeholders __RELATED_GAME_1__, __RELATED_GAME_2__, and __CATEGORY_LINK__ MUST appear exactly as written (with double underscores) in the final paragraph. DO NOT replace them with actual game names.

Format: Use HTML tags (<h3>, <p>, <strong>, <ul>, <li>)
Length: 600-900 words total
Tone: Exciting, informative, SEO-friendly
Keywords to include: "${title}", "${category} games", "play ${title}"`;

// Retourner TOUTES les données + le prompt
// IMPORTANT: Gemini doit recevoir le prompt ET les données du jeu
return {
  title: title,
  category: category,
  page_url: pageUrl,
  iframe_url: iframeUrl,
  image_url: imageUrl,
  prompt: geminiPrompt
};
