(function() {
    'use strict';

    // 1. DAFTAR PESAN ERROR / PERINGATAN TERBARU (Bahasa Indonesia & Inggris)
    const blockedTexts = [
        "verification unavailable",
        "please use a regular web browser",
        "verification only works in a real browser",
        "redirecting to discord",
        "yah ke fix",
        "verifikasi cuma bisa lewat browser",
        "browser tidak didukung"
    ];

    // 2. Sembunyikan Alert Peringatan
    const bypassWebViewCheck = () => {
        document.querySelectorAll('div, p, h1, h2, span, section').forEach(el => {
            if (el.innerText) {
                const currentText = el.innerText.toLowerCase();
                const isBlocked = blockedTexts.some(keyword => currentText.includes(keyword));
                
                if (isBlocked) {
                    const parentCard = el.closest('div') || el;
                    parentCard.style.display = 'none';
                }
            }
        });
    };

    // 3. BLOKIR AUTO-REDIRECT KE DISCORD
    // Mencegah script web mengarahkan halaman ke Discord secara paksa
    const originalLocationAssign = window.location.assign;
    const originalLocationReplace = window.location.replace;

    window.location.replace = function(url) {
        if (url && url.includes('discord')) return;
        return originalLocationReplace.apply(this, arguments);
    };

    window.location.assign = function(url) {
        if (url && url.includes('discord')) return;
        return originalLocationAssign.apply(this, arguments);
    };

    // 4. Bypass Anti-Adblock (Keep Monetag/PropellerAds Spoofing)
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.show_8923412 = function() {};

    // 5. Auto Remove Ads Element
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

    // Jalankan pemeriksaan intensif
    setInterval(() => {
        bypassWebViewCheck();
        removeAds();
    }, 100);

})();
