const extApi = typeof browser !== "undefined" ? browser : chrome;

// Helper to open the app with data
function openAppWithData(data) {
    extApi.storage.local.set(data, () => {
        extApi.tabs.create({ url: extApi.runtime.getURL("index.html") });
    });
}

// Handle messages from the Custom Mobile Menu
extApi.runtime.onMessage.addListener((request) => {
    if (request.action === "open_with_data") {
        openAppWithData(request.data);
    }
});

// Context Menus (For Desktop compatibility)
extApi.contextMenus.onClicked.addListener((info, tab) => {
    let data = {};
    if (info.menuItemId === 'openSidePanel') data.qrurl = tab.url;
    // ... (keep your existing logic)
    openAppWithData(data);
});