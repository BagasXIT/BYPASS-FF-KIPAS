(function() {
    'use strict';

    // 1. SPOOFING NAVIGATOR
    try {
        delete window.Android;
        delete window.wv;
        if (!window.chrome) window.chrome = { runtime: {} };
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    } catch(e) {}

    // 2. PEMBERSINAN PRESISI (KARTU UTAMA TIDAK AKAN HILANG)
    const fixUI = () => {
        document.querySelectorAll('p, span, div').forEach(el => {
            if (el.innerText) {
                const txt = el.innerText.toLowerCase();

                // Deteksi teks pesan error
                if (txt.includes("verification unavailable") || 
                    txt.includes("please use a regular web browser") || 
                    txt.includes("verification only works in a real browser") ||
                    txt.includes("yah ke fix")) {
                    
                    // Ambil pembungkus terdekat
                    const parent = el.closest('div');
                    
                    if (parent) {
                        // JIKA parent mengandung judul 'VERIFY YOUR UID' atau kolom Input, HANYA sembunyikan teks errornya!
                        if (parent.innerText.toUpperCase().includes('VERIFY YOUR UID') || parent.querySelector('input')) {
                            el.style.setProperty('display', 'none', 'important');
                        } else {
                            // Jika ini elemen error terpisah di luar form, baru sembunyikan parent-nya
                            parent.style.setProperty('display', 'none', 'important');
                        }
                    } else {
                        el.style.setProperty('display', 'none', 'important');
                    }
                }
            }
        });
    };

    // Jalankan pembersihan secara berskala
    setInterval(fixUI, 150);

    // 3. BYPASS ANTI-ADBLOCK
    window.canRunAds = true;
    window.isAdBlockActive = false;
})();
