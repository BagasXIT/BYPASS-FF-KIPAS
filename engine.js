(function() {
    'use strict';

    // 1. SPUFING UTAMA: Buat WebView terlihat 100% sebagai Chrome Asli di level Browser API
    try {
        if (!window.chrome) {
            window.chrome = { runtime: {} };
        }
        delete window.Android;
        delete window.wv;
        
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        Object.defineProperty(navigator, 'vendor', { get: () => 'Google Inc.' });
    } catch(e) {}

    // 2. MATIKAN FUNGSI DETEKSI / REDIRECT DARI WEBSITE TARGET
    // Mencegah window.location diubah ke Discord atau ke tampilan error
    const blockRedirect = () => {
        window.onbeforeunload = null;
        
        const safeAssign = function(url) {
            if (typeof url === 'string' && (url.includes('discord') || url.includes('gg/'))) {
                return false;
            }
            window.location.href = url;
        };

        window.location.assign = safeAssign;
        window.location.replace = safeAssign;
    };

    // 3. SAPU BERSIH OVERLAY & BOX ERROR (DOM KILLER)
    const sweepErrorUI = () => {
        // A. Jika seluruh layar berubah menjadi "YAH KE FIX" / Overlay Discord
        const bodyText = document.body ? document.body.innerText.toLowerCase() : '';
        if (bodyText.includes("yah ke fix") || bodyText.includes("verification only works in a real browser")) {
            // Sembunyikan elemen paling luar yang menutupi layar
            document.querySelectorAll('div').forEach(div => {
                const txt = div.innerText ? div.innerText.toLowerCase() : '';
                if (txt.includes("yah ke fix") || txt.includes("redirecting to discord") || txt.includes("join discord")) {
                    div.style.setProperty('display', 'none', 'important');
                }
            });
        }

        // B. Hapus kotak merah "Verification unavailable..." di atas input UID
        document.querySelectorAll('div, p, span').forEach(el => {
            if (el.innerText) {
                const txt = el.innerText.toLowerCase();
                if (txt.includes("verification unavailable") || txt.includes("please use a regular web browser")) {
                    // Paksa hilangkan kotak error merahnya
                    const errorBox = el.closest('div');
                    if (errorBox) {
                        errorBox.style.setProperty('display', 'none', 'important');
                    }
                }
            }
        });
    };

    // 4. BYPASS ANTI-ADBLOCK
    window.canRunAds = true;
    window.isAdBlockActive = false;

    // Execute secepat mungkin (tiap 10ms)
    blockRedirect();
    setInterval(() => {
        sweepErrorUI();
    }, 10);

})();
