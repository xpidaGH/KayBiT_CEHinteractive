# KayBiT_CEHinteractive — Comprehensive Student User Guide
**Certified Ethical Hacker (CEH v13) Interactive Self-Study Track & Offline Framework**

---

## 1. System Overview & Offline Architecture
**KayBiT_CEHinteractive** is an all-in-one, serverless, client-side application engineered for advanced programming and cybersecurity students preparing for the EC-Council Certified Ethical Hacker (CEH v13) credential.

Key architecture points:
- **Zero Backend Database**: Operates 100% offline without telemetry, credentials, or remote servers.
- **Serverless Persistence**: All domain checklists, exam readiness ratings, custom mock quiz questions, test history, notes, and Nmap presets are saved directly inside the browser's HTML5 `localStorage` key-value store (`kaybit_ceh_*`).
- **Data Portability**: Easily export and import your entire state as JSON, generate fillable interactive AcroForm PDFs, or download a standalone single-file HTML bundle.

---

## 2. Interactive CEH v13 Domain Progress Tracker
The application structures all 20 modules of the official CEH v13 syllabus:
1. **Module 01: Introduction to Ethical Hacking** (Footprinting, Laws, Frameworks, MITRE ATT&CK)
2. **Module 02: Footprinting & Reconnaissance** (OSINT, WHOIS, DNS Interrogation)
3. **Module 03: Scanning Networks** (Nmap, Hping3, Ping sweeps, Port scanning)
4. **Module 04: Enumeration Techniques** (NetBIOS, SNMP, LDAP, NTP, RPC, SMB)
5. **Module 05: Vulnerability Analysis** (Nessus, OpenVAS, CVSS v3.1/v4.0 scoring)
6. **Module 06: System Hacking** (Privilege Escalation, Pass-the-Hash, Steganography)
7. **Module 07: Malware Threats** (Trojans, Ransomware, Fileless malware, Reverse Engineering)
8. **Module 08: Sniffing** (Wireshark, ARP poisoning, MAC flooding CAM overflow)
9. **Module 09: Social Engineering** (Phishing, Pretexting, SET Toolkit, MFA bypass)
10. **Module 10: Denial-of-Service** (SYN Flood, UDP Amplification, Slowloris, Botnets)
11. **Module 11: Session Hijacking** (TCP Hijacking, JWT manipulation, Cookie theft)
12. **Module 12: Evading IDS, Firewalls, and Honeypots** (Fragmentation, Decoys, Source Port Spoofing)
13. **Module 13: Hacking Web Servers** (WebDAV, Apache/IIS flaws, HTTP Request Smuggling)
14. **Module 14: Hacking Web Applications** (OWASP Top 10, SSRF, IDOR, XSS, CSRF)
15. **Module 15: SQL Injection** (In-Band UNION, Error-based, Blind Time/Boolean, sqlmap)
16. **Module 16: Hacking Wireless Networks** (WPA2/WPA3, 4-Way Handshake, PMKID, Evil Twin)
17. **Module 17: Hacking Mobile Platforms** (Android APK reversing, Frida hooking, iOS jailbreak)
18. **Module 18: IoT and OT Hacking** (MQTT, Modbus, SCADA, Firmware extraction)
19. **Module 19: Cloud Computing Security** (AWS/Azure/GCP, S3 enumeration, IAM escalation)
20. **Module 20: Cryptography & AI in Cyber Security** (Ciphers, PKI, LLM Prompt Injection in CEH v13)

### Using the Tracker:
- Click any domain card to view granular objectives, common ports, attack vectors, and associated tools.
- Toggle the checklist checkboxes as you study.
- Mark your domain status as **Not Started**, **In Progress**, or **Mastered**.
- Watch your weighted exam readiness gauge calculate your realistic passing trajectory.

---

## 3. Real-Time Mock Quiz Engine & Custom Quiz Builder
- **Practice Mode**: Instant feedback with in-depth technical explanations and CWE/CVE references upon answering.
- **Exam Mode**: Simulates real CEH testing conditions with a live timer, flag-for-review toggle, and final score audit.
- **Domain Filtering**: Practice all modules or drill down into weak areas (e.g. only Web Applications or Wireless).
- **Custom Question Creator**: Add custom scenarios, multiple-choice options, correct index, and explanations.
- **JSON Question Bank Export / Import**: Collaborate with study peers by downloading or uploading customized question sets.

---

