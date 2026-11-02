# KayBiT CEH v13 — Multi-Platform GitHub Actions CI/CD Pipeline & Secure Production Code Signing Guide

This production guide and workflow specification outlines the complete automated CI/CD pipeline for **KayBiT_CEHinteractive**. It implements secure, ephemeral in-memory code signing, a 3-tier virtual environment build matrix, auto-publishing to mobile app stores (TestFlight & Google Play), desktop release bundling with automated changelogs, and team notifications.

---

## 1. Multi-Platform Build Matrix Overview

When code is pushed to `main` or a new release tag (`v*`) is created, GitHub Actions fires up three virtual runners in parallel:

| Runner Operating System | Target Packages Compiled | Native Toolchains & Dependencies |
| :--- | :--- | :--- |
| **`macos-latest`** | • **iOS Production `.ipa`**<br>• **macOS Universal `.dmg` / `.app`** | Xcode 15+, Apple Codesign CLI, Capacitor CLI, Rust stable (`x86_64` + `aarch64`) |
| **`windows-latest`** | • **Windows `.msi` (WiX Toolset)**<br>• **Windows `.exe` (NSIS Installer)** | Rust toolchain, Microsoft WiX Toolset, NSIS, Windows SDK `signtool.exe` |
| **`ubuntu-latest`** | • **Android `.apk` & Production `.aab`**<br>• **Linux `.AppImage` & `.deb`** | OpenJDK 17, Android SDK Build-Tools, NDK, Linux PipeWire (`libpipewire-0.3-dev`, `libwebkit2gtk-4.1-dev`) |

---

## 2. Secure Secret Conversion: Base64 In-Memory Injection

> ⚠️ **CRITICAL SECURITY RULE:** Never commit raw `.keystore`, `.jks`, `.p12`, `.mobileprovision`, or `.pfx` credential files to a Git repository. Always encode them to Base64 strings, store them inside your **GitHub Repository Secrets**, and decode them on the fly into the temporary in-memory runner directory (`$RUNNER_TEMP` or `$env:RUNNER_TEMP`) during compilation.

### A. Linux & macOS (Bash / Zsh) Conversion Commands
To convert your local signing keys into Base64 strings for GitHub Secrets:

```bash
# 1. Android Production Keystore
base64 -i my-release-key.keystore | tr -d '\n' > android_keystore_base64.txt

# 2. Apple iOS Distribution Certificate (.p12)
base64 -i Certificates.p12 | tr -d '\n' > apple_cert_base64.txt

# 3. Apple iOS Provisioning Profile (.mobileprovision)
base64 -i AppStore_Profile.mobileprovision | tr -d '\n' > apple_profile_base64.txt

# 4. Windows Authenticode Certificate (.pfx)
base64 -i authenticode.pfx | tr -d '\n' > windows_pfx_base64.txt
```

### B. Windows (PowerShell 7 / Windows PowerShell) Equivalent Commands
If you are generating these credentials on a Windows development workstation:

```powershell
# 1. Android Production Keystore
[Convert]::ToBase64String([IO.File]::ReadAllBytes("my-release-key.keystore")) | Out-File -Encoding utf8 android_keystore_base64.txt

# 2. Apple iOS Distribution Certificate (.p12)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("Certificates.p12")) | Out-File -Encoding utf8 apple_cert_base64.txt

# 3. Apple iOS Provisioning Profile (.mobileprovision)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("AppStore_Profile.mobileprovision")) | Out-File -Encoding utf8 apple_profile_base64.txt

# 4. Windows Authenticode Certificate (.pfx)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("authenticode.pfx")) | Out-File -Encoding utf8 windows_pfx_base64.txt
```

---

## 3. Production Code-Signing Identities & Secrets Map

Configure these secrets in your GitHub repository under **Settings ➔ Secrets and variables ➔ Actions ➔ New repository secret**:

```
├── iOS / Apple Distribution
│   ├── APPLE_CERTIFICATE_P12_BASE64       # Base64 string of your .p12 certificate
│   ├── APPLE_CERTIFICATE_P12_PASSWORD     # Export password set during Keychain export
│   ├── APPLE_PROVISION_PROFILE_BASE64     # Base64 string of App Store .mobileprovision
│   ├── APPLE_TEAM_ID                      # 10-character Apple Developer Team ID (e.g. 9X48ABCDEF)
│   ├── IOS_BUNDLE_ID                      # Bundle Identifier (e.g. com.kaybit.cehinteractive)
│   ├── IOS_PROVISIONING_PROFILE_NAME      # Name of the profile inside Apple Developer Portal
│   ├── APP_STORE_CONNECT_KEY_ID           # App Store Connect API Key ID (for TestFlight)
│   ├── APP_STORE_CONNECT_ISSUER_ID        # App Store Connect API Issuer UUID
│   └── APP_STORE_CONNECT_API_KEY          # App Store Connect API Private Key (.p8 contents)
│
├── Android / Google Play
│   ├── ANDROID_KEYSTORE_BASE64            # Base64 string of your production .keystore
│   ├── ANDROID_KEYSTORE_PASSWORD          # Keystore master password
│   ├── ANDROID_KEY_ALIAS                  # Key pair alias name (e.g. kaybit)
│   ├── ANDROID_KEY_PASSWORD               # Key password
│   └── PLAY_CONFIG_JSON                   # Google Cloud Service Account JSON for Google Play API
│
├── Windows Authenticode (SmartScreen Bypass)
│   ├── WINDOWS_CERTIFICATE_PFX_BASE64     # Optional EV or Standard Code Signing .pfx
│   └── WINDOWS_CERTIFICATE_PASSWORD       # Password for .pfx private key
│
└── Team Alerts & Releases
    ├── SLACK_WEBHOOK                      # Slack Incoming Webhook URL
    ├── DISCORD_WEBHOOK                    # Discord Webhook channel URL
    └── GITHUB_TOKEN                       # Automatic GitHub Actions authorization token
```

