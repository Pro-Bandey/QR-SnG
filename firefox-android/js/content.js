let menu = null;

document.addEventListener('contextmenu', (e) => {
    // Remove existing menu
    if (menu) menu.remove();

    const target = e.target;
    const link = target.closest('a')?.href;
    const img = target.closest('img')?.src;
    const selectedText = window.getSelection().toString().trim();

    // Create Menu
    menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%);
        background: #1F2937; color: white; border-radius: 12px; padding: 8px;
        z-index: 1000000; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        display: flex; flex-direction: column; min-width: 200px; font-family: sans-serif;
    `;

    const addButton = (text, data) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `padding: 12px; border: none; background: none; color: white; text-align: left; font-size: 14px; border-bottom: 1px solid #374151;`;
        btn.onclick = () => {
            chrome.runtime.sendMessage({ action: "open_with_data", data });
            menu.remove();
        };
        menu.appendChild(btn);
    };

    if (selectedText) addButton("Generate QR for Selection", { qrurl: selectedText });
    if (img) {
        addButton("Scan this Image", { qrimageurl: img });
        addButton("Generate QR for Image Link", { qrurl: img });
    }
    if (link) addButton("Generate QR for Link", { qrurl: link });
    addButton("Generate QR for Page", { qrurl: window.location.href });

    document.body.appendChild(menu);

    // Close menu on tap elsewhere
    setTimeout(() => {
        document.addEventListener('click', () => menu?.remove(), { once: true });
    }, 100);

    // Prevent menu from blocking UI if user didn't want it
    e.preventDefault();
});