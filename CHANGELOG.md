#### **The Master Version (v3.1.0 — v3.1.5)**

_Focus: Ultimate utility and "Scan Anywhere" technology._

- **What’s New:**
  - **On-Screen Snipping Tool:** New feature to drag and select a specific area on any webpage to scan QR codes from `<canvas>`, `<svg>`, or CSS backgrounds.
  - **Geo-Location Search:** Added auto-fill for coordinates. Type a city name (e.g., "Paris") to instantly fetch and input Latitude/Longitude via Nominatim API.
  - **Smart Scan Parsing:** Scanned results now show beautiful formatted UI cards (e.g., a "Connect" button for Wi-Fi or "Add Contact" for vCard) instead of raw text.
- **What’s Fixed:**
  - **D&D Flicker Fix:** Fixed the "crumbling" visual glitch during drag-and-drop by implementing a `dragCounter`.
  - **Browser Redirect Fix:** Prevented images from opening in a new tab when accidentally dropped outside the drop zone.
- **What’s Removed:**
  - Removed the "Default Popup" from manifest to prioritize the Side Panel ecosystem.

#### **Smart Logic & UX Polish (v2.9.0 — v3.0.5)**

_Focus: User experience and cross-platform stability._

- **What’s New:**
  - **Smart File Naming:** Files are now named `QR-SnG_[content].png` (sanitized and truncated to 50 chars) instead of random timestamps.
  - **Long-Text Compression:** Added "Host & Compress" feature. Massive texts are hosted on a web-viewer (`pro-bandey.github.io/QR-SnG/`) and shortened into a clean QR code.
  - **Contrast Checker:** Real-time scannability rating based on Foreground/Background color contrast ratios.
  - **Global Dark Mode:** Manual and system-based theme toggling.
- **What’s Fixed:**
  - **CSP Security Fix:** Re-wrote all history buttons using Event Delegation to comply with Chrome Manifest V3 Content Security Policy (fixing non-responsive buttons).
- **What’s Removed:**
  - Removed "qr-scanner.min.js" library in favor of **jsQR** for 100% CSP compliance and no-worker dependency.

#### **High Customization & Export (v2.3.0 — v2.8.5)**

_Focus: Visual aesthetics and professional-grade outputs._

- **What’s New:**
  - **Matrix Rendering Engine:** Re-engineered the generator to support **Dots, Liquid, and Square** shapes.
  - **Eye Styling:** Ability to style the corner "Position Markers" (Eyes) separately.
  - **Color Gradients:** Added support for linear gradients in the foreground.
  - **Multi-Format Export:** Native support for downloading in **PNG, JPG, and Vector SVG**.
  - **History Log:** Local history storage with "Favorites" and "Bin" management.
- **What’s Fixed:**
  - Fixed SVG generation logic to ensure vector files are perfectly sharp at any scale.
- **What’s Removed:**
  - Removed the "Center Logo" feature to ensure 100% scannability across all custom dot shapes.

#### **The UI Rebirth & Privacy Pivot (v1.6.0 — v2.2.0)**

_Focus: Redesigning for privacy and modern browser standards._

- **What’s New:**
  - **Side Panel Integration:** Moved the UI from a popup to the Chrome Side Panel for a persistent multitasking experience.
  - **File-Based Scanning:** Added the ability to upload images to scan QR codes.
  - **TinyURL Integration:** Added URL shortening using API fallback logic (Api1 and Api2).
  - **Smart Templates:** Dedicated forms for Wi-Fi (SSID/Pass) and vCards.
- **What’s Fixed:**
  - Resolved "Race Condition" where data sent from context menus wouldn't appear if the panel was closed.
- **What’s Removed:**
  - **DEPRECATED WEBCAM:** Completely removed camera/video logic. This solved 3rd party privacy concerns and allowed the extension to work on PCs without cameras.

#### **The Foundation (v1.0.0 — v1.5.0)**

_Focus: Initial release and core utility._

- **What’s New:**
  - Initial launch with QR Generation for plain text and URLs.
  - Added **Webcam-based QR Scanner** using `getUserMedia`.
  - Implemented "Generate from Clipboard" feature.
  - Basic context menus for "Create QR for this page."
- **What’s Fixed:**
  - Optimized `qrcode.min.js` to prevent memory leaks during rapid regeneration.
- **What’s Removed:**
  - Removed redundant internal logging to speed up the Side Panel load time.