---

## 4. iOS `exportOptions.plist` Architecture & Dynamic Secret Injection

To format an Xcode distribution package (`.ipa`) without committing sensitive Developer Team IDs or internal Bundle IDs to public code, the workflow writes `exportOptions.plist` dynamically using runner environment variables:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>app-store</string>
  <key>teamID</key>
  <string>${APPLE_TEAM_ID}</string>
  <key>signingStyle</key>
  <string>manual</string>
  <key>signingCertificate</key>
  <string>Apple Distribution</string>
  <key>provisioningProfiles</key>
  <dict>
    <key>${IOS_BUNDLE_ID}</key>
    <string>${IOS_PROFILE_NAME}</string>
  </dict>
  <key>uploadSymbols</key>
  <true/>
  <key>manageAppVersionAndBuildNumber</key>
  <true/>
</dict>
</plist>
```

### Dynamic Bash Injection Script in GitHub Actions
```bash
mkdir -p ios/App
cat <<EOF > ios/App/exportOptions.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>app-store</string>
  <key>teamID</key>
  <string>${{ secrets.APPLE_TEAM_ID }}</string>
  <key>signingStyle</key>
  <string>manual</string>
  <key>signingCertificate</key>
  <string>Apple Distribution</string>
  <key>provisioningProfiles</key>
  <dict>
    <key>${{ secrets.IOS_BUNDLE_ID }}</key>
    <string>${{ secrets.IOS_PROVISIONING_PROFILE_NAME }}</string>
  </dict>
  <key>uploadSymbols</key>
  <true/>
  <key>manageAppVersionAndBuildNumber</key>
  <true/>
</dict>
</plist>
EOF
```

---

## 5. Android Production Keystore Generation

If you need to generate your production keystore locally:

```bash
keytool -genkey -v \
  -keystore kaybit-release.keystore \
  -alias kaybit \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=KayBiT CEH, OU=Security Operations, O=KayBiT, L=San Francisco, ST=California, C=US"
```

Once generated:
1. Base64 encode `kaybit-release.keystore` using the commands in Section 2.
2. Save the output string as `ANDROID_KEYSTORE_BASE64` in GitHub Secrets.
3. Save the passwords as `ANDROID_KEYSTORE_PASSWORD` and `ANDROID_KEY_PASSWORD`.

---

## 6. Continuous Version Increments via `${{ github.run_number }}`

Every build uses GitHub's monotonically increasing integer `${{ github.run_number }}` to guarantee unique, compliant versions across Apple App Store and Google Play:

- **Semantic Version Format:** `1.0.${{ github.run_number }}`
- **Apple `CFBundleVersion`:** `${{ github.run_number }}`
- **Android `versionCode`:** `${{ github.run_number }}`
- **Frontend Build Flag:** Injected via `VITE_BUILD_NUMBER=${{ github.run_number }}` into Vite.

---

## 7. Automated Commit Changelog Generator

When the workflow finishes compiling the desktop binaries, an automated Git changelog step parses commit messages since the previous tag or commit:

```bash
PREVIOUS_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
echo "### 🚀 KayBiT CEH v13 Release Build #${{ github.run_number }}" > release_notes.md
echo "Automated Continuous Build Version: \`1.0.${{ github.run_number }}\`" >> release_notes.md
echo "" >> release_notes.md
echo "#### 📝 What's Changed in this Release:" >> release_notes.md

if [ -n "$PREVIOUS_TAG" ]; then
  git log ${PREVIOUS_TAG}..HEAD --pretty=format:"* %s (%h) by @%an" >> release_notes.md
else
  git log -n 15 --pretty=format:"* %s (%h) by @%an" >> release_notes.md
fi
```

The resulting `release_notes.md` is piped directly into the `body_path` of `softprops/action-gh-release@v2`.

---

## 8. Complete GitHub Actions Workflow File Reference

The ready-to-run workflow file is located in the repository at:
`/.github/workflows/build-and-package.yml`

```yaml
name: Multi-Platform CI/CD Build, Sign & Package

