// ===================================================================
// Script de Déduplication pour n8n
// À placer dans le nœud "Code" AVANT le nœud "Loop Over Items"
// ===================================================================

// 1. Récupérer les jeux scrapés (depuis le stdout du nœud précédent)
// Le nœud précédent (Execute Command) retourne une string JSON dans "stdout"
const jsonString = $input.item.json.stdout;
let scrapedGames = [];

try {
    scrapedGames = JSON.parse(jsonString);
    if (!Array.isArray(scrapedGames)) {
        scrapedGames = [scrapedGames];
    }
} catch (e) {
    console.log("❌ Erreur parsing JSON scraper:", e);
    // Fallback si ce n'est pas du JSON valide
    scrapedGames = [];
}

// 2. Récupérer les jeux existants (depuis le nœud HTTP Request1)
// Adaptez le nom du nœud si nécessaire (ex: "HTTP Request1")
const existingItems = $("HTTP Request1").all();

// Si l'API retourne un tableau directement dans le premier item
let existingGames = [];
if (existingItems.length > 0) {
    if (Array.isArray(existingItems[0].json)) {
        existingGames = existingItems[0].json;
    } else {
        // Sinon, si n8n a éclaté le tableau en plusieurs items
        existingGames = existingItems.map(item => item.json);
    }
}

console.log(`📊 Analyse: ${scrapedGames.length} jeux scrapés vs ${existingGames.length} jeux existants`);

// 3. Filtrer pour ne garder que les nouveaux jeux
const newGames = scrapedGames.filter(scraped => {
    // Normaliser le titre pour la comparaison (minuscules, sans espaces inutiles)
    const scrapedTitle = (scraped.title || '').toLowerCase().trim();
    const scrapedUrl = (scraped.page_url || '').toLowerCase().trim();

    // Vérifier si le jeu existe déjà
    const exists = existingGames.some(existing => {
        const existingTitle = (existing.title || '').toLowerCase().trim();
        const existingUrl = (existing.page_url || '').toLowerCase().trim();
        
        // Comparaison par Titre OU par URL
        return existingTitle === scrapedTitle || (scrapedUrl && existingUrl && existingUrl === scrapedUrl);
    });

    if (exists) {
        console.log(`🚫 Ignoré (déjà existant): ${scraped.title}`);
        return false;
    }
    
    console.log(`✅ Nouveau jeu détecté: ${scraped.title}`);
    return true;
});

console.log(`🚀 Résultat: ${newGames.length} nouveaux jeux à importer`);

// 4. Retourner les nouveaux jeux pour le Loop
return newGames;
