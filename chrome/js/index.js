import QrScanner from './qr-scanner.min.js';

// --- DOM ELEMENTS ---
const dndOverlay = document.getElementById('dnd-overlay');
const qrcodee = document.getElementById("qrcode");
const genbtn = document.getElementById('gen-btn');
const downloadbtn = document.getElementById('download-btn');
const clipboardbtn = document.getElementById('clip-btn');

const input = document.querySelector('#img-in');
const outqrtxt = document.getElementById('out-qr-txt');
const scanPreview = document.getElementById('scan-preview');
const copybtn = document.getElementById('copy-btn');
const actionbtn = document.getElementById('action-btn');
const actionbtnSvg = {
  link: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M318-120q-82 0-140-58t-58-140q0-40 15-76t43-64l134-133 56 56-134 134q-17 17-25.5 38.5T200-318q0 49 34.5 83.5T318-200q23 0 45-8.5t39-25.5l133-134 57 57-134 133q-28 28-64 43t-76 15Zm79-220-57-57 223-223 57 57-223 223Zm251-28-56-57 134-133q17-17 25-38t8-44q0-50-34-85t-84-35q-23 0-44.5 8.5T558-726L425-592l-57-56 134-134q28-28 64-43t76-15q82 0 139.5 58T839-641q0 39-14.5 75T782-502L648-368Z"/></svg>',
  Location: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>',
  sms: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M348.5-531.5Q360-543 360-560t-11.5-28.5Q337-600 320-600t-28.5 11.5Q280-577 280-560t11.5 28.5Q303-520 320-520t28.5-11.5Zm160 0Q520-543 520-560t-11.5-28.5Q497-600 480-600t-28.5 11.5Q440-577 440-560t11.5 28.5Q463-520 480-520t28.5-11.5Zm160 0Q680-543 680-560t-11.5-28.5Q657-600 640-600t-28.5 11.5Q600-577 600-560t11.5 28.5Q623-520 640-520t28.5-11.5ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>',
  email: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>'
}
const scanActions = document.getElementById('scan-actions');

// Customization
const templateSelector = document.getElementById('template-selector');
const shortenUrlCheck = document.getElementById('shorten-url');
const compressTextCheck = document.getElementById('compress-text');
const shortenLoader = document.getElementById('shorten-loader');
const colorDarkInput = document.getElementById('color-dark');
const colorDark2Input = document.getElementById('color-dark-2');
const colorLightInput = document.getElementById('color-light');
const transBgCheck = document.getElementById('trans-bg');
const contrastWarning = document.getElementById('contrast-warning');
const qrShapeInput = document.getElementById('qr-shape');
const eyeShapeInput = document.getElementById('eye-shape');
const downloadFormat = document.getElementById('download-format');

// Theme & State
const themeToggle = document.getElementById('theme-toggle');
let currentQRMatrix = null;
let currentQRSize = 300;
let lastGeneratedText = "qr-code";

// --- INITIALIZE THEME ---
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.setAttribute('data-theme', 'dark');
  themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>';
}
themeToggle.addEventListener('click', () => {
  if (document.body.getAttribute('data-theme') === 'dark') {
    document.body.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>';
  } else {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>';
  }
});

// --- TABS LOGIC ---
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.getAttribute('data-target')).classList.add('active');
  });
});

// --- TEMPLATES ---
templateSelector.addEventListener('change', (e) => {
  document.querySelectorAll('.template-section').forEach(el => el.classList.remove('active'));
  document.getElementById(`tpl-${e.target.value}`).classList.add('active');
});

function getTemplateText() {
  const t = templateSelector.value;
  if (t === 'text') return document.getElementById('qr-txt').value.trim();
  if (t === 'wifi') {
    const s = document.getElementById('wifi-ssid').value.trim();
    const p = document.getElementById('wifi-pass').value.trim();
    return s ? `WIFI:T:${document.getElementById('wifi-type').value};S:${s};P:${p};;` : '';
  }
  if (t === 'vcard') {
    const n = document.getElementById('vc-name').value.trim(), p = document.getElementById('vc-phone').value.trim(), e = document.getElementById('vc-email').value.trim();
    return n ? `BEGIN:VCARD\nVERSION:3.0\nFN:${n}\nTEL:${p}\nEMAIL:${e}\nEND:VCARD` : '';
  }
  if (t === 'email') {
    const to = document.getElementById('em-to').value.trim(), sub = document.getElementById('em-sub').value.trim(), body = document.getElementById('em-body').value.trim();
    return to ? `mailto:${to}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}` : '';
  }
  if (t === 'sms') return `smsto:${document.getElementById('sms-phone').value.trim()}:${document.getElementById('sms-msg').value.trim()}`;
  if (t === 'geo') return `geo:${document.getElementById('geo-lat').value},${document.getElementById('geo-lng').value}`;
  return '';
}
// --- GEO LOCATION SEARCH ---
const geoSearchInput = document.getElementById('geo-search');
const geoLoader = document.getElementById('geo-loader');

