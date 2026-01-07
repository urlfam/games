// ============================================
// PUZZIO.IO - INJECTOR ANTI-PUB v2.0
// ============================================
// Basé sur la technique KizGame + améliorations
// Port: 9999
// ============================================

(function () {
  console.log('[Puzzio.io] ⚡ Anti-Pub v2.0 : Nettoyage Interface & Pubs');

  // ============================================
  // 1. BOUCLIER VISUEL (CSS INJECTION)
  // ============================================
  // Cache les pubs et boutons CrazyGames DÈS LE CHARGEMENT
  const style = document.createElement('style');
  style.innerHTML = `
        /* === CONTENEURS DE PUBLICITÉ === */
        #preroll, 
        #advertisement, 
        #ad-container, 
        .ad-container,
        iframe[src*="intentia"], 
        iframe[src*="google"], 
        iframe[src*="ima"],
        iframe[src*="doubleclick"],
        iframe[src*="googlesyndication"],
        video[src*="ad"] {
            display: none !important;
            opacity: 0 !important;
            width: 0 !important; 
            height: 0 !important;
            z-index: -99999 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
        }
        
        /* === BOUTONS ET LIENS CRAZYGAMES === */
        button.css-vuljoq,              /* Bouton "Play on CrazyGames" */
        button.css-1u67gvk,             /* Bouton "Save Progress" */
        div.css-cg7wzy,                 /* Texte "More games on CrazyGames" */
        a[href*="crazygames.com"],      /* Tous liens vers CrazyGames */
        #external-playMoreGames-link,   /* Logo CrazyGames cliquable */
        .MuiGrid-root.css-1h1938b,      /* Barre du bas avec contrôles */
        .footerButton,                  /* Boutons du footer */
        [class*="playOnCrazyGames"],    /* Classe dynamique */
        [class*="moreGames"]            /* Classe "more games" */
        {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            opacity: 0 !important;
        }

        /* === ÉCRAN "OOOOPS" === */
        div[style*="exclusively on CrazyGames"] {
            display: none !important;
        }
    `;
  document.head.appendChild(style);
  console.log('[Puzzio.io] ✅ CSS Anti-Pub injecté');

  // ============================================
  // 2. FONCTION DE DÉBLOCAGE DES PUBS
  // ============================================
  function triggerAdCompletion() {
    console.log('[Puzzio.io] ⚡ Simulation: Pub Terminée (Skip)');

    // Événement global "adFinished"
    window.dispatchEvent(new Event('adFinished'));
    window.dispatchEvent(new Event('adComplete'));

    // Si un adManager existe
    if (window.adManager && window.adManager.onAdEvent) {
      try {
        window.adManager.onAdEvent({ type: 'loaded' });
      } catch (e) {}
      try {
        window.adManager.onAdEvent({ type: 'start' });
      } catch (e) {}
      try {
        window.adManager.onAdEvent({ type: 'complete' });
      } catch (e) {}
      try {
        window.adManager.onAdEvent({ type: 'allAdsCompleted' });
      } catch (e) {}
    }
  }

  // ============================================
  // 3. FAUX SDK CRAZYGAMES (INTERCEPTEUR)
  // ============================================
  const FakeSDK = {
    init: function () {
      console.log('[Puzzio.io] 🎮 CrazyGames SDK.init() - Fake Mode');
      return Promise.resolve();
    },

    requestAd: function (type) {
      console.log('[Puzzio.io] 🚫 requestAd(' + type + ') -> SKIP');
      return new Promise((resolve) => {
        setTimeout(() => {
          triggerAdCompletion();
          resolve();
        }, 50);
      });
    },

    requestBanner: function () {
      console.log('[Puzzio.io] 🚫 requestBanner() -> SKIP');
      return Promise.resolve();
    },

    hasAdblock: function () {
      console.log('[Puzzio.io] hasAdblock() -> false');
      return Promise.resolve(false);
    },

    game: {
      gameplayStart: function () {
        console.log('[Puzzio.io] ✅ gameplayStart() - NO ADS');
      },
      gameplayStop: function () {
        console.log('[Puzzio.io] gameplayStop()');
      },
      happytime: function () {
        console.log('[Puzzio.io] ✅ happytime() - NO ADS');
      },
      sdkGameLoadingStart: function () {
        console.log('[Puzzio.io] sdkGameLoadingStart()');
      },
      sdkGameLoadingStop: function () {
        console.log('[Puzzio.io] sdkGameLoadingStop()');
      },
      showInviteButton: function () {},
      hideInviteButton: function () {},
      inviteLink: function () {
        return { code: '', url: '' };
      },
    },

    ad: {
      requestAd: function (type, callbacks) {
        console.log('[Puzzio.io] 🚫 ad.requestAd(' + type + ') -> SKIP');
        if (callbacks && callbacks.adFinished) {
          setTimeout(function () {
            callbacks.adFinished();
          }, 100);
        }
        return Promise.resolve();
      },
      hasAdblock: function () {
        return Promise.resolve(false);
      },
    },

    banner: {
      requestBanner: function () {
        console.log('[Puzzio.io] 🚫 banner.requestBanner() -> SKIP');
        return Promise.resolve();
      },
      clearBanner: function () {},
      requestResponsiveBanner: function () {
        console.log('[Puzzio.io] 🚫 banner.requestResponsiveBanner() -> SKIP');
        return Promise.resolve();
      },
      clearAllBanners: function () {},
    },

    user: {
      getUser: function () {
        console.log('[Puzzio.io] user.getUser() -> anonymous');
        return Promise.resolve(null);
      },
      showAuthPrompt: function () {
        return Promise.resolve(null);
      },
      showAccountLinkPrompt: function () {
        return Promise.resolve(null);
      },
    },
  };

  // Exposer le Fake SDK
  window.CrazyGames = window.CrazyGames || {};
  window.CrazyGames.SDK = FakeSDK;
  console.log('[Puzzio.io] ✅ Fake CrazyGames SDK installé');

  // ============================================
  // 4. MOCK GOOGLE IMA (ANTI-PUB VIDÉO)
  // ============================================
  window.google = window.google || {};
  window.google.ima = {
    OmidVerificationVendor: { GOOGLE: 1 },

    settings: {
      setDisableCustomPlaybackForIOS10Plus: function () {},
      setDisableFlashAds: function () {},
      setVpaidMode: function () {},
      setLocale: function () {},
      setPpid: function () {},
      setPlayerType: function () {},
      setPlayerVersion: function () {},
      setSessionId: function () {},
    },

    VERSION: 'puzzio-fake-no-ads',

    AdDisplayContainer: function () {
      return {
        initialize: function () {
          console.log(
            '[Puzzio.io] 🚫 IMA AdDisplayContainer.initialize() - Fake',
          );
        },
        destroy: function () {},
      };
    },

    AdsLoader: function () {
      return {
        addEventListener: function () {},
        contentComplete: function () {},
        requestAds: function (req) {
          console.log('[Puzzio.io] 🚫 IMA AdsLoader.requestAds() -> SKIP');
          setTimeout(triggerAdCompletion, 50);
        },
        removeEventListener: function () {},
      };
    },

    AdsManager: function () {
      return {
        init: function () {
          console.log('[Puzzio.io] 🚫 IMA AdsManager.init() - Fake');
        },
        start: function () {
          console.log('[Puzzio.io] 🚫 IMA AdsManager.start() -> SKIP');
          setTimeout(triggerAdCompletion, 10);
        },
        resize: function () {},
        destroy: function () {},
        pause: function () {},
        resume: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
        getRemainingTime: function () {
          return 0;
        },
        setVolume: function () {},
        getVolume: function () {
          return 0;
        },
      };
    },

    AdsRenderingSettings: function () {
      return {
        useStyledLinearAds: function () {},
        useStyledNonLinearAds: function () {},
      };
    },

    ViewMode: {},
    AdEvent: { Type: {} },
    AdErrorEvent: { Type: {} },
    AdError: function () {},
    AdsRequest: function () {},
    ImaSdkSettings: function () {
      this.setVpaidMode = function () {};
      this.setLocale = function () {};
      this.setDisableCustomPlaybackForIOS10Plus = function () {};
    },
  };
  console.log('[Puzzio.io] ✅ Fake Google IMA SDK installé');

  // ============================================
  // 5. NETTOYEUR ACTIF (Auto-Clean + Auto-Click)
  // ============================================
  setInterval(function () {
    // A. Tueur de vidéos publicitaires
    document.querySelectorAll('video').forEach(function (vid) {
      if (
        !vid.paused &&
        vid.src &&
        (vid.src.includes('ad') || vid.src.includes('ima'))
      ) {
        vid.muted = true;
        vid.dispatchEvent(new Event('ended'));
        vid.remove();
        console.log('[Puzzio.io] 🚫 Vidéo pub supprimée');
      }
    });

    // B. Tueur d'écran "Oooops exclusively on CrazyGames"
    const divs = document.getElementsByTagName('div');
    for (let i = 0; i < divs.length; i++) {
      const div = divs[i];
      if (
        div.innerText &&
        div.innerText.includes('exclusively on CrazyGames')
      ) {
        div.remove();
        console.log("[Puzzio.io] 🚫 Écran 'Oooops' supprimé");
      }
    }

    // C. Tueur de boutons CrazyGames récalcitrants
    const buttons = document.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      if (
        btn.innerText &&
        (btn.innerText.includes('CrazyGames') ||
          btn.innerText.includes('Save your progress'))
      ) {
        btn.style.display = 'none';
      }

      // AUTO-CLICK sur "Play here" pour démarrer automatiquement
      if (btn.innerText && btn.innerText.includes('Play here')) {
        console.log("[Puzzio.io] 🎮 Auto-Click sur 'Play here'");
        btn.click();
      }
    }

    // D. Suppression des liens "More games"
    const links = document.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.href && link.href.includes('crazygames.com')) {
        link.style.display = 'none';
      }
    }
  }, 100); // Vérifie toutes les 100ms

  console.log('[Puzzio.io] ✅ Nettoyeur actif démarré');

  // ============================================
  // 6. PROXY RÉSEAU (URL REWRITING)
  // ============================================
  var domains = {
    'api.intentia.com': '147.93.7.103:9999/proxy/api.intentia.com',
    'api.cld.com': '147.93.7.103:9999/proxy/api.cld.com',
    'idx.liadm.com': '147.93.7.103:9999/proxy/idx.liadm.com',
    'imasdk.googleapis.com': '147.93.7.103:9999/ima',
    'imasdk.googleapis.co': '147.93.7.103:9999/ima',
    'id.hadron.ad.gt': '147.93.7.103:9999/proxy/id.hadron.ad.gt',
    'geo.privacymanager.io': '147.93.7.103:9999/proxy/geo.privacymanager.io',
    'id.crwdcntrl.net': '147.93.7.103:9999/proxy/id.crwdcntrl.net',
    'lb.eu-1-id5-sync.com': '147.93.7.103:9999/proxy/lb.eu-1-id5-sync.com',
    'id5-sync.com': '147.93.7.103:9999/proxy/id5-sync.com',
    'gum.criteo.com': '147.93.7.103:9999/proxy/gum.criteo.com',
    'lexicon.33across.com': '147.93.7.103:9999/proxy/lexicon.33across.com',
  };

  function rewrite(url) {
    if (!url) return url;
    try {
      // Réécriture aggressive pour api.intentia.com
      if (url.includes('api.intentia.com') && !url.includes('147.93.7')) {
        url = url.replace(
          /https?:\/\/(www\.)?api\.intentia\.com/g,
          'http://147.93.7.103:9999/proxy/api.intentia.com',
        );
        console.log('[Puzzio.io] 🔄 REWRITE', url);
        return url;
      }

      // Réécriture pour game-files
      if (url.includes('.game-files.crazygames.com')) {
        var match = url.match(
          /https?:\/\/([^.]+)\.game-files\.crazygames\.com\/(.*)/,
        );
        if (match) {
          var newUrl =
            'http://147.93.7.103:9999/game-files/' + match[1] + '/' + match[2];
          console.log('[Puzzio.io] 🔄 REWRITE GAME-FILES', newUrl);
          return newUrl;
        }
      }

      // Réécriture générique
      var u = new URL(url, window.location.href);
      for (var d in domains) {
        if (u.hostname === d || u.hostname.endsWith('.' + d)) {
          var n = 'http://' + domains[d] + u.pathname + u.search + u.hash;
          console.log('[Puzzio.io] 🔄 REWRITE', n);
          return n;
        }
      }
    } catch (e) {
      console.error('[Puzzio.io] ❌ REWRITE ERROR', e);
      return url;
    }
    return url;
  }

  // Intercepter fetch()
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : input.url;

    // Bloquer les requêtes de tracking/pub
    if (
      url &&
      (url.includes('intentia') ||
        url.includes('googleads') ||
        url.includes('doubleclick') ||
        url.includes('googlesyndication'))
    ) {
      console.log('[Puzzio.io] 🚫 FETCH BLOCKED', url);
      return Promise.resolve(new Response('{}', { status: 200 }));
    }

    var newURL = rewrite(url);
    if (newURL !== url) {
      console.log('[Puzzio.io] 🔄 FETCH REWRITTEN', url, '->', newURL);
      input = typeof input === 'string' ? newURL : new Request(newURL, input);
    }
    return origFetch.call(this, input, init).catch(function (err) {
      console.error('[Puzzio.io] ❌ FETCH ERROR', url, err);
      throw err;
    });
  };

  // Intercepter XMLHttpRequest
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    var newURL = rewrite(url);
    if (newURL !== url) {
      console.log('[Puzzio.io] 🔄 XHR REWRITTEN', url, '->', newURL);
    }
    return origOpen.call(
      this,
      method,
      newURL,
      arguments[2],
      arguments[3],
      arguments[4],
    );
  };

  // Bloquer window.open (popups)
  window.open = function () {
    console.warn('[Puzzio.io] 🚫 window.open() BLOCKED');
    return null;
  };

  // Bloquer appendChild d'iframes externes
  var origAppend = Element.prototype.appendChild;
  Element.prototype.appendChild = function (child) {
    if (child.tagName === 'IFRAME') {
      var src = child.src || child.getAttribute('src');
      if (
        src &&
        src.startsWith('http') &&
        !src.includes('147.93.7.103') &&
        !src.includes('blob:') &&
        !src.includes('unity')
      ) {
        console.warn('[Puzzio.io] 🚫 External iframe BLOCKED', src);
        return child;
      }
    }
    return origAppend.call(this, child);
  };

  console.log('[Puzzio.io] ✅ Proxy réseau actif');
  console.log('[Puzzio.io] 🎉 Anti-Pub v2.0 READY - NO ADS!');
})();
