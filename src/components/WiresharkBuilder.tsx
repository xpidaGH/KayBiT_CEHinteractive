import React, { useState } from 'react';
import {
  Network,
  Copy,
  Check,
  Sparkles,
  Shield,
  Sliders,
  Terminal,
  Activity,
  AlertTriangle,
  Info,
  Layers
} from 'lucide-react';
import { WIRESHARK_PRESETS, WiresharkFilterPreset } from '../data/securityToolsData';

export const WiresharkBuilder: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ws-syn-flood');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Custom filter state
  const [protocol, setProtocol] = useState<string>('http');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [ipDirection, setIpDirection] = useState<'any' | 'src' | 'dst'>('any');
  const [port, setPort] = useState<string>('');
  const [portDirection, setPortDirection] = useState<'any' | 'src' | 'dst'>('any');
  const [synOnly, setSynOnly] = useState<boolean>(false);
  const [resetOnly, setResetOnly] = useState<boolean>(false);
  const [payloadContains, setPayloadContains] = useState<string>('');
  const [networkInterface, setNetworkInterface] = useState<string>('eth0');

  const selectedPreset = WIRESHARK_PRESETS.find((p) => p.id === selectedPresetId);

  const handleApplyPreset = (preset: WiresharkFilterPreset) => {
    setSelectedPresetId(preset.id);
  };

  // Build custom display filter
  const buildCustomDisplayFilter = (): string => {
    const parts: string[] = [];

    if (protocol !== 'all') {
      parts.push(protocol);
    }

    if (ipAddress.trim()) {
      if (ipDirection === 'src') parts.push(`ip.src == ${ipAddress.trim()}`);
      else if (ipDirection === 'dst') parts.push(`ip.dst == ${ipAddress.trim()}`);
      else parts.push(`ip.addr == ${ipAddress.trim()}`);
    }

    if (port.trim()) {
      if (portDirection === 'src') parts.push(`tcp.srcport == ${port.trim()}`);
      else if (portDirection === 'dst') parts.push(`tcp.dstport == ${port.trim()}`);
      else parts.push(`tcp.port == ${port.trim()}`);
    }

    if (synOnly) {
      parts.push('tcp.flags.syn == 1 && tcp.flags.ack == 0');
    }

    if (resetOnly) {
      parts.push('tcp.flags.reset == 1');
    }

    if (payloadContains.trim()) {
      parts.push(`frame contains "${payloadContains.trim()}"`);
    }

    return parts.length > 0 ? parts.join(' and ') : 'frame';
  };

  // Build custom BPF capture filter
  const buildCustomBpfFilter = (): string => {
    const parts: string[] = [];

    if (protocol !== 'all' && ['tcp', 'udp', 'icmp', 'arp'].includes(protocol)) {
      parts.push(protocol);
    }

    if (ipAddress.trim()) {
      if (ipDirection === 'src') parts.push(`src host ${ipAddress.trim()}`);
      else if (ipDirection === 'dst') parts.push(`dst host ${ipAddress.trim()}`);
      else parts.push(`host ${ipAddress.trim()}`);
    }

    if (port.trim()) {
      if (portDirection === 'src') parts.push(`src port ${port.trim()}`);
      else if (portDirection === 'dst') parts.push(`dst port ${port.trim()}`);
      else parts.push(`port ${port.trim()}`);
    }

    if (synOnly) {
      parts.push('tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) == 0');
    }

    return parts.length > 0 ? parts.join(' and ') : 'ip or arp';
  };

  const displayFilter = selectedPreset ? selectedPreset.displayFilter : buildCustomDisplayFilter();
  const bpfFilter = selectedPreset ? selectedPreset.bpfCaptureFilter : buildCustomBpfFilter();
  const tsharkCmd = selectedPreset
    ? selectedPreset.tsharkCommand
    : `tshark -i ${networkInterface} -Y "${buildCustomDisplayFilter()}"`;
  const tcpdumpCmd = selectedPreset
    ? selectedPreset.tcpdumpCommand
    : `tcpdump -i ${networkInterface} "${buildCustomBpfFilter()}" -nn`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="card bg-dark border-secondary shadow-lg rounded-3 overflow-hidden text-light">
      {/* Header */}
      <div className="card-header bg-black bg-opacity-40 border-secondary py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2.5 rounded-3 bg-primary bg-opacity-15 text-primary border border-primary border-opacity-25">
            <Network size={22} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0 fw-bold text-light">Wireshark & Tshark Packet Filter Generator</h5>
              <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50">
                Display & BPF Capture
              </span>
            </div>
            <div className="text-secondary small mt-0.5">
              Construct Wireshark display filters, kernel BPF capture syntax, and command-line Tshark/Tcpdump statements.
            </div>
          </div>
        </div>

        {/* Interface Input */}
        <div className="d-flex align-items-center gap-2">
          <span className="small text-secondary fw-semibold">Interface:</span>
          <input
            type="text"
            className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
            value={networkInterface}
            onChange={(e) => setNetworkInterface(e.target.value)}
            style={{ width: '100px' }}
          />
        </div>
      </div>

      <div className="card-body p-4">
        {/* Presets Grid */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-1.5 small text-secondary fw-bold">
              <Sparkles size={14} className="text-warning" />
              <span>CEH v13 SECURITY ANALYSIS PRESETS</span>
            </div>
            {selectedPresetId && (
              <button
                type="button"
                className="btn btn-link btn-sm text-info p-0 text-decoration-none small"
                onClick={() => setSelectedPresetId('')}
              >
                Switch to Custom Manual Filter Builder
              </button>
            )}
          </div>

          <div className="row g-2">
            {WIRESHARK_PRESETS.map((preset) => {
              const isActive = selectedPresetId === preset.id;
              return (
                <div key={preset.id} className="col-md-4 col-sm-6">
                  <div
                    className={`p-2.5 rounded-3 border cursor-pointer transition-all ${
                      isActive
                        ? 'bg-primary bg-opacity-15 border-primary text-light'
                        : 'bg-black bg-opacity-30 border-secondary text-secondary hover-border-light'
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleApplyPreset(preset)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className={`fw-bold small ${isActive ? 'text-info' : 'text-light'}`}>
                        {preset.name}
                      </span>
                      <span className="badge bg-black text-secondary border border-secondary" style={{ fontSize: '0.65rem' }}>
                        {preset.category.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-secondary small font-monospace text-truncate" style={{ fontSize: '0.72rem' }}>
                      {preset.displayFilter}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Manual Controls (visible if no preset or customizing) */}
        {!selectedPresetId && (
          <div className="p-3 mb-4 rounded-3 bg-black bg-opacity-40 border border-secondary">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Sliders size={16} className="text-info" />
              <span className="fw-bold text-light small">CUSTOM FILTER ATTRIBUTES</span>
            </div>

            <div className="row g-3">
              {/* Protocol */}
              <div className="col-md-3">
                <label className="form-label small text-secondary fw-semibold">Protocol</label>
                <select
                  className="form-select form-select-sm bg-dark text-light border-secondary"
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value)}
                >
                  <option value="all">Any / All</option>
                  <option value="tcp">TCP</option>
                  <option value="udp">UDP</option>
                  <option value="http">HTTP</option>
                  <option value="dns">DNS</option>
                  <option value="arp">ARP</option>
                  <option value="icmp">ICMP</option>
                  <option value="tls">TLS / SSL</option>
                  <option value="smb2">SMB2 / SMB3</option>
                  <option value="ssh">SSH</option>
                </select>
              </div>

              {/* IP Filter */}
              <div className="col-md-5">
                <label className="form-label small text-secondary fw-semibold">IP Address</label>
                <div className="input-group input-group-sm">
                  <select
                    className="form-select bg-dark text-light border-secondary"
                    style={{ maxWidth: '90px' }}
                    value={ipDirection}
                    onChange={(e) => setIpDirection(e.target.value as any)}
                  >
                    <option value="any">Both</option>
                    <option value="src">Source</option>
                    <option value="dst">Dest</option>
                  </select>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary font-monospace"
                    placeholder="e.g. 192.168.1.100"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Port Filter */}
              <div className="col-md-4">
                <label className="form-label small text-secondary fw-semibold">Port</label>
                <div className="input-group input-group-sm">
                  <select
                    className="form-select bg-dark text-light border-secondary"
                    style={{ maxWidth: '90px' }}
                    value={portDirection}
                    onChange={(e) => setPortDirection(e.target.value as any)}
                  >
                    <option value="any">Both</option>
                    <option value="src">Src</option>
                    <option value="dst">Dst</option>
                  </select>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary font-monospace"
                    placeholder="e.g. 80 or 443"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                  />
                </div>
              </div>

              {/* Payload contains */}
              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">Payload Substring (contains)</label>
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-light border-secondary font-monospace"
                  placeholder="e.g. password, admin, /etc/passwd"
                  value={payloadContains}
                  onChange={(e) => setPayloadContains(e.target.value)}
                />
              </div>

              {/* Flag Toggles */}
              <div className="col-md-6 d-flex align-items-end gap-3 pb-1">
                <div className="form-check">
                  <input
                    className="form-check-input bg-dark border-secondary"
                    type="checkbox"
                    id="synCheck"
                    checked={synOnly}
                    onChange={(e) => setSynOnly(e.target.checked)}
                  />
                  <label className="form-check-label small text-light cursor-pointer" htmlFor="synCheck">
                    SYN only (SYN=1, ACK=0)
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input bg-dark border-secondary"
                    type="checkbox"
                    id="resetCheck"
                    checked={resetOnly}
                    onChange={(e) => setResetOnly(e.target.checked)}
                  />
                  <label className="form-check-label small text-light cursor-pointer" htmlFor="resetCheck">
                    Reset only (RST=1)
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Threat Explanation Banner */}
        {selectedPreset && (
          <div className="p-3 mb-4 rounded-3 bg-info bg-opacity-10 border border-info border-opacity-25">
            <div className="d-flex align-items-start gap-2">
              <Info size={18} className="text-info mt-0.5 flex-shrink-0" />
              <div>
                <div className="fw-bold text-info small mb-0.5">{selectedPreset.name} — CEH v13 Threat Analysis</div>
                <div className="text-light small">{selectedPreset.threatExplanation}</div>
              </div>
            </div>
          </div>
        )}

        {/* Output Commands Grid */}
        <div className="row g-3">
          {/* 1. Wireshark Display Filter */}
          <div className="col-md-6">
            <div className="card bg-black border-secondary p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-info fw-bold">1. WIRESHARK DISPLAY FILTER (GUI)</span>
                <button
                  type="button"
                  className={`btn btn-sm py-0 px-2 ${copiedType === 'display' ? 'btn-success' : 'btn-outline-info'}`}
                  onClick={() => copyToClipboard(displayFilter, 'display')}
                >
                  {copiedType === 'display' ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <div className="p-2 rounded bg-dark border border-secondary font-monospace small text-light text-break">
                {displayFilter}
              </div>
              <div className="text-secondary small mt-1" style={{ fontSize: '0.72rem' }}>
                Paste into the top green search bar in the Wireshark GUI.
              </div>
            </div>
          </div>

          {/* 2. BPF Capture Filter */}
          <div className="col-md-6">
            <div className="card bg-black border-secondary p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-warning fw-bold">2. BPF CAPTURE FILTER (KERNEL)</span>
                <button
                  type="button"
                  className={`btn btn-sm py-0 px-2 ${copiedType === 'bpf' ? 'btn-success' : 'btn-outline-warning'}`}
                  onClick={() => copyToClipboard(bpfFilter, 'bpf')}
                >
                  {copiedType === 'bpf' ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <div className="p-2 rounded bg-dark border border-secondary font-monospace small text-light text-break">
                {bpfFilter}
              </div>
              <div className="text-secondary small mt-1" style={{ fontSize: '0.72rem' }}>
                Evaluated in libpcap kernel space before saving to disk.
              </div>
            </div>
          </div>

          {/* 3. Tshark Command */}
          <div className="col-md-6">
            <div className="card bg-black border-secondary p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-success fw-bold">3. TSHARK TERMINAL COMMAND</span>
                <button
                  type="button"
                  className={`btn btn-sm py-0 px-2 ${copiedType === 'tshark' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => copyToClipboard(tsharkCmd, 'tshark')}
                >
                  {copiedType === 'tshark' ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <div className="p-2 rounded bg-dark border border-secondary font-monospace small text-light text-break">
                {tsharkCmd}
              </div>
              <div className="text-secondary small mt-1" style={{ fontSize: '0.72rem' }}>
                Headless CLI packet extraction for security scripts.
              </div>
            </div>
          </div>

          {/* 4. Tcpdump Command */}
          <div className="col-md-6">
            <div className="card bg-black border-secondary p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-danger fw-bold">4. TCPDUMP ONE-LINER</span>
                <button
                  type="button"
                  className={`btn btn-sm py-0 px-2 ${copiedType === 'tcpdump' ? 'btn-success' : 'btn-outline-danger'}`}
                  onClick={() => copyToClipboard(tcpdumpCmd, 'tcpdump')}
                >
                  {copiedType === 'tcpdump' ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <div className="p-2 rounded bg-dark border border-secondary font-monospace small text-light text-break">
                {tcpdumpCmd}
              </div>
              <div className="text-secondary small mt-1" style={{ fontSize: '0.72rem' }}>
                Standard Linux/BSD command-line network sniffer.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
