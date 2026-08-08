// ============================================================
// DEVIL ENGINE — FINAL NUKLIR (HANCURKAN ERROR + REDIRECT)
// ============================================================
(function() {
    'use strict';
    console.log('[DEVIL] Nuklir final aktif!');

    // ---------- 1. SPOOFING TOTAL ----------
    const fakeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
    const spoof = {
        userAgent: fakeUA,
        vendor: 'Google Inc.',
        platform: 'Win32',
        webdriver: false,
        plugins: [1,2,3,4,5],
        languages: ['en-US', 'en'],
        deviceMemory: 8,
        hardwareConcurrency: 8,
        maxTouchPoints: 0,
        cookieEnabled: true,
        doNotTrack: null,
        connection: { effectiveType: '4g', rtt: 50, downlink: 10 },
        mediaDevices: { enumerateDevices: () => Promise.resolve([]) },
        storage: { estimate: () => Promise.resolve({ quota: 1024**3, usage: 0 }) }
    };
    Object.keys(spoof).forEach(k => {
        try { Object.defineProperty(navigator, k, { get: () => spoof[k], configurable: false }); } catch(e) {}
    });
    if (!window.chrome) {
        window.chrome = { app: { isInstalled: false }, runtime: {}, loadTimes: () => {}, csi: () => {}, sendMessage: () => {} };
    }

    // ---------- 2. CEGAH REDIRECT & POPUP ----------
    const origLoc = window.location;
    Object.defineProperty(window, 'location', {
        get: () => origLoc,
        set: (url) => { console.log('[DEVIL] Redirect dicegah:', url); return false; }
    });
    window.open = () => null;
    window.addEventListener('beforeunload', (e) => { e.preventDefault(); e.returnValue = ''; });

    // ---------- 3. INTERCEPT VERIFIKASI (SUKSES PALSU) ----------
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && (url.includes('verify') || url.includes('uid') || url.includes('whitelist'))) {
            console.log('[DEVIL] Intercept fetch verifikasi:', url);
            return Promise.resolve(new Response(JSON.stringify({
                success: true,
                message: 'UID verified',
                data: { uid: '14645454545', status: 'whitelisted' }
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
        if (this._url && (this._url.includes('verify') || this._url.includes('uid') || this._url.includes('whitelist'))) {
            console.log('[DEVIL] Intercept XHR verifikasi:', this._url);
            setTimeout(() => {
                this.readyState = 4;
                this.status = 200;
                this.responseText = JSON.stringify({ success: true, data: { uid: '14645454545' } });
                if (this.onreadystatechange) this.onreadystatechange();
            }, 50);
            return;
        }
        return origSend.apply(this, arguments);
    };

    // ---------- 4. AUTO VERIFY ----------
    function autoVerify() {
        const uidInput = document.querySelector('input[type="text"]');
        if (uidInput) {
            uidInput.value = '14645454545';
            uidInput.dispatchEvent(new Event('input', { bubbles: true }));
            const btn = document.querySelector('button[type="submit"], .btn-verify, input[type="submit"]');
            if (btn) {
                btn.click();
                console.log('[DEVIL] UID diisi & Verify diklik');
            }
        }
    }

    // ---------- 5. EKSEKUSI CEPAT & HANCURKAN ERROR ----------
    function nukeEverything() {
        // Hapus semua elemen yang mengandung kata "Verification unavailable" atau "regular web browser"
        const all = document.querySelectorAll('*');
        all.forEach(el => {
            const text = (el.innerText || '').toLowerCase();
            if (text.includes('verification unavailable') || text.includes('regular web browser') || text.includes('browser tidak didukung')) {
                let parent = el.closest('div, section, main, body');
                if (parent) {
                    parent.style.display = 'none';
                    parent.style.visibility = 'hidden';
                    parent.style.opacity = '0';
                    parent.style.pointerEvents = 'none';
                    parent.remove(); // brute force hapus dari DOM
                }
            }
            // Hapus modal overlay
            const style = getComputedStyle(el);
            if (parseInt(style.zIndex) > 9999 && style.position === 'fixed') {
                el.remove();
            }
        });
        // Bersihkan body dari semua child kecuali yang penting (tapi kita akan redirect)
    }

    // Jalankan terus menerus
    autoVerify();
    setInterval(() => {
        nukeEverything();
        // Cek apakah "Berhasil" muncul dan tidak ada error, lalu redirect
        const bodyText = document.body.innerText || '';
        if (bodyText.includes('Berhasil') && !bodyText.toLowerCase().includes('verification unavailable')) {
            console.log('[DEVIL] Verifikasi sukses, redirect ke home...');
            // Redirect ke halaman utama (sesuaikan URL)
            window.location.replace('https://ffkipas.my.id/');
        }
    }, 100);

    // Observer
    new MutationObserver(() => {
        nukeEverything();
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true });

    // ---------- 6. MATIKAN SCRIPT LAIN (OVERRIDE eval, setTimeout) ----------
    // Hentikan semua setTimeout/setInterval yang mungkin memunculkan error
    const origSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay) {
        if (typeof fn === 'string' && (fn.includes('error') || fn.includes('unavailable'))) {
            console.log('[DEVIL] Timeout error dicegah');
            return null;
        }
        return origSetTimeout.apply(this, arguments);
    };
    const origSetInterval = window.setInterval;
    window.setInterval = function(fn, delay) {
        if (typeof fn === 'string' && (fn.includes('error') || fn.includes('unavailable'))) {
            console.log('[DEVIL] Interval error dicegah');
            return null;
        }
        return origSetInterval.apply(this, arguments);
    };

    console.log('[DEVIL] Nuklir final siap! Error akan hancur dan redirect ke home.');
})();