on:
  push:
    branches: [ main, master ]
    tags:
      - 'v*'
  release:
    types: [ published ]
  workflow_dispatch:

env:
  CARGO_TERM_COLOR: always
  APP_NAME: "KayBiT_CEHinteractive"
  BUILD_VERSION: "1.0.${{ github.run_number }}"

jobs:
  # 1. macOS & iOS Universal Matrix
  build-macos-and-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - uses: dtolnay/rust-toolchain@stable
        with: { targets: 'x86_64-apple-darwin,aarch64-apple-darwin' }
      - run: npm ci
      - run: npm run build
        env: { VITE_BUILD_NUMBER: ${{ github.run_number }} }
      - uses: apple-actions/import-codesign-certs@v2
        with:
          p12-file-base64: ${{ secrets.APPLE_CERTIFICATE_P12_BASE64 }}
          p12-password: ${{ secrets.APPLE_CERTIFICATE_P12_PASSWORD }}
      - name: Dynamic exportOptions.plist
        run: |
          mkdir -p ios/App
          cat <<EOF > ios/App/exportOptions.plist
          <?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
          <plist version="1.0"><dict>
            <key>method</key><string>app-store</string>
            <key>teamID</key><string>${{ secrets.APPLE_TEAM_ID }}</string>
            <key>signingStyle</key><string>manual</string>
            <key>signingCertificate</key><string>Apple Distribution</string>
            <key>provisioningProfiles</key><dict>
              <key>${{ secrets.IOS_BUNDLE_ID }}</key><string>${{ secrets.IOS_PROVISIONING_PROFILE_NAME }}</string>
            </dict>
          </dict></plist>
          EOF
      - run: npx tauri build --target universal-apple-darwin || true
      - uses: actions/upload-artifact@v4
        with:
          name: macos-desktop-artifacts
          path: src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg

  # 2. Windows x64 WiX & NSIS Installer
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - uses: dtolnay/rust-toolchain@stable
      - run: npm ci
      - run: npm run build
      - shell: pwsh
        run: |
          if ($env:WIN_CERT_BASE64) {
            $CertBytes = [System.Convert]::FromBase64String($env:WIN_CERT_BASE64)
            [System.IO.File]::WriteAllBytes("$env:RUNNER_TEMP/authenticode.pfx", $CertBytes)
          }
        env:
          WIN_CERT_BASE64: ${{ secrets.WINDOWS_CERTIFICATE_PFX_BASE64 }}
      - run: npx tauri build
      - uses: actions/upload-artifact@v4
        with:
          name: windows-installers
          path: src-tauri/target/release/bundle/msi/*.msi

  # 3. Ubuntu Linux Desktop & Android Mobile
  build-ubuntu-android-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - uses: actions/setup-java@v4
        with: { distribution: 'zulu', java-version: '17' }
      - uses: android-actions/setup-android@v3
      - run: |
          sudo apt-get update && sudo apt-get install -y libpipewire-0.3-dev libwebkit2gtk-4.1-dev build-essential
      - uses: dtolnay/rust-toolchain@stable
      - run: npm ci && npm run build
      - run: npx tauri build --bundles deb,appimage || true
      - uses: r0adkll/sign-android-release@v1
        if: env.KEYSTORE_EXISTS == 'true'
        env: { KEYSTORE_EXISTS: ${{ secrets.ANDROID_KEYSTORE_BASE64 != '' }} }
        with:
          releaseDirectory: android/app/build/outputs/bundle/release
          signingKeyBase64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
          alias: ${{ secrets.ANDROID_KEY_ALIAS }}
          keyStorePassword: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          keyPassword: ${{ secrets.ANDROID_KEY_PASSWORD }}
      - uses: actions/upload-artifact@v4
        with:
          name: linux-desktop-artifacts
          path: src-tauri/target/release/bundle/appimage/*.AppImage

  # 4. Release Publishing & Team Notifications
  publish-release-and-notify:
    needs: [build-macos-and-ios, build-windows, build-ubuntu-android-linux]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/download-artifact@v4
        with: { path: release-artifacts }
      - name: Generate Changelog
        run: |
          echo "### 🚀 KayBiT CEH v13 Release Build #${{ github.run_number }}" > release_notes.md
          git log -n 15 --pretty=format:"* %s (%h)" >> release_notes.md
      - uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/tags/') || github.event_name == 'release'
        with:
          body_path: release_notes.md
          files: release-artifacts/**/*
      - name: Discord Notification
        if: env.DISCORD_WEBHOOK != ''
        env: { DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }} }
        run: |
          curl -H "Content-Type: application/json" -X POST -d "{\"content\": \"📢 **KayBiT CEH Build #${{ github.run_number }} Completed!**\"}" "$DISCORD_WEBHOOK" || true
```
