const extApi = typeof browser !== "undefined" ? browser : chrome;

extApi.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    extApi.tabs.create({ url: "intro.html" });
  }
  extApi.storage.local.set({ bannerStartTime: Date.now(), bannerDismissed: false });
  extApi.contextMenus.create({ id: 'openSidePanel', title: 'Create QR for this page', contexts: ['page'] });
  extApi.contextMenus.create({ id: 'openSidePanel1', title: 'Create QR for "%s"', contexts: ['selection'] });
  extApi.contextMenus.create({ id: 'openSidePanel2', title: 'Create QR for selected link', contexts: ['link'] });
  extApi.contextMenus.create({ id: 'openSidePanel3', title: 'Create QR for image/media link', contexts: ['image', 'audio', 'video'] });
  extApi.contextMenus.create({ id: 'openSidePanel4', title: 'Scan QR Code from image', contexts: ['image'] });
  extApi.contextMenus.create({ id: "scanPageArea", title: "Select & Scan QR on page", contexts: ["page", "image", "link"] });
  if (extApi.sidePanel && extApi.sidePanel.setPanelBehavior) {
    extApi.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
  }
});

extApi.runtime.onStartup.addListener(() => {
  extApi.storage.local.set({ bannerStartTime: Date.now(), bannerDismissed: false });
});

extApi.runtime.setUninstallURL("https://github.com/pro-bandey/QR-SnG");

extApi.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "capture_area") {
    extApi.tabs.captureVisibleTab(
      sender.tab.windowId,
      { format: "png" },
      (dataUrl) => {
        extApi.storage.local.set({
          qrAreaScan: { imgUrl: dataUrl, rect: request.rect },
        });
      }
    );
  }
  else if (request.action === "fetch_image") {
    fetch(request.url)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => sendResponse({ dataUrl: reader.result });
        reader.readAsDataURL(blob);
      })
      .catch(err => sendResponse({ error: err.message }));
    return true;
  }
});

extApi.contextMenus.onClicked.addListener((info, tab) => {
  let data = {};
  if (info.menuItemId === 'openSidePanel') data.qrurl = tab.url;
  else if (info.menuItemId === 'openSidePanel1') data.qrurl = info.selectionText;
  else if (info.menuItemId === 'openSidePanel2') data.qrurl = info.linkUrl;
  else if (info.menuItemId === 'openSidePanel3') data.qrurl = info.srcUrl;
  else if (info.menuItemId === 'openSidePanel4') data.qrimageurl = info.srcUrl;
  else if (info.menuItemId === "scanPageArea") {
    if (extApi.sidePanel && extApi.sidePanel.open) {
      extApi.sidePanel.open({ windowId: tab.windowId }).then(() => {
        setTimeout(() => {
          extApi.tabs.sendMessage(tab.id, { action: "start_selection" }).catch(() => console.log("Tab refresh needed"));
        }, 300);
      });
    } else {
      if (extApi.sidebarAction && extApi.sidebarAction.open) extApi.sidebarAction.open();
      setTimeout(() => {
        extApi.tabs.sendMessage(tab.id, { action: "start_selection" }).catch(() => console.log("Tab refresh needed"));
      }, 300);
    }
    return;
  }
  if (extApi.sidePanel && extApi.sidePanel.open) {
    extApi.storage.local.set(data, () => {
      extApi.sidePanel.open({ windowId: tab.windowId }).catch(console.error);
    });
  }
  else {
    if (extApi.sidebarAction && extApi.sidebarAction.open) {
      extApi.sidebarAction.open();
    }
    extApi.storage.local.set(data);
  }
});

if (!extApi.sidePanel && extApi.action) {
  extApi.action.onClicked.addListener(() => {
    if (extApi.sidebarAction && extApi.sidebarAction.toggle) {
      extApi.sidebarAction.toggle();
    }
  });
}