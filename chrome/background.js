chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Create QR Code for this page',
    contexts: ['page'],
  });
  chrome.contextMenus.create({
    id: 'openSidePanel1',
    title: 'QR Code Of "%s"',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id: 'openSidePanel2',
    title: ' QR Code Of This Link ',
    contexts: ['link'],
  });
  chrome.contextMenus.create({
    id: 'openSidePanel3',
    title: 'QR Code for This Media Obj Link',
    contexts: ['image', 'audio', 'video'],
  });
  chrome.contextMenus.create({
    id: 'openSidePanel4',
    title: 'Scan QR Code for Selected Image',
    contexts: ['image'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked');
  if (info.menuItemId === 'openSidePanel') {
    chrome.storage.local.set({ qrurl: tab.url });
    chrome.sidePanel.setOptions({
      tabId: tab?.id || -1,
      path: 'index.html',
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab?.id || -1 });
  }
  if (info.menuItemId === 'openSidePanel1') {
    chrome.storage.local.set({ qrurl: info.selectionText });
    chrome.sidePanel.setOptions({
      tabId: tab?.id || -1,
      path: 'index.html',
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab?.id || -1 });
  }
  if (info.menuItemId === 'openSidePanel2') {
    chrome.storage.local.set({ qrurl: info.linkUrl });
    chrome.sidePanel.setOptions({
      tabId: tab?.id || -1,
      path: 'index.html',
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab?.id || -1 });
  }
  if (info.menuItemId === 'openSidePanel3') {
    chrome.storage.local.set({ qrurl: info.srcUrl });
    chrome.sidePanel.setOptions({
      tabId: tab?.id || -1,
      path: 'index.html',
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab?.id || -1 });
  }
  if (info.menuItemId === 'openSidePanel4') {
    chrome.storage.local.set({ qrimageurl: info.srcUrl });
    chrome.sidePanel.setOptions({
      tabId: tab?.id || -1,
      path: 'index.html',
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab?.id || -1 });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'index.html' });
});