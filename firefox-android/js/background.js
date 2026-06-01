const extApi = typeof browser !== "undefined" ? browser : chrome;

extApi.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    extApi.tabs.create({ url: "intro.html" });
  }
  extApi.storage.local.set({ bannerStartTime: Date.now(), bannerDismissed: false });

  extApi.contextMenus.create({ id: 'openSidePanel', title: 'Create QR for this page', contexts: ['page'] });
  extApi.contextMenus.create({ id: 'openSidePanel1', title: 'Create QR for "%s"', contexts: ['selection'] });
  extApi.contextMenus.create({ id: 'openSidePanel2', title: 'Create QR for selected link', contexts:['link'] });
  extApi.contextMenus.create({ id: 'openSidePanel3', title: 'Create QR for image/media link', contexts: ['image', 'audio', 'video'] });
  extApi.contextMenus.create({ id: 'openSidePanel4', title: 'Scan QR Code from image', contexts: ['image'] });
});

extApi.runtime.onStartup.addListener(() => {
  extApi.storage.local.set({ bannerStartTime: Date.now(), bannerDismissed: false });
});

extApi.runtime.setUninstallURL("https://github.com/pro-bandey/QR-SnG");

extApi.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "open_from_mobile_menu") {
      extApi.storage.local.set(request.data, () => {
          extApi.tabs.create({ url: extApi.runtime.getURL("index.html") });
      });
  }
});

extApi.contextMenus.onClicked.addListener((info, tab) => {
  let data = {};
  if (info.menuItemId === 'openSidePanel') data.qrurl = tab.url;
  else if (info.menuItemId === 'openSidePanel1') data.qrurl = info.selectionText;
  else if (info.menuItemId === 'openSidePanel2') data.qrurl = info.linkUrl;
  else if (info.menuItemId === 'openSidePanel3') data.qrurl = info.srcUrl;
  else if (info.menuItemId === 'openSidePanel4') data.qrimageurl = info.srcUrl;

  extApi.storage.local.set(data, () => {
    extApi.tabs.create({ url: extApi.runtime.getURL("index.html") });
  });
});

const actionApi = extApi.action || extApi.browserAction;
if (actionApi) {
  actionApi.onClicked.addListener(() => {
    extApi.tabs.create({ url: extApi.runtime.getURL("index.html") });
  });
}