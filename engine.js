(function() {
    'use strict';

    // 1. Sembunyikan pesan "YAH KE FIX" tanpa merusak Cloudflare Turnstile
    const bypassWebViewCheck = () => {
        document.querySelectorAll('div, p, h1, h2, span').forEach(el => {
            if (el.innerText && (el.innerText.includes("YAH KE FIX") || el.innerText.includes("Verifikasi cuma bisa lewat browser"))) {
                const parentCard = el.closest('div');
                if (parentCard) parentCard.style.display = 'none';
            }
        });
    };

    // 2. Bypass Anti-Adblock (Keep Monetag/PropellerAds Spoofing)
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.show_8923412 = function() {};

    // 3. Auto Remove Ads Element
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

    setInterval(() => {
        bypassWebViewCheck();
        removeAds();
    }, 300);
})();
