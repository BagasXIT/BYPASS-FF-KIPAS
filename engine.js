// ============================================================
// DEVIL ENGINE — ANTI-REDIRECT + AUTO VERIFY (SUPER AGGRESSIVE)
// ============================================================
(function() {
    'use strict';
    console.log('[DEVIL] Engine anti-redirect aktif!');

    // ---------- 1. KONFIGURASI ----------
    const MY_UID = "123456789"; // Ganti dengan UID FF lu

    // ---------- 2. CEGAH REDIRECT (JURUS MATI) ----------
    // Override location
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
        get: function() { return originalLocation; },
        set: function(url) {
            console.log('[DEVIL] Redirect dicegah:', url);
            return false;
        }
    });
    window.location.href = function(url) {
        console.log('[DEVIL] Redirect dicegah (href):', url);
        return false;
    };
    window.location.replace = function(url) {
        console.log('[DEVIL] Redirect.replace dicegah:', url);
        return false;
    };
    window.location.assign = function(url) {
        console.log('[DEVIL] Redirect.assign dicegah:', url);
        return false;
    };
    window.open = function(url) {
        console.log('[DEVIL] Popup/redirect dicegah:', url);
        return null;
    };

    // Cegah event beforeunload (redirect dari meta refresh)
    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = '';
        console.log('[DEVIL] Beforeunload dicegah');
        return false;
    });

    // Hentikan semua interval/timeout yang mungkin memicu redirect
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay) {
        if (typeof fn === 'string' && fn.includes('location')) {
            console.log('[DEVIL] Timeout redirect dicegah');
            return null;
        }
        return originalSetTimeout.apply(this, arguments);
    };

    // ---------- 3. HAPUS OVERLAY PASSWORD (JIKA MUNCUL) ----------
    function nukeOverlay() {
        // Cari elemen dengan teks "PS:" atau "password"
        const keywords = ["PS:", "enter your code", "login and password", "Password:", "Enter password"];
        document.querySelectorAll('*').forEach(el => {
            const text = el.innerText || '';
            if (keywords.some(kw => text.includes(kw))) {
                let parent = el.closest('div, section, main, body');
                if (parent) {
                    parent.style.display = 'none';
                    parent.style.visibility = 'hidden';
                    parent.style.opacity = '0';
                    parent.style.pointerEvents = 'none';
                }
            }
            // Hapus elemen dengan z-index tinggi (modal)
            const style = getComputedStyle(el);
            if (parseInt(style.zIndex) > 9999 && style.position === 'fixed') {
                el.style.display = 'none';
            }
        });
    }

    // ---------- 4. AUTO FILL UID & VERIFY (SEBELUM REDIRECT) ----------
    function autoVerify() {
        const uidInput = document.querySelector('input[type="text"]');
        if (uidInput) {
            uidInput.value = MY_UID;
            uidInput.dispatchEvent(new Event('input', { bubbles: true }));
            // Cari tombol Verify
            const btn = document.querySelector('button[type="submit"], .btn-verify, input[type="submit"]');
            if (btn) {
                btn.click();
                console.log('[DEVIL] UID diisi & tombol Verify diklik!');
            }
        }
    }

    // ---------- 5. INTERCEPT REQUEST AUTENTIKASI (BYPASS VERIF) ----------
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && (url.includes('verify') || url.includes('uid') || url.includes('whitelist'))) {
            console.log('[DEVIL] Intercept verifikasi:', url);
            return Promise.resolve(new Response(JSON.stringify({
                success: true,
                message: 'UID verified',
                data: { uid: MY_UID, status: 'whitelisted' }
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
                this.responseText = JSON.stringify({ success: true, data: { uid: MY_UID } });
                if (this.onreadystatechange) this.onreadystatechange();
            }, 50);
            return;
        }
        return origSend.apply(this, arguments);
    };

    // ---------- 6. EKSEKUSI SUPER CEPAT (SETIAP 100ms) ----------
    function fullAttack() {
        nukeOverlay();
        autoVerify();
        // Hapus iklan juga
        document.querySelectorAll('iframe[src*="ad"], iframe[src*="doubleclick"], ins.adsbygoogle')
            .forEach(el => el.remove());
    }

    fullAttack();
    setInterval(fullAttack, 100); // <-- Eksekusi setiap 0.1 detik

    // Observer DOM
    new MutationObserver(fullAttack)
        .observe(document.documentElement, { childList: true, subtree: true });

    console.log('[DEVIL] Engine anti-redirect siap! Halaman UID akan tetap terbuka.');
})();
