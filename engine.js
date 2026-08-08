(function() {
    'use strict';
    console.log('[DEVIL] Super Spoof Engine aktif!');

    // ============================================================
    // 1. SPOOFING NAVIGATOR (SEMUA PROPER)
    // ============================================================
    const fakeUA = 'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6422.165 Mobile Safari/537.36';
    const spoofProps = {
        userAgent: fakeUA,
        vendor: 'Google Inc.',
        platform: 'Linux armv8l',
        webdriver: false,
        plugins: [1,2,3,4,5],
        languages: ['id-ID', 'id', 'en-US', 'en'],
        deviceMemory: 8,
        hardwareConcurrency: 8,
        maxTouchPoints: 5,
        cookieEnabled: true,
        doNotTrack: null,
        connection: { effectiveType: '4g', rtt: 100, downlink: 10 },
        mediaDevices: { enumerateDevices: () => Promise.resolve([]) },
        storage: { estimate: () => Promise.resolve({ quota: 1024*1024*1024, usage: 0 }) }
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
            app: { isInstalled: false, InstallState: { DISABLED: 'disabled', INSTALLED: 'installed', NOT_INSTALLED: 'not_installed' } },
            runtime: { OnInstalledReason: { INSTALL: 'install', UPDATE: 'update' } },
            loadTimes: () => {},
            csi: () => {},
            sendMessage: () => {}
        };
    }

    // Spoof screen
    if (screen) {
        try {
            Object.defineProperty(screen, 'availWidth', { get: () => 1080 });
            Object.defineProperty(screen, 'availHeight', { get: () => 2400 });
            Object.defineProperty(screen, 'width', { get: () => 1080 });
            Object.defineProperty(screen, 'height', { get: () => 2400 });
        } catch(e) {}
    }

    // Spoof Function.prototype.toString
    const origToString = Function.prototype.toString;
    Function.prototype.toString = function() {
        if (this === window.alert || this === window.prompt || this === window.confirm) {
            return 'function alert() { [native code] }';
        }
        return origToString.call(this);
    };

    // ============================================================
    // 2. CEGAH REDIRECT KE DISCORD
    // ============================================================
    const origLocation = window.location;
    Object.defineProperty(window, 'location', {
        get: () => origLocation,
        set: (url) => {
            if (typeof url === 'string' && (url.includes('discord.com') || url.includes('youtube.com'))) {
                console.log('[DEVIL] Redirect ke Discord dicegah!');
                window.location.href = 'https://ffkipas.my.id/';
                return false;
            }
            return origLocation.href = url;
        }
    });

    // ============================================================
    // 3. INTERCEPT REQUEST VERIFIKASI
    // ============================================================
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

    // ============================================================
    // 4. AUTO FILL & VERIFY
    // ============================================================
    function autoVerify() {
        const uidInput = document.querySelector('input[type="text"]');
        if (uidInput) {
            uidInput.value = '14645454545';
            uidInput.dispatchEvent(new Event('input', { bubbles: true }));
            const btn = document.querySelector('button[type="submit"], .btn-verify, input[type="submit"]');
            if (btn) {
                btn.click();
                console.log('[DEVIL] UID diisi & Verify diklik.');
            }
        }
    }

    // ============================================================
    // 5. HAPUS ERROR & NAVIGASI KE DASHBOARD
    // ============================================================
    function killErrorAndNavigate() {
        // Hapus elemen yang mengandung teks error
        const errorKeywords = ['verification unavailable', 'please use a regular web browser', 'verifikasi gagal', 'pemecahan masalah', 'yah ke fix'];
        document.querySelectorAll('*').forEach(el => {
            const text = (el.innerText || '').toLowerCase();
            if (errorKeywords.some(kw => text.includes(kw))) {
                const parent = el.closest('div, section, main, body');
                if (parent) {
                    parent.style.display = 'none';
                    parent.style.visibility = 'hidden';
                    parent.style.opacity = '0';
                    parent.style.pointerEvents = 'none';
                    console.log('[DEVIL] Error element dihapus:', text.substring(0,40));
                }
            }
        });

        // Jika ada "Berhasil" atau "success", langsung navigasi ke dashboard
        const bodyText = document.body.innerText || '';
        if (bodyText.includes('Berhasil') || bodyText.includes('success') || bodyText.includes('berhasil')) {
            console.log('[DEVIL] Verifikasi sukses! Redirect ke dashboard...');
            window.location.href = 'https://ffkipas.my.id/';
        }
    }

    // ============================================================
    // 6. EKSEKUSI BERKALA
    // ============================================================
    autoVerify();
    setInterval(killErrorAndNavigate, 200);
    new MutationObserver(killErrorAndNavigate)
        .observe(document.documentElement, { childList: true, subtree: true, characterData: true });

    // Pantau perubahan URL untuk cegah redirect ke Discord
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl.includes('discord.com')) {
            console.log('[DEVIL] Terdeteksi redirect ke Discord, paksa ke dashboard');
            window.location.href = 'https://ffkipas.my.id/';
        }
    }, 300);

    console.log('[DEVIL] Super Spoof Engine siap!');
})();
