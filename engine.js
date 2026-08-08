// ============================================================
// DEVIL ENGINE ULTIMATE — BYPASS UID VERIFICATION + CLOUDFLARE
// ============================================================
(function() {
    'use strict';
    console.log('[DEVIL] Engine aktif...');

    // ---------- 1. SETTING UID (GANTI SESUAI UID LU) ----------
    const MY_UID = "123456789"; // <-- Ganti dengan UID Free Fire asli lu

    // ---------- 2. FUNGSI HAPUS TEKS PERINGATAN ----------
    const blockedTexts = [
        "yah ke fix", "verifikasi cuma bisa lewat browser", "browser tidak didukung",
        "silakan buka di chrome", "ad block terdeteksi", "matikan adblocker anda",
        "ad was not loaded", "please disable adblock", "enable javascript"
    ];

    function killBlockedMessages() {
        document.querySelectorAll('div, p, h1, h2, h3, span, section, article, main, body')
            .forEach(el => {
                if (el.innerText) {
                    const text = el.innerText.toLowerCase();
                    const isBlocked = blockedTexts.some(keyword => text.includes(keyword.toLowerCase()));
                    if (isBlocked) {
                        const parent = el.closest('div, section, article, main, body') || el;
                        parent.style.display = 'none';
                        parent.style.visibility = 'hidden';
                        console.log('[DEVIL] Teks peringatan dihapus:', el.innerText.substring(0, 40));
                    }
                }
            });
    }

    // ---------- 3. HAPUS IKLAN ----------
    function killAllAds() {
        const selectors = [
            'iframe[src*="ad"]', 'iframe[src*="ads"]', 'iframe[src*="doubleclick"]',
            'iframe[src*="google"]', 'iframe[src*="monetag"]', 'iframe[src*="propeller"]',
            'ins.adsbygoogle', '.adsbygoogle', '.google-auto-placed',
            'div[id*="ad"]', 'div[class*="ad"]', 'div[id*="banner"]', 'div[class*="banner"]',
            'div[id*="pop"]', 'div[class*="pop"]', 'div[id*="interstitial"]',
            'a[href*="monetag"]', 'a[href*="propeller"]', 'a[href*="doubleclick"]',
            'a[href*="googlesyndication"]', 'a[href*="adsterra"]',
            'script[src*="ads"]', 'script[src*="googletag"]', 'script[src*="doubleclick"]'
        ];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    // ---------- 4. SPOOFING ANTI-ADBLOCK ----------
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.show_8923412 = function() { return true; };
    if (window.monetag) window.monetag = { display: function() {} };
    if (window.propeller) window.propeller = { display: function() {} };

    // ---------- 5. BYPASS UPDATE ONLINE (FETCH & XHR) ----------
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && (url.includes('update') || url.includes('version') || url.includes('check'))) {
            console.log('[DEVIL] Fetch update dicegat:', url);
            return Promise.resolve(new Response(JSON.stringify({
                version: '999.9.9', latest: true, update_available: false
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }
        return origFetch.call(this, input, init);
    };

    const XHR = XMLHttpRequest;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;
    XHR.prototype.open = function(method, url) {
        this._url = url;
        return origOpen.apply(this, arguments);
    };
    XHR.prototype.send = function(body) {
        if (this._url && (this._url.includes('update') || this._url.includes('version') || this._url.includes('check'))) {
            console.log('[DEVIL] XHR update dicegat:', this._url);
            setTimeout(() => {
                this.readyState = 4;
                this.status = 200;
                this.responseText = JSON.stringify({ version: '999.9.9', latest: true });
                if (this.onreadystatechange) this.onreadystatechange();
            }, 50);
            return;
        }
        return origSend.apply(this, arguments);
    };

    // ---------- 6. MATIKAN POPUP ----------
    window.open = function(url) { console.log('[DEVIL] Popup diblokir:', url); return null; };
    window.alert = console.log;
    window.confirm = function() { return false; };
    window.prompt = function() { return ''; };

    // ---------- 7. BYPASS CLOUDFLARE CHALLENGE ----------
    function bypassCloudflare() {
        // Cek apakah ada iframe/turnstile challenge
        const challenge = document.querySelector('#cf-challenge, .cf-browser-verification, [data-cf]');
        if (challenge) {
            console.log('[DEVIL] Cloudflare challenge terdeteksi, mencoba bypass...');
            // Cari tombol verifikasi di dalam challenge
            const verifyBtn = challenge.querySelector('button[type="submit"], input[type="submit"]');
            if (verifyBtn) {
                setTimeout(() => verifyBtn.click(), 500);
            } else {
                // Mungkin challenge sudah selesai sendiri, kita reload ulang
                // Tapi lebih baik kita override response seperti di bawah
            }
        }
        // Selain itu, kita juga bisa override fungsi challenge callback
        // Ini contoh untuk Turnstile:
        if (window.turnstile) {
            window.turnstile.render = function(container, params) {
                // Simulasikan sukses
                if (params && params.callback) {
                    params.callback('fake-token');
                }
                return 'fake-widget-id';
            };
            console.log('[DEVIL] Turnstile di-bypass (fake token).');
        }
        // Override fungsi Cloudflare biasa
        window._cf_chl_opt = window._cf_chl_opt || {};
        window._cf_chl_opt.cg = function() { return true; };
    }

    // ---------- 8. BYPASS VERIFIKASI UID (INTERCEPT RESPONSE) ----------
    // Kita intercept semua request yang ke endpoint verifikasi UID
    // dan ubah response-nya menjadi sukses
    function interceptVerification() {
        // Override fetch untuk endpoint verify
        const origFetch2 = window.fetch;
        window.fetch = function(input, init) {
            const url = typeof input === 'string' ? input : input.url;
            if (url && (url.includes('verify') || url.includes('uid') || url.includes('whitelist'))) {
                console.log('[DEVIL] Verifikasi UID dicegat:', url);
                // Kembalikan response palsu sukses
                const fakeResponse = new Response(JSON.stringify({
                    success: true,
                    message: 'UID berhasil diverifikasi!',
                    data: { uid: MY_UID, status: 'whitelisted' }
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
                return Promise.resolve(fakeResponse);
            }
            return origFetch2.call(this, input, init);
        };

        // Override XMLHttpRequest untuk endpoint yang sama
        const XHR2 = XMLHttpRequest;
        const origOpen2 = XHR2.prototype.open;
        const origSend2 = XHR2.prototype.send;
        XHR2.prototype.open = function(method, url) {
            this._url = url;
            return origOpen2.apply(this, arguments);
        };
        XHR2.prototype.send = function(body) {
            if (this._url && (this._url.includes('verify') || this._url.includes('uid') || this._url.includes('whitelist'))) {
                console.log('[DEVIL] XHR verifikasi dicegat:', this._url);
                setTimeout(() => {
                    this.readyState = 4;
                    this.status = 200;
                    this.responseText = JSON.stringify({
                        success: true,
                        message: 'UID berhasil diverifikasi! (fake)',
                        data: { uid: MY_UID, status: 'whitelisted' }
                    });
                    if (this.onreadystatechange) this.onreadystatechange();
                }, 50);
                return;
            }
            return origSend2.apply(this, arguments);
        };
    }

    // ---------- 9. AUTO FILL UID & SUBMIT ----------
    function autoFillAndSubmit() {
        const uidInput = document.querySelector('input[type="text"]') || document.querySelector('input');
        if (uidInput) {
            uidInput.value = MY_UID;
            // Trigger event
            const evt = new Event('input', { bubbles: true });
            uidInput.dispatchEvent(evt);
            
            // Cari tombol verify
            const verifyBtn = document.querySelector('button[type="submit"], input[type="submit"], .btn-verify, button:contains("VERIFY")');
            if (verifyBtn) {
                setTimeout(() => verifyBtn.click(), 300);
                console.log('[DEVIL] UID diisi & tombol verify diklik.');
            }
        } else {
            // Jika tidak ada input, mungkin halaman sudah di halaman sukses?
            console.log('[DEVIL] Tidak ada input UID ditemukan.');
        }
    }

    // ---------- 10. EKSEKUSI UTAMA ----------
    function runFullBypass() {
        killBlockedMessages();
        killAllAds();
        bypassCloudflare();
        interceptVerification(); // Penting: ini harus dijalankan SEBELUM request verifikasi dikirim
        autoFillAndSubmit();
    }

    // Jalankan pertama kali
    runFullBypass();

    // Jalankan setiap 500ms untuk jaga-jaga
    setInterval(runFullBypass, 500);

    // Observer DOM untuk perubahan halaman
    new MutationObserver(() => runFullBypass())
        .observe(document.documentElement, { childList: true, subtree: true });

    console.log('[DEVIL] Engine ULTIMATE siap! Verifikasi UID + Cloudflare + Ads mati total.');
})();