geoSearchInput.addEventListener('change', async (e) => {
  const query = e.target.value.trim();
  if (!query) return;

  geoLoader.style.display = 'block';
  try {
    // OpenStreetMap free geocoding API
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data && data.length > 0) {
      document.getElementById('geo-lat').value = parseFloat(data[0].lat).toFixed(6);
      document.getElementById('geo-lng').value = parseFloat(data[0].lon).toFixed(6);
    } else {
      alert("Location not found. Please try a different city name.");
    }
  } catch (err) {
    console.error("Geocoding failed:", err);
  }
  geoLoader.style.display = 'none';
});

// Check Scannability Contrast
function checkContrast() {
  const hexToRgb = hex => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const lum = ([r, g, b]) => {
    let a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
  const l1 = lum(hexToRgb(colorLightInput.value));
  const l2 = lum(hexToRgb(colorDarkInput.value));
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  if (!transBgCheck.checked && ratio < 3.0) {
    contrastWarning.innerText = `⚠️ Low Contrast (${ratio.toFixed(1)}:1). QR may not scan well.`;
    contrastWarning.style.display = 'block';
  } else {
    contrastWarning.style.display = 'none';
  }
} [colorDarkInput, colorLightInput, transBgCheck].forEach(el => el.addEventListener('change', checkContrast));

// --- URL SHORTENER & HOSTING ---
async function shortenUrl(longUrl) {
  const apis = ["R6TkierZYnp2nPqoz5qE1r38SVwEwjPc7QT9zR7hvP0wI0JvUsU7bwzCVWLw", "kJV3c2Pd5RdKpaWkqf45Mo4jZf7VskWnrwzq7pOCEs0vhaauzOZwKjEEgJAo"];
  for (let token of apis) {
    try {
      let res = await fetch("https://api.tinyurl.com/create", {
        method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl, domain: "tinyurl.com" })
      });
      if (res.ok) return (await res.json()).data.tiny_url;
    } catch (e) { }
  }
  return longUrl;
}

// Disable mutually exclusive checkboxes
compressTextCheck.addEventListener('change', () => {
  if (compressTextCheck.checked) shortenUrlCheck.checked = false;
});
shortenUrlCheck.addEventListener('change', () => {
  if (shortenUrlCheck.checked) compressTextCheck.checked = false;
});

// --- GENERATOR LOGIC (CANVAS MANIPULATION) ---
function isEyeArea(r, c, max) {
  return (r < 7 && c < 7) || (r < 7 && c >= max - 7) || (r >= max - 7 && c < 7);
}

async function generateQr() {
  let txt = getTemplateText();
  if (!txt) return;

  // Handle URL Shortening & Text Compression
  if (templateSelector.value === 'text') {
    if (compressTextCheck.checked) {
      shortenLoader.style.display = 'inline';
      const payloadUrl = `https://pro-bandey.github.io/QR-SnG/?theme=dark&txt=${encodeURIComponent(txt)}`;
      txt = await shortenUrl(payloadUrl);
      shortenLoader.style.display = 'none';
    } else if (shortenUrlCheck.checked && txt.startsWith('http')) {
      shortenLoader.style.display = 'inline';
      txt = await shortenUrl(txt);
      shortenLoader.style.display = 'none';
    }
  }

  lastGeneratedText = txt;

  const tempDiv = document.createElement("div");
  const qr = new QRCode(tempDiv, { text: txt, correctLevel: QRCode.CorrectLevel.H });

  setTimeout(() => {
    const modules = qr._oQRCode.modules;
    const mCount = qr._oQRCode.moduleCount;
    currentQRMatrix = modules;

    const canvas = document.createElement('canvas');
    canvas.width = currentQRSize; canvas.height = currentQRSize;
    const ctx = canvas.getContext('2d');

    // Background
    if (!transBgCheck.checked) {
      ctx.fillStyle = colorLightInput.value;
      ctx.fillRect(0, 0, currentQRSize, currentQRSize);
    }

    // Foreground Gradient
    let fgStyle = colorDarkInput.value;
    if (colorDarkInput.value !== colorDark2Input.value) {
      let grad = ctx.createLinearGradient(0, 0, currentQRSize, currentQRSize);
      grad.addColorStop(0, colorDarkInput.value);
      grad.addColorStop(1, colorDark2Input.value);
      fgStyle = grad;
    }
    ctx.fillStyle = fgStyle;

    const rSize = currentQRSize / mCount;
    const shape = qrShapeInput.value;
    const eyeShape = eyeShapeInput.value;

    for (let r = 0; r < mCount; r++) {
      for (let c = 0; c < mCount; c++) {
        if (modules[r][c]) {
          if (isEyeArea(r, c, mCount)) {
            ctx.beginPath();
            if (eyeShape === 'circles') ctx.arc(c * rSize + rSize / 2, r * rSize + rSize / 2, rSize / 2 + 0.1, 0, 2 * Math.PI);
            else if (eyeShape === 'rounded') ctx.roundRect(c * rSize, r * rSize, rSize + 0.5, rSize + 0.5, rSize * 0.4);
            else ctx.fillRect(c * rSize, r * rSize, rSize + 0.5, rSize + 0.5);
            ctx.fill();
          } else {
            ctx.beginPath();
            if (shape === 'dots') ctx.arc(c * rSize + rSize / 2, r * rSize + rSize / 2, rSize / 2 - 0.5, 0, 2 * Math.PI);
            else if (shape === 'liquid') ctx.roundRect(c * rSize, r * rSize, rSize + 0.5, rSize + 0.5, rSize * 0.4);
            else ctx.fillRect(c * rSize, r * rSize, rSize + 0.5, rSize + 0.5);
            ctx.fill();
          }
        }
      }
    }

    qrcodee.innerHTML = '';
    qrcodee.appendChild(canvas);
    saveHistory('Generated At', lastGeneratedText);
  }, 100);
}
genbtn.addEventListener('click', generateQr);

// --- SMART FILE NAMING ---
function getSmartFilename(ext) {
  let name = lastGeneratedText.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  name = name.replace(/[\/\\?%*:|"<> \n]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!name) name = "qr-code";
  if (name.length > 50) name = name.substring(0, 50).replace(/-$/, '');
  return `QR-SnG_${name}.${ext}`;
}

// --- DOWNLOADS ---
downloadbtn.addEventListener('click', () => {
  if (!currentQRMatrix) return;
  const fmt = downloadFormat.value;
  const canvas = qrcodee.querySelector('canvas');
  const filename = getSmartFilename(fmt);

  if (fmt === 'png' || fmt === 'jpg') {
    const a = document.createElement('a');
    a.href = canvas.toDataURL(fmt === 'png' ? 'image/png' : 'image/jpeg');
    a.download = filename; a.click();
  } else if (fmt === 'svg') {
    const mCount = currentQRMatrix.length; const rSize = currentQRSize / mCount;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${currentQRSize} ${currentQRSize}" width="${currentQRSize}" height="${currentQRSize}">`;
    if (!transBgCheck.checked) svg += `<rect width="100%" height="100%" fill="${colorLightInput.value}"/>`;
    for (let r = 0; r < mCount; r++) {
      for (let c = 0; c < mCount; c++) {
        if (currentQRMatrix[r][c]) svg += `<rect x="${c * rSize}" y="${r * rSize}" width="${rSize + 0.1}" height="${rSize + 0.1}" fill="${colorDarkInput.value}"/>`;
      }
    }
    svg += `</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});

// --- SMART SCAN PARSER ---
function parseScanResult(txt) {
  scanActions.style.display = 'flex';
  actionbtn.style.display = 'none';
  actionbtn.onclick = null;

  if (txt.startsWith('WIFI:')) {
    const type = (txt.match(/T:(.*?);/) || [])[1] || '';
    const ssid = (txt.match(/S:(.*?);/) || [])[1] || '';
    const pass = (txt.match(/P:(.*?);/) || [])[1] || '';
    return `<strong>Wi-Fi Network</strong><br><b>Name:</b> ${ssid}<br><b>Pass:</b> ${pass || '<i>None</i>'}<br><b>Security:</b> ${type}`;
  }
  if (txt.startsWith('BEGIN:VCARD')) {
    const n = (txt.match(/FN:(.*)/) || [])[1] || '';
    const tel = (txt.match(/TEL:(.*)/) || [])[1] || '';
    const em = (txt.match(/EMAIL:(.*)/) || [])[1] || '';
    return `<strong>Contact Card</strong><br><b>Name:</b> ${n}<br><b>Phone:</b> <a href="tel:${tel}">${tel}</a><br><b>Email:</b> <a href="mailto:${em}" target="_blank">${em}</a>`;
  }
  if (txt.startsWith('http://') || txt.startsWith('https://') || txt.startsWith('chrome:') || txt.startsWith('about:')) {
    actionbtn.style.display = 'flex'; actionbtn.innerHTML = `${actionbtnSvg.link} Open Link`;
    actionbtn.onclick = () => { if (chrome?.tabs) chrome.tabs.create({ url: txt }); else window.open(txt, '_blank'); };
    return `<strong>URL Link</strong><br> <a href="${txt}" target="_blank">${txt}</a>`;
  }
  if (txt.startsWith('geo:')) {
    actionbtn.style.display = 'flex'; actionbtn.innerHTML = `${actionbtnSvg.Location} Open Location`;
    actionbtn.onclick = () => { if (chrome?.tabs) chrome.tabs.create({ url: txt }); else window.open(txt, '_blank'); };
    return `<strong>URL Link</strong><br> <a href="${txt}" target="_blank">${txt}</a>`;
  }
  if (txt.startsWith('mailto:')) {
    actionbtn.style.display = 'flex'; actionbtn.innerHTML = `${actionbtnSvg.email} Send Email`;
    actionbtn.onclick = () => { if (chrome?.tabs) chrome.tabs.create({ url: txt }); else window.open(txt, '_blank'); };
    return `<strong>URL Link</strong><br><a href="${txt}" target="_blank">${txt}</a>`;
  }
  if (txt.startsWith('smsto:')) {
    actionbtn.style.display = 'flex'; actionbtn.innerHTML = `${actionbtnSvg.sms} Send SMS`;
    actionbtn.onclick = () => { if (chrome?.tabs) chrome.tabs.create({ url: txt }); else window.open(txt, '_blank'); };
    return `<strong>URL Link</strong><br><a href="${txt}" target="_blank">${txt}</a>`;
  }
  return `<strong>Text Result</strong><br> ${txt}`;
}

function scanQR(file) {
  outqrtxt.innerHTML = "<i>Scanning...</i>";
  scanPreview.src = URL.createObjectURL(file);
  scanPreview.style.display = 'block';

  QrScanner.scanImage(file, { returnDetailedScanResult: true })
    .then(res => {
      outqrtxt.innerHTML = parseScanResult(res.data);
      outqrtxt.setAttribute('data-raw', res.data);
      saveHistory('Scanned', res.data);
    })
    .catch(err => {
      outqrtxt.innerHTML = '<span style="color:red">No QR code found in the image.</span>';
      scanActions.style.display = 'none';
    });
}

input.addEventListener('change', (e) => { if (e.target.files.length > 0) scanQR(e.target.files[0]); });

copybtn.addEventListener('click', () => {
  const t = outqrtxt.getAttribute('data-raw');
  if (t) navigator.clipboard.writeText(t).catch(e => console.error(e));
});

clipboardbtn.addEventListener('click', () => {
  navigator.clipboard.readText().then(txt => {
    if (txt) {
      document.querySelector('[data-target="tab-gen"]').click();
      templateSelector.value = 'text'; templateSelector.dispatchEvent(new Event('change'));
      document.getElementById('qr-txt').value = txt; generateQr();
    }
  });
});

// --- DRAG & DROP ---
// window.addEventListener('dragover', (e) => { e.preventDefault(); dndOverlay.classList.add('active'); });
// window.addEventListener('dragleave', (e) => { e.preventDefault(); dndOverlay.classList.remove('active'); });
// window.addEventListener('drop', (e) => {
//   e.preventDefault(); dndOverlay.classList.remove('active');
//   const items = e.dataTransfer.items;

//   if (e.dataTransfer.files.length > 0 && e.dataTransfer.files[0].type.includes('image')) {
//     document.querySelector('[data-target="tab-scan"]').click();
//     scanQR(e.dataTransfer.files[0]);
//   } else {
//     e.dataTransfer.items[0].getAsString(text => {
//       if (text) {
//         document.querySelector('[data-target="tab-gen"]').click();
//         templateSelector.value = 'text'; templateSelector.dispatchEvent(new Event('change'));
//         document.getElementById('qr-txt').value = text; generateQr();
//       }
//     });
//   }
// });

// --- DRAG & DROP (Flicker Fix Applied) ---
let dragCounter = 0;

window.addEventListener('dragenter', (e) => {
  e.preventDefault();
  dragCounter++;
  if (dragCounter === 1) dndOverlay.classList.add('active');
});

window.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dragCounter--;
  if (dragCounter === 0) dndOverlay.classList.remove('active');
});

window.addEventListener('dragover', (e) => {
  e.preventDefault(); // Crucial: Stops the browser from defaulting to new tab
});

window.addEventListener('drop', (e) => {
  e.preventDefault();
  dragCounter = 0;
  dndOverlay.classList.remove('active');

  if (e.dataTransfer.files.length > 0 && e.dataTransfer.files[0].type.includes('image')) {
    document.querySelector('[data-target="tab-scan"]').click();
    scanQR(e.dataTransfer.files[0]);
  } else if (e.dataTransfer.items.length > 0) {
    e.dataTransfer.items[0].getAsString(text => {
      if (text) {
        document.querySelector('[data-target="tab-gen"]').click();
        templateSelector.value = 'text'; templateSelector.dispatchEvent(new Event('change'));
        document.getElementById('qr-txt').value = text; generateQr();
      }
    });
  }
});

// --- ADVANCED HISTORY LOGIC (CSP FIX APPLIED) ---
let historyState = [];
let currentHistView = 'all';

function manageHistoryStorage() {
  const now = Date.now();
  historyState = historyState.filter(item => {
    if (item.deletedAt && (now - item.deletedAt > 30 * 24 * 60 * 60 * 1000)) return false;
    return true;
  });
  chrome?.storage?.local.set({ appHistory: historyState });
  renderHistory();
}

function loadHistory() {
  if (chrome?.storage?.local) {
    chrome.storage.local.get(['appHistory'], (res) => {
      historyState = res.appHistory || [];
      manageHistoryStorage();
    });
  }
}

function saveHistory(type, data) {
  if (!data) return;
  const activeItems = historyState.filter(i => !i.deletedAt);
  if (activeItems.length > 0 && activeItems[0].data === data) return;

  historyState.unshift({ id: Date.now(), type, data, date: new Date().toLocaleDateString(), isFav: false, deletedAt: null });
  manageHistoryStorage();
}

document.querySelectorAll('.hist-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.hist-tab').forEach(b => b.classList.remove('active'));
    t.classList.add('active');
    currentHistView = t.getAttribute('data-view');
    renderHistory();
  });
});

document.getElementById('empty-bin-btn').addEventListener('click', () => {
  historyState = historyState.filter(i => !i.deletedAt);
  manageHistoryStorage();
});

// Helper actions
function toggleFav(id) { const idx = historyState.findIndex(i => i.id === id); if (idx > -1) historyState[idx].isFav = !historyState[idx].isFav; manageHistoryStorage(); }
function moveToBin(id) { const idx = historyState.findIndex(i => i.id === id); if (idx > -1) historyState[idx].deletedAt = Date.now(); manageHistoryStorage(); }
function restoreItem(id) { const idx = historyState.findIndex(i => i.id === id); if (idx > -1) historyState[idx].deletedAt = null; manageHistoryStorage(); }
function deletePerm(id) { historyState = historyState.filter(i => i.id !== id); manageHistoryStorage(); }
function useItem(id) {
  const item = historyState.find(i => i.id === id); if (!item) return;
  document.querySelector('[data-target="tab-gen"]').click();
  templateSelector.value = 'text'; templateSelector.dispatchEvent(new Event('change'));
  document.getElementById('qr-txt').value = item.data; generateQr();
}

// Event Delegation for History Buttons (Fixes Chrome CSP Errors)
document.getElementById('history-list').addEventListener('click', (e) => {
  const btn = e.target.closest('.action-btn');
  if (!btn) return;

  const action = btn.getAttribute('data-action');
  const id = parseInt(btn.getAttribute('data-id'));

  if (action === 'fav') toggleFav(id);
  else if (action === 'bin') moveToBin(id);
  else if (action === 'restore') restoreItem(id);
  else if (action === 'delete') deletePerm(id);
  else if (action === 'use') useItem(id);
});

function renderHistory() {
  const list = document.getElementById('history-list');
  const emptyRow = document.getElementById('empty-bin-row');
  list.innerHTML = '';

  let filtered = historyState;
  if (currentHistView === 'all') { filtered = historyState.filter(i => !i.deletedAt); emptyRow.style.display = 'none'; }
  if (currentHistView === 'fav') { filtered = historyState.filter(i => !i.deletedAt && i.isFav); emptyRow.style.display = 'none'; }
  if (currentHistView === 'bin') { filtered = historyState.filter(i => i.deletedAt); emptyRow.style.display = filtered.length ? 'block' : 'none'; }

  if (filtered.length === 0) { list.innerHTML = `<div style="text-align:center;font-size:12px;color:var(--text-muted);padding:20px;">No items found.</div>`; return; }

  filtered.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';

    let actionsHTML = '';
    if (item.deletedAt) {
      actionsHTML = `<button class="icon-btn action-btn" data-action="restore" data-id="${item.id}" title="Restore"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C"><path d="M444-312h72v-150l57 57 51-51-144-144-144 144 51 51 57-57v150ZM312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480Zm-336 0v480-480Z"/></svg></button>
                     <button class="icon-btn action-btn" data-action="delete" data-id="${item.id}" title="Delete Forever" style="color:var(--danger)"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323"><path d="m400-325 80-80 80 80 51-51-80-80 80-80-51-51-80 80-80-80-51 51 80 80-80 80 51 51Zm-88 181q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480Zm-336 0v480-480Z"/></svg></button>`;
    } else {
      actionsHTML = `<button class="icon-btn action-btn" data-action="fav" data-id="${item.id}" title="Favorite">${item.isFav ? '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA33F7"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm280-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z"/></svg>'}</button>
                     <button class="icon-btn action-btn" data-action="use" data-id="${item.id}" title="Re-Use"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M314-115q-104-48-169-145T80-479q0-26 2.5-51t8.5-49l-46 27-40-69 191-110 110 190-70 40-54-94q-11 27-16.5 56t-5.5 60q0 97 53 176.5T354-185l-40 70Zm306-485v-80h109q-46-57-111-88.5T480-800q-55 0-104 17t-90 48l-40-70q50-35 109-55t125-20q79 0 151 29.5T760-765v-55h80v220H620ZM594 0 403-110l110-190 69 40-57 98q118-17 196.5-107T800-480q0-11-.5-20.5T797-520h81q1 10 1.5 19.5t.5 20.5q0 135-80.5 241.5T590-95l44 26-40 69Z"/></svg></button>
                     <button class="icon-btn action-btn" data-action="bin" data-id="${item.id}" title="Move to Trash"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></button>`;
    }

    div.innerHTML = `
      <div class="history-header">
        <span class="history-badge">${item.type} • ${item.date}</span>
        <div class="history-actions">${actionsHTML}</div>
      </div>
      <div class="history-text" title="${item.data}">${item.data}</div>
    `;
    list.appendChild(div);
  });
}

loadHistory();


// --- CONTEXT MENUS STORAGE LISTENERS ---
if (chrome && chrome.storage && chrome.storage.local) {
  chrome.storage.local.get(["qrurl", "qrimageurl"], (result) => {
    if (result.qrurl) {
      document.querySelector('[data-target="tab-gen"]').click();
      templateSelector.value = 'text'; templateSelector.dispatchEvent(new Event('change'));
      document.getElementById('qr-txt').value = result.qrurl; generateQr();
      chrome.storage.local.remove("qrurl");
    }
    if (result.qrimageurl) {
      document.querySelector('[data-target="tab-scan"]').click();
      fetch(result.qrimageurl).then(r => r.blob()).then(scanQR);
      chrome.storage.local.remove("qrimageurl");
    }
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes["qrurl"] && changes["qrurl"].newValue) {
        document.querySelector('[data-target="tab-gen"]').click();
        templateSelector.value = 'text'; templateSelector.dispatchEvent(new Event('change'));
        document.getElementById('qr-txt').value = changes["qrurl"].newValue; generateQr();
        chrome.storage.local.remove("qrurl");
      }
      if (changes["qrimageurl"] && changes["qrimageurl"].newValue) {
        document.querySelector('[data-target="tab-scan"]').click();
        fetch(changes["qrimageurl"].newValue).then(r => r.blob()).then(scanQR);
        chrome.storage.local.remove("qrimageurl");
      }
    }
  });
}