# QR Code Scanner & Generator (QR-SnG)

A high-performance, professional-grade browser extension designed for seamless QR code creation and extraction. Built with a focus on modern UI/UX, privacy, and the ability to handle complex web elements like Canvas and SVG-based QR codes that traditional scanners fail to recognize.

## Overview

**QR-SnG** is more than a simple barcode reader; it is a comprehensive toolkit for managing digital data. Whether you need to generate a high-quality vector QR code for a business card or extract data from a stubborn CSS-styled QR code on a webpage, this extension provides a robust, Manifest V3-compliant solution.

---

## Key Features

### 🔍 Advanced Scanning Capabilities

- **Dynamic Snipping Tool:** A custom-built "On-Screen" selection tool that allows you to click and drag a box over any part of a webpage. This captures and decodes QR codes rendered in `<canvas>`, `<svg>`, or complex CSS backgrounds that cannot be downloaded as standard images.
  > **Note:** This Feature currently available on chrome version
- **jsQR Integration:** Utilizes the synchronous `jsQR` engine for 100% Manifest V3 CSP compliance. No external web workers are required, ensuring maximum security and performance.
- **Multi-Input Support:** Scan QR codes via file upload, standard right-click context menus, or by simply dragging and dropping an image file anywhere into the side panel.
- **Smart Parser:** Automatically detects the data type of scanned codes (Wi-Fi, vCard, URL, etc.) and presents a formatted, interactive UI rather than raw text.

### 🎨 Professional QR Generation

- **Smart Templates:** Dedicated forms for generating specialized QR codes:
  - **Wi-Fi:** SSID, Password, and Encryption type.
  - **vCard:** Full contact details (Name, Phone, Email).
  - **Communication:** Email (Subject/Body) and SMS/WhatsApp integration.
  - **Geolocation:** Latitude/Longitude with a built-in **City Search** (OpenStreetMap API) to auto-fill coordinates.
- **Deep Customization:**
  - **Shape Control:** Customize "Data Dots" and "Position Eyes" independently (Squares, Circles, Rounded, or Liquid styles).
  - **Visual Aesthetics:** Support for solid colors, linear gradients, and transparent backgrounds.
  - **Contrast Validator:** Real-time scannability check that warns you if your color choices provide insufficient contrast for physical scanners.
- **Large Text Hosting:** A unique feature that handles massive text payloads by hosting the content on a secure web viewer and generating a lightweight, scannable "Compressed Link" QR code instead.

### 📂 History & Management

- **Intelligent History Log:** Saves your recent scans and generations locally.
- **Favorites & Recycle Bin:** Organize your codes with a "Starred" system. Deleted items move to a Recycle Bin with a 30-day auto-purge cycle, similar to modern OS behavior.
- **Smart File Naming:** Automatically names downloaded files based on their content (e.g., `QR-SnG_github.com-my-project.png`), truncated to 50 characters for easy recognition.

---

## Advanced Technology

### URL Shortening & Fallback

The extension integrates the TinyURL API to ensure that long, complex URLs result in simple, high-density QR codes that are easier for mobile devices to scan. It features a dual-API fallback system to ensure the service remains available even if a specific API key reaches its limit.

### Cross-Browser Compatibility

While optimized for the **Chrome Side Panel API**, the architecture is designed with cross-browser standards in mind:

- **Chrome Version:** Fully utilizes Manifest V3, Side Panel API, and Context Menus.
- **Firefox Version:** Implemented using the WebExtensions API. In Firefox, the interface operates via the `sidebarAction` or a dedicated options page, ensuring that Firefox users enjoy the same "Side-by-Side" experience without hardware-dependent logic like webcams.

### Privacy & Performance

- **No Camera Required:** Unlike legacy scanners, this tool requires zero camera permissions, making it ideal for PCs and privacy-conscious users.
- **Dark Mode:** A fully native Dark Mode toggle that respects user preferences and reduces eye strain.
- **Local Processing:** All QR decoding and matrix generation happen locally on your machine; your data is never sent to a third-party server for processing (except optional URL shortening).
