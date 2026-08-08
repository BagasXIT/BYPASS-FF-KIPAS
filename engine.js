(function() {
    'use strict';

    // 1. DONT REDIRECT TO DISCORD / BLOCK NAVIGATION
    window.location.replace = function(url) {
        if (url && (url.includes('discord') || url.includes('gg/'))) return;
        window.location.href = url;
    };
    window.location.assign = function(url) {
        if (url && (url.includes('discord') || url.includes('gg/'))) return;
        window.location.href = url;
    };

    // 2. SPOOF NAVIGATOR & REMOVE WEBVIEW BRIDGES
    try {
        delete window.Android;
        delete window.wv;
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    } catch(e) {}

    // 3. PAKSA HAPUS ELEMENT ERROR MERAH & REDIRECT DISCORD
    const killErrorElements = () => {
        // Cari teks error spesifik
        const targets = [
            "verification unavailable",
            "please use a regular web browser",
            "verification only works in a real browser",
            "redirecting to discord",
            "yah ke fix"
        ];

        // Sembunyikan elemen teks merah
        document.querySelectorAll('div, p, span, h1, h2').forEach(el => {
            if (el.innerText) {
                const txt = el.innerText.toLowerCase();
                if (targets.some(key => txt.includes(key))) {
                    // Jika itu pesan error kotak merah di atas input
                    const parentRedBox = el.closest('div[class*="red"], div[class*="bg-red"], div[class*="error"], div[class*="border"]');
                    if (parentRedBox) {
                        parentRedBox.remove(); // Hapus permanen dari DOM
                    } else {
                        el.style.setProperty('display', 'none', 'important');
                    }
                }
            }
        });

        // Jika halaman berubah total jadi layar "Verification only works in a real browser"
        if (document.body && document.body.innerText.toLowerCase().includes("verification only works in a real browser")) {
            // Reload atau kembalikan ke halaman verifikasi utama
            if (window.location.href.includes('verify')) {
                // Biarkan di halaman tersebut tapi hapus overlay full screen
                document.querySelectorAll('div').forEach(d => {
                    if (d.innerText.toLowerCase().includes("redirecting to discord")) {
                        d.remove();
                    }
                });
            }
        }
    };

    // 4. BYPASS ANTI-ADBLOCK
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.show_8923412 = function() {};

    // 5. REMOVE POPUP ADS
    const removeAds = () => {
        document.querySelectorAll('iframe[src*="ad"], iframe[src*="pop"], div[id*="pop"], a[href*="monetag"]').forEach(el => el.remove());
    };

    // Eksekusi super cepat (tiap 20ms) agar pesan error tidak sempat muncul di layar user
    setInterval(() => {
        killErrorElements();
        removeAds();
    }, 20);

})();
