import { NmapOptionConfig } from '../types';

export const NMAP_OPTIONS: NmapOptionConfig[] = [
  // Scan Types
  {
    flag: '-sS',
    name: 'SYN Stealth Scan (Half-open)',
    category: 'scan_type',
    description: 'Sends SYN, tears down with RST upon SYN-ACK. Default for privileged users; does not complete 3-way handshake.',
    requiresRoot: true,
    dangerLevel: 'stealth'
  },
  {
    flag: '-sT',
    name: 'TCP Connect Scan',
    category: 'scan_type',
    description: 'Completes full 3-way handshake via system socket. Used by non-root users; heavily logged by firewalls and OS.',
    dangerLevel: 'noisy'
  },
  {
    flag: '-sU',
    name: 'UDP Port Scan',
    category: 'scan_type',
    description: 'Audits UDP services (DNS, SNMP, DHCP, TFTP). Relies on ICMP port unreachable responses or service replies.',
    requiresRoot: true,
    dangerLevel: 'normal'
  },
  {
    flag: '-sA',
    name: 'TCP ACK Scan (Firewall Rule Mapping)',
    category: 'scan_type',
    description: 'Sends raw ACK packets to determine whether ports are filtered by stateful firewalls vs unfiltered.',
    requiresRoot: true,
    dangerLevel: 'stealth'
  },
  {
    flag: '-sN',
    name: 'TCP Null Scan',
    category: 'scan_type',
    description: 'Sends packets with no TCP flags set. Open ports should drop the packet; closed ports return RST per RFC 793.',
    requiresRoot: true,
    dangerLevel: 'stealth'
  },
  {
    flag: '-sF',
    name: 'TCP FIN Scan',
    category: 'scan_type',
    description: 'Sends packets with only the FIN flag set. RFC 793 compliant Unix systems leave open ports silent.',
    requiresRoot: true,
    dangerLevel: 'stealth'
  },
  {
    flag: '-sX',
    name: 'TCP Xmas Scan',
    category: 'scan_type',
    description: 'Sets FIN, PSH, and URG flags (lit like a Christmas tree). Bypasses naive stateless packet filters.',
    requiresRoot: true,
    dangerLevel: 'stealth'
  },
  {
    flag: '-sV',
    name: 'Service / Version Detection',
    category: 'discovery',
    description: 'Interrogates open ports with signature probes to identify running daemon software and exact version strings.',
    dangerLevel: 'normal'
  },
  {
    flag: '-O',
    name: 'OS Fingerprinting',
    category: 'discovery',
    description: 'Analyzes TCP/IP stack implementation quirks (TCP window size, IP ID sequencing, TTL) to determine target OS.',
    requiresRoot: true,
    dangerLevel: 'normal'
  },
  {
    flag: '-A',
    name: 'Aggressive Mode Scan',
    category: 'discovery',
    description: 'Enables OS detection (-O), version scanning (-sV), script scanning (-sC), and traceroute (--traceroute) simultaneously.',
    requiresRoot: true,
    dangerLevel: 'noisy'
  },
  {
    flag: '-Pn',
    name: 'Treat All Hosts As Online (Skip Host Discovery)',
    category: 'discovery',
    description: 'Skips ICMP echo host discovery ping. Useful when targets block ICMP probes.',
    dangerLevel: 'normal'
  },

  // Timing Templates
  {
    flag: '-T0',
    name: 'Timing: Paranoid (-T0)',
    category: 'timing',
    description: 'Extremely slow serial scanning (5-minute pauses between packets) designed to evade IDS threshold alerts.',
    dangerLevel: 'stealth'
  },
  {
    flag: '-T2',
    name: 'Timing: Polite (-T2)',
    category: 'timing',
    description: 'Slows down scan to use less network bandwidth and minimize target host load.',
    dangerLevel: 'stealth'
  },
  {
    flag: '-T4',
    name: 'Timing: Aggressive (-T4)',
    category: 'timing',
    description: 'Optimized for fast, reliable modern local and broadband networks. Recommended for pentest labs.',
    dangerLevel: 'normal'
  },
  {
    flag: '-T5',
    name: 'Timing: Insane (-T5)',
    category: 'timing',
    description: 'Ultra-fast scan; risks dropping packets or crashing fragile network appliances.',
    dangerLevel: 'noisy'
  },

  // Scripts (NSE)
  {
    flag: '-sC',
    name: 'Default NSE Scripts',
    category: 'scripts',
    description: 'Runs standard safe NSE discovery scripts (--script=default) against identified ports.',
    dangerLevel: 'normal'
  },
  {
    flag: '--script=vuln',
    name: 'Vulnerability Audit Scripts',
    category: 'scripts',
    description: 'Executes known vulnerability checks against services (e.g. Heartbleed, SMB Ghost, Log4j).',
    dangerLevel: 'noisy'
  },
  {
    flag: '--script=auth',
    name: 'Authentication & Credential Checks',
    category: 'scripts',
    description: 'Tests for default credentials and anonymous logins (FTP anonymous, SMB null session, SNMP public).',
    dangerLevel: 'normal'
  },
  {
    flag: '--script=discovery',
    name: 'Deep Network Discovery',
    category: 'scripts',
    description: 'Queries DNS, SNMP, SMB, and HTTP headers to map active network resources and shares.',
    dangerLevel: 'normal'
  },

  // Evasion
  {
    flag: '-f',
    name: 'Fragment Packets (8-byte chunks)',
    category: 'evasion',
    description: 'Splits TCP header across multiple IP fragments to thwart simple packet filtering firewalls.',
    requiresRoot: true,
    dangerLevel: 'stealth'
  },
  {
    flag: '--data-length',
    name: 'Append Random Data to Probes',
    category: 'evasion',
    description: 'Adds specified length of random payload bytes to avoid fixed-size probe signatures in IDS.',
    requiresArg: true,
    argPlaceholder: 'e.g. 24',
    argDefault: '24',
    dangerLevel: 'stealth'
  },
  {
    flag: '-D',
    name: 'Decoy Scan (IP Spoofing)',
    category: 'evasion',
    description: 'Intersperses real scan packets with decoys so IDS cannot identify which IP is the real scanner.',
    requiresArg: true,
    argPlaceholder: 'RND:5 or IP1,IP2,ME',
    argDefault: 'RND:5',
    requiresRoot: true,
    dangerLevel: 'stealth'
  },
  {
    flag: '-g',
    name: 'Source Port Spoofing (e.g. 53 or 88)',
    category: 'evasion',
    description: 'Forces probes to originate from trusted port numbers (e.g. DNS 53 or Kerberos 88) to bypass naive ingress rules.',
    requiresArg: true,
    argPlaceholder: '53',
    argDefault: '53',
    requiresRoot: true,
    dangerLevel: 'stealth'
  },

  // Output Formats
  {
    flag: '-oN',
    name: 'Normal Output to File',
    category: 'output',
    description: 'Saves standard human-readable text output into a file.',
    requiresArg: true,
    argPlaceholder: 'scan_results.txt',
    argDefault: 'scan_results.txt'
  },
  {
    flag: '-oX',
    name: 'XML Output (for Metasploit/Nessus import)',
    category: 'output',
    description: 'Outputs scan results in structured XML suitable for automated parsers and vulnerability management systems.',
    requiresArg: true,
    argPlaceholder: 'scan_results.xml',
    argDefault: 'scan_results.xml'
  },
  {
    flag: '-oA',
    name: 'Output All 3 Formats (.nmap, .xml, .gnmap)',
    category: 'output',
    description: 'Simultaneously generates normal text, XML, and grepable output files under the specified base name.',
    requiresArg: true,
    argPlaceholder: 'ceh_target_audit',
    argDefault: 'ceh_target_audit'
  }
];

