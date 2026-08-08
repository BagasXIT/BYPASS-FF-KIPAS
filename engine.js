// ============================================================
// DEVIL ENGINE FINAL — BYPASS ADS + UPDATE + ANTI DETEKSI
// ============================================================
(function() {
    'use strict';
    console.log('[DEVIL] Engine diaktifkan...');

    // ---------- 1. DAFTAR TEKS YANG DIHAPUS (BLOCKED MESSAGES) ----------
    const blockedTexts = [
        "yah ke fix", "verifikasi cuma bisa lewat browser", "browser tidak didukung",
        "silakan buka di chrome", "ad block terdeteksi", "matikan adblocker anda",
        "ad was not loaded", "please disable adblock", "enable javascript",
        "browser kamu tidak support", "gunakan chrome terbaru"
    ];

    // ---------- 2. FUNGSI HAPUS ELEMEN BERDASARKAN TEKS ----------
    function killBlockedMessages() {
        // Cari semua elemen yang mengandung teks terlarang
        const allElements = document.querySelectorAll('div, p, h1, h2, h3, span, section, article, main');
        allElements.forEach(el => {
            if (el.innerText) {
                const text = el.innerText.toLowerCase();
                const isBlocked = blockedTexts.some(keyword => text.includes(keyword.toLowerCase()));
                if (isBlocked) {
                    // Hapus seluruh card/parent-nya
                    const parent = el.closest('div, section, article, main, body') || el;
                    parent.style.display = 'none';
                    parent.style.visibility = 'hidden';
                    parent.style.pointerEvents = 'none';
                    console.log('[DEVIL] Teks terlarang dihapus:', el.innerText.substring(0, 50));
                }
            }
        });
    }

    // ---------- 3. HAPUS SEMUA IKLAN (SELECTOR GLOBAL) ----------
    function killAllAds() {
        const selectors = [
            // Iklan umum
            'iframe[src*="ad"]', 'iframe[src*="ads"]', 'iframe[src*="doubleclick"]',
            'iframe[src*="google"]', 'iframe[src*="monetag"]', 'iframe[src*="propeller"]',
            'ins.adsbygoogle', '.adsbygoogle', '.google-auto-placed',
            // Div iklan
            'div[id*="ad"]', 'div[class*="ad"]', 'div[id*="banner"]', 'div[class*="banner"]',
            'div[id*="pop"]', 'div[class*="pop"]', 'div[id*="interstitial"]',
            // Link iklan
            'a[href*="monetag"]', 'a[href*="propeller"]', 'a[href*="doubleclick"]',
            'a[href*="googlesyndication"]', 'a[href*="adsterra"]',
            // Script iklan
            'script[src*="ads"]', 'script[src*="googletag"]', 'script[src*="doubleclick"]'
        ];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
                console.log('[DEVIL] Iklan dihapus:', selector);
            });
        });
    }

    // ---------- 4. SPOOFING ANTI-ADBLOCK ----------
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.show_8923412 = function() { return true; };
    // Matikan deteksi dari Monetag/Propeller
    if (window.monetag) window.monetag = { display: function() {} };
    if (window.propeller) window.propeller = { display: function() {} };
    if (window._pop) window._pop = { init: function() {} };

    // ---------- 5. BYPASS UPDATE ONLINE (FETCH + XHR) ----------
    // Intercept semua request yang mengandung kata 'update' atau 'version'
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && (url.includes('update') || url.includes('version') || url.includes('check'))) {
            console.log('[DEVIL] Fetch update dicegat:', url);
            const fakeResponse = new Response(JSON.stringify({
                version: '999.9.9',
                latest: true,
                update_available: false,
                message: 'You are using the latest version.'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
            return Promise.resolve(fakeResponse);
        }
        return origFetch.call(this, input, init);
    };

    // Intercept XMLHttpRequest
    const XHR = XMLHttpRequest;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;
    XHR.prototype.open = function(method, url) {
        this._url = url;
        return origOpen.apply(this, arguments);
    };
    XHR.prototype.send = function(body) {
        if (this._url && (this._url.includes('update') || this._url.includes('version') || this._url.includes('check'))) {
            console.log('[DEVIL] XHR update dicegat:', this._url);
            setTimeout(() => {
                this.readyState = 4;
                this.status = 200;
                this.responseText = JSON.stringify({ version: '999.9.9', latest: true });
                if (this.onreadystatechange) this.onreadystatechange();
            }, 50);
            return;
        }
        return origSend.apply(this, arguments);
    };

    // ---------- 6. BLOKIR POPUP & ALERT ----------
    window.open = function(url) {
        console.log('[DEVIL] Popup diblokir:', url);
        return null;
    };
    window.alert = function(msg) { console.log('[DEVIL] Alert:', msg); };
    window.confirm = function() { return false; };
    window.prompt = function() { return ''; };

    // ---------- 7. OBSERVER (PANTAU PERUBAHAN DOM) ----------
    function runFullBypass() {
        killBlockedMessages();
        killAllAds();
    }

    // Jalankan pertama kali
    runFullBypass();

    // Jalankan setiap 500ms (buat jaga-jaga iklan muncul belakangan)
    setInterval(runFullBypass, 500);

    // Observer untuk perubahan DOM
    const observer = new MutationObserver(() => runFullBypass());
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    console.log('[DEVIL] Engine FINAL siap! Semua iklan, update, dan deteksi mati.');
})();
