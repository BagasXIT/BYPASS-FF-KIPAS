(function() {
    'use strict';

    // 1. Bypass Anti-Adblock / Fake Ad-blocker Checkers
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.show_8923412 = function() {}; // Dummy function untuk Monetag/PopUnder
    window.monetag = window.monetag || {};
    
    // 2. Sembunyikan Pesan Error "Ad was not loaded" jika sempat muncul
    const hideErrorMsg = () => {
        const errorBoxes = document.querySelectorAll('div, p, span');
        errorBoxes.forEach(el => {
            if (el.innerText && el.innerText.includes("Ad was not loaded")) {
                el.style.display = 'none';
            }
        });
    };

    // 3. Auto-remove Iklan & Pop-ups Tanpa Memicu Error
    const removeAds = () => {
        // Hapus Iklan Pop-under / Overlay
        const adSelectors = [
            'iframe[src*="ad"]',
            'iframe[src*="pop"]',
            'div[id*="pop"]',
            'div[class*="ad-"]',
            'a[href*="monetag"]',
            'a[href*="propeller"]'
        ];
        
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    };

    // Jalankan pembersihan secara periodik
    setInterval(() => {
        hideErrorMsg();
        removeAds();
    }, 500);

    // Override window.open agar iklan tab baru/pop-up tidak bisa terbuka
    window.open = function() {
        return null;
    };
})();