export interface NmapPreset {
  id: string;
  name: string;
  description: string;
  target: string;
  ports: string;
  selectedFlags: string[];
  flagArgs: Record<string, string>;
}

export const NMAP_PRESETS: NmapPreset[] = [
  {
    id: 'stealth-recon',
    name: 'Stealthy SYN Firewall Evasion Scan',
    description: 'Uses SYN stealth, packet fragmentation, decoy IPs, and trusted DNS source port 53 to slip past perimeter filters.',
    target: '192.168.1.100',
    ports: '21,22,25,80,443,445,3389',
    selectedFlags: ['-sS', '-Pn', '-T2', '-f', '-g', '-D'],
    flagArgs: { '-g': '53', '-D': 'RND:5' }
  },
  {
    id: 'vuln-audit',
    name: 'Comprehensive Vulnerability Audit',
    description: 'Performs service version detection combined with vulnerability script database (--script=vuln) with full logging.',
    target: '192.168.1.0/24',
    ports: '--top-ports 1000',
    selectedFlags: ['-sS', '-sV', '--script=vuln', '-T4', '-oA'],
    flagArgs: { '-oA': 'subnet_vuln_audit' }
  },
  {
    id: 'udp-critical',
    name: 'Critical UDP Services Scan',
    description: 'Probes common UDP ports (DNS, DHCP, SNMP, NTP, TFTP) with service version identification.',
    target: '10.10.10.25',
    ports: '53,67,68,69,123,161,162,500',
    selectedFlags: ['-sU', '-sV', '-Pn', '-T4', '-oN'],
    flagArgs: { '-oN': 'udp_services.txt' }
  },
  {
    id: 'aggressive-discovery',
    name: 'Full Aggressive Pentest Sweep (-A)',
    description: 'Enables OS fingerprinting, version scanning, default NSE scripts, and traceroute with fast T4 timing.',
    target: '10.0.0.1',
    ports: '-p-',
    selectedFlags: ['-A', '-T4', '-oX'],
    flagArgs: { '-oX': 'deep_host_discovery.xml' }
  }
];

export const NMAP_SCAN_TYPES = NMAP_OPTIONS.filter((o) => o.category === 'scan_type');
export const NMAP_TIMING_TEMPLATES = NMAP_OPTIONS.filter((o) => o.category === 'timing');
export const NMAP_EVASION_OPTIONS = NMAP_OPTIONS.filter((o) => o.category === 'evasion');
export const NMAP_NSE_SCRIPTS = NMAP_OPTIONS.filter((o) => o.category === 'scripts');

