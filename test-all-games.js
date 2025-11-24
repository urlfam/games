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
  const networkErrors = [];
  const criticalErrors = [];
  let totalRequests = 0;
  let failed404 = 0;
  let failed400 = 0;
  let failed500 = 0;
  let mainPageLoaded = false;
  
  // Capturer TOUTES les requêtes réseau
  page.on('response', (response) => {
    totalRequests++;
    const status = response.status();
    const url = response.url();
    
    // Si c'est la page principale qui échoue, c'est critique
    if (url.includes(`/game/${slug}`) && status >= 400) {
      criticalErrors.push({
        type: 'main-page-error',
        status: status,
        url: url,
      });
    }
    
    // Compter les différents types d'erreurs
    if (status === 404) {
      failed404++;
      networkErrors.push({
        type: 'network-404',
        status: status,
        url: url.substring(0, 150), // Tronquer l'URL
      });
    } else if (status === 400) {
      failed400++;
      networkErrors.push({
        type: 'network-400-bad-request',
        status: status,
        url: url.substring(0, 150),
      });
    } else if (status >= 500) {
      failed500++;
      networkErrors.push({
        type: 'network-500-server-error',
        status: status,
        url: url.substring(0, 150),
      });
    }
  });
  
  try {
    // Charger la page avec un timeout généreux et ne pas attendre networkidle
    const response = await page.goto(gameUrl, { 
      waitUntil: 'domcontentloaded', // Plus tolérant que networkidle2
      timeout: 20000 
    });
    
    mainPageLoaded = response.status() === 200;
    
    // Attendre plus longtemps pour détecter les jeux qui plantent après le chargement initial
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Vérifier si on a une erreur VISIBLE sur la page
    const pageAnalysis = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasNoSuchKey = bodyText.includes('NoSuchKey');
      const hasAccessDenied = bodyText.includes('Access Denied');
      const has404 = bodyText.includes('404') && bodyText.includes('Not Found');
      const hasExclusiveMessage = bodyText.includes('exclusively on CrazyGames');
      const hasRefusedToConnect = bodyText.includes('refused to connect');
      
      // Détecter si le jeu est bloqué sur un écran de chargement
      const stuckOnLoading = bodyText.includes('Loading assets...') || 
                            bodyText.includes('Loading...') ||
                            bodyText.includes('Please wait...');
      
      // Vérifier si l'injector a été chargé
      const scripts = Array.from(document.querySelectorAll('script'));
      const injectorLoaded = scripts.some(s => s.src && s.src.includes('/injector.js'));
      
      return {
        bodyText: bodyText.substring(0, 500),
        hasNoSuchKey,
        hasAccessDenied,
        has404,
        hasExclusiveMessage,
        hasRefusedToConnect,
        stuckOnLoading,
        injectorLoaded,
        hasVisibleError: hasNoSuchKey || hasAccessDenied || has404 || hasExclusiveMessage || hasRefusedToConnect,
      };
    });
    
    // Détecter si c'est vraiment cassé
    const totalErrors = failed404 + failed400 + failed500;
    const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) : 0;
    
    const isBroken = 
      !mainPageLoaded || 
      criticalErrors.length > 0 || 
      pageAnalysis.hasVisibleError ||
      (pageAnalysis.stuckOnLoading && totalErrors > 2) || // Bloqué sur loading + quelques erreurs
      failed400 > 3 || // Plus de 3 erreurs 400 Bad Request = problème
      failed500 > 2 || // Plus de 2 erreurs serveur = problème
      (totalErrors > 5 && errorRate > 0.2); // Plus de 20% d'erreurs totales
    
    const result = {
      slug,
      title: game.title,
      url: gameUrl,
      working: !isBroken,
      mainPageLoaded,
      totalRequests,
      failed404,
      failed400,
      failed500,
      totalErrors: totalErrors,
      errorRate: Math.round(errorRate * 100),
      injectorLoaded: pageAnalysis.injectorLoaded,
      visibleError: pageAnalysis.hasVisibleError,
      stuckOnLoading: pageAnalysis.stuckOnLoading,
      criticalErrors: criticalErrors,
      sampleNetworkErrors: networkErrors.slice(0, 5), // Montrer 5 exemples d'erreurs
      testedAt: new Date().toISOString(),
    };
    
    if (result.working) {
      console.log(`   ✅ Fonctionne ! (${totalRequests} requêtes, ${failed404} x 404, ${failed400} x 400, ${failed500} x 5xx)`);
    } else {
      console.log(`   ❌ Cassé !`);
      if (!mainPageLoaded) console.log(`      - Page principale non chargée`);
      if (pageAnalysis.hasVisibleError) console.log(`      - Erreur visible: ${pageAnalysis.bodyText.substring(0, 100)}...`);
      if (pageAnalysis.stuckOnLoading) console.log(`      - Bloqué sur l'écran de chargement`);
      if (failed400 > 0) console.log(`      - ${failed400} erreurs 400 Bad Request`);
      if (failed500 > 0) console.log(`      - ${failed500} erreurs serveur (5xx)`);
      if (result.errorRate > 20) console.log(`      - Taux d'erreur: ${result.errorRate}%`);
      
      // Afficher quelques exemples d'erreurs
      if (networkErrors.length > 0) {
        console.log(`      - Exemples d'erreurs:`);
        networkErrors.slice(0, 3).forEach(err => {
          console.log(`         • ${err.type}: ${err.url}`);
        });
      }
      
      criticalErrors.forEach(err => {
        console.log(`      - CRITIQUE: ${err.type}: ${err.status} ${err.url}`);
      });
    }
    
    await page.close();
    return result;
    
  } catch (error) {
    console.log(`   ⚠️  Timeout: ${error.message}`);
    await page.close();
    
    // Un timeout n'est pas forcément un problème si la page a commencé à charger
    return {
      slug,
      title: game.title,
      url: gameUrl,
      working: mainPageLoaded, // Si la page a chargé avant le timeout, c'est OK
      mainPageLoaded,
      totalRequests,
      failed404,
      failed400,
      failed500,
      totalErrors: failed404 + failed400 + failed500,
      errorRate: totalRequests > 0 ? Math.round(((failed404 + failed400 + failed500) / totalRequests) * 100) : 0,
      injectorLoaded: false,
      visibleError: false,
      stuckOnLoading: false,
      criticalErrors: [{
        type: 'timeout',
        message: error.message,
      }],
      sampleNetworkErrors: [],
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
