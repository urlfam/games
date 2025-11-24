const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const GAMES_DB_PATH = path.join(DATA_DIR, 'games.json');
const REPORT_PATH = path.join(DATA_DIR, 'games-health-report.json');

const PROXY_URL = process.env.PROXY_URL || 'http://147.93.7.103:9999';
const TEST_TIMEOUT = 15000; // 15 secondes par jeu

async function loadGames() {
  try {
    const data = await fs.readFile(GAMES_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Impossible de charger games.json:', error.message);
    process.exit(1);
  }
}

async function saveGames(games) {
  await fs.writeFile(GAMES_DB_PATH, JSON.stringify(games, null, 2), 'utf-8');
}

async function saveReport(report) {
  await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');
}

async function testGame(browser, game) {
  const slug = game.page_url.substring(game.page_url.lastIndexOf('/') + 1);
  const gameUrl = `${PROXY_URL}/game/${slug}`;
  
  console.log(`\n🎮 Test: ${game.title} (${slug})`);
  console.log(`   URL: ${gameUrl}`);
  
  const page = await browser.newPage();
  const errors = [];
  const consoleErrors = [];
  
  // Capturer les erreurs réseau (404, 500, etc.)
  page.on('response', (response) => {
    if (response.status() >= 400) {
      errors.push({
        type: 'network',
        status: response.status(),
        url: response.url(),
      });
    }
  });
  
  // Capturer les erreurs de console
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Capturer les erreurs JavaScript
  page.on('pageerror', (error) => {
    errors.push({
      type: 'javascript',
      message: error.message,
    });
  });
  
  try {
    // Charger la page avec timeout
    await page.goto(gameUrl, { 
      waitUntil: 'networkidle2',
      timeout: TEST_TIMEOUT 
    });
    
    // Attendre un peu pour que le jeu se charge
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Vérifier si on a une erreur "NoSuchKey" ou similaire
    const bodyText = await page.evaluate(() => document.body.innerText);
    
    if (bodyText.includes('NoSuchKey') || 
        bodyText.includes('Access Denied') ||
        bodyText.includes('404') ||
        bodyText.includes('exclusively on CrazyGames')) {
      errors.push({
        type: 'content',
        message: 'Page contient un message d\'erreur',
      });
    }
    
    // Vérifier si l'injector est actif
    const injectorActive = await page.evaluate(() => {
      return window.console && 
             performance.getEntriesByName('/injector.js').length > 0;
    });
    
    const result = {
      slug,
      title: game.title,
      url: gameUrl,
      working: errors.length === 0,
      errors: errors,
      consoleErrors: consoleErrors.slice(0, 5), // Limiter à 5 erreurs
      injectorLoaded: injectorActive,
      testedAt: new Date().toISOString(),
    };
    
    if (result.working) {
      console.log(`   ✅ Fonctionne !`);
    } else {
      console.log(`   ❌ Erreur détectée:`);
      errors.forEach(err => {
        console.log(`      - ${err.type}: ${err.message || err.url || err.status}`);
      });
    }
    
    await page.close();
    return result;
    
  } catch (error) {
    console.log(`   ❌ Timeout ou crash: ${error.message}`);
    await page.close();
    return {
      slug,
      title: game.title,
      url: gameUrl,
      working: false,
      errors: [{
        type: 'timeout',
        message: error.message,
      }],
      consoleErrors: [],
      injectorLoaded: false,
      testedAt: new Date().toISOString(),
    };
  }
}

async function main() {
  console.log('🚀 Démarrage du test automatique des jeux...\n');
  
  const games = await loadGames();
  console.log(`📊 ${games.length} jeux à tester\n`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ]
  });
  
  const results = [];
  
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    const result = await testGame(browser, game);
    results.push(result);
    
    // Mettre à jour le statut dans games.json
    games[i].working = result.working;
    games[i].lastTested = result.testedAt;
    
    // Pause entre chaque test pour ne pas surcharger
    if (i < games.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  await browser.close();
  
  // Sauvegarder les résultats
  await saveGames(games);
  await saveReport({
    totalGames: games.length,
    workingGames: results.filter(r => r.working).length,
    brokenGames: results.filter(r => !r.working).length,
    testedAt: new Date().toISOString(),
    results: results,
  });
  
  // Afficher le résumé
  console.log('\n' + '='.repeat(60));
  console.log('📋 RÉSUMÉ');
  console.log('='.repeat(60));
  console.log(`✅ Jeux fonctionnels: ${results.filter(r => r.working).length}`);
  console.log(`❌ Jeux cassés: ${results.filter(r => !r.working).length}`);
  console.log(`📊 Taux de succès: ${Math.round((results.filter(r => r.working).length / results.length) * 100)}%`);
  
  const brokenGames = results.filter(r => !r.working);
  if (brokenGames.length > 0) {
    console.log('\n❌ Jeux qui ne fonctionnent pas:');
    brokenGames.forEach(game => {
      console.log(`   - ${game.title} (${game.slug})`);
      game.errors.forEach(err => {
        console.log(`      • ${err.type}: ${err.message || err.url || err.status}`);
      });
    });
  }
  
  console.log(`\n💾 Rapport sauvegardé: ${REPORT_PATH}`);
  console.log('✅ Test terminé!\n');
}

main().catch(console.error);
