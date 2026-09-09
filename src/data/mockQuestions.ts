import { QuizQuestion } from '../types';

export const INITIAL_MOCK_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-01',
    domainId: 3,
    domainName: 'Scanning Networks',
    question: 'A security analyst performs an Nmap scan with the command `nmap -sS -p 80 192.168.1.50`. The scanner transmits a SYN packet and receives a response containing SYN+ACK flags. What does the scanner transmit back, and what is the resulting port state?',
    options: [
      'The scanner transmits an ACK packet and marks the port as FILTERED',
      'The scanner transmits an RST packet and marks the port as OPEN',
      'The scanner transmits a FIN packet and marks the port as CLOSED',
      'The scanner transmits a SYN+ACK packet and marks the port as OPEN'
    ],
    correctIndex: 1,
    explanation: 'In an Nmap SYN Stealth Scan (-sS), also known as a half-open scan, the scanner sends a SYN. When the target responds with SYN+ACK (indicating the port is listening), the scanner immediately responds with an RST (Reset) packet to tear down the connection before the 3-way handshake finishes. This prevents the application layer from logging a full TCP connection.',
    difficulty: 'Fundamentals',
    cveOrTool: 'Nmap -sS'
  },
  {
    id: 'q-02',
    domainId: 15,
    domainName: 'SQL Injection',
    question: 'During a web application penetration test, an ethical hacker inputs `\' OR 1=1--` into a login username parameter. The database executes the query without error and logs the user in as administrator. What type of vulnerability is this, and what is the primary structural defense?',
    options: [
      'Second-Order SQLi; mitigate by blacklisting single quotes in client-side JavaScript',
      'In-band SQL Injection; mitigate by deploying parameterized queries / prepared statements',
      'Blind Time-based SQLi; mitigate by implementing Web Application Firewall (WAF) regexes only',
      'Out-of-band SQLi; mitigate by restricting DNS egress ports from the database'
    ],
    correctIndex: 1,
    explanation: 'This is a classic In-band SQL Injection where user input alters the SQL command syntax. The definitive defense is using parameterized queries (Prepared Statements), which treat user input strictly as literal data variables rather than executable SQL bytecode.',
    difficulty: 'Fundamentals',
    cveOrTool: 'CWE-89 SQL Injection'
  },
  {
    id: 'q-03',
    domainId: 12,
    domainName: 'Evading IDS, Firewalls, and Honeypots',
    question: 'An ethical hacker suspects an IDS is blocking port scan probes based on standard packet size signatures. Which Nmap switch allows the tester to append random payload bytes to packets to evade fixed-length signature detection?',
    options: [
      '--source-port 53',
      '--data-length <number>',
      '-D RND:10',
      '--scan-delay 50ms'
    ],
    correctIndex: 1,
    explanation: 'The `--data-length <number>` option in Nmap appends random bytes to packets so they are not empty (which is typical for default port scan probes). This alters packet size signatures used by intrusion detection systems (IDS) and anomaly detectors.',
    difficulty: 'Intermediate',
    cveOrTool: 'Nmap Evasion'
  },
  {
    id: 'q-04',
    domainId: 6,
    domainName: 'System Hacking',
    question: 'On a Linux target during post-exploitation, a pentester runs `find / -perm -4000 2>/dev/null`. What is the specific objective of this command?',
    options: [
      'Locate world-writable files in the root filesystem for credential theft',
      'Locate executables configured with the SUID (Set User ID) permission bit for privilege escalation',
      'Locate files modified within the last 4000 minutes to uncover administrator activity',
      'Locate hidden directories created by root containing SSH private keys'
    ],
    correctIndex: 1,
    explanation: 'The permission octal `-4000` corresponds to the SUID (SetUID) bit. SUID binaries execute with the permissions of the file owner (often root) rather than the executing user. If vulnerable or misconfigured (e.g. vulnerable GTFOBins), they can be leveraged for root privilege escalation.',
    difficulty: 'Intermediate',
    cveOrTool: 'Linux SUID Enumeration'
  },
  {
    id: 'q-05',
    domainId: 8,
    domainName: 'Sniffing',
    question: 'An attacker on a switched local area network sends thousands of forged Ethernet frames with random source MAC addresses directly to the switch port. What attack is taking place and what is the outcome if successful?',
    options: [
      'ARP Cache Poisoning; victim machines redirect their gateway traffic to the attacker',
      'MAC Flooding (CAM Table Exhaustion); the switch fails open into hub mode, broadcasting all traffic to all ports',
      'DHCP Starvation; the attacker exhausts the IP pool and deploys a rogue DNS server',
      'VLAN Hopping via Double Tagging; attacker accesses isolated DMZ segments directly'
    ],
    correctIndex: 1,
    explanation: 'MAC Flooding (using tools like `macof`) exhausts the switch\'s Content Addressable Memory (CAM) table. Once full, the switch cannot map MAC addresses to physical ports, so it fails open into "fail-secure" or hub mode, broadcasting packets out of all ports and enabling passive packet sniffing.',
    difficulty: 'Intermediate',
    cveOrTool: 'macof / CAM Exhaustion'
  },
  {
    id: 'q-06',
    domainId: 14,
    domainName: 'Hacking Web Applications',
    question: 'While testing a cloud-hosted web application, a security engineer discovers that an image preview feature takes an arbitrary URL from user input: `https://example.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/`. What attack is being conducted?',
    options: [
      'Cross-Site Scripting (XSS)',
      'Server-Side Request Forgery (SSRF)',
      'Insecure Direct Object Reference (IDOR)',
      'Cross-Site Request Forgery (CSRF)'
    ],
    correctIndex: 1,
    explanation: 'This is Server-Side Request Forgery (SSRF). The web server is coerced into making HTTP requests to internal/link-local network resources (such as the AWS/Azure Instance Metadata Service at 169.254.169.254), exposing sensitive IAM roles and temporary security tokens.',
    difficulty: 'Advanced Scenario',
    cveOrTool: 'CWE-918 SSRF'
  },
  {
    id: 'q-07',
    domainId: 2,
    domainName: 'Footprinting and Reconnaissance',
    question: 'Which DNS record query allows an attacker or penetration tester to find the authoritative mail exchange servers for a target organization?',
    options: [
      'PTR (Pointer Record)',
      'MX (Mail Exchange Record)',
      'SOA (Start of Authority)',
      'CNAME (Canonical Name)'
    ],
    correctIndex: 1,
    explanation: 'The MX (Mail Exchange) record specifies the mail servers responsible for accepting incoming email messages on behalf of a domain name. Enumerating MX records identifies external mail gateways and third-party security hygiene providers (e.g., Proofpoint, Mimecast).',
    difficulty: 'Fundamentals',
    cveOrTool: 'DNS Recon'
  },
  {
    id: 'q-08',
    domainId: 10,
    domainName: 'Denial-of-Service',
    question: 'How does an NTP Monlist amplification attack achieve an amplification factor of over 500x?',
    options: [
      'By forging TCP SYN packets with corrupted checksums requiring retransmission',
      'By sending small spoofed UDP requests asking the NTP daemon for the last 600 hosts that communicated with it',
      'By establishing thousands of idle SSL handshakes that exhaust server cryptographic chips',
      'By flooding DNS recursive resolvers with fragmented ICMP Echo requests'
    ],
    correctIndex: 1,
    explanation: 'The NTP `monlist` command is an administrative feature in older NTP daemons that returns the IP addresses of the last 600 machines that interacted with the NTP server. A tiny spoofed UDP request (pointing source IP to the victim) causes the NTP server to send multiple large packets back to the victim.',
    difficulty: 'Intermediate',
    cveOrTool: 'NTP Monlist Amplification'
  },
  {
    id: 'q-09',
    domainId: 16,
    domainName: 'Hacking Wireless Networks',
    question: 'In an assessment of an IEEE 802.11 WPA2-Personal network, what specific cryptographic artifact must be intercepted to conduct an offline dictionary or brute-force attack?',
    options: [
      'The RADIUS shared secret packet during initial beacon framing',
      'The 4-way EAPOL handshake containing ANonce, SNonce, and MIC',
      'The WEP Initialization Vector (IV) keystream generated by airmon-ng',
      'The PMK derived directly from the router WPS PIN pinout'
    ],
    correctIndex: 1,
    explanation: 'WPA2-PSK relies on a 4-way EAPOL handshake between the Access Point and client. By intercepting the Authenticator Nonce (ANonce), Supplicant Nonce (SNonce), and Message Integrity Code (MIC), an attacker can perform offline password cracking against the pre-shared key (PSK) using tools like Hashcat or Aircrack-ng.',
    difficulty: 'Intermediate',
    cveOrTool: 'Aircrack-ng / WPA2 Handshake'
  },
  {
    id: 'q-10',
    domainId: 20,
    domainName: 'Cryptography & AI in Cyber Security',
    question: 'In the latest CEH v13 syllabus covering Artificial Intelligence security, what vulnerability describes an attacker feeding malicious text into an LLM prompt that overrides system instructions and forces the model to execute unauthorized functions or leak proprietary context?',
    options: [
      'Model Inversion Attack',
      'Direct Prompt Injection (Jailbreak)',
      'Membership Inference Attack',
      'Spectral Anomaly Poisoning'
    ],
    correctIndex: 1,
    explanation: 'Direct Prompt Injection occurs when user input deliberately crafts instructions that trick the Large Language Model (LLM) into ignoring its system prompt, safety filters, or developer guardrails. In CEH v13, this is highlighted as OWASP Top 10 for LLM Applications (LLM01).',
    difficulty: 'Advanced Scenario',
    cveOrTool: 'CEH v13 AI Module / OWASP LLM01'
  },
  {
    id: 'q-11',
    domainId: 11,
    domainName: 'Session Hijacking',
    question: 'An attacker intercepts a user\'s web traffic and observes a session cookie with the following attributes: `Set-Cookie: session_id=abc12345; Path=/; Domain=.site.com; Secure`. Which browser defense was omitted that leaves this cookie vulnerable to theft via Cross-Site Scripting (XSS)?',
    options: [
      'SameSite=None',
      'HttpOnly',
      'Max-Age=3600',
      'Partitioned'
    ],
    correctIndex: 1,
    explanation: 'The `HttpOnly` cookie flag instructs the web browser that the cookie should not be accessible via client-side scripts (such as `document.cookie`). Without `HttpOnly`, any XSS flaw on the domain allows an attacker to exfiltrate the session token.',
    difficulty: 'Fundamentals',
    cveOrTool: 'HttpOnly Cookie Flag'
  },
  {
    id: 'q-12',
    domainId: 18,
    domainName: 'IoT and OT Hacking',
    question: 'When performing a physical security assessment of an IoT smart home controller, the tester notices a 4-pin header on the printed circuit board (PCB) labeled VCC, GND, TX, and RX. What interface is this, and what tool is commonly used to interface with it?',
    options: [
      'JTAG; monitored with logic analyzers for boundary scanning',
      'UART (Universal Asynchronous Receiver-Transmitter); accessed via USB-to-UART serial bridge',
      'SPI (Serial Peripheral Interface); read with an Oscilloscope',
      'I2C (Inter-Integrated Circuit); probed via Ethernet tap'
    ],
    correctIndex: 1,
    explanation: 'TX (Transmit), RX (Receive), VCC (Voltage), and GND (Ground) are the characteristic pinouts of a UART (Universal Asynchronous Receiver-Transmitter) serial interface. Connecting via a 3.3V/5V USB-to-UART serial adapter allows testers to view bootloader logs and often obtain an unauthenticated root shell on Linux-based IoT devices.',
    difficulty: 'Intermediate',
    cveOrTool: 'Hardware UART Pinout'
  },
  {
    id: 'q-13',
    domainId: 19,
    domainName: 'Cloud Computing Security',
    question: 'An attacker scans an organization\'s cloud infrastructure and discovers that an AWS S3 bucket returns HTTP 200 with XML contents listing key names when accessed anonymously via `https://corp-backups.s3.amazonaws.com`. What configuration caused this exposure?',
    options: [
      'AWS KMS encryption was enabled with a default customer managed key',
      'The S3 Bucket Access Control List (ACL) or Bucket Policy granted "AllUsers" (or public) Read permission',
      'The AWS Route 53 CNAME alias was pointing to an Elastic Load Balancer in another VPC',
      'The IAM Role attached to the EC2 instance had iam:PassRole permissions'
    ],
    correctIndex: 1,
    explanation: 'S3 buckets that allow anonymous read access have their Bucket Policy or Access Control List (ACL) explicitly set to grant READ access to `AllUsers` (the public internet) or authenticated AWS accounts without restriction.',
    difficulty: 'Fundamentals',
    cveOrTool: 'AWS S3 Misconfiguration'
  },
  {
    id: 'q-14',
    domainId: 4,
    domainName: 'Enumeration',
    question: 'Which tool and command can an ethical hacker run against a Windows domain controller on port 135/445 with an empty username and password to establish a null session and enumerate domain user accounts?',
    options: [
      'nbtstat -A 10.0.0.5',
      'rpcclient -U "" -N 10.0.0.5 with command enumdomusers',
      'snmpwalk -v1 -c public 10.0.0.5 1.3.6.1.4.1',
      'nikto -h 10.0.0.5 -C all'
    ],
    correctIndex: 1,
    explanation: '`rpcclient` with `-U ""` (empty user) and `-N` (no password) attempts to bind to IPC$ using a null session. Once connected, commands like `enumdomusers`, `enumdomgroups`, and `queryuser` query Active Directory SAM database without valid credentials.',
    difficulty: 'Intermediate',
    cveOrTool: 'rpcclient / SMB Null Session'
  },
  {
    id: 'q-15',
    domainId: 7,
    domainName: 'Malware Threats',
    question: 'A security engineer discovers malware that injects malicious code directly into legitimate Windows system processes (such as `svchost.exe` or `explorer.exe`) in RAM without writing an executable binary to the host hard drive. What category best defines this malware?',
    options: [
      'Macro virus',
      'Fileless Malware (Living off the Land)',
      'Polymorphic boot sector virus',
      'Hardware firmware rootkit'
    ],
    correctIndex: 1,
    explanation: 'Fileless malware operates in volatile memory (RAM), using Living off the Land Binaries (LOLBins) like PowerShell, WMI, or reflective DLL process injection into legitimate processes. Because no files exist on disk, traditional signature-based antivirus often fails to detect it.',
    difficulty: 'Intermediate',
    cveOrTool: 'Fileless / LOLBins'
  }
];