## 4. Interactive Nmap Command Builder
Construct professional network scanning commands without memorizing complex switches:
- **Scan Types**: `-sS` (SYN stealth), `-sT` (TCP connect), `-sU` (UDP), `-sA` (ACK firewall check), `-sN`, `-sF`, `-sX` (Xmas).
- **Timing & Performance**: `-T0` (Paranoid) to `-T5` (Insane), host timeouts, and packet rates.
- **Firewall & IDS Evasion**: `-f` (fragmentation), `--mtu 24`, `-D RND:5` (Decoys), `-g 53` (source port spoofing), `--data-length 25`.
- **Scripts**: `--script=default`, `vuln`, `auth`, `discovery`.
- **Output**: `-oN`, `-oX`, `-oA` for saving results to pentest logs.
- **Live Explanation**: Hover or inspect the live breakdown table showing the exact role of every argument in the generated command.

---

## 5. Multi-Language Cyber Security Cheat Sheets
Includes dedicated, tested code snippets for **21 programming languages**:
1. **Python**: Multi-threaded socket port scanner & HTTP banner grabber.
2. **JavaScript**: DOM keystroke hook & XSS payload mechanics.
3. **TypeScript**: JWT decoder, expiry checker, and `alg: "none"` vulnerability detection.
4. **Java**: SSL/TLS certificate chain inspection & weak cipher suite auditing.
5. **C# (.NET)**: Windows token impersonation & `SeImpersonatePrivilege` analysis.
6. **Kotlin**: Android exported Intent analyzer & root binary presence verification.
7. **Dart / Flutter**: Strict SSL pinning with SHA-256 SPKI fingerprint verification.
8. **Bash / Shell**: High-speed automated subnet ping sweep & ARP neighbor extraction.
9. **Rust**: Memory-safe asynchronous TCP port scanner using Tokio.
10. **Go (Golang)**: High-concurrency worker pool port scanner using goroutines.
11. **C++**: Windows process module & DLL injection integrity auditor.
12. **C**: RFC 1071 IP checksum calculation for raw packet forging.
13. **PHP**: Side-by-side SQL injection vs Parameterized PDO query defense.
14. **Ruby**: Metasploit Framework auxiliary scanner module skeleton.
15. **PowerShell**: Active Directory Kerberoastable SPN account harvester.
16. **SQL**: UNION-based column enumeration and database schema extraction payloads.
17. **R**: Statistical IQR and Z-score anomaly detection for volumetric DDoS traffic.
18. **Scala**: Functional stream pattern-matcher for web server access log threat auditing.
19. **MATLAB / Octave**: Wireless RF signal FFT spectrogram peak frequency analysis.
20. **Assembly (x86_64)**: Null-byte free `/bin/sh` execve shellcode construction.
21. **COBOL**: Mainframe ledger transaction hash and RACF access permission audit.

---

## 6. Interactive Fillable AcroForm PDF Export
Click **"Export Interactive PDF"** in the top navigation or study sheet:
- Generates a genuine PDF with digital text fields for student notes.
- Dropdown combo-boxes for multiple-choice quiz questions.
- Built-in Reset Button to clear practice sheets directly inside Adobe Acrobat, Chrome PDF viewer, or Foxit Reader.
- Also compatible with the programmatic Python script (`scripts/generate_interactive_pdf.py`).

---

## 7. Standalone Single-File HTML5 App Exporter
Click **"Export Standalone Single-File App"** to bundle the entire application into a single `.html` file:
- Requires no Node.js, npm, or local web server.
- Double-click the saved HTML file to run in Chrome, Firefox, Safari, or Edge directly from a USB stick.
- Preserves all local storage data natively.

---

## 8. Internationalization (i18n)
The in-app User Guide is translated into **18 languages** accessible via the language dropdown in the modal:
- 🇫🇷 French (Français)
- 🇩🇪 German (Deutsch)
- 🇮🇹 Italian (Italiano)
- 🇪🇸 Spanish (Español)
- 🇧🇷 Portuguese (Português)
- 🇮🇩 Indonesian (Bahasa Indonesia)
- 🇰🇪 Swahili (Kiswahili)
- 🇹🇷 Turkish (Türkçe)
- 🇷🇺 Russian (Русский)
- 🇨🇳 Chinese (简体中文)
- 🇯🇵 Japanese (日本語)
- 🇸🇦 Arabic (العربية - with native Right-to-Left formatting)
- 🇵🇰 Urdu (اردو - with native Right-to-Left formatting)
- 🇮🇳 Hindi (हिन्दी)
- 🇮🇳 Marathi (मराठी)
- 🇧🇩 Bengali (বাংলা)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Telugu (తెలుగు)
- 🇺🇸 English (Default)

---

## 9. Packaging & Local Execution
See `INSTALLATION.md` for instructions on packaging KayBiT_CEHinteractive into:
- **Android APK / AAB**: Using Capacitor or Cordova.
- **Desktop Executables (.exe, .msi, .dmg)**: Using lightweight Tauri (Rust) or Electron.
- **PWA (Progressive Web App)**: Installable directly from your mobile or desktop browser via the in-app install button.
- **Embedded Binaries**: Using Go single-binary webserver (`scripts/main.go`) or Rust WebView (`scripts/main.rs`).
