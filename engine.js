(function() {
    'use strict';

    // 1. SPOOF CLIENT HINTS (Sec-CH-UA) & CHROMIUM OBJECTS
    try {
        // Hilangkan objek bawaan Android WebView
        delete window.Android;
        delete window.wv;

        // Palsukan window.chrome
        window.chrome = {
            app: { isInstalled: false },
            runtime: {}
        };

        // Palsukan UserAgentData (Client Hints) agar terbaca sebagai Chrome Android murni
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

    // 2. MUTATION OBSERVER (Memantau DOM secara instant tanpa delay interval)
    const targets = [
        "verification unavailable",
        "please use a regular web browser",
        "verification only works in a real browser",
        "redirecting to discord",
        "yah ke fix"
    ];

    const cleanDOM = () => {
        // A. Sembunyikan Overlay Fullscreen / Redirect Discord
        document.querySelectorAll('div, section, main').forEach(el => {
            const txt = (el.innerText || '').toLowerCase();
            if (txt.includes("verification only works in a real browser") || txt.includes("yah ke fix")) {
                if (el.children.length > 0 && el.innerText.length < 300) {
                    el.style.setProperty('display', 'none', 'important');
                }
            }
        });

        // B. Hapus Kotak Error Merah "Verification unavailable"
        document.querySelectorAll('div, p, span').forEach(el => {
            const txt = (el.innerText || '').toLowerCase();
            if (txt.includes("verification unavailable") || txt.includes("please use a regular web browser")) {
                const parentBox = el.closest('div');
                if (parentBox) {
                    parentBox.style.setProperty('display', 'none', 'important');
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
