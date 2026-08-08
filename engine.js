(function() {
    'use strict';

    // 1. SPOOF CLIENT HINTS & CHROMIUM OBJECTS
    try {
        delete window.Android;
        delete window.wv;

        window.chrome = {
            app: { isInstalled: false },
            runtime: {}
        };

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

    // 2. CLEANDOM PRESISI (Hanya sembunyikan kotak error merah)
    const cleanDOM = () => {
        // Hapus HANYA elemen yang berisi teks error merah, tanpa menghapus kartu utama
        document.querySelectorAll('div, p, span').forEach(el => {
            const txt = (el.innerText || '').toLowerCase();
            
            // Cek jika elemen berisi teks error "Verification unavailable"
            if (txt.includes("verification unavailable") || txt.includes("please use a regular web browser")) {
                // Pastikan yang disembunyikan HANYA kotak merah kecilnya
                if (el.children.length === 0 || el.tagName.toLowerCase() === 'p' || el.tagName.toLowerCase() === 'span') {
                    const redBox = el.closest('div');
                    if (redBox && !redBox.innerText.toLowerCase().includes("verify your uid")) {
                        redBox.style.setProperty('display', 'none', 'important');
                    }
                }
            }

            // Sembunyikan layar overlay "YAH KE FIX" jika muncul terpisah
            if (txt.includes("verification only works in a real browser") || txt.includes("redirecting to discord")) {
                if (!txt.includes("verify your uid")) {
                    el.style.setProperty('display', 'none', 'important');
                }
            }
        });
    };

    // Jalankan observer saat ada perubahan HTML di web
    const observer = new MutationObserver(() => cleanDOM());
    if (document.documentElement) {
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Backup interval super cepat
    setInterval(cleanDOM, 10);

    // 3. BYPASS ANTI-ADBLOCK
    window.canRunAds = true;
    window.isAdBlockActive = false;
})();
