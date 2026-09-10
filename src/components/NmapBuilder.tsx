import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Shield,
  HelpCircle,
  Clock,
  Sliders,
  FileCode
} from 'lucide-react';
import { NMAP_PRESETS, NMAP_SCAN_TYPES, NMAP_TIMING_TEMPLATES, NMAP_EVASION_OPTIONS, NMAP_NSE_SCRIPTS } from '../data/nmapOptions';

export const NmapBuilder: React.FC = () => {
  const [target, setTarget] = useState('192.168.1.100');
  const [selectedScanType, setSelectedScanType] = useState('-sS');
  const [selectedTiming, setSelectedTiming] = useState('-T4');
  const [portSelection, setPortSelection] = useState<'common' | 'fast' | 'all' | 'custom'>('common');
  const [customPorts, setCustomPorts] = useState('21,22,80,443,445,3389,8080');
  const [enableOsDetection, setEnableOsDetection] = useState(true);
  const [enableVersionDetection, setEnableVersionDetection] = useState(true);
  const [enableTraceroute, setEnableTraceroute] = useState(false);
  const [activeEvasion, setActiveEvasion] = useState<Record<string, boolean>>({});
  const [selectedScripts, setSelectedScripts] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Apply preset
  const applyPreset = (presetId: string) => {
    const p = NMAP_PRESETS.find((item) => item.id === presetId);
    if (!p) return;

    if (p.target) setTarget(p.target);

    // Scan type detection from selectedFlags
    const foundScan = p.selectedFlags.find((f) => ['-sS', '-sT', '-sU', '-sA', '-sN', '-sF', '-sX'].includes(f));
    if (foundScan) setSelectedScanType(foundScan);

    // Timing
    const foundTiming = p.selectedFlags.find((f) => ['-T0', '-T1', '-T2', '-T3', '-T4', '-T5'].includes(f));
    if (foundTiming) setSelectedTiming(foundTiming);

    const isAggressive = p.selectedFlags.includes('-A');
    setEnableOsDetection(isAggressive || p.selectedFlags.includes('-O'));
    setEnableVersionDetection(isAggressive || p.selectedFlags.includes('-sV'));
    setEnableTraceroute(isAggressive || p.selectedFlags.includes('--traceroute'));

    if (p.ports === '-p-') {
      setPortSelection('all');
    } else if (p.ports === '-F') {
      setPortSelection('fast');
    } else if (p.ports && p.ports.startsWith('-p ')) {
      setPortSelection('custom');
      setCustomPorts(p.ports.replace('-p ', ''));
    } else if (p.ports) {
      setPortSelection('custom');
      setCustomPorts(p.ports);
    }

    const evasionMap: Record<string, boolean> = {};
    const flags = p.selectedFlags || [];
    ['-f', '-g', '-D', '--data-length', '--badsum', '--spoof-mac'].forEach((evFlag) => {
      if (flags.includes(evFlag)) {
        evasionMap[evFlag] = true;
      }
    });
    setActiveEvasion(evasionMap);

    const scriptFlags = flags
      .filter((f) => f.startsWith('--script='))
      .map((f) => f.replace('--script=', ''));
    setSelectedScripts(scriptFlags);
  };

  const toggleEvasion = (flag: string) => {
    setActiveEvasion((prev) => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  const toggleScript = (scriptName: string) => {
    setSelectedScripts((prev) =>
      prev.includes(scriptName) ? prev.filter((s) => s !== scriptName) : [...prev, scriptName]
    );
  };

  // Build the live command string
  const buildCommand = () => {
    const parts = ['nmap'];

    // Scan type
    if (selectedScanType) parts.push(selectedScanType);

    // Timing
    if (selectedTiming) parts.push(selectedTiming);

    // OS & Version & Traceroute
    if (enableOsDetection && enableVersionDetection && enableTraceroute) {
      parts.push('-A');
    } else {
      if (enableOsDetection) parts.push('-O');
      if (enableVersionDetection) parts.push('-sV');
      if (enableTraceroute) parts.push('--traceroute');
    }

    // Ports
    if (portSelection === 'fast') {
      parts.push('-F');
    } else if (portSelection === 'all') {
      parts.push('-p-');
    } else if (portSelection === 'custom' && customPorts.trim()) {
      parts.push(`-p ${customPorts.trim()}`);
    } else if (portSelection === 'common' && customPorts.trim()) {
      parts.push(`-p ${customPorts.trim()}`);
    }

    // Evasion
    Object.keys(activeEvasion).forEach((flag) => {
      if (activeEvasion[flag]) {
        parts.push(flag);
      }
    });

    // Scripts
    if (selectedScripts.length > 0) {
      parts.push(`--script=${selectedScripts.join(',')}`);
    }

    // Output
    if (outputFormat) {
      parts.push(`${outputFormat} scan_audit`);
    }

    // Target
    parts.push(target.trim() || '<target>');

    return parts.join(' ');
  };

  const generatedCommand = buildCommand();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetBuilder = () => {
    setSelectedScanType('-sS');
    setSelectedTiming('-T4');
    setPortSelection('common');
    setCustomPorts('21,22,80,443,445,3389,8080');
    setEnableOsDetection(true);
    setEnableVersionDetection(true);
    setEnableTraceroute(false);
    setActiveEvasion({});
    setSelectedScripts([]);
    setOutputFormat('');
  };

  return (
    <div className="container-fluid px-3 py-4">
      {/* Top Banner & Preset Selector */}
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded bg-info bg-opacity-10 text-info">
              <Terminal size={20} />
            </div>
            <div>
              <h5 className="mb-0 text-light fw-bold">Interactive Nmap Command Builder</h5>
              <small className="text-secondary">
                Visually configure network reconnaissance, stealth evasion, and NSE vulnerability scripts
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="small text-secondary fw-semibold">Quick Presets:</span>
            <div className="btn-group btn-group-sm" role="group">
              {NMAP_PRESETS.map((p) => (
                <button
                  key={p.id}
                  className="btn btn-outline-secondary text-light btn-sm"
                  onClick={() => applyPreset(p.id)}
                  title={p.description}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <button
              className="btn btn-outline-danger btn-sm p-1.5 ms-2"
              onClick={resetBuilder}
              title="Reset builder to default"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Generated Command Terminal Output */}
      <div className="card bg-black border-secondary mb-4 shadow-lg overflow-hidden">
        <div className="card-header bg-dark bg-opacity-75 border-secondary px-3 py-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger rounded-circle p-1" style={{ width: '10px', height: '10px' }} />
            <span className="badge bg-warning rounded-circle p-1" style={{ width: '10px', height: '10px' }} />
            <span className="badge bg-success rounded-circle p-1" style={{ width: '10px', height: '10px' }} />
            <span className="small text-secondary font-monospace ms-2">bash / zsh terminal execution string</span>
          </div>
          <button
            id="btn-copy-nmap-command"
            className={`btn btn-sm ${copied ? 'btn-success' : 'btn-info text-dark fw-bold'} d-flex align-items-center gap-1.5 py-1 px-3`}
            onClick={handleCopy}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Command'}</span>
          </button>
        </div>

        <div className="card-body p-4 font-monospace">
          <div className="d-flex align-items-start gap-2">
            <span className="text-secondary select-none">$</span>
            <span className="text-info fw-bold fs-5 text-break">{generatedCommand}</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Target & Core Scans */}
        <div className="col-12 col-lg-6">
          {/* Target Specification */}
          <div className="card bg-dark border-secondary p-3 mb-3 shadow-sm">
            <h6 className="text-light fw-bold mb-2">1. Target Specification</h6>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary font-monospace">
                Host / Subnet
              </span>
              <input
                type="text"
                id="input-nmap-target"
                className="form-control bg-dark text-light border-secondary font-monospace"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. 192.168.1.100, 10.0.0.0/24, or scanme.nmap.org"
              />
            </div>
          </div>

          {/* Scan Types */}
          <div className="card bg-dark border-secondary p-3 mb-3 shadow-sm">
            <h6 className="text-light fw-bold mb-2">2. Scan Technique (CEH v13 Core)</h6>
            <div className="row g-2">
              {NMAP_SCAN_TYPES.map((st) => (
                <div key={st.flag} className="col-12 col-sm-6">
                  <label
                    className={`card h-100 p-2 cursor-pointer border ${
                      selectedScanType === st.flag
                        ? 'bg-info bg-opacity-10 border-info text-info'
                        : 'bg-black bg-opacity-25 border-secondary text-secondary'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="scanType"
                        checked={selectedScanType === st.flag}
                        onChange={() => setSelectedScanType(st.flag)}
                        className="form-check-input mt-0"
                      />
                      <span className="font-monospace fw-bold small">{st.flag}</span>
                    </div>
                    <span className="small text-light mt-1">{st.name}</span>
                    <span className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                      {st.description}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Port Specification */}
          <div className="card bg-dark border-secondary p-3 mb-3 shadow-sm">
            <h6 className="text-light fw-bold mb-2">3. Port Selection</h6>
            <div className="btn-group btn-group-sm w-100 mb-2" role="group">
              <button
                type="button"
                className={`btn ${portSelection === 'common' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setPortSelection('common')}
              >
                Standard Top Ports
              </button>
              <button
                type="button"
                className={`btn ${portSelection === 'fast' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setPortSelection('fast')}
              >
                Fast (-F Top 100)
              </button>
              <button
                type="button"
                className={`btn ${portSelection === 'all' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setPortSelection('all')}
              >
                All 65,535 (-p-)
              </button>
              <button
                type="button"
                className={`btn ${portSelection === 'custom' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setPortSelection('custom')}
              >
                Custom Ports
              </button>
            </div>

            {(portSelection === 'common' || portSelection === 'custom') && (
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-light border-secondary font-monospace"
                value={customPorts}
                onChange={(e) => setCustomPorts(e.target.value)}
                placeholder="e.g. 21,22,80,443,445,8080"
              />
            )}
          </div>

          {/* Timing & Performance */}
          <div className="card bg-dark border-secondary p-3 shadow-sm">
            <h6 className="text-light fw-bold mb-2">4. Timing Template</h6>
            <div className="row g-2">
              {NMAP_TIMING_TEMPLATES.map((t) => (
                <div key={t.flag} className="col-4">
                  <button
                    type="button"
                    className={`btn btn-sm w-100 font-monospace ${
                      selectedTiming === t.flag ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'
                    }`}
                    onClick={() => setSelectedTiming(t.flag)}
                  >
                    <div>{t.flag}</div>
                    <small style={{ fontSize: '0.68rem' }}>{t.name}</small>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Evasion, NSE Scripts, Detection & Output */}
        <div className="col-12 col-lg-6">
          {/* OS, Service & Traceroute Toggles */}
          <div className="card bg-dark border-secondary p-3 mb-3 shadow-sm">
            <h6 className="text-light fw-bold mb-2">5. Detection & Inspection Switches</h6>
            <div className="d-flex flex-wrap gap-3">
              <label className="form-check cursor-pointer">
                <input
                  type="checkbox"
                  className="form-check-input border-secondary"
                  checked={enableOsDetection}
                  onChange={(e) => setEnableOsDetection(e.target.checked)}
                />
                <span className="form-check-label text-light small font-monospace">
                  -O (OS Fingerprinting)
                </span>
              </label>

              <label className="form-check cursor-pointer">
                <input
                  type="checkbox"
                  className="form-check-input border-secondary"
                  checked={enableVersionDetection}
                  onChange={(e) => setEnableVersionDetection(e.target.checked)}
                />
                <span className="form-check-label text-light small font-monospace">
                  -sV (Service / Version Probe)
                </span>
              </label>

              <label className="form-check cursor-pointer">
                <input
                  type="checkbox"
                  className="form-check-input border-secondary"
                  checked={enableTraceroute}
                  onChange={(e) => setEnableTraceroute(e.target.checked)}
                />
                <span className="form-check-label text-light small font-monospace">
                  --traceroute (Hop Geolocation)
                </span>
              </label>
            </div>
          </div>

          {/* Firewall / IDS Evasion Options */}
          <div className="card bg-dark border-secondary p-3 mb-3 shadow-sm">
            <h6 className="text-light fw-bold mb-2 d-flex align-items-center gap-2">
              <Shield size={16} className="text-warning" />
              <span>6. Firewall & IDS Evasion (CEH v13 Module 12)</span>
            </h6>
            <div className="row g-2">
              {NMAP_EVASION_OPTIONS.map((ev) => {
                const isActive = !!activeEvasion[ev.flag];
                return (
                  <div key={ev.flag} className="col-12 col-sm-6">
                    <label
                      className={`card h-100 p-2 cursor-pointer border ${
                        isActive
                          ? 'bg-warning bg-opacity-10 border-warning text-warning'
                          : 'bg-black bg-opacity-25 border-secondary text-secondary'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleEvasion(ev.flag)}
                          className="form-check-input mt-0 border-secondary"
                        />
                        <span className="font-monospace fw-bold small">{ev.flag}</span>
                      </div>
                      <span className="small text-light mt-1">{ev.name}</span>
                      <span className="small text-secondary" style={{ fontSize: '0.7rem' }}>
                        {ev.description}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nmap Scripting Engine (NSE) */}
          <div className="card bg-dark border-secondary p-3 mb-3 shadow-sm">
            <h6 className="text-light fw-bold mb-2 d-flex align-items-center gap-2">
              <FileCode size={16} className="text-info" />
              <span>7. Nmap Scripting Engine (NSE Categories)</span>
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {NMAP_NSE_SCRIPTS.map((script) => {
                const isSelected = selectedScripts.includes(script.name);
                return (
                  <button
                    key={script.name}
                    type="button"
                    className={`btn btn-sm ${
                      isSelected ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'
                    }`}
                    onClick={() => toggleScript(script.name)}
                    title={script.description}
                  >
                    --script={script.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Output Format */}
          <div className="card bg-dark border-secondary p-3 shadow-sm">
            <h6 className="text-light fw-bold mb-2">8. Output Logging</h6>
            <div className="btn-group btn-group-sm w-100" role="group">
              <button
                type="button"
                className={`btn ${outputFormat === '' ? 'btn-secondary text-light' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setOutputFormat('')}
              >
                None
              </button>
              <button
                type="button"
                className={`btn ${outputFormat === '-oN' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setOutputFormat('-oN')}
              >
                -oN (Standard Text)
              </button>
              <button
                type="button"
                className={`btn ${outputFormat === '-oX' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setOutputFormat('-oX')}
              >
                -oX (XML)
              </button>
              <button
                type="button"
                className={`btn ${outputFormat === '-oA' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setOutputFormat('-oA')}
              >
                -oA (All 3 Formats)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
