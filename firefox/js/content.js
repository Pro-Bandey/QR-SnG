
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