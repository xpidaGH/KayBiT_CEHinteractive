import React, { useState } from 'react';
import {
  Package,
  Terminal,
  Code2,
  Copy,
  Check,
  Download,
  FileText,
  Smartphone,
  Monitor,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Layers
} from 'lucide-react';

export const PackagingSuite: React.FC = () => {
  const [selectedSuite, setSelectedSuite] = useState<
    'github_actions' | 'brand_assets' | 'python' | 'node' | 'go' | 'rust' | 'install'
  >('github_actions');
  const [copied, setCopied] = useState(false);

  const scriptsData = {
    github_actions: {
      name: 'GitHub Actions Multi-Platform CI/CD (.github/workflows/build-and-package.yml)',
      filename: 'build-and-package.yml',
      command: 'gh workflow run build-and-package.yml',
      desc: '3-tier virtual runner matrix (macOS, Windows, Ubuntu) with Base64 code-signing, TestFlight, Google Play, and automated changelogs.',
      code: `# Multi-Platform CI/CD Build, Sign & Package
# Matrix: macos-latest (iOS .ipa + macOS Universal .dmg), windows-latest (Tauri .msi + .exe), ubuntu-latest (Android .aab + Linux .AppImage)
# Detailed Documentation: /GitHub_Actions.md
name: Multi-Platform CI/CD Build, Sign & Package

on:
  push:
    branches: [ main, master ]
  release:
    types: [ published ]

jobs:
  build-macos-and-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: apple-actions/import-codesign-certs@v2
        with:
          p12-file-base64: \${{ secrets.APPLE_CERTIFICATE_P12_BASE64 }}
          p12-password: \${{ secrets.APPLE_CERTIFICATE_P12_PASSWORD }}
      - run: npx tauri build --target universal-apple-darwin

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx tauri build

  build-ubuntu-android-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: r0adkll/sign-android-release@v1
        with:
          signingKeyBase64: \${{ secrets.ANDROID_KEYSTORE_BASE64 }}`
    },
    brand_assets: {
      name: 'KBT Brand Logo & App Icon Multiplatform Integration Guide',
      filename: 'kbt-brand-integration.md',
      command: 'npm run tauri icon ./public/assets/kbt-logo.png',
      desc: 'Squircle mask utility, Desktop Title Bar (20px), Mobile App Bar (30px), and Web Header (36px) assets.',
      code: `/* Tailwind CSS Squircle Mask Utility (src/index.css) */
@layer utilities {
  .mask-squircle {
    mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="black" d="M 0,50 C 0,4 4,0 50,0 C 96,0 100,4 100,50 C 100,96 96,100 50,100 C 4,100 0,96 0,50 Z"/></svg>');
    mask-size: 100% 100%;
    mask-repeat: no-repeat;
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="black" d="M 0,50 C 0,4 4,0 50,0 C 96,0 100,4 100,50 C 100,96 96,100 50,100 C 4,100 0,96 0,50 Z"/></svg>');
    -webkit-mask-size: 100% 100%;
    -webkit-mask-repeat: no-repeat;
  }
}

# Multiplatform Asset Sizing Reference:
# 1. Desktop Title Bar (Windows/macOS): 16x16 - 24x24 (.ico / .icns)
# 2. Mobile App Bar (iOS/Android): 28x28 - 32x32 (Adaptive Vectors + Squircle)
# 3. Web Header Bar (Web Browser / PWA): 34x34 - 40x40 (Squircle + Glow)
#
# Generate all platform icons with Tauri CLI:
npm run tauri icon ./public/assets/kbt-logo.png`
    },
    python: {
      name: 'Python Interactive PDF Generator (ReportLab)',
      filename: 'generate_interactive_pdf.py',
      command: 'python3 scripts/generate_interactive_pdf.py',
      desc: 'Builds fillable AcroForm PDFs with text fields, dropdown menus, and reset buttons natively.',
      code: `#!/usr/bin/env python3
# KayBiT_CEHinteractive - ReportLab Interactive PDF Generator
# Generates fillable AcroForms with text fields, dropdown menus, and reset buttons.
# pip install reportlab
# python3 generate_interactive_pdf.py [output.pdf]
import sys
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

def create_interactive_ceh_pdf(output_filename="KayBiT_CEH_Interactive_Template.pdf"):
    c = canvas.Canvas(output_filename, pagesize=letter)
    width, height = letter

    # Header
    c.setFillColor(colors.HexColor("#0d1117"))
    c.rect(0, height - 70, width, 70, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#58a6ff"))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(36, height - 36, "KayBiT CEH v13 Interactive Study Template")

    form = c.acroForm
    # Form Text Field
    form.textfield(name="student_name", x=175, y=height - 105, width=180, height=18)
    # Form Dropdown Choice
    form.choice(name="scenario1_answer", options=["-- Select --", "-sS", "-sT", "-sN", "-sX"], x=36, y=height - 190, width=240, height=20)
    # Form Multiline Notes
    form.textfield(name="notes", x=36, y=height - 390, width=width - 72, height=140, multiline=True)
    # Reset Button
    form.button(name="reset", caption="Reset Practice Sheet", x=width - 170, y=height - 435, width=134, height=24)

    c.save()
    print("[+] Interactive PDF generated:", output_filename)

if __name__ == "__main__":
    create_interactive_ceh_pdf()`
    },
    node: {
      name: 'Node.js / TypeScript Web Container',
      filename: 'package_node.ts',
      command: 'npx tsx scripts/package_node.ts',
      desc: 'Zero-dependency Express container serving the compiled dist bundle with immutable local caching headers.',
      code: `#!/usr/bin/env tsx
import express from 'express';
import path from 'path';

const PORT = 8080;
const app = express();
const distDir = path.resolve(process.cwd(), 'dist');

app.use(express.static(distDir, { maxAge: '1d', immutable: true, index: 'index.html' }));
app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')));

app.listen(PORT, '127.0.0.1', () => {
  console.log(\`KayBiT_CEHinteractive Container running: http://127.0.0.1:\${PORT}\`);
});`
    },
    go: {
      name: 'Go (Golang) Single-Binary Microservice',
      filename: 'main.go',
      command: 'go build -ldflags="-s -w" -o kaybit_ceh scripts/main.go',
      desc: 'Embeds the entire frontend directly into a standalone, portable binary using the standard library //go:embed.',
      code: `package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
)

//go:embed all:dist
var embeddedDist embed.FS

func main() {
	distSub, _ := fs.Sub(embeddedDist, "dist")
	http.Handle("/", http.FileServer(http.FS(distSub)))
	fmt.Println("KayBiT_CEH Go standalone microservice listening on :8080")
	http.ListenAndServe(":8080", nil)
}`
    },
    rust: {
      name: 'Rust Native Desktop Window (Wry / Tao)',
      filename: 'main.rs',
      command: 'cargo build --release',
      desc: 'Ultra-lightweight (<15 MB) desktop window using OS native webview, eliminating Electron memory overhead.',
      code: `use tao::dpi::LogicalSize;
use tao::event_loop::{ControlFlow, EventLoop};
use tao::window::WindowBuilder;
use wry::WebViewBuilder;

fn main() -> wry::Result<()> {
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title("KayBiT_CEHinteractive")
        .with_inner_size(LogicalSize::new(1280.0, 840.0))
        .build(&event_loop)
        .unwrap();

    let _webview = WebViewBuilder::new(&window)
        .with_url("http://localhost:3000")
        .build()?;

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;
    });
}`
    },
    install: {
      name: 'Cross-Platform Native Packaging Guide (INSTALLATION.md)',
      filename: 'INSTALLATION.md',
      command: 'cat INSTALLATION.md',
      desc: 'Step-by-step instructions for Android APK (Capacitor), Windows EXE (Tauri), macOS DMG, and GitHub Actions CI/CD.',
      code: `# Refer to the root INSTALLATION.md and GitHub_Actions.md files
# Key targets:
# 1. Android APK: npx cap add android && cd android && ./gradlew assembleDebug
# 2. Desktop Windows/Mac: npx tauri build
# 3. Web & Offline: PWA Service Worker via Workbox`
    }
  };

  const activeScript = scriptsData[selectedSuite];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeScript.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeScript.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid px-3 py-4">
      {/* Top Header */}
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded bg-info bg-opacity-10 text-info">
              <Package size={20} />
            </div>
            <div>
              <h5 className="mb-0 text-light fw-bold">Cross-Platform Packaging Suites & Automations</h5>
              <small className="text-secondary">
                Portable automation scripts in Python, Node.js, Go, Rust, GitHub Actions CI/CD, and KBT Brand Assets
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Selector Column */}
        <div className="col-12 col-md-4">
          <div className="list-group border border-secondary rounded shadow-sm">
            <button
              className={`list-group-item list-group-item-action border-secondary p-3 ${
                selectedSuite === 'github_actions' ? 'bg-info text-dark fw-bold' : 'bg-dark text-light'
              }`}
              onClick={() => setSelectedSuite('github_actions')}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="d-flex align-items-center gap-1.5">
                  <GitBranch size={16} />
                  <span>GitHub Actions CI/CD</span>
                </span>
                <span className="badge bg-success bg-opacity-40 text-light small">Multi-Platform</span>
              </div>
              <small className={selectedSuite === 'github_actions' ? 'text-dark text-opacity-75' : 'text-secondary'}>
                3-runner matrix, code signing, TestFlight & Play Store
              </small>
            </button>

            <button
              className={`list-group-item list-group-item-action border-secondary p-3 ${
                selectedSuite === 'brand_assets' ? 'bg-info text-dark fw-bold' : 'bg-dark text-light'
              }`}
              onClick={() => setSelectedSuite('brand_assets')}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="d-flex align-items-center gap-1.5">
                  <Layers size={16} />
                  <span>KBT Brand & App Icons</span>
                </span>
                <span className="badge bg-warning bg-opacity-40 text-dark small">Squircle UI</span>
              </div>
              <small className={selectedSuite === 'brand_assets' ? 'text-dark text-opacity-75' : 'text-secondary'}>
                Desktop, Mobile & Web Header logo sizing specs
              </small>
            </button>

            <button
              className={`list-group-item list-group-item-action border-secondary p-3 ${
                selectedSuite === 'python' ? 'bg-info text-dark fw-bold' : 'bg-dark text-light'
              }`}
              onClick={() => setSelectedSuite('python')}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span>Python ReportLab</span>
                <span className="badge bg-secondary bg-opacity-40 text-light small">PDF Script</span>
              </div>
              <small className={selectedSuite === 'python' ? 'text-dark text-opacity-75' : 'text-secondary'}>
                Interactive fillable AcroForm PDF generator
              </small>
            </button>

            <button
              className={`list-group-item list-group-item-action border-secondary p-3 ${
                selectedSuite === 'node' ? 'bg-info text-dark fw-bold' : 'bg-dark text-light'
              }`}
              onClick={() => setSelectedSuite('node')}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span>Node.js / TypeScript</span>
                <span className="badge bg-secondary bg-opacity-40 text-light small">Container</span>
              </div>
              <small className={selectedSuite === 'node' ? 'text-dark text-opacity-75' : 'text-secondary'}>
                Local serverless HTTP container with caching
              </small>
            </button>

            <button
              className={`list-group-item list-group-item-action border-secondary p-3 ${
                selectedSuite === 'go' ? 'bg-info text-dark fw-bold' : 'bg-dark text-light'
              }`}
              onClick={() => setSelectedSuite('go')}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span>Go (Golang)</span>
                <span className="badge bg-secondary bg-opacity-40 text-light small">Microservice</span>
              </div>
              <small className={selectedSuite === 'go' ? 'text-dark text-opacity-75' : 'text-secondary'}>
                Single-binary standalone executable with //go:embed
              </small>
            </button>

            <button
              className={`list-group-item list-group-item-action border-secondary p-3 ${
                selectedSuite === 'rust' ? 'bg-info text-dark fw-bold' : 'bg-dark text-light'
              }`}
              onClick={() => setSelectedSuite('rust')}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span>Rust (Wry / Tao)</span>
                <span className="badge bg-secondary bg-opacity-40 text-light small">Desktop Window</span>
              </div>
              <small className={selectedSuite === 'rust' ? 'text-dark text-opacity-75' : 'text-secondary'}>
                Ultra-fast &lt;15MB native desktop wrapper
              </small>
            </button>

            <button
              className={`list-group-item list-group-item-action border-secondary p-3 ${
                selectedSuite === 'install' ? 'bg-info text-dark fw-bold' : 'bg-dark text-light'
              }`}
              onClick={() => setSelectedSuite('install')}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span>Native Packaging Guide</span>
                <span className="badge bg-secondary bg-opacity-40 text-light small">INSTALLATION.md</span>
              </div>
              <small className={selectedSuite === 'install' ? 'text-dark text-opacity-75' : 'text-secondary'}>
                Android APK, iOS PWA, Windows EXE, and macOS DMG
              </small>
            </button>
          </div>

          {/* Quick Platform Overview Card */}
          <div className="card bg-dark border-secondary p-3 mt-3 shadow-sm">
            <h6 className="text-light fw-bold mb-2">Multi-Platform CI/CD Highlights</h6>
            <ul className="small text-secondary ps-3 mb-0 lh-lg">
              <li><strong>macOS Runner:</strong> Apple codesigning, iOS .ipa & macOS Universal .dmg.</li>
              <li><strong>Windows Runner:</strong> Rust/Tauri WiX .msi & NSIS .exe with Signtool.</li>
              <li><strong>Ubuntu Runner:</strong> Android SDK/NDK .aab & Linux PipeWire .AppImage.</li>
              <li><strong>Zero Secret Leaks:</strong> Base64 decoded in-memory on the fly.</li>
            </ul>
          </div>
        </div>

        {/* Right Code Display Column */}
        <div className="col-12 col-md-8">
          <div className="card bg-dark border-secondary shadow-sm">
            <div className="card-header bg-dark border-secondary p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <span className="badge bg-info text-dark font-monospace me-2">{activeScript.filename}</span>
                <span className="text-light fw-bold">{activeScript.name}</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-info'} d-flex align-items-center gap-1`}
                  onClick={handleCopy}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  onClick={handleDownload}
                  title="Download script file"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="card-body p-0 bg-black font-monospace">
              <pre
                className="p-3 m-0 text-light overflow-x-auto"
                style={{ fontSize: '0.82rem', maxHeight: '420px', lineHeight: '1.5' }}
              >
                <code>{activeScript.code}</code>
              </pre>
            </div>

            <div className="card-footer bg-dark border-secondary p-3">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <span className="small text-secondary d-block">Terminal Execution Command:</span>
                  <code className="text-success small">{activeScript.command}</code>
                </div>
                <small className="text-secondary">{activeScript.desc}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
