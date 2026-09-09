# KayBiT_CEHinteractive

> **All-in-One Cross-Platform Interactive Study Track & Offline Architecture for Certified Ethical Hacker (CEH v13)**
> Designed for advanced programming students (Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart/Flutter, Bash/Shell, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, COBOL/Assembly).

---

## 🌟 Key Features

1. **CEH v13 20-Domain Progress Tracker**:
   - Covers all 20 modules from Footprinting to Cloud Security & CEH v13 AI Vulnerabilities (LLM prompt injection, adversarial ML).
   - Checklists, sub-objectives, attack vectors, common ports, and weighted exam readiness score calculation.
2. **Real-Time Mock Quiz Engine**:
   - Scenario-based questions with instant technical explanations, CVE references, and domain breakdowns.
   - Practice Mode vs Timed Exam Mode.
   - Built-in Custom Question Creator and JSON Question Bank Export/Import.
3. **Interactive Nmap Command Builder**:
   - Visually assemble complex scanning flags: SYN stealth (`-sS`), UDP (`-sU`), timing (`-T0` to `-T5`), packet fragmentation (`-f`), decoys (`-D`), source port spoofing (`-g 53`), NSE scripts (`--script=vuln`).
   - Live syntax breakdown with one-click copy.
4. **21-Language Cyber Security Cheat Sheet**:
   - Ready-to-run offensive and defensive automation snippets in Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart/Flutter, Bash/Shell, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembly, and COBOL.
5. **Interactive Fillable AcroForm PDF Generator**:
   - Programmatic generation in browser via `pdf-lib` creating digital text fields, multiple-choice dropdowns, and form reset buttons.
   - Companion Python script (`scripts/generate_interactive_pdf.py`) using ReportLab.
6. **Standalone Single-File HTML5 Exporter**:
   - Export a self-contained `.html` application file that runs offline from a USB stick on any device without node or server.
7. **Cross-Language Local Packaging Suites**:
   - Automation scripts in Node.js/TypeScript, Go (embedded microservice), Rust (desktop window wrapper), and Python.
8. **Internationalization (i18n)**:
   - Full student User Guide translated into **18 languages**: French, German, Italian, Spanish, Portuguese, Indonesian, Swahili, Turkish, Russian, Chinese, Japanese, Arabic (RTL), Urdu (RTL), Hindi, Marathi, Bengali, Tamil, and Telugu (+ English).
9. **Native Distribution & CI/CD**:
   - Comprehensive `INSTALLATION.md` covering Android APK (Capacitor), Windows `.exe` / macOS `.dmg` (Tauri), and GitHub Actions build pipeline.

---

## 🚀 Quick Start

### Run in Development:
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Build Production Bundle:
```bash
npm run build
```

### Run Embedded Microservice in Go:
```bash
go run scripts/main.go
```

### Run Node.js Local Container:
```bash
npx tsx scripts/package_node.ts
```

### Generate Interactive Fillable PDF via Python:
```bash
python3 scripts/generate_interactive_pdf.py
```

---

## 📜 Documentation
- `USER_GUIDE.md`: Comprehensive student handbook translated into 18+ languages.
- `INSTALLATION.md`: Step-by-step cross-platform packaging guide for Android APK, iOS PWA, Windows EXE, and macOS DMG.
