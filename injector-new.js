// ============================================
// PUZZIO.IO - INJECTOR ANTI-PUB v3.0 FINAL
// ============================================
// Basé sur la technique KizGame + test réussi
// Port: 9999
// Mis à jour: 2025-12-18
// ============================================

(function() {
    console.log("[Puzzio.io] ⚡ Anti-Pub v3.0 FINAL : Nettoyage Interface & Pubs");

    // ============================================
    // 1. BOUCLIER VISUEL (CSS INJECTION)
    // ============================================
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
        button.css-vuljoq,              /* Bouton "Play on CrazyGames" et "Save Progress" */
        button.css-1u67gvk,             /* Variante bouton */
        div.css-cg7wzy,                 /* Texte "More games on CrazyGames" */
        a[href*="crazygames.com"],      /* Tous liens vers CrazyGames */
        #external-playMoreGames-link,   /* Logo CrazyGames cliquable */
        .MuiGrid-root.css-1h1938b,      /* Barre du bas avec contrôles */
        .footerButton,                  /* Boutons du footer */
        [class*="playOnCrazyGames"],    /* Classe dynamique */
        [class*="moreGames"],           /* Classe "more games" */
        [class*="saveProgress"]         /* Bouton Save Progress */
        {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* === VIDÉOS ET OVERLAYS === */
        video, 
        .video-overlay,
        .ad-overlay,
        [class*="AdContainer"],
        [id*="adContainer"] {
            display: none !important;
            opacity: 0 !important;
        }

        /* === MODALES ET POPUPS === */
        .modal[class*="ad"],
        .popup[class*="sponsor"],
        [class*="AdModal"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // 2. FONCTION DE DÉBLOCAGE (FAKE AD EVENTS)
    // ============================================
    function triggerAdCompletion() {
        console.log("⚡ Simulation: Pub Terminée");
        
        // Event global
        window.dispatchEvent(new Event('adFinished'));
        window.dispatchEvent(new Event('adComplete'));
        
        // AdManager CrazyGames
        if (window.adManager && window.adManager.onAdEvent) {
            try { 
                window.adManager.onAdEvent({type: 'loaded'}); 
                window.adManager.onAdEvent({type: 'start'}); 
                window.adManager.onAdEvent({type: 'complete'}); 
                window.adManager.onAdEvent({type: 'allAdsCompleted'}); 
            } catch(e) {}
        }
    }

    // ============================================
    // 3. FAUX SDK CRAZYGAMES
    // ============================================
    const FakeSDK = {
        init: () => {
            console.log("[Puzzio.io] CrazyGames SDK Mocké");
            return Promise.resolve();
        },
        requestAd: (type) => { 
            console.log("[Puzzio.io] Demande de pub (" + type + ") -> SKIP");
            return new Promise((resolve) => {
                setTimeout(() => { 
                    triggerAdCompletion(); 
                    resolve(); 
                }, 50);
            });
        },
        requestBanner: () => {
            console.log("[Puzzio.io] Banner Pub -> SKIP");
            return Promise.resolve();
        },
        hasAdblock: () => false,
        game: { 
            gameplayStart: () => {}, 
            gameplayStop: () => {}, 
            happytime: () => {},
            inviteLink: () => Promise.resolve()
        },
        ad: { 
            requestAd: (type) => {
                console.log("[Puzzio.io] Ad Request (" + type + ") -> SKIP");
                return Promise.resolve();
            }
        },
        banner: {
            requestBanner: () => Promise.resolve()
        },
        user: {
            getUser: () => Promise.resolve(null),
            isUserAccountAvailable: false
        }
    };

    // Installation du SDK
    window.CrazyGames = window.CrazyGames || {};
    window.CrazyGames.SDK = FakeSDK;

    // ============================================
    // 4. MOCK GOOGLE IMA (PUB VIDÉO)
    // ============================================
    window.google = window.google || {};
    window.google.ima = {
        AdDisplayContainer: function() { 
            return { 
                initialize: () => {}, 
                destroy: () => {} 
            }; 
        },
        AdsLoader: function() { 
            return { 
                addEventListener: () => {},
                removeEventListener: () => {},
                contentComplete: () => {}, 
                requestAds: (req) => { 
                    console.log("[Puzzio.io] Google IMA Ads Request -> SKIP");
                    setTimeout(triggerAdCompletion, 50); 
                },
                destroy: () => {}
            }; 
        },
        AdsManager: function() { 
            return { 
                init: () => {}, 
                start: () => { 
                    console.log("[Puzzio.io] Google IMA Start -> SKIP");
                    setTimeout(triggerAdCompletion, 10); 
                }, 
                resize: () => {}, 
                destroy: () => {},
                pause: () => {},
                resume: () => {},
                skip: () => {}
            }; 
        },
        AdsRequest: function() {},
        AdEvent: { Type: {} },
        AdErrorEvent: { Type: {} },
        ViewMode: { NORMAL: 'normal', FULLSCREEN: 'fullscreen' },
        AdsRenderingSettings: function() {}
    };

    // ============================================
    // 5. NETTOYEUR ACTIF (BOUCLE DE SUPPRESSION)
    // ============================================
    setInterval(() => {
        // --- TUEUR DE VIDÉOS ---
        document.querySelectorAll('video').forEach(vid => {
            if (!vid.paused) { 
                vid.muted = true; 
                vid.pause();
                vid.dispatchEvent(new Event('ended')); 
                vid.remove(); 
            }
        });
        
        // --- TUEUR D'ÉCRAN "Oooops" (Jeu exclusif CrazyGames) ---
        const divs = document.getElementsByTagName('div');
        for (let div of divs) {
            if (div.innerText && div.innerText.includes("exclusively on CrazyGames")) { 
                div.remove(); 
            }
        }

        // --- TUEUR DE BOUTONS RÉCALCITRANTS ---
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
            const text = btn.innerText || '';
            
            // Suppression des boutons CrazyGames
            if (text.includes("CrazyGames") || 
                text.includes("Play on Crazy") || 
                text.includes("Save Progress") ||
                text.includes("More games")) {
                btn.style.display = 'none';
                btn.remove();
            }
            
            // Auto-click sur "Play here" pour démarrer le jeu
            if (text.includes("Play here") || text.includes("Play Now")) {
                console.log("[Puzzio.io] Auto-Click sur Play");
                setTimeout(() => btn.click(), 100);
            }
        }
        
        // --- SUPPRESSION DES LIENS CRAZYGAMES ---
        const links = document.querySelectorAll('a');
        for (let link of links) {
            if (link.href && link.href.includes('crazygames.com')) {
                link.style.display = 'none';
                link.remove();
            }
        }

        // --- SUPPRESSION DES IFRAMES DE PUB ---
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
            const src = iframe.src || '';
            if (src.includes('intentia') || 
                src.includes('googleads') || 
                src.includes('doubleclick') ||
                src.includes('googlesyndication')) {
                iframe.remove();
            }
        }

    }, 100); // Vérification toutes les 100ms

    // ============================================
    // 6. PROXY RÉSEAU (REDIRECTION DES REQUÊTES)
    // ============================================
    const SERVER_IP = "147.93.7.103";
    const SERVER_PORT = "9999";
    
    const domains = {
        "api.intentia.com": `${SERVER_IP}:${SERVER_PORT}/proxy/api.intentia.com`,
        "api.cld.com": `${SERVER_IP}:${SERVER_PORT}/proxy/api.cld.com`,
        "imasdk.googleapis.com": `${SERVER_IP}:${SERVER_PORT}/ima`,
        "googleads.g.doubleclick.net": `${SERVER_IP}:${SERVER_PORT}/ima`,
        "securepubads.g.doubleclick.net": `${SERVER_IP}:${SERVER_PORT}/ima`
    };

    function rewrite(url) {
        if (!url) return url;
        try {
            const u = new URL(url, window.location.href);
            for (const domain in domains) {
                if (u.hostname === domain || u.hostname.endsWith("." + domain)) {
                    return "http://" + domains[domain] + u.pathname + u.search + u.hash;
                }
            }
        } catch (e) { 
            return url; 
        }
        return url;
    }

    // --- INTERCEPTION FETCH ---
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        let url = typeof input === "string" ? input : input.url;
        
        // Bloquer les requêtes de pub
        if (url && (url.includes("intentia") || 
                    url.includes("googleads") || 
                    url.includes("doubleclick") ||
                    url.includes("googlesyndication"))) {
            console.log("[Puzzio.io] Fetch bloqué:", url);
            return Promise.resolve(new Response("{}", {status: 200}));
        }
        
        // Réécrire les URLs
        const newURL = rewrite(url);
        if (newURL !== url) {
            input = typeof input === "string" ? newURL : new Request(newURL, input);
            console.log("[Puzzio.io] Fetch réécrit:", url, "→", newURL);
        }
        
        return origFetch.call(this, input, init);
    };

    // --- INTERCEPTION XMLHTTPREQUEST ---
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // Bloquer les requêtes de pub
        if (url && (url.includes("intentia") || 
                    url.includes("googleads") || 
                    url.includes("doubleclick"))) {
            console.log("[Puzzio.io] XHR bloqué:", url);
            url = "data:text/plain,{}"; // URL vide
        }
        
        const newURL = rewrite(url);
        if (newURL !== url) {
            console.log("[Puzzio.io] XHR réécrit:", url, "→", newURL);
        }
        
        return origOpen.call(this, method, newURL, arguments[2], arguments[3], arguments[4]);
    };

    // ============================================
    // 7. DÉCLENCHEMENT IMMÉDIAT
    // ============================================
    // On simule la fin des pubs dès le chargement
    setTimeout(triggerAdCompletion, 100);
    setTimeout(triggerAdCompletion, 500);
    setTimeout(triggerAdCompletion, 1000);

    console.log("[Puzzio.io] ✅ Anti-Pub v3.0 FINAL installé avec succès");

})();
