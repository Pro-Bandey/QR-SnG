const extApi = typeof browser !== "undefined" ? browser : chrome;

extApi.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start_selection") {
        initSnippingTool();
        sendResponse({ status: "started" });
    }
});

function initSnippingTool() {
    if (document.getElementById('qr-sng-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'qr-sng-overlay';
    overlay.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:999999; cursor:crosshair;`;
    const selection = document.createElement('div');
    selection.style.cssText = `position:absolute; border:2px dashed #4F46E5; background:rgba(79,70,229,0.2); display:none; pointer-events:none;`;
    overlay.appendChild(selection);
    document.body.appendChild(overlay);
    let startX, startY, isDragging = false;
    overlay.addEventListener('mousedown', (e) => {
        isDragging = true; startX = e.clientX; startY = e.clientY;
        selection.style.left = startX + 'px'; selection.style.top = startY + 'px';
        selection.style.width = '0px'; selection.style.height = '0px';
        selection.style.display = 'block';
    });
    overlay.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX, currentY = e.clientY;
        selection.style.left = Math.min(currentX, startX) + 'px';
        selection.style.top = Math.min(currentY, startY) + 'px';
        selection.style.width = Math.abs(currentX - startX) + 'px';
        selection.style.height = Math.abs(currentY - startY) + 'px';
    });
    overlay.addEventListener('mouseup', (e) => {
        isDragging = false;
        const rect = selection.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const finalRect = {
            x: rect.left * dpr, y: rect.top * dpr,
            w: rect.width * dpr, h: rect.height * dpr
        };
        document.body.removeChild(overlay);
        if (finalRect.w > 10 && finalRect.h > 10) {
            extApi.runtime.sendMessage({ action: "capture_area", rect: finalRect });
        }
    });
}

// ---- CUSTOM MOBILE CONTEXT MENU LOGIC ---- //

let mobileMenu = null;
let selectionTimeout = null;

function removeMobileMenu() {
    if (mobileMenu) {
        mobileMenu.remove();
        mobileMenu = null;
    }
}

function showMobileMenu(options) {
    removeMobileMenu();
    mobileMenu = document.createElement('div');
    mobileMenu.style.cssText = `
        position: fixed; left: 0; bottom: 0; width: 100%;
        background: #1F2937; color: #fff; border-top-left-radius: 16px; border-top-right-radius: 16px;
        z-index: 2147483647; box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
        display: flex; flex-direction: column; padding-bottom: env(safe-area-inset-bottom);
        font-family: system-ui, sans-serif; transition: transform 0.3s ease;
        transform: translateY(100%);
    `;

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt.label;
        btn.style.cssText = `
            padding: 16px; border: none; border-bottom: 1px solid #374151;
            background: transparent; color: #fff; text-align: center; font-size: 16px; width: 100%; cursor: pointer;
        `;
        btn.onclick = () => {
            extApi.runtime.sendMessage({ action: "open_from_mobile_menu", data: opt.data });
            removeMobileMenu();
        };
        mobileMenu.appendChild(btn);
    });
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.cssText = `
        padding: 16px; border: none; background: transparent; color: #9CA3AF; text-align: center; font-size: 16px; width: 100%; cursor: pointer;
    `;
    cancelBtn.onclick = removeMobileMenu;
    mobileMenu.appendChild(cancelBtn);

    document.body.appendChild(mobileMenu);
    
    // Animate up
    requestAnimationFrame(() => {
        mobileMenu.style.transform = 'translateY(0)';
    });
}

// 1. Long Press logic (Images, Links, Media, Page)
document.addEventListener('contextmenu', (e) => {
    // IMPORTANT: No e.preventDefault() so we don't break the native browser menu
    const target = e.target;
    const link = target.closest('a')?.href;
    const img = target.closest('img')?.src;
    
    let options =[];
    if (img) {
        options.push({ label: "Scan this Image for QR", data: { qrimageurl: img } });
        options.push({ label: "Generate QR for Image Link", data: { qrurl: img } });
    } else if (link) {
        options.push({ label: "Generate QR for this Link", data: { qrurl: link } });
    } else if (target.closest('video') || target.closest('audio')) {
        options.push({ label: "Generate QR for Media Link", data: { qrurl: target.closest('video, audio').src } });
    } else {
        options.push({ label: "Generate QR for this Page", data: { qrurl: window.location.href } });
    }
    
    if (options.length > 0) {
        // Slight delay allows the native menu to position itself before our bottom sheet slides up
        setTimeout(() => showMobileMenu(options), 300);
    }
});

// 2. Smart Text Selection Logic
document.addEventListener('selectionchange', () => {
    clearTimeout(selectionTimeout);
    
    // Debounce: Wait 500ms after the user finishes adjusting selection handles
    selectionTimeout = setTimeout(() => {
        const text = window.getSelection().toString().trim();
        if (text && text.length > 0) {
            showMobileMenu([{ label: "Generate QR for Selected Text", data: { qrurl: text } }]);
        } else {
            removeMobileMenu();
        }
    }, 500);
});

// Close menu if user taps elsewhere
document.addEventListener('pointerdown', (e) => {
    if (mobileMenu && !mobileMenu.contains(e.target)) {
        removeMobileMenu();
    }
});