# KayBiT_CEHinteractive — Complete Cross-Platform Installation & Packaging Guide

This guide provides instructors and students with production-grade architectures and step-by-step instructions to wrap **KayBiT_CEHinteractive** into native installers:
- **Android**: Standalone `.apk` and Google Play `.aab`
- **iOS**: Progressive Web App (PWA) and Capacitor iOS IPA guidelines
- **Windows**: Lightweight `.exe` setup and `.msi` installers
- **macOS**: Universal `.dmg` disk image and `.app` bundles
- **Linux**: `.AppImage`, `.deb`, and embedded Go/Rust binaries

---

## 1. Tooling Selection Strategy

| Target Platform | Recommended Modern Tool | Alternative | Why We Recommend It |
|---|---|---|---|
| **Android (APK/AAB)** | **Capacitor 6** | Apache Cordova | Modern, first-class TypeScript support, direct native WebView integration, zero overhead, clean Android Studio project structure. |
| **iOS (iPhone/iPad)** | **PWA + Capacitor iOS** | React Native | Apple WebKit PWA allows instant installation without requiring a $99/yr Apple Developer account; Capacitor wraps it into Xcode if App Store distribution is desired. |
| **Desktop (Win/Mac/Linux)** | **Tauri 2 (Rust)** | Electron | **Tauri generates 10-15 MB binaries** using the OS's native webview (WebView2 on Windows, WebKit on macOS) compared to Electron's 120+ MB bundles, while consuming 80% less RAM. |
| **Web & Offline** | **Vite PWA (Workbox)** | Native ServiceWorker | Pre-caches all HTML, JS, CSS, and fonts for instantaneous zero-latency offline loading with full `localStorage` persistence. |

---

## 2. Project Restructuring Guidelines

To support both web browsers and native app wrappers without maintaining separate codebases:

### A. Relative Asset Base (`vite.config.ts`)
Set `base: './'` in `vite.config.ts` so that embedded WebViews (which load assets from `file://` or local custom schemes `tauri://localhost` and `capacitor://localhost`) can find static assets without 404 errors:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // CRITICAL: Enables relative pathing for native WebViews
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
});
```

### B. Safe Storage Handling
Always wrap `localStorage` access with fallback error guards for environments where cookies or storage might be sandboxed:
```typescript
export const getStorageItem = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (err) {
    console.warn('Storage unavailable, using memory fallback', err);
    return fallback;
  }
};
```

### C. Offline Asset Precaching
All fonts, styles, and scripts must be bundle-internal or precached via service worker so native apps work when airplane mode is enabled.

---

## 3. Concrete Configuration Files

### A. Capacitor Mobile Configuration (`capacitor.config.ts`)
Install Capacitor in your project:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init KayBiT_CEHinteractive com.kaybit.cehinteractive --web-dir dist
```

Create `capacitor.config.ts` in the project root:
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaybit.cehinteractive',
  appName: 'KayBiT_CEHinteractive',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
```

#### Generating the Android APK:
```bash
# 1. Build the Vite frontend
npm run build

# 2. Sync web assets to the Android native project
npx cap add android
npx cap sync android

# 3. Build debug or release APK using Gradle
cd android
./gradlew assembleDebug
# The output APK will be at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

### B. Tauri Desktop Configuration (`src-tauri/tauri.conf.json`)
Install Tauri CLI:
```bash
npm install -D @tauri-apps/cli
npx tauri init
```

Create/Update `src-tauri/tauri.conf.json`:
```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "KayBiT_CEHinteractive",
  "version": "1.0.0",
  "identifier": "com.kaybit.cehinteractive",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:3000",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "KayBiT CEH v13 Interactive Study Suite",
        "width": 1280,
        "height": 840,
        "minWidth": 900,
        "minHeight": 600,
        "center": true,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://fonts.googleapis.com https://fonts.gstatic.com data: blob:"
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

#### Compiling Native Desktop Packages:
```bash
# On Windows: Generates .exe setup and .msi in src-tauri/target/release/bundle/
npx tauri build

# On macOS: Generates universal .dmg and .app bundle
npx tauri build --target universal-apple-darwin

