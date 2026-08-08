// ============================================================
// DEVIL ENGINE NUKLIR — HANCURKAN PASSWORD GATE + VERIFIKASI
// ============================================================
(function() {
    'use strict';
    console.log('[DEVIL] Engine Nuklir aktif!');

    // ---------- 1. KONFIGURASI ----------
    const MY_UID = "123456789"; // Ganti dengan UID FF lu
    const PASSWORD_GUESS = "kipas123"; // Coba password umum (opsional)

    // ---------- 2. FUNGSI HAPUS OVERLAY PASSWORD ----------
    function nukePasswordGate() {
        // Cari elemen dengan teks kunci
        const keywords = ["PS:", "enter your code", "login and password", "Password:", "Enter password"];
        let found = false;
        document.querySelectorAll('*').forEach(el => {
            const text = el.innerText || '';
            if (keywords.some(kw => text.includes(kw))) {
                // Hapus seluruh elemen dan parent-nya
                let parent = el.closest('div, section, main, body, html');
                if (parent) {
                    parent.style.display = 'none';
                    parent.style.visibility = 'hidden';
                    parent.style.opacity = '0';
                    parent.style.pointerEvents = 'none';
                    found = true;
                }
            }
            // Hapus juga elemen dengan z-index tinggi (modal)
            const style = getComputedStyle(el);
            if (parseInt(style.zIndex) > 9999 && style.position === 'fixed') {
                el.style.display = 'none';
            }
        });
        if (found) console.log('[DEVIL] Password gate dihancurkan!');

        // Coba isi password jika ada input
        const pwdInput = document.querySelector('input[type="password"]');
        if (pwdInput) {
            pwdInput.value = PASSWORD_GUESS;
            pwdInput.dispatchEvent(new Event('input', { bubbles: true }));
            const btn = document.querySelector('button[type="submit"], input[type="submit"]');
            if (btn) btn.click();
            console.log('[DEVIL] Password diisi & disubmit (tebakan).');
        }
    }

    // ---------- 3. INTERCEPT REQUEST AUTENTIKASI ----------
    // Tangkap semua request yang mengirim password atau kode
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && (url.includes('auth') || url.includes('login') || url.includes('password') || url.includes('code'))) {
            console.log('[DEVIL] Intercept request auth:', url);
            // Kembalikan respons sukses palsu
            return Promise.resolve(new Response(JSON.stringify({
                success: true,
                message: 'Authenticated',
                token: 'fake-token'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }
        return origFetch.call(this, input, init);
    };

    // Intercept XMLHttpRequest
    const XHR = XMLHttpRequest;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;
    XHR.prototype.open = function(method, url) {
        this._url = url;
        return origOpen.apply(this, arguments);
    };
    XHR.prototype.send = function(body) {
        if (this._url && (this._url.includes('auth') || this._url.includes('login') || this._url.includes('password') || this._url.includes('code'))) {
            console.log('[DEVIL] Intercept XHR auth:', this._url);
            setTimeout(() => {
                this.readyState = 4;
                this.status = 200;
                this.responseText = JSON.stringify({ success: true, token: 'fake' });
                if (this.onreadystatechange) this.onreadystatechange();
            }, 50);
            return;
        }
        return origSend.apply(this, arguments);
    };

    // ---------- 4. AUTO FILL UID & VERIFIKASI (jika halaman sudah terbuka) ----------
    function autoVerifyUID() {
        const uidInput = document.querySelector('input[type="text"]');
        if (uidInput && (uidInput.placeholder || '').toLowerCase().includes('uid')) {
            uidInput.value = MY_UID;
            uidInput.dispatchEvent(new Event('input', { bubbles: true }));
            const btn = document.querySelector('button[type="submit"], .btn-verify');
            if (btn) setTimeout(() => btn.click(), 300);
            console.log('[DEVIL] UID diisi otomatis.');
        }
    }

    // ---------- 5. EKSEKUSI BERKALA ----------
    function fullNuke() {
        nukePasswordGate();
        autoVerifyUID();
        // Hapus iklan juga
        document.querySelectorAll('iframe[src*="ad"], iframe[src*="doubleclick"], ins.adsbygoogle')
            .forEach(el => el.remove());
    }

    fullNuke();
    setInterval(fullNuke, 300);

    // Observer DOM
    new MutationObserver(fullNuke)
        .observe(document.documentElement, { childList: true, subtree: true });

    console.log('[DEVIL] Engine Nuklir siap! Password gate akan hancur.');
})();
