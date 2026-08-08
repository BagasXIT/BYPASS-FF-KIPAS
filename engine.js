// ============================================================
// DEVIL ENGINE — SPOOF WEBVIEW + AUTO VERIFY + HAPUS ERROR
// ============================================================
(function() {
    'use strict';
    console.log('[DEVIL] Engine spoofing aktif!');

    // ---------- 1. KONFIGURASI UID ----------
    const MY_UID = "14645454545"; // Ganti dengan UID kamu

    // ---------- 2. SPOOFING WEBVIEW (BIAR KAYAK BROWSER NORMAL) ----------
    // 2a. User-Agent palsu (Chrome Android terbaru)
    const fakeUA = "Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.165 Mobile Safari/537.36";
    Object.defineProperty(navigator, 'userAgent', { get: () => fakeUA, configurable: false });
    Object.defineProperty(navigator, 'vendor', { get: () => 'Google Inc.', configurable: false });
    Object.defineProperty(navigator, 'platform', { get: () => 'Linux armv8l', configurable: false });

    // 2b. Hilangkan tanda WebView
    Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5], configurable: false });
    Object.defineProperty(navigator, 'languages', { get: () => ['id-ID', 'id', 'en-US', 'en'], configurable: false });

    // 2c. Tambahkan window.chrome (palsu)
    if (!window.chrome) {
        window.chrome = {
            app: {},
            runtime: {},
            loadTimes: function() {},
            csi: function() {},
            sendMessage: function() {}
        };
    }

    // 2d. Tambahkan properti lain yang sering dicek
    if (!window.navigator.deviceMemory) {
        Object.defineProperty(navigator, 'deviceMemory', { get: () => 8, configurable: false });
    }
    if (!window.navigator.hardwareConcurrency) {
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8, configurable: false });
    }

    // 2e. Override Function.prototype.toString untuk fungsi native (biar gak ketahuan)
    const origToString = Function.prototype.toString;
    Function.prototype.toString = function() {
        if (this === window.alert || this === window.prompt || this === window.confirm) {
            return 'function alert() { [native code] }';
        }
        return origToString.call(this);
    };

    // ---------- 3. CEGAH REDIRECT & POPUP ----------
    const origLocation = window.location;
    Object.defineProperty(window, 'location', {
        get: () => origLocation,
        set: (url) => { console.log('[DEVIL] Redirect dicegah:', url); return false; }
    });
    window.open = (url) => { console.log('[DEVIL] Popup dicegah:', url); return null; };
    window.addEventListener('beforeunload', (e) => { e.preventDefault(); e.returnValue = ''; });

    // ---------- 4. HAPUS ELEMEN "Verification unavailable" ----------
    function removeErrorMessages() {
        const errorTexts = [
            "Verification unavailable",
            "Please use a regular web browser",
            "gunakan browser biasa",
            "browser tidak didukung"
        ];
        document.querySelectorAll('*').forEach(el => {
            const text = el.innerText || '';
            if (errorTexts.some(err => text.includes(err))) {
                const parent = el.closest('div, section, main, body');
                if (parent) {
                    parent.style.display = 'none';
                    parent.style.visibility = 'hidden';
                    console.log('[DEVIL] Pesan error dihapus:', text.substring(0, 40));
                }
            }
        });
        // Hapus juga elemen dengan z-index tinggi yang mungkin menutupi
        document.querySelectorAll('*').forEach(el => {
            const style = getComputedStyle(el);
            if (parseInt(style.zIndex) > 9999 && style.position === 'fixed') {
                el.style.display = 'none';
            }
        });
    }

    // ---------- 5. AUTO FILL UID & VERIFY (CEPAT) ----------
    function autoVerify() {
        const uidInput = document.querySelector('input[type="text"]');
        if (uidInput) {
            uidInput.value = MY_UID;
            uidInput.dispatchEvent(new Event('input', { bubbles: true }));
            const btn = document.querySelector('button[type="submit"], .btn-verify, input[type="submit"]');
            if (btn) {
                btn.click();
                console.log('[DEVIL] UID diisi & tombol Verify diklik!');
            }
        }
    }

    // ---------- 6. INTERCEPT REQUEST VERIFIKASI (BYPASS SERVER) ----------
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && (url.includes('verify') || url.includes('uid') || url.includes('whitelist'))) {
            console.log('[DEVIL] Intercept fetch verifikasi:', url);
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

    // ---------- 7. EKSEKUSI BERKALA (SETIAP 100ms) ----------
    function fullAttack() {
        removeErrorMessages();
        autoVerify();
        // Hapus iklan
        document.querySelectorAll('iframe[src*="ad"], iframe[src*="doubleclick"], ins.adsbygoogle')
            .forEach(el => el.remove());
    }

    fullAttack();
    setInterval(fullAttack, 100);

    // Observer DOM
    new MutationObserver(fullAttack)
        .observe(document.documentElement, { childList: true, subtree: true });

    console.log('[DEVIL] Engine spoofing siap! WebView disamarkan, error dihapus.');
})();
