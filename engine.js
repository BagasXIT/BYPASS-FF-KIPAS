(function() {
    'use strict';

    // 1. SPOOF NAVIGATOR SECARA DEEP
    try {
        delete window.Android;
        delete window.wv;
        window.chrome = { runtime: {} };
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    } catch(e) {}

    // 2. HIJACK TOMBOL "VERIFY UID"
    // Begitu user menekan tombol VERIFY UID, buka otomatis via Chrome Intent
    const interceptVerifyButton = () => {
        const verifyBtn = document.querySelector('button, a, input[type="submit"]');
        
        document.querySelectorAll('*').forEach(el => {
            if (el.innerText && el.innerText.toUpperCase().includes('VERIFY UID')) {
                // Bersihkan event listener bawaan web target
                const newBtn = el.cloneNode(true);
                if (el.parentNode) {
                    el.parentNode.replaceChild(newBtn, el);
                }

                // Tambahkan aksi paksa buka Chrome
                newBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Ambil UID yang diinput user
                    const inputEl = document.querySelector('input[type="text"], input[type="number"]');
                    const uid = inputEl ? inputEl.value : '';

                    // Buka URL saat ini langsung di Google Chrome Asli
                    const targetUrl = window.location.href.replace(/^https?:\/\//, '');
                    const intentUrl = "intent://" + targetUrl + "#Intent;scheme=https;package=com.android.chrome;end";
                    
                    window.location.href = intentUrl;
                }, true);
            }
        });
    };

    // Jalankan pemantauan tombol secara berkala
    setInterval(interceptVerifyButton, 300);
})();
