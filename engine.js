// ============================================================
// DEVIL ENGINE — REPLACE HALAMAN SETELAH VERIFIKASI SUKSES
// ============================================================
(function() {
    'use strict';
    console.log('[DEVIL] Engine replace aktif!');

    // ---------- 1. SPOOFING WEBVIEW (MASIH DIPERTAHANKAN) ----------
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
        maxTouchPoints: 0
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

    // ---------- 3. INTERCEPT VERIFIKASI ----------
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
                // Setelah klik, kita tunggu sebentar lalu ganti halaman
                setTimeout(replacePageWithSuccess, 1500);
            }
        } else {
            // Jika tidak ada input, mungkin halaman sudah dalam status error, kita coba ganti langsung
            replacePageWithSuccess();
        }
    }

    // ---------- 5. REPLACE HALAMAN DENGAN KONTEN SUKSES ----------
    function replacePageWithSuccess() {
        // Cek apakah sudah ada tulisan "Berhasil" atau tidak
        const bodyText = document.body.innerText || '';
        if (bodyText.includes('Berhasil') || bodyText.includes('success')) {
            console.log('[DEVIL] Verifikasi terdeteksi sukses, mengganti halaman...');
            // Buat halaman baru yang bersih
            const newHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KIPAS SERVER</title>
    <style>
        body {
            background: #0b0e14;
            color: #fff;
            font-family: 'Segoe UI', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            flex-direction: column;
            text-align: center;
        }
        h1 {
            color: #E040FB;
            font-size: 2.5em;
            text-shadow: 0 0 20px #E040FB;
        }
        p { color: #aaa; font-size: 1.2em; }
        .btn {
            background: #4A148C;
            color: #fff;
            border: none;
            padding: 15px 40px;
            border-radius: 30px;
            font-size: 1.2em;
            cursor: pointer;
            text-decoration: none;
            margin-top: 20px;
            box-shadow: 0 0 15px #4A148C;
        }
        .btn:hover { background: #6A1B9A; }
        .footer {
            margin-top: 50px;
            color: #555;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <h1>✅ VERIFIKASI SUKSES</h1>
    <p>Selamat, UID Anda telah terverifikasi.<br>Silakan akses menu utama di bawah.</p>
    <a href="https://ffkipas.my.id/" class="btn">🚀 MENU UTAMA</a>
    <div class="footer">© BAGASXIT OFFICIAL</div>
    <script>
        // Jika tombol diklik, kita paksa navigasi
        document.querySelector('.btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'https://ffkipas.my.id/';
        });
    <\/script>
</body>
</html>
            `;
            document.documentElement.innerHTML = newHTML;
            // Hentikan semua interval/timeout
            const highestTimeout = setTimeout(() => {}, 9999);
            for (let i = 0; i < highestTimeout; i++) {
                clearTimeout(i);
                clearInterval(i);
            }
        }
    }

    // ---------- 6. EKSEKUSI BERKALA ----------
    autoVerify();
    // Cek setiap 500ms apakah halaman sudah berubah
    setInterval(() => {
        const bodyText = document.body.innerText || '';
        if (bodyText.includes('Berhasil') && !bodyText.toLowerCase().includes('verification unavailable')) {
            replacePageWithSuccess();
        }
    }, 500);

    // Observer juga
    new MutationObserver(() => {
        const bodyText = document.body.innerText || '';
        if (bodyText.includes('Berhasil') && !bodyText.toLowerCase().includes('verification unavailable')) {
            replacePageWithSuccess();
        }
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

    console.log('[DEVIL] Engine replace siap! Halaman akan diganti setelah verifikasi sukses.');
})();
