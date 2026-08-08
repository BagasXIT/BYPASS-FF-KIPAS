(function() {
    'use strict';

    // ==========================================
    // 1. AUTO OPEN CHROME (DART/JALUR DARURAT)
    // Jika server memblokir API WebView, buka halaman otomatis di Chrome Asli
    // ==========================================
    const checkAndRedirectToChrome = () => {
        const bodyText = document.body ? document.body.innerText.toLowerCase() : '';
        const isErrorPresent = bodyText.includes("verification unavailable") || 
                               bodyText.includes("verification only works in a real browser") ||
                               bodyText.includes("yah ke fix");

        if (isErrorPresent && !window.location.href.includes('intent://')) {
            const cleanUrl = window.location.href.replace(/^https?:\/\//, '');
            const chromeIntent = "intent://" + cleanUrl + "#Intent;scheme=https;package=com.android.chrome;end";
            window.location.href = chromeIntent;
        }
    };

    // ==========================================
    // 2. SPOOFING NAVIGATOR & CLIENT HINTS
    // Menipu website agar membaca WebView sebagai Google Chrome Murni
    // ==========================================
    try {
        delete window.Android;
        delete window.wv;

        window.chrome = {
            app: { isInstalled: false },
            runtime: {}
        };

        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        Object.defineProperty(navigator, 'vendor', { get: () => 'Google Inc.' });

        if (navigator.userAgentData) {
            Object.defineProperty(navigator, 'userAgentData', {
                get: () => ({
                    brands: [
                        { brand: 'Not A;Brand', version: '99' },
                        { brand: 'Chromium', version: '122' },
                        { brand: 'Google Chrome', version: '122' }
                    ],
                    mobile: true,
                    platform: 'Android',
                    getHighEntropyValues: () => Promise.resolve({
                        architecture: 'arm',
                        bitness: '64',
                        model: 'SM-S918B',
                        platformVersion: '13.0.0'
                    })
                })
            });
        }
    } catch (e) {}

    // ==========================================
    // 3. BLOCK REDIRECT KE DISCORD
    // Mencegah halaman mengalihkan aplikasi ke Discord
    // ==========================================
    const preventDiscordRedirect = () => {
        window.onbeforeunload = null;
        const blockUrl = (url) => typeof url === 'string' && (url.includes('discord') || url.includes('gg/'));

        const origAssign = window.location.assign;
        window.location.assign = function(url) {
            if (!blockUrl(url)) origAssign.apply(this, arguments);
        };

        const origReplace = window.location.replace;
        window.location.replace = function(url) {
            if (!blockUrl(url)) origReplace.apply(this, arguments);
        };
    };

    // ==========================================
    // 4. CLEAN DOM & HAPUS ELEMENT ERROR MERAH
    // Menyapu bersih kotak peringatan di layar
    // ==========================================
    const blockedKeywords = [
        "verification unavailable",
        "please use a regular web browser",
        "verification only works in a real browser",
        "redirecting to discord",
        "yah ke fix",
        "verifikasi cuma bisa lewat browser"
    ];

    const cleanDOM = () => {
        document.querySelectorAll('div, p, span, h1, h2, section').forEach(el => {
            if (el.innerText) {
                const txt = el.innerText.toLowerCase();
                if (blockedKeywords.some(kw => txt.includes(kw))) {
                    const errorCard = el.closest('div') || el;
                    errorCard.style.setProperty('display', 'none', 'important');
                }
            }
        });
    };

    // ==========================================
    // 5. BYPASS ANTI-ADBLOCK & ADS REMOVER
    // ==========================================
    window.canRunAds = true;
    window.isAdBlockActive = false;

    const removeAds = () => {
        const adSelectors = [
            'iframe[src*="ad"]',
            'iframe[src*="pop"]',
            'div[id*="pop"]',
            'a[href*="monetag"]',
            'a[href*="propeller"]'
        ];
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    };

    // ==========================================
    // 6. EXECUTION LOOPS
    // ==========================================
    preventDiscordRedirect();

    // Gunakan MutationObserver untuk pembersihan instant
    const observer = new MutationObserver(() => {
        cleanDOM();
        removeAds();
    });

    if (document.documentElement) {
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Backup loop berkala
    setInterval(() => {
        cleanDOM();
        removeAds();
        checkAndRedirectToChrome();
    }, 100);

})();