# On Linux: Generates .AppImage and .deb
npx tauri build
```

---

## 4. Build Automation: GitHub Actions CI/CD Pipeline

Create `.github/workflows/build-native.yml` to automatically build, test, and release all native packages on every Git tag push:

```yaml
name: Build Cross-Platform Native Packages

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  # 1. Android APK Build
  build-android:
    name: Build Android APK
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Install Dependencies
        run: npm ci

      - name: Build Web App
        run: npm run build

      - name: Capacitor Sync
        run: |
          npx cap add android || true
          npx cap sync android

      - name: Build Android APK via Gradle
        run: |
          cd android
          chmod +x ./gradlew
          ./gradlew assembleRelease

      - name: Upload Android APK
        uses: actions/upload-artifact@v4
        with:
          name: KayBiT_CEHinteractive-android-release.apk
          path: android/app/build/outputs/apk/release/app-release-unsigned.apk

  # 2. Desktop Binaries (Windows & macOS)
  build-tauri:
    name: Build Desktop (${{ matrix.platform }})
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: 'windows-latest'
            args: '--target x86_64-pc-windows-msvc'
          - platform: 'macos-latest'
            args: '--target universal-apple-darwin'
          - platform: 'ubuntu-22.04'
            args: ''

    runs-on: ${{ matrix.platform }}
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Rust Toolchain
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.platform == 'macos-latest' && 'aarch64-apple-darwin,x86_64-apple-darwin' || '' }}

      - name: Install Linux Build Dependencies (Ubuntu only)
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

      - name: Install NPM Dependencies
        run: npm ci

      - name: Build Desktop Binaries via Tauri
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: ${{ github.ref_name }}
          releaseName: 'KayBiT_CEHinteractive ${{ github.ref_name }}'
          releaseBody: 'Download pre-compiled binaries for Windows, macOS, Android, and Linux.'
          releaseDraft: false
          prerelease: false
```

---

## 5. Hosting & Distribution Architecture (Vercel / Netlify / AWS S3)

To give students clean, dependable download links on your official website:

### Directory Structure on AWS S3 / CloudFront:
```text
https://downloads.kaybit.edu/cehinteractive/
│
├── latest.json                     # JSON feed for client in-app update checks
├── index.html                      # Branded landing page with OS detection script
│
├── releases/
│   └── v1.0.0/
│       ├── KayBiT_CEH-Setup-1.0.0.exe        (Windows x64 Setup Installer)
│       ├── KayBiT_CEH-1.0.0.msi              (Windows MSI Enterprise Installer)
│       ├── KayBiT_CEH-1.0.0-universal.dmg    (macOS Intel & Apple Silicon DMG)
│       ├── KayBiT_CEH-1.0.0.apk              (Android Standalone APK)
│       ├── KayBiT_CEH-1.0.0.AppImage         (Linux Universal Executable)
│       ├── KayBiT_CEH_standalone.html        (Single-file Offline Portable App)
│       └── SHA256SUMS.txt                    (Cryptographic integrity hashes)
```

### Automatic Client-Side OS Detection Snippet (For your website):
```html
<script>
  function getDownloadLink() {
    const ua = navigator.userAgent.toLowerCase();
    const base = "https://downloads.kaybit.edu/cehinteractive/releases/v1.0.0/";
    
    if (ua.includes("android")) {
      return { name: "Download Android APK", url: base + "KayBiT_CEH-1.0.0.apk", icon: "android" };
    } else if (ua.includes("mac")) {
      return { name: "Download macOS Universal .dmg", url: base + "KayBiT_CEH-1.0.0-universal.dmg", icon: "apple" };
    } else if (ua.includes("win")) {
      return { name: "Download Windows .exe Installer", url: base + "KayBiT_CEH-Setup-1.0.0.exe", icon: "windows" };
    } else if (ua.includes("linux")) {
      return { name: "Download Linux .AppImage", url: base + "KayBiT_CEH-1.0.0.AppImage", icon: "terminal" };
    }
    return { name: "Download Standalone HTML5", url: base + "KayBiT_CEH_standalone.html", icon: "globe" };
  }
</script>
```

### Auto-Update Specification (`latest.json`):
```json
{
  "version": "1.0.0",
  "notes": "Initial CEH v13 syllabus release with 20 modules, Mock Quiz Engine, and Nmap Builder.",
  "pub_date": "2026-09-09T00:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "...",
      "url": "https://downloads.kaybit.edu/cehinteractive/releases/v1.0.0/KayBiT_CEH-Setup-1.0.0.exe"
    },
    "darwin-universal": {
      "signature": "...",
      "url": "https://downloads.kaybit.edu/cehinteractive/releases/v1.0.0/KayBiT_CEH-1.0.0-universal.dmg"
    }
  }
}
```
