// Fichier : test-scraper.js
const puppeteer = require('puppeteer');

async function testExtraction() {
  // On utilise la nouvelle URL que vous avez trouvée !
  const gamePageUrl = 'https://games.crazygames.com/fr_FR/master-of-numbers-qmz/index.html';
  
  console.log(`1. Lancement d'un navigateur en arrière-plan...`);
  
  let browser;
  try {
    // Utilise le nouveau mode "headless" qui est plus difficile à détecter
    browser = await puppeteer.launch({ headless: "new" }); 
    const page = await browser.newPage();
    
    // Se faire passer pour un navigateur normal
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');

    console.log(`2. Navigation vers : ${gamePageUrl}`);
    await page.goto(gamePageUrl, { waitUntil: 'networkidle2' });

    console.log("3. Page chargée. Recherche de l'URL du jeu...");
    const html = await page.content();

    // La regex pour trouver l'URL dans l'objet "options"
    const regex = /"loaderOptions":\{"url":"(https:\/\/[^"]+)"\}/;
    const match = html.match(regex);

    if (match && match[1]) {
      const directGameUrl = match[1];
      console.log("\n✅ SUCCÈS ! URL directe du jeu trouvée :");
      console.log(directGameUrl);
      console.log("\nC'est cette URL qu'il faut utiliser dans l'iframe de votre site.");
    } else {
      console.error("\n❌ ÉCHEC. Impossible de trouver l'URL directe dans le code source.");
      console.log("Cela signifie que la structure de la page a peut-être changé, ou que nous sommes encore bloqués.");
    }

  } catch (error) {
    console.error("Une erreur est survenue:", error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log("\n4. Navigateur fermé.");
    }
  }
}

testExtraction();