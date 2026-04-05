import QrScanner from './qr-scanner.min.js';

// DOM Elements
const input = document.querySelector('#img-in');
const outqrtxt = document.getElementById('out-qr-txt');
const genbtn = document.getElementById('gen-btn');
const qrtxt = document.getElementById('qr-txt');
const qrcodee = document.getElementById("qrcode");
const copybtn = document.getElementById('copy-btn');
const downloadbtn = document.getElementById('download-btn');
const clipboardbtn = document.getElementById('clip-btn');

let qrcode = null;

// --- SCANNER LOGIC ---
function scanQR(file) {
  outqrtxt.innerText = "Scanning...";
  QrScanner.scanImage(file, { returnDetailedScanResult: true })
    .then(result => {
        outqrtxt.innerText = result.data;
    })
    .catch(error => {
        outqrtxt.innerText = 'No QR code found in the image.';
        console.log(error || 'No QR code found.');
    });
}

input.addEventListener('change', (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    const file = files[0];
    if (file instanceof File && file.type.includes("image")) {
        scanQR(file);
    }
  }
});

// --- GENERATOR LOGIC ---
function generateQr(txt) {
  if (!txt || !txt.trim()) return;
  
  if (qrcode) {
    qrcode.clear(); 
    qrcode.makeCode(txt);
  } else {
    qrcodee.innerHTML = ''; // clear placeholder text
    qrcode = new QRCode(qrcodee, {
      text: txt,
      width: 200,
      height: 200,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
  }
}

genbtn.addEventListener('click', () => {
  const txt = qrtxt.value;
  if (txt) {
    generateQr(txt);
  }
});

clipboardbtn.addEventListener('click', () => {
  navigator.clipboard.readText().then((txt) => {
    if (txt) {
        qrtxt.value = txt; // Populate input for UX visibility
        generateQr(txt);
    }
  }).catch(err => console.error("Clipboard permission denied.", err));
});

copybtn.addEventListener('click', () => {
  const textToCopy = outqrtxt.innerText;
  if (textToCopy && textToCopy !== "Scanning..." && textToCopy !== "No QR scanned yet..." && textToCopy !== "No QR code found in the image.") {
      navigator.clipboard.writeText(textToCopy).catch(err => console.error(err));
  }
});

downloadbtn.addEventListener('click', () => {
  const imgs = qrcodee.getElementsByTagName('img');
  if (imgs.length > 0 && imgs[0].src) {
    const a = document.createElement('a');
    a.href = imgs[0].src;
    a.download = `qr-${Date.now()}.png`;
    a.click();
  } else {
    const canvases = qrcodee.getElementsByTagName('canvas');
    if (canvases.length > 0) {
        const a = document.createElement('a');
        a.href = canvases[0].toDataURL("image/png");
        a.download = `qr-${Date.now()}.png`;
        a.click();
    }
  }
});

// --- STORAGE LISTENERS (For Context Menus) ---
const targetKeyUrl = "qrurl";
const targetKeyImgUrl = "qrimageurl";

if (chrome && chrome.storage && chrome.storage.local) {
  // Initial check on load
  chrome.storage.local.get([targetKeyUrl, targetKeyImgUrl], (result) => {
    if (result && result.qrurl) {
      qrtxt.value = result.qrurl;
      generateQr(result.qrurl);
    }
    if (result && result.qrimageurl) {
        fetch(result.qrimageurl)
            .then(response => response.blob())
            .then(myBlob => scanQR(myBlob))
            .catch(err => console.error(err));
    }
  });

  // Listener for dynamic updates (when panel is already open)
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes[targetKeyUrl] && changes[targetKeyUrl].oldValue !== changes[targetKeyUrl].newValue) {
        qrtxt.value = changes[targetKeyUrl].newValue;
        generateQr(changes[targetKeyUrl].newValue);
      }
      if (changes[targetKeyImgUrl] && changes[targetKeyImgUrl].oldValue !== changes[targetKeyImgUrl].newValue) {
        fetch(changes[targetKeyImgUrl].newValue)
            .then(response => response.blob())
            .then(myBlob => scanQR(myBlob))
            .catch(err => console.error(err));
      }
    }
  });
}