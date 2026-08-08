// ============================================================
// DEVIL ENGINE — SPOOF WEBVIEW TOTAL + AUTO VERIFY + HAPUS ERROR
// ============================================================
(function() {
    'use strict';
    console.log('[DEVIL] Engine spoofing total aktif!');

    // ---------- 1. SPOOFING WEBVIEW (SEMUA PROPERTI) ----------
    // 1a. User-Agent Chrome Desktop (biar aman)
    const fakeUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
    Object.defineProperty(navigator, 'userAgent', { get: () => fakeUA, configurable: false });
    Object.defineProperty(navigator, 'vendor', { get: () => 'Google Inc.', configurable: false });
    Object.defineProperty(navigator, 'platform', { get: () => 'Win32', configurable: false });
    Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5], configurable: false });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'], configurable: false });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 8, configurable: false });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8, configurable: false });
    Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 0, configurable: false });

    // 1b. Tambahkan window.chrome (palsu)
    if (!window.chrome) {
        window.chrome = {
            app: { isInstalled: false, InstallState: { DISABLED: 'disabled', INSTALLED: 'installed', NOT_INSTALLED: 'not_installed' } },
            runtime: { OnInstalledReason: { INSTALL: 'install', UPDATE: 'update', CHROME_UPDATE: 'chrome_update', SHARED_MODULE_UPDATE: 'shared_module_update' } },
            loadTimes: function() {},
            csi: function() {},
            sendMessage: function() {}
        };
    }

    // 1c. Tambahkan properti lain yang sering dicek
    if (!window.navigator.connection) {
        Object.defineProperty(navigator, 'connection', {
            get: () => ({ effectiveType: '4g', rtt: 100, downlink: 10 }),
            configurable: false
        });
    }
    if (!window.navigator.mediaDevices) {
        Object.defineProperty(navigator, 'mediaDevices', {
            get: () => ({ enumerateDevices: () => Promise.resolve([]) }),
            configurable: false
        });
    }
    if (!window.navigator.storage) {
        Object.defineProperty(navigator, 'storage', {
            get: () => ({ estimate: () => Promise.resolve({ quota: 1024 * 1024 * 1024, usage: 0 }) }),
            configurable: false
        });
    }

    // 1d. Override Function.prototype.toString untuk fungsi native
    const origToString = Function.prototype.toString;
    Function.prototype.toString = function() {
        if (this === window.alert || this === window.prompt || this === window.confirm) {
            return 'function alert() { [native code] }';
        }
        return origToString.call(this);
    };

    // ---------- 2. CEGAH REDIRECT & POPUP ----------
    const origLocation = window.location;
    Object.defineProperty(window, 'location', {
        get: () => origLocation,
        set: (url) => { console.log('[DEVIL] Redirect dicegah:', url); return false; }
    });
    window.open = (url) => { console.log('[DEVIL] Popup dicegah:', url); return null; };
    window.addEventListener('beforeunload', (e) => { e.preventDefault(); e.returnValue = ''; });

    // ---------- 3. HAPUS SEMUA PESAN ERROR ----------
    function removeErrorMessages() {
        const errorTexts = [
            "Verification unavailable",
            "Please use a regular web browser",
            "gunakan browser biasa",
            "browser tidak didukung",
            "WebView not supported",
            "Silakan buka di Chrome"
        ];
        document.querySelectorAll('*').forEach(el => {
            const text = el.innerText || '';
            if (errorTexts.some(err => text.includes(err))) {
                const parent = el.closest('div, section, main, body');
                if (parent) {
                    parent.style.display = 'none';
                    parent.style.visibility = 'hidden';
                    parent.style.opacity = '0';
                    parent.style.pointerEvents = 'none';
                    console.log('[DEVIL] Pesan error dihapus:', text.substring(0, 40));
                }
            }
        });
        // Hapus elemen dengan z-index tinggi (modal/overlay)
        document.querySelectorAll('*').forEach(el => {
            const style = getComputedStyle(el);
            if (parseInt(style.zIndex) > 9999 && style.position === 'fixed') {
                el.style.display = 'none';
            }
        });
    }

    // ---------- 4. AUTO FILL UID & VERIFY (CEPAT) ----------
    function autoVerify() {
        const uidInput = document.querySelector('input[type="text"]');
        if (uidInput) {
            const uid = "14645454545"; // Ganti dengan UID kamu
            uidInput.value = uid;
            uidInput.dispatchEvent(new Event('input', { bubbles: true }));
            const btn = document.querySelector('button[type="submit"], .btn-verify, input[type="submit"]');
            if (btn) {
                btn.click();
                console.log('[DEVIL] UID diisi & tombol Verify diklik!');
            }
        }
    }

    // ---------- 5. INTERCEPT REQUEST VERIFIKASI ----------
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && (url.includes('verify') || url.includes('uid') || url.includes('whitelist'))) {
            console.log('[DEVIL] Intercept fetch verifikasi:', url);
            return Promise.resolve(new Response(JSON.stringify({
                success: true,
                message: 'UID verified',
                data: { uid: "14645454545", status: 'whitelisted' }
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
                this.responseText = JSON.stringify({ success: true, data: { uid: "14645454545" } });
                if (this.onreadystatechange) this.onreadystatechange();
            }, 50);
            return;
        }
        return origSend.apply(this, arguments);
    };

    // ---------- 6. EKSEKUSI BERKALA (SETIAP 100ms) ----------
    function fullAttack() {
        removeErrorMessages();
        autoVerify();
        document.querySelectorAll('iframe[src*="ad"], iframe[src*="doubleclick"], ins.adsbygoogle')
            .forEach(el => el.remove());
    }

    fullAttack();
    setInterval(fullAttack, 100);

    // Observer DOM
    new MutationObserver(fullAttack)
        .observe(document.documentElement, { childList: true, subtree: true });

    console.log('[DEVIL] Engine spoofing total siap! WebView 100% tersamar, error dihapus.');
})();
