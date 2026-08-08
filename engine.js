
(function() {
    'use strict';

    // 1. DAFTAR KATA PENGERINGATAN / ERROR YANG INGIN DIBLOKIR
    // Tambahkan kata baru di dalam tanda kurung siku ini (pisahkan dengan koma)
    const blockedTexts = [
        "yah ke fix",
        "verifikasi cuma bisa lewat browser",
        "browser tidak didukung",
        "silakan buka di chrome",
        "ad block terdeteksi",
        "matikan adblocker anda",
        "ad was not loaded",
        "Verification only works in a real browser Redirecting to Discord...",
        "Join Discord",
        "YAH KE FIX Verification only works in a real browser Redirecting to Discord... Join Discord",
        "Join Discord https://dsc.gg/sikipas",
        "Verification unavailable. Please use a regular web browser.",
    ];

    // 2. Sembunyikan Pesan Peringatan secara Otomatis
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

    // 3. Bypass Anti-Adblock (Spoofing Monetag / PropellerAds)
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.show_8923412 = function() {};

    // 4. Auto Remove Elements Iklan
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

    // Jalankan pemeriksaan secara terus-menerus
    setInterval(() => {
        bypassWebViewCheck();
        removeAds();
    }, 300);
})();
