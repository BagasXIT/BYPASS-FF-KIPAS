(function() {
    'use strict';

    // 1. Sembunyikan & Hapus Tampilan Error "YAH KE FIX" secara paksa
    const forceBypassWebViewCheck = () => {
        // Jika terdapat elemen teks "YAH KE FIX" atau "Verifikasi cuma bisa lewat browser", sembunyikan/hapus
        document.querySelectorAll('div, p, h1, h2, span').forEach(el => {
            if (el.innerText && (el.innerText.includes("YAH KE FIX") || el.innerText.includes("Verifikasi cuma bisa lewat browser"))) {
                const parentCard = el.closest('div');
                if (parentCard) parentCard.style.display = 'none';
            }
        });
    };

    // 2. Palsukan Objek Navigator & Window agar terbaca sebagai Browser Chrome Resmi
    try {
        Object.defineProperty(navigator, 'userAgent', {
            get: function () { return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'; }
        });
        Object.defineProperty(navigator, 'vendor', { get: function () { return 'Google Inc.'; } });
        Object.defineProperty(navigator, 'webdriver', { get: function () { return false; } });
    } catch (e) {}

    // Hapus JEJAK khas WebView Android
    delete window.Android;
    delete window.wv;
    delete window.chrome; // reset jika ada inject palsu

    // 3. Bypass Anti-Adblock (Keep existing logic)
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.show_8923412 = function() {};

    // Run terus menerus untuk memastikan elemen deteksi langsung hilang saat dirender
    setInterval(() => {
        forceBypassWebViewCheck();
    }, 100);

})();
