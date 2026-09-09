import { CEHDomain } from '../types';

export const INITIAL_CEH_DOMAINS: CEHDomain[] = [
  {
    id: 1,
    code: 'MOD-01',
    title: 'Introduction to Ethical Hacking & Security Fundamentals',
    weight: 6,
    description: 'Information security fundamentals, CIA triad, defense-in-depth, threat intelligence, hacking phases, cyber kill chain, MITRE ATT&CK, legal frameworks, and compliance standards.',
    objectives: [
      'Understand ethical hacking stages (Recon, Scanning, Gaining Access, Maintaining Access, Clearing Tracks)',
      'Analyze the Cyber Kill Chain and MITRE ATT&CK Enterprise Matrix',
      'Distinguish White Hat, Grey Hat, and Black Hat methodologies',
      'Apply HIPAA, GDPR, PCI-DSS, and DMCA legal constraints'
    ],
    keyTools: ['MITRE ATT&CK Navigator', 'Shodan', 'CISA Cyber Essentials'],
    commonPorts: ['Port 443 (HTTPS)', 'Port 80 (HTTP)', 'Port 22 (SSH)'],
    attackVectors: ['Threat modeling', 'Compliance bypass', 'Supply chain compromise'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c1-1', label: 'Master the 5 Phases of Ethical Hacking', completed: false },
      { id: 'c1-2', label: 'Map tactics across MITRE ATT&CK framework', completed: false },
      { id: 'c1-3', label: 'Review Vulnerability vs Threat vs Risk calculation', completed: false },
      { id: 'c1-4', label: 'Memorize PCI-DSS & GDPR penalties for security breaches', completed: false }
    ]
  },
  {
    id: 2,
    code: 'MOD-02',
    title: 'Footprinting and Reconnaissance (OSINT)',
    weight: 7,
    description: 'Passive and active reconnaissance methods, Open Source Intelligence (OSINT), WHOIS lookups, DNS interrogation, search engine dorking, and automated enumeration tools.',
    objectives: [
      'Deploy Google Dorking operators (filetype, site, inurl, intitle, cache)',
      'Perform deep WHOIS and ASN range reconnaissance',
      'Execute DNS zone transfers using Dig and nslookup',
      'Harvest employee metadata and organizational charts via LinkedIn and OSINT tools'
    ],
    keyTools: ['Maltego', 'Recon-ng', 'theHarvester', 'Shodan', 'Censys', 'SpiderFoot'],
    commonPorts: ['Port 53 (DNS UDP/TCP)', 'Port 43 (WHOIS)'],
    attackVectors: ['DNS Zone Transfer (AXFR)', 'Metadata leakage via PDF/DOCX', 'Public Git repo secrets'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c2-1', label: 'Execute AXFR zone transfer via host/dig command', completed: false },
      { id: 'c2-2', label: 'Configure theHarvester API keys for OSINT enumeration', completed: false },
      { id: 'c2-3', label: 'Practice Maltego transforms on target domains', completed: false },
      { id: 'c2-4', label: 'Audit public code repositories for leaked API secrets', completed: false }
    ]
  },
  {
    id: 3,
    code: 'MOD-03',
    title: 'Scanning Networks & Target Discovery',
    weight: 8,
    description: 'Port scanning architectures, TCP flags, network sweep techniques, OS fingerprinting, vulnerability scanning, and IDS/Firewall evasive packet forging.',
    objectives: [
      'Compare TCP SYN (-sS), Full Connect (-sT), FIN (-sF), Xmas (-sX), and Null (-sN) scans',
      'Craft custom packets with hping3 for firewall testing and ICMP analysis',
      'Identify OS signatures via TTL and TCP window size evaluation',
      'Configure UDP port scans and handle ICMP port unreachable responses'
    ],
    keyTools: ['Nmap', 'Hping3', 'Masscan', 'ZMap', 'Wireshark', 'Netcat'],
    commonPorts: ['All 65535 TCP/UDP ports', 'ICMP Echo/Reply'],
    attackVectors: ['SYN Stealth Scan', 'Idle/Zombie Scan (-sI)', 'Fragmented Scans (-f)'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c3-1', label: 'Memorize TCP 3-way handshake flag combinations', completed: false },
      { id: 'c3-2', label: 'Differentiate TCP Xmas (FIN, PSH, URG) from Null scan', completed: false },
      { id: 'c3-3', label: 'Run hping3 SYN flood and packet fragmentation tests', completed: false },
      { id: 'c3-4', label: 'Configure Nmap timing templates (-T0 Paranoid to -T5 Insane)', completed: false }
    ]
  },
  {
    id: 4,
    code: 'MOD-04',
    title: 'Enumeration Techniques (NetBIOS, SNMP, LDAP, RPC)',
    weight: 6,
    description: 'Active extraction of usernames, machine names, network resources, shares, routing tables, and service settings over standardized protocols.',
    objectives: [
      'Enumerate SMB shares and IPC$ null sessions on port 445',
      'Extract MIB trees and community strings (public/private) using SNMPwalk',
      'Query Active Directory structures using LDAP and RPCclient',
      'Enumerate SMTP users using VRFY, EXPN, and RCPT TO commands'
    ],
    keyTools: ['enum4linux-ng', 'snmpwalk', 'rpcclient', 'nbtstat', 'ldapsearch'],
    commonPorts: ['Port 135 (RPC)', 'Port 137-139 (NetBIOS)', 'Port 445 (SMB)', 'Port 161/162 (SNMP)', 'Port 389/636 (LDAP)'],
    attackVectors: ['SMB Null Session', 'Default SNMP Community Strings', 'SMTP User Enumeration'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c4-1', label: 'Execute enum4linux to harvest domain users & password policies', completed: false },
      { id: 'c4-2', label: 'Walk SNMP MIB tree on port 161 for system uptime and interfaces', completed: false },
      { id: 'c4-3', label: 'Inspect LDAP directory tree via anonymous binding', completed: false }
    ]
  },
  {
    id: 5,
    code: 'MOD-05',
    title: 'Vulnerability Analysis & Management',
    weight: 5,
    description: 'Vulnerability assessment lifecycle, CVE/NVD databases, CVSS v3.1/v4.0 scoring calculation metrics, and enterprise vulnerability scanners.',
    objectives: [
      'Calculate CVSS Base, Temporal, and Environmental metrics',
      'Differentiate authenticated vs unauthenticated vulnerability scans',
      'Correlate Nessus and OpenVAS reports with CVE databases',
      'Prioritize patching based on Exploit Prediction Scoring System (EPSS)'
    ],
    keyTools: ['Nessus', 'OpenVAS/Greenbone', 'Qualys', 'VulnDB', 'NVD'],
    commonPorts: ['Port 8834 (Nessus Web UI)', 'Port 9392 (OpenVAS)'],
    attackVectors: ['Unpatched remote code execution', 'Misconfiguration exploits', 'Outdated TLS/SSL'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c5-1', label: 'Calculate a CVSS 3.1 score for an RCE vulnerability', completed: false },
      { id: 'c5-2', label: 'Conduct an authenticated vs unauthenticated Nessus scan', completed: false },
      { id: 'c5-3', label: 'Map discovered vulnerabilities to MITRE CVE IDs', completed: false }
    ]
  },
  {
    id: 6,
    code: 'MOD-06',
    title: 'System Hacking & Post-Exploitation',
    weight: 10,
    description: 'Gaining access, password cracking, privilege escalation (Windows Token manipulation, Linux SUID binaries), steganography, and clearing logs.',
    objectives: [
      'Crack password hashes (NTLM, SHA-512, bcrypt) using Hashcat and John the Ripper',
      'Exploit Linux SUID binaries and sudoers misconfigurations',
      'Perform Windows privilege escalation using Potato exploits (Juicy/PrintPotato)',
      'Embed payload secrets via steganography (Steghide) and alternate data streams (ADS)'
    ],
    keyTools: ['Metasploit', 'Hashcat', 'John the Ripper', 'Mimikatz', 'LinPEAS', 'WinPEAS'],
    commonPorts: ['Port 4444 (Default Metasploit payload listener)'],
    attackVectors: ['Pass-the-Hash', 'Kernel Exploits', 'DLL Hijacking', 'Alternate Data Streams'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c6-1', label: 'Execute Hashcat rule-based dictionary attack against NTLM hashes', completed: false },
      { id: 'c6-2', label: 'Run LinPEAS to find vulnerable SUID/GUID binaries', completed: false },
      { id: 'c6-3', label: 'Extract plaintext credentials from LSASS memory using Mimikatz', completed: false },
      { id: 'c6-4', label: 'Clear audit logs in Windows (wevtutil) and Linux (/var/log/auth.log)', completed: false }
    ]
  },
  {
    id: 7,
    code: 'MOD-07',
    title: 'Malware Threats & Reverse Engineering Basics',
    weight: 6,
    description: 'Trojan classification, ransomware mechanisms, worms, rootkits, fileless malware, polymorphic viruses, and static/dynamic malware analysis in sandboxes.',
    objectives: [
      'Differentiate Crypters, Packers, Droppers, and Exploit Kits',
      'Analyze malware behavior using Process Hacker, RegShot, and Wireshark',
      'Calculate cryptographic hashes (MD5, SHA-256) for VirusTotal threat intelligence',
      'Examine ransomware encryption schemes and backup destruction tactics'
    ],
    keyTools: ['Ghidra', 'x64dbg', 'Process Hacker', 'PEview', 'VirusTotal', 'Procmon'],
    commonPorts: ['Arbitrary dynamic ports, Port 8080/443 for C2 beaconing'],
    attackVectors: ['Macro payloads', 'Living off the Land Binaries (LOLBins)', 'Ghost DLL injection'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c7-1', label: 'Identify packed executables with PEiD / Detect It Easy', completed: false },
      { id: 'c7-2', label: 'Monitor file/registry mutations before and after malware execution', completed: false },
      { id: 'c7-3', label: 'Trace C2 callback beacons inside Wireshark network streams', completed: false }
    ]
  },
  {
    id: 8,
    code: 'MOD-08',
    title: 'Sniffing & Traffic Interception',
    weight: 5,
    description: 'Passive eavesdropping, ARP cache poisoning, MAC flooding (switch CAM table exhaustion), DHCP starvation, rogue DHCP servers, and DNS spoofing.',
    objectives: [
      'Execute ARP spoofing to insert attacker machine as Man-in-the-Middle (MitM)',
      'Flood switch CAM tables with macof to force hub failover behavior',
      'Capture and reconstruct unencrypted HTTP, FTP, and Telnet sessions',
      'Deploy DNS spoofing using Bettercap or Ettercap'
    ],
    keyTools: ['Wireshark', 'Ettercap', 'Bettercap', 'Tcpdump', 'dsniff', 'macof'],
    commonPorts: ['Port 67/68 (DHCP)', 'Port 53 (DNS)', 'Port 21 (FTP)', 'Port 23 (Telnet)'],
    attackVectors: ['ARP Poisoning', 'CAM Overflow', 'DHCP Starvation', 'SSL Stripping'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c8-1', label: 'Perform ARP poisoning with arpspoof between gateway and victim', completed: false },
      { id: 'c8-2', label: 'Capture plaintext credentials via Wireshark display filters', completed: false },
      { id: 'c8-3', label: 'Analyze gratuitous ARP requests for spoofing detection', completed: false }
    ]
  },
  {
    id: 9,
    code: 'MOD-09',
    title: 'Social Engineering & Psychological Manipulation',
    weight: 5,
    description: 'Human-based and computer-based social engineering, phishing, spear phishing, whaling, vishing, smishing, credential harvesting, and baiting attacks.',
    objectives: [
      'Deploy credential harvester clones using Social-Engineer Toolkit (SET)',
      'Differentiate spear phishing, whaling, watering hole, and pretexting attacks',
      'Identify shoulder surfing, dumpster diving, and tailgating defenses',
      'Implement multi-factor authentication (FIDO2) defenses against phishing'
    ],
    keyTools: ['Social-Engineer Toolkit (SET)', 'GoPhish', 'Evilginx2 (Reverse Proxy 2FA bypass)'],
    commonPorts: ['Port 80/443 (Web clones)', 'Port 25 (SMTP spoofing)'],
    attackVectors: ['Domain typosquatting', 'Reverse proxy credential intercept', 'Urgency pretexting'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c9-1', label: 'Configure GoPhish mock training campaign with landing page', completed: false },
      { id: 'c9-2', label: 'Analyze SPF, DKIM, and DMARC headers for email authentication', completed: false },
      { id: 'c9-3', label: 'Understand Evilginx session cookie hijacking against MFA', completed: false }
    ]
  },
  {
    id: 10,
    code: 'MOD-10',
    title: 'Denial-of-Service (DoS & DDoS) & Amplification',
    weight: 5,
    description: 'Volumetric, protocol, and application-layer DoS attacks, SYN floods, UDP amplification (NTP, DNS, SSDP), botnets, and cloud scrubbers.',
    objectives: [
      'Explain SYN flood mechanics and TCP embryonic connection queues',
      'Calculate bandwidth amplification factors in NTP monlist and DNS ANY queries',
      'Analyze low-and-slow application DoS (Slowloris, Slow POST)',
      'Configure SYN cookies, rate limiting, and Cloudflare/AWS Shield defenses'
    ],
    keyTools: ['Hping3', 'Slowloris', 'LOIC/HOIC', 'GoldenEye', 'Wireshark'],
    commonPorts: ['Port 123 (NTP monlist)', 'Port 53 (DNS ANY)', 'Port 1900 (SSDP)'],
    attackVectors: ['Reflected Amplification', 'Smurf Attack', 'TCP SYN Flood', 'Slowloris'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c10-1', label: 'Simulate SYN flood using hping3 -S -p 80 --flood --rand-source', completed: false },
      { id: 'c10-2', label: 'Inspect incomplete HTTP headers generated by Slowloris', completed: false },
      { id: 'c10-3', label: 'Enable TCP SYN cookies on Linux kernel sysctl config', completed: false }
    ]
  },
  {
    id: 11,
    code: 'MOD-11',
    title: 'Session Hijacking & Token Manipulation',
    weight: 5,
    description: 'Network-level session hijacking (TCP sequence guessing) and application-level hijacking (cookie stealing, session fixation, JWT tampering, CRIME/BREACH).',
    objectives: [
      'Predict TCP sequence numbers to inject packets into active sessions',
      'Steal session cookies via XSS and Cross-Site Request Forgery (CSRF)',
      'Analyze JWT vulnerabilities (alg: "none", weak HMAC secret cracking)',
      'Implement Secure, HttpOnly, and SameSite cookie attributes'
    ],
    keyTools: ['Burp Suite', 'OWASP ZAP', 'jwt_tool', 'Wireshark'],
    commonPorts: ['Port 443 (HTTPS)', 'Port 80 (HTTP)'],
    attackVectors: ['Session Fixation', 'JWT "none" algorithm exploit', 'TCP RST injection'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c11-1', label: 'Modify JWT signature algorithm to none using jwt_tool', completed: false },
      { id: 'c11-2', label: 'Inspect session cookie flags (HttpOnly, Secure, SameSite=Strict)', completed: false },
      { id: 'c11-3', label: 'Replay captured session token in Burp Repeater', completed: false }
    ]
  },
  {
    id: 12,
    code: 'MOD-12',
    title: 'Evading IDS, Firewalls, and Honeypots',
    weight: 5,
    description: 'Intrusion Detection System (Snort/Suricata) evasion, packet fragmentation, decoys, source routing, proxy chains, and honeypot detection techniques.',
    objectives: [
      'Bypass signature rules via packet fragmentation (-f, --mtu)',
      'Obfuscate scanner source IP using Nmap decoy flags (-D RND:10)',
      'Identify Honeyd and Kippo honeypots via latency and response inconsistencies',
      'Route malicious traffic through multi-hop Tor and SOCKS5 ProxyChains'
    ],
    keyTools: ['Proxychains', 'Tor', 'Nmap', 'Fragroute', 'Snort'],
    commonPorts: ['Port 9050 (Tor SOCKS5)', 'Port 1080 (SOCKS)'],
    attackVectors: ['IP Fragmentation', 'Decoy Scans', 'Source Port Spoofing (-g 53)'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c12-1', label: 'Test Nmap evasion flags (-f, -g 53, --data-length 25)', completed: false },
      { id: 'c12-2', label: 'Configure Proxychains with multiple upstream SOCKS5 nodes', completed: false },
      { id: 'c12-3', label: 'Write a custom Snort rule to detect FIN/PSH/URG Xmas scans', completed: false }
    ]
  },
  {
    id: 13,
    code: 'MOD-13',
    title: 'Hacking Web Servers & Directory Architectures',
    weight: 5,
    description: 'Web server architecture flaws, Apache/Nginx/IIS vulnerabilities, directory traversal, WebDAV exploitation, HTTP response splitting, and unpatched modules.',
    objectives: [
      'Exploit misconfigured WebDAV permissions (PUT /payload.asp)',
      'Discover unlinked web endpoints using Dirsearch and Gobuster',
      'Execute directory traversal attacks (../../../../etc/passwd)',
      'Harden web servers by disabling weak HTTP methods (TRACE, OPTIONS, PUT)'
    ],
    keyTools: ['Nikto', 'Gobuster', 'Dirsearch', 'Davtest', 'Cadaver'],
    commonPorts: ['Port 80 (HTTP)', 'Port 443 (HTTPS)', 'Port 8080 (Web proxy/alternate)'],
    attackVectors: ['WebDAV Arbitrary File Upload', 'Path Traversal', 'HTTP Request Smuggling'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c13-1', label: 'Run Nikto scanner against web server to detect outdated modules', completed: false },
      { id: 'c13-2', label: 'Brute-force hidden directories with Gobuster using common wordlists', completed: false },
      { id: 'c13-3', label: 'Upload test webshell via WebDAV cadaver CLI', completed: false }
    ]
  },
  {
    id: 14,
    code: 'MOD-14',
    title: 'Hacking Web Applications (OWASP Top 10)',
    weight: 7,
    description: 'Cross-Site Scripting (Reflected, Stored, DOM), Server-Side Request Forgery (SSRF), Insecure Direct Object References (IDOR), CSRF, and XML External Entity (XXE).',
    objectives: [
      'Craft reflected and stored XSS payloads bypassing standard WAF regex filters',
      'Exploit Server-Side Request Forgery (SSRF) against cloud metadata services (169.254.169.254)',
      'Identify Broken Access Control and IDOR in REST API parameters',
      'Inject malicious XML External Entities (XXE) to read local server files'
    ],
    keyTools: ['Burp Suite Professional', 'OWASP ZAP', 'Postman', 'Wfuzz'],
    commonPorts: ['Port 80, 443, 8443'],
    attackVectors: ['Stored XSS', 'SSRF to AWS IMDSv1', 'IDOR object manipulation', 'File Inclusion (LFI/RFI)'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c14-1', label: 'Exploit SSRF to retrieve AWS IMDS credentials (169.254.169.254)', completed: false },
      { id: 'c14-2', label: 'Inject XSS polyglot payload inside form inputs', completed: false },
      { id: 'c14-3', label: 'Test IDOR by incrementing user_id in REST API authorization headers', completed: false }
    ]
  },
  {
    id: 15,
    code: 'MOD-15',
    title: 'SQL Injection (SQLi) & Database Exploitation',
    weight: 6,
    description: 'SQL injection classifications (In-band UNION, Error-based, Blind Boolean-based, Blind Time-based, Out-of-band), database enumeration, and automated exploitation via sqlmap.',
    objectives: [
      'Extract database schema, tables, and columns via UNION SELECT injection',
      'Exfiltrate data character-by-character using substring sleep/time-delay payloads',
      'Execute operating system commands via MSSQL xp_cmdshell',
      'Remediate SQLi using parameterized prepared statements and ORM boundaries'
    ],
    keyTools: ['sqlmap', 'Burp Suite', 'Ghauri', 'DBeaver'],
    commonPorts: ['Port 1433 (MSSQL)', 'Port 1521 (Oracle)', 'Port 3306 (MySQL)', 'Port 5432 (PostgreSQL)'],
    attackVectors: ['UNION-Based Injection', 'Time-based Blind Injection', 'Second-Order SQLi'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c15-1', label: 'Determine column count with ORDER BY 1, 2, 3...', completed: false },
      { id: 'c15-2', label: 'Extract database banner via UNION SELECT NULL, @@version--', completed: false },
      { id: 'c15-3', label: 'Automate table dump using sqlmap -u target --dump --batch', completed: false },
      { id: 'c15-4', label: 'Understand parameterized queries preventing injection at bytecode level', completed: false }
    ]
  },
  {
    id: 16,
    code: 'MOD-16',
    title: 'Hacking Wireless Networks (Wi-Fi & Bluetooth)',
    weight: 5,
    description: '802.11 Wi-Fi security standards, WEP, WPA2-PSK 4-way handshake capture, WPA3 SAE Dragonfly handshake, KRACK, rogue access points (Evil Twin), and Bluetooth bluebugging.',
    objectives: [
      'Capture 4-way WPA/WPA2 handshake via deauthentication frames',
      'Crack WPA2 handshakes using Aircrack-ng and Hashcat (mode 22000)',
      'Deploy an Evil Twin rogue AP with captive portal credential interceptor',
      'Audit Bluetooth vulnerabilities: Bluejacking, Bluesnarfing, and Bluebugging'
    ],
    keyTools: ['Aircrack-ng suite', 'Kismet', 'Wifite', 'Airgeddon', 'Bettercap'],
    commonPorts: ['Wireless 2.4 GHz / 5 GHz / 6 GHz IEEE 802.11 channels'],
    attackVectors: ['Deauthentication Attack', 'Evil Twin AP', 'PMKID Hash Extraction', 'WPS PIN Brute-force'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c16-1', label: 'Put wireless card in monitor mode using airmon-ng start wlan0', completed: false },
      { id: 'c16-2', label: 'Send targeted deauth frames with aireplay-ng -0 5 -a BSSID', completed: false },
      { id: 'c16-3', label: 'Extract and crack PMKID hash without waiting for active clients', completed: false }
    ]
  },
  {
    id: 17,
    code: 'MOD-17',
    title: 'Hacking Mobile Platforms (Android & iOS)',
    weight: 4,
    description: 'Mobile attack vectors, Android APK reverse engineering, intent sniffing, root detection bypass, iOS jailbreaking, runtime manipulation using Frida, and MDM solutions.',
    objectives: [
      'Decompile Android APK using JADX and apktool to inspect manifest and secrets',
      'Bypass SSL pinning and root detection on mobile apps using Frida hooks',
      'Analyze mobile data storage (SQLite databases, SharedPreferences)',
      'Examine iOS app security boundaries and binary entitlements'
    ],
    keyTools: ['Frida', 'MobSF (Mobile Security Framework)', 'JADX-GUI', 'Apktool', 'Objection'],
    commonPorts: ['Port 5555 (ADB over TCP)'],
    attackVectors: ['Exported Android Activity/Receiver exploit', 'Hardcoded API secrets in strings.xml', 'SSL Pinning Bypass'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c17-1', label: 'Decompile APK with JADX and search for API keys and endpoint URLs', completed: false },
      { id: 'c17-2', label: 'Hook SSL pinning certificate validator using Frida script', completed: false },
      { id: 'c17-3', label: 'Inspect Android app SQLite database for unencrypted PII', completed: false }
    ]
  },
  {
    id: 18,
    code: 'MOD-18',
    title: 'IoT and OT (Operational Technology / SCADA) Hacking',
    weight: 4,
    description: 'Internet of Things (IoT) architectures, MQTT/CoAP protocols, hardware hacking (UART, JTAG), firmware extraction, SCADA, ICS protocols (Modbus, DNP3), and Stuxnet mechanics.',
    objectives: [
      'Extract and unpack IoT device firmware using Binwalk',
      'Sniff and inject unauthorized messages on unauthenticated MQTT brokers (port 1883)',
      'Analyze ICS/SCADA Modbus protocol function codes on port 502',
      'Identify hardware debugging interfaces (UART serial pinouts) on circuit boards'
    ],
    keyTools: ['Binwalk', 'QEMU (Firmware emulation)', 'MQTT-Spy', 'Wireshark', 'Firmwalker'],
    commonPorts: ['Port 1883/8883 (MQTT)', 'Port 502 (Modbus TCP)', 'Port 20000 (DNP3)'],
    attackVectors: ['Firmware Hardcoded Credentials', 'Unauthenticated MQTT Publish', 'Modbus Command Injection'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c18-1', label: 'Extract filesystem from firmware binary with binwalk -e firmware.bin', completed: false },
      { id: 'c18-2', label: 'Subscribe to wildcard MQTT topic (#) on target broker port 1883', completed: false },
      { id: 'c18-3', label: 'Review Modbus TCP packet structure and function codes (Read Coils)', completed: false }
    ]
  },
  {
    id: 19,
    code: 'MOD-19',
    title: 'Cloud Computing Security (AWS, Azure, GCP)',
    weight: 5,
    description: 'Cloud architecture threats, AWS IAM privilege escalation, publicly readable S3 buckets, Azure AD/Entra ID misconfigurations, metadata SSRF, and container breakout (Docker/K8s).',
    objectives: [
      'Enumerate open AWS S3 storage buckets using CloudEnum and Pacu',
      'Escalate IAM privileges via misconfigured iam:PassRole and PutUserPolicy',
      'Exploit Kubernetes API without authentication (port 10250 Kubelet)',
      'Escape Docker containers mounted with dangerous host sockets (/var/run/docker.sock)'
    ],
    keyTools: ['Pacu', 'ScoutSuite', 'CloudEnum', 'TruffleHog', 'Peirates'],
    commonPorts: ['Port 10250 (Kubelet API)', 'Port 2375 (Docker daemon unencrypted)'],
    attackVectors: ['Open Cloud Storage Buckets', 'IAM Privilege Escalation', 'Docker Socket Breakout', 'Metadata Exfiltration'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c19-1', label: 'Scan public domain for open S3 buckets and Azure blobs with CloudEnum', completed: false },
      { id: 'c19-2', label: 'Simulate AWS IAM privilege escalation with Pacu modules', completed: false },
      { id: 'c19-3', label: 'Analyze container escape vectors via privileged flag and mounted root', completed: false }
    ]
  },
  {
    id: 20,
    code: 'MOD-20',
    title: 'Cryptography & AI in Cyber Security (CEH v13 Updates)',
    weight: 6,
    description: 'Symmetric vs asymmetric ciphers, hashing, PKI, Heartbleed, quantum computing threats, and CEH v13 special focus: Adversarial AI, LLM prompt injection, and ML model poisoning.',
    objectives: [
      'Compare AES-256-GCM, RSA, ECC, and Diffie-Hellman cryptographic strengths',
      'Analyze SSL/TLS vulnerabilities (Heartbleed, POODLE, BEAST)',
      'Execute Prompt Injection and Jailbreaking against enterprise LLM interfaces (CEH v13)',
      'Mitigate data poisoning and adversarial model inversion in machine learning pipelines'
    ],
    keyTools: ['OpenSSL', 'CyberChef', 'Hashcat', 'Garak (LLM Vulnerability Scanner)', 'Bimi'],
    commonPorts: ['Port 443 (HTTPS/TLS)', 'Port 8443'],
    attackVectors: ['Direct Prompt Injection (LLM)', 'Ransomware Cryptographic Flaws', 'Insecure Random Number Generation'],
    status: 'not_started',
    userNotes: '',
    checklist: [
      { id: 'c20-1', label: 'Generate RSA keypair and self-signed certificate using OpenSSL CLI', completed: false },
      { id: 'c20-2', label: 'Decode multi-stage XOR and Base64 encoded payload in CyberChef', completed: false },
      { id: 'c20-3', label: 'Audit an LLM assistant against indirect prompt injection (OWASP LLM 01)', completed: false }
    ]
  }
];
