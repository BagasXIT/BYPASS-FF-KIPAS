(function() {
    console.log("BAGASXIT Engine Loaded Successfully");

    // 1. Anti Deteksi WebView
    try {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        window.open = function(url) { 
            console.log('Blocked pop-up: ' + url); 
            return null; 
        };
    } catch(e) {}

    // 2. Pembersih Iklan Agresif
    function killAds() {
        const selectors = [
            'iframe', 'ins', 'div[class*="ads"]', 'div[id*="ads"]', 
            'div[class*="pop"]', 'div[id*="pop"]', 'a[href*="adsterra"]', 
            'a[href*="monetag"]', 'a[href*="propellerads"]', '.banner-ads', 
            '[class*="sticky"]', '[id*="google_ads"]'
        ];
        selectors.forEach(s => {
            document.querySelectorAll(s).forEach(el => el.remove());
        });
    }

    // Jalankan eksekusi awal & pantau perubahan elemen (MutationObserver)
    killAds();
    if (document.body) {
        new MutationObserver(killAds).observe(document.body, { childList: true, subtree: true });
    }

    // Blokir klik elemen link iklan
    document.addEventListener('click', function(e) {
        if (e.target && e.target.tagName === 'A' && e.target.href && e.target.href.includes('ads')) {
            e.preventDefault();
        }
    }, true);
})();
