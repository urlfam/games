// ===================================================================
// Script de Déduplication pour n8n (Version Finale)
// À placer dans le nœud "Code" AVANT le nœud "Loop Over Items"
// ===================================================================

// 1. Récupérer les jeux scrapés (depuis la sortie standard du script Python)
// Le nœud précédent est supposé être "Execute Command"
const executionItem = $input.item;
let scrapedGames = [];

try {
    if (executionItem.json.stdout) {
        scrapedGames = JSON.parse(executionItem.json.stdout);
    } else {
        console.log("⚠️ Pas de stdout trouvé dans l'item d'entrée");
    }
} catch (e) {
    console.log("❌ Erreur parsing JSON du scraper:", e.message);
}

// 2. Récupérer les jeux existants (depuis le nœud HTTP Request)
// IMPORTANT : Vérifiez que le nom du nœud est bien "HTTP Request1" ou adaptez-le !
let existingGames = [];
try {
    // On essaie de récupérer les items du nœud "HTTP Request1"
    // Si votre nœud s'appelle différemment (ex: "Get All Games"), changez le nom ici !
    const existingItems = $("HTTP Request1").all();
    
    if (existingItems.length > 0) {
        // Cas 1: L'API retourne un tableau directement dans le premier item
        if (Array.isArray(existingItems[0].json)) {
            existingGames = existingItems[0].json;
        } 
        // Cas 2: L'API retourne { data: [...] } ou { body: [...] }
        else if (existingItems[0].json.data && Array.isArray(existingItems[0].json.data)) {
            existingGames = existingItems[0].json.data;
        }
        // Cas 3: n8n a déjà éclaté le tableau en items individuels
        else {
            existingGames = existingItems.map(item => item.json);
        }
    }
} catch (e) {
    console.log("⚠️ Impossible de récupérer les jeux existants (nœud introuvable ?):", e.message);
    // On continue, mais la déduplication ne se fera pas (risque de doublons)
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
// On retourne chaque jeu dans un format compatible avec n8n
return newGames.map(game => ({ json: game }));
