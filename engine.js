(function() {
    'use strict';
    console.log('[DEVIL] Engine final aktif!');

    const UID = '14645454545'; // Ganti dengan UID asli Anda
    const DASHBOARD_URL = 'https://ffkipas.my.id/';

    Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1,2,3,4,5], configurable: false });
    if (!window.chrome) {
        window.chrome = { app: { isInstalled: false }, runtime: {}, loadTimes: () => {}, csi: () => {} };
    }

    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url && (url.includes('verify') || url.includes('uid') || url.includes('whitelist'))) {
            return Promise.resolve(new Response(JSON.stringify({
                success: true,
                message: 'UID verified',
                data: { uid: UID, status: 'whitelisted' }
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
            setTimeout(() => {
                this.readyState = 4;
                this.status = 200;
                this.responseText = JSON.stringify({ success: true, data: { uid: UID } });
                if (this.onreadystatechange) this.onreadystatechange();
            }, 50);
            return;
        }
        return origSend.apply(this, arguments);
    };

    function autoVerify() {
        const uidInput = document.querySelector('input[type="text"]');
        if (uidInput) {
            uidInput.value = UID;
            uidInput.dispatchEvent(new Event('input', { bubbles: true }));
            const btn = document.querySelector('button[type="submit"], .btn-verify, input[type="submit"]');
            if (btn) {
                btn.click();
                console.log('[DEVIL] UID diisi & Verify diklik.');
            }
        }
    }

    function checkAndNavigate() {
        const bodyText = document.body.innerText || '';
        if (bodyText.includes('Berhasil') || bodyText.includes('success')) {
            console.log('[DEVIL] Verifikasi sukses! Pindah ke dashboard...');
            window.location.href = DASHBOARD_URL;
        }
    }

    autoVerify();
    setInterval(checkAndNavigate, 300);
    new MutationObserver(checkAndNavigate)
        .observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
