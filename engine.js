// ============================================================
// DEVIL ENGINE NUKLIR — SPOOF + HAPUS ERROR + REDIRECT
// ============================================================
(function() {
    'use strict';
    console.log('[DEVIL] Nuklir engine aktif!');

    // ---------- 1. SPOOFING WEBVIEW (SEMUA PROPER) ----------
    const spoofProps = {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
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
    Object.keys(spoofProps).forEach(key => {
        try {
            Object.defineProperty(navigator, key, {
                get: () => spoofProps[key],
                configurable: false
            });
        } catch(e) {}
    });

    // Tambahkan window.chrome
    if (!window.chrome) {
        window.chrome = {
            app: { isInstalled: false },
            runtime: {},
            loadTimes: () => {},
            csi: () => {},
            sendMessage: () => {}
        };
    }

    // ---------- 2. CEGAH REDIRECT ----------
    const origLocation = window.location;
    Object.defineProperty(window, 'location', {
        get: () => origLocation,
        set: (url) => { console.log('[DEVIL] Redirect dicegah:', url); return false; }
    });
    window.open = () => null;
    window.addEventListener('beforeunload', (e) => { e.preventDefault(); e.returnValue = ''; });

    // ---------- 3. HAPUS ELEMEN ERROR (AGRESIF) ----------
    function nukeErrors() {
        const errorKeywords = [
            'verification unavailable', 'please use a regular web browser',
            'browser tidak didukung', 'gunakan browser biasa', 'webview not supported'
        ];
        // Cari semua elemen
        const all = document.querySelectorAll('*');
        all.forEach(el => {
            const text = (el.innerText || '').toLowerCase();
            if (errorKeywords.some(kw => text.includes(kw))) {
                // Hapus elemen dan seluruh parent yang mungkin card
                let parent = el.closest('div, section, main, body');
                if (parent) {
                    parent.style.display = 'none';
                    parent.style.visibility = 'hidden';
                    parent.style.opacity = '0';
                    parent.style.pointerEvents = 'none';
                    console.log('[DEVIL] Error element nuked:', text.substring(0,40));
                }
            }
            // Hapus elemen dengan z-index tinggi (modal)
            const style = getComputedStyle(el);
            if (parseInt(style.zIndex) > 9999 && style.position === 'fixed') {
                el.style.display = 'none';
            }
        });
        // Coba cari berdasarkan XPath (jika ada)
        try {
            const xpath = "//*[contains(text(), 'Verification unavailable') or contains(text(), 'Please use a regular web browser')]";
            const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
            let node;
            while (node = result.iterateNext()) {
                let parent = node.closest('div, section, main');
                if (parent) parent.style.display = 'none';
            }
        } catch(e) {}
    }

    // ---------- 4. CEGAH PEMBUATAN ELEMEN ERROR (OVERRIDE) ----------
    const origCreateElement = document.createElement;
    document.createElement = function(tagName, options) {
        const el = origCreateElement.call(this, tagName, options);
        // Jika tag div atau section, kita pantau isinya
        if (tagName.toLowerCase() === 'div' || tagName.toLowerCase() === 'section') {
            const origAppendChild = el.appendChild;
            el.appendChild = function(child) {
                if (child.nodeType === 1 && child.innerText) {
                    const text = child.innerText.toLowerCase();
                    if (text.includes('verification unavailable') || text.includes('please use a regular web browser')) {
                        console.log('[DEVIL] Mencegah pembuatan error element');
                        return child;
                    }
                }
                return origAppendChild.call(this, child);
            };
            // Juga cegah innerHTML
            const origSetInner = Object.getOwnPropertyDescriptor(el, 'innerHTML');
            if (origSetInner) {
                Object.defineProperty(el, 'innerHTML', {
                    set: function(value) {
                        if (value && (value.toLowerCase().includes('verification unavailable') || value.toLowerCase().includes('please use a regular web browser'))) {
                            console.log('[DEVIL] Mencegah innerHTML error');
                            return;
                        }
                        origSetInner.set.call(this, value);
                    },
                    get: origSetInner.get
                });
            }
        }
        return el;
    };

    // ---------- 5. AUTO VERIFY UID ----------
    function autoVerify() {
        const uidInput = document.querySelector('input[type="text"]');
        if (uidInput) {
            const uid = "14645454545"; // Ganti dengan UID asli
            uidInput.value = uid;
            uidInput.dispatchEvent(new Event('input', { bubbles: true }));
            const btn = document.querySelector('button[type="submit"], .btn-verify, input[type="submit"]');
            if (btn) {
                btn.click();
                console.log('[DEVIL] UID diisi & Verify diklik');
                // Setelah klik, kita tunggu sebentar lalu hapus error
                setTimeout(nukeErrors, 200);
            }
        }
    }

    // ---------- 6. INTERCEPT REQUEST VERIFIKASI ----------
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

    // ---------- 7. EKSEKUSI CEPAT (50ms) ----------
    function attack() {
        nukeErrors();
        autoVerify();
        // Hapus iklan juga
        document.querySelectorAll('iframe[src*="ad"], iframe[src*="doubleclick"], ins.adsbygoogle')
            .forEach(el => el.remove());
    }

    attack();
    setInterval(attack, 50); // setiap 50ms

    // Observer
    new MutationObserver(attack)
        .observe(document.documentElement, { childList: true, subtree: true, attributes: true });

    // ---------- 8. REDIRECT KE HALAMAN UTAMA (jika verifikasi sukses) ----------
    // Setelah beberapa detik, cek apakah ada "Berhasil" dan tidak ada error, lalu pindah ke halaman utama
    setTimeout(() => {
        const hasSuccess = document.body.innerText.includes('Berhasil');
        const hasError = document.body.innerText.toLowerCase().includes('verification unavailable');
        if (hasSuccess && !hasError) {
            // Redirect ke halaman utama KIPAS SERVER (ganti dengan URL yang benar)
            window.location.replace('https://ffkipas.my.id/'); // atau /dashboard
            console.log('[DEVIL] Verifikasi sukses, redirect ke home.');
        }
    }, 2000);

    console.log('[DEVIL] Engine Nuklir siap! Error akan dihancurkan.');
})();
