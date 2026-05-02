chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Create QR for this page",
    contexts: ["page"],
  });
  chrome.contextMenus.create({
    id: "openSidePanel1",
    title: 'Create QR for "%s"',
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "openSidePanel2",
    title: "Create QR for selected link",
    contexts: ["link"],
  });
  chrome.contextMenus.create({
    id: "openSidePanel3",
    title: "Create QR for image/media link",
    contexts: ["image", "audio", "video"],
  });
  chrome.contextMenus.create({
    id: "openSidePanel4",
    title: "Scan QR Code from image",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: "scanPageArea",
    title: "Select & Scan QR on page",
    contexts: ["page", "image", "link"],
  });
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(console.error);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let data = {};
  if (info.menuItemId === "openSidePanel") data.qrurl = tab.url;
  else if (info.menuItemId === "scanPageArea") {
    chrome.sidePanel.open({ windowId: tab.windowId }).then(() => {
      chrome.tabs
        .sendMessage(tab.id, { action: "start_selection" })
        .catch(() => console.log("Tab refresh needed"));
    });
  }
  else if (info.menuItemId === "openSidePanel1")
    data.qrurl = info.selectionText;
  else if (info.menuItemId === "openSidePanel2") data.qrurl = info.linkUrl;
  else if (info.menuItemId === "openSidePanel3") data.qrurl = info.srcUrl;
  else if (info.menuItemId === "openSidePanel4") data.qrimageurl = info.srcUrl;
  chrome.storage.local.set(data, () => {
    chrome.sidePanel
      .open({ windowId: tab.windowId })
      .catch((err) => console.error(err));
  });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "capture_area") {
    chrome.tabs.captureVisibleTab(
      sender.tab.windowId,
      { format: "png" },
      (dataUrl) => {
        chrome.storage.local.set({
          qrAreaScan: { imgUrl: dataUrl, rect: request.rect },
        });
      },
    );
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

const extInstaUninsta = typeof browser !== "undefined" ? browser : chrome;
extInstaUninsta.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    extInstaUninsta.tabs.create({
      url: "intro.html",
    });
  }
  extInstaUninsta.storage.local.set({
    bannerStartTime: Date.now(),
    bannerDismissed: false,
  });
});
extInstaUninsta.runtime.onStartup.addListener(() => {
  extInstaUninsta.storage.local.set({
    bannerStartTime: Date.now(),
    bannerDismissed: false,
  });
});
extInstaUninsta.runtime.setUninstallURL("https://github.com/pro-bandey/QR-SnG");
