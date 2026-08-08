(function() {
    'use strict';

    // 1. ELSAM SPOOFING (Tanpa manipulasi berlebihan yang bikin crash)
    try {
        delete window.Android;
        delete window.wv;
        
        if (!window.chrome) {
            window.chrome = { runtime: {} };
        }
        
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    } catch(e) {}

    // 2. PEMBERSIN KOTAK ERROR MERAH PRESISI
    const fixUI = () => {
        // Cari elemen yang berisi teks error "Verification unavailable"
        document.querySelectorAll('div').forEach(div => {
            if (div.children.length === 0 || div.querySelectorAll('div').length === 0) {
                const txt = (div.innerText || '').toLowerCase();
                if (txt.includes("verification unavailable") || txt.includes("please use a regular web browser")) {
                    // Sembunyikan HANYA kontainer merah kecilnya
                    const alertBox = div.closest('div[class*="bg-"]');
                    if (alertBox) {
                        alertBox.style.setProperty('display', 'none', 'important');
                    } else {
                        div.style.setProperty('display', 'none', 'important');
                    }
                }
            }
        });
    };

    // Run interval stabil (tiap 200ms agar tidak memberatkan CPU/RAM)
    setInterval(fixUI, 200);

    // 3. BYPASS ANTI-ADBLOCK
    window.canRunAds = true;
    window.isAdBlockActive = false;
})();
