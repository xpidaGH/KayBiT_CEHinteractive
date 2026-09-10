import React, { useState } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  Sparkles,
  Shield,
  Sliders,
  Terminal,
  Zap,
  Clock,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react';
import { HYDRA_PRESETS, HydraPreset } from '../data/securityToolsData';

export const HydraBuilder: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('hydra-ssh-wordlist');
  const [targetHost, setTargetHost] = useState<string>('192.168.1.50');
  const [protocol, setProtocol] = useState<string>('ssh');
  const [port, setPort] = useState<number>(22);
  const [mode, setMode] = useState<'brute_single_user' | 'brute_user_list' | 'spray'>('brute_single_user');
  const [singleUser, setSingleUser] = useState<string>('root');
  const [userList, setUserList] = useState<string>('/usr/share/seclists/Usernames/top-usernames-shortlist.txt');
  const [singlePass, setSinglePass] = useState<string>('Autumn2026!');
  const [passList, setPassList] = useState<string>('/usr/share/wordlists/rockyou.txt');
  const [threads, setThreads] = useState<number>(16);
  const [delaySeconds, setDelaySeconds] = useState<number>(0);
  const [exitOnFound, setExitOnFound] = useState<boolean>(true);
  const [verbose, setVerbose] = useState<boolean>(true);

  // Web form options
  const [formPath, setFormPath] = useState<string>('/login.php');
  const [formParams, setFormParams] = useState<string>('user=^USER^&pass=^PASS^&Login=Submit');
  const [failureCondition, setFailureCondition] = useState<string>('F=Invalid username or password');

  const [copied, setCopied] = useState<boolean>(false);

  const handleApplyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = HYDRA_PRESETS.find((x) => x.id === presetId);
    if (!p) return;

    setProtocol(p.protocol);
    setPort(p.defaultPort);
    setThreads(p.recommendedThreads);
    setDelaySeconds(p.evasionDelay || 0);

    if (p.mode === 'spray') {
      setMode('spray');
      if (p.defaultUserList) setUserList(p.defaultUserList);
      setSinglePass(p.defaultPassList);
    } else {
      setMode('brute_single_user');
      setSingleUser(p.defaultUser);
      setPassList(p.defaultPassList);
    }

    if (p.formPath) setFormPath(p.formPath);
    if (p.formParams) setFormParams(p.formParams);
    if (p.failureCondition) setFailureCondition(p.failureCondition);
  };

  // Generate Hydra Command
  const generateCommand = (): string => {
    const parts = ['hydra'];

    // Credentials
    if (mode === 'brute_single_user') {
      parts.push(`-l ${singleUser.trim() || 'admin'}`);
      parts.push(`-P ${passList.trim() || '/usr/share/wordlists/rockyou.txt'}`);
    } else if (mode === 'brute_user_list') {
      parts.push(`-L ${userList.trim() || 'users.txt'}`);
      parts.push(`-P ${passList.trim() || '/usr/share/wordlists/rockyou.txt'}`);
    } else if (mode === 'spray') {
      parts.push(`-L ${userList.trim() || 'users.txt'}`);
      parts.push(`-p "${singlePass.trim() || 'Password123!'}"`);
    }

    // Tuning & Evasion
    if (threads) {
      parts.push(`-t ${threads}`);
    }

    if (delaySeconds > 0) {
      parts.push(`-W ${delaySeconds}`);
    }

    if (exitOnFound) {
      parts.push('-f');
    }

    if (verbose) {
      parts.push('-V');
    }

    // Port if non-standard
    if (
      (protocol === 'ssh' && port !== 22) ||
      (protocol === 'ftp' && port !== 21) ||
      (protocol === 'rdp' && port !== 3389) ||
      (protocol === 'http-post-form' && port !== 80) ||
      (protocol === 'mysql' && port !== 3306)
    ) {
      parts.push(`-s ${port}`);
    }

    // Target Host
    parts.push(targetHost.trim() || '192.168.1.50');

    // Protocol & Web parameters
    if (protocol === 'http-post-form' || protocol === 'http-get-form') {
      const condition = failureCondition.trim() || 'F=Invalid';
      parts.push(protocol);
      parts.push(`"${formPath.trim()}:${formParams.trim()}:${condition}"`);
    } else {
      parts.push(protocol);
    }

    return parts.join(' ');
  };

  const command = generateCommand();

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card bg-dark border-secondary shadow-lg rounded-3 overflow-hidden text-light">
      {/* Header */}
      <div className="card-header bg-black bg-opacity-40 border-secondary py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2.5 rounded-3 bg-warning bg-opacity-15 text-warning border border-warning border-opacity-25">
            <KeyRound size={22} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0 fw-bold text-light">THC-Hydra Online Login Cracker Generator</h5>
              <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50">
                Network Auth & Brute Force
              </span>
            </div>
            <div className="text-secondary small mt-0.5">
              Construct high-speed dictionary attacks, evasion rate limits, and password spraying across SSH, RDP, SMB, and Web forms.
            </div>
          </div>
        </div>

        {/* Presets dropdown */}
        <div className="d-flex align-items-center gap-2">
          <Sparkles size={16} className="text-warning" />
          <select
            className="form-select form-select-sm bg-dark text-light border-secondary"
            value={selectedPresetId}
            onChange={(e) => handleApplyPreset(e.target.value)}
            style={{ width: '250px' }}
          >
            <option value="">⚡ Select Hydra Preset...</option>
            {HYDRA_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-body p-4">
        {/* Terminal Command Output */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-secondary fw-semibold">GENERATED HYDRA COMMAND</span>
            <button
              type="button"
              className={`btn btn-sm py-0.5 px-2.5 ${copied ? 'btn-success' : 'btn-warning text-dark fw-bold'}`}
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
          <pre className="p-3 rounded-3 bg-black border border-secondary text-warning font-monospace small mb-0 overflow-auto" style={{ maxHeight: '120px' }}>
            <code>{command}</code>
          </pre>
        </div>

        {/* Controls Grid */}
        <div className="row g-3">
          {/* Target Host & Protocol */}
          <div className="col-md-5">
            <label className="form-label small text-secondary fw-semibold">Target Host IP / Domain</label>
            <input
              type="text"
              className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
              value={targetHost}
              onChange={(e) => setTargetHost(e.target.value)}
              placeholder="e.g. 192.168.1.50 or target.corp"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small text-secondary fw-semibold">Protocol</label>
            <select
              className="form-select form-select-sm bg-black text-light border-secondary"
              value={protocol}
              onChange={(e) => {
                const proto = e.target.value;
                setProtocol(proto);
                if (proto === 'ssh') setPort(22);
                else if (proto === 'ftp') setPort(21);
                else if (proto === 'rdp') setPort(3389);
                else if (proto === 'http-post-form') setPort(80);
                else if (proto === 'mysql') setPort(3306);
                else if (proto === 'smb') setPort(445);
              }}
            >
              <option value="ssh">SSH (Port 22)</option>
              <option value="http-post-form">HTTP POST Form (Web Login)</option>
              <option value="rdp">RDP (Port 3389)</option>
              <option value="smb">SMB (Port 445)</option>
              <option value="ftp">FTP (Port 21)</option>
              <option value="mysql">MySQL (Port 3306)</option>
              <option value="postgres">PostgreSQL (Port 5432)</option>
              <option value="telnet">Telnet (Port 23)</option>
              <option value="vnc">VNC (Port 5900)</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small text-secondary fw-semibold">Port</label>
            <input
              type="number"
              className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
              value={port}
              onChange={(e) => setPort(parseInt(e.target.value) || 22)}
            />
          </div>

          {/* Attack Mode */}
          <div className="col-12">
            <label className="form-label small text-secondary fw-semibold">Attack Strategy</label>
            <div className="btn-group btn-group-sm w-100" role="group">
              <button
                type="button"
                className={`btn ${mode === 'brute_single_user' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setMode('brute_single_user')}
              >
                Single Username (-l) + Password Wordlist (-P)
              </button>
              <button
                type="button"
                className={`btn ${mode === 'brute_user_list' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setMode('brute_user_list')}
              >
                Username List (-L) + Password Wordlist (-P)
              </button>
              <button
                type="button"
                className={`btn ${mode === 'spray' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-secondary'}`}
                onClick={() => setMode('spray')}
              >
                Password Spraying: User List (-L) + Single Password (-p)
              </button>
            </div>
          </div>

          {/* Credentials Inputs */}
          {mode === 'brute_single_user' && (
            <>
              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">Username (-l)</label>
                <input
                  type="text"
                  className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                  value={singleUser}
                  onChange={(e) => setSingleUser(e.target.value)}
                  placeholder="e.g. root or admin"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">Password Wordlist (-P)</label>
                <input
                  type="text"
                  className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                  value={passList}
                  onChange={(e) => setPassList(e.target.value)}
                  placeholder="/usr/share/wordlists/rockyou.txt"
                />
              </div>
            </>
          )}

          {mode === 'brute_user_list' && (
            <>
              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">Username List File (-L)</label>
                <input
                  type="text"
                  className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                  value={userList}
                  onChange={(e) => setUserList(e.target.value)}
                  placeholder="users.txt"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">Password Wordlist (-P)</label>
                <input
                  type="text"
                  className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                  value={passList}
                  onChange={(e) => setPassList(e.target.value)}
                  placeholder="/usr/share/wordlists/rockyou.txt"
                />
              </div>
            </>
          )}

          {mode === 'spray' && (
            <>
              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">Target User Accounts List (-L)</label>
                <input
                  type="text"
                  className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                  value={userList}
                  onChange={(e) => setUserList(e.target.value)}
                  placeholder="domain_users.txt"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">Single Password to Spray (-p)</label>
                <input
                  type="text"
                  className="form-control form-control-sm bg-black text-light border-secondary font-monospace"
                  value={singlePass}
                  onChange={(e) => setSinglePass(e.target.value)}
                  placeholder="e.g. Autumn2026!"
                />
              </div>
            </>
          )}

          {/* Web Form Options (conditional) */}
          {protocol === 'http-post-form' && (
            <div className="col-12 p-3 rounded-3 bg-black bg-opacity-40 border border-secondary">
              <div className="fw-semibold text-info small mb-2">Web Login Form Parameters (Path:Body:Condition)</div>
              <div className="row g-2">
                <div className="col-md-4">
                  <label className="form-label small text-secondary" style={{ fontSize: '0.75rem' }}>Login URL Path</label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-light border-secondary font-monospace"
                    value={formPath}
                    onChange={(e) => setFormPath(e.target.value)}
                    placeholder="/login.php"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-secondary" style={{ fontSize: '0.75rem' }}>POST Payload Format (^USER^, ^PASS^)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-light border-secondary font-monospace"
                    value={formParams}
                    onChange={(e) => setFormParams(e.target.value)}
                    placeholder="user=^USER^&pass=^PASS^"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-secondary" style={{ fontSize: '0.75rem' }}>Failure String (F=...)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-light border-secondary font-monospace"
                    value={failureCondition}
                    onChange={(e) => setFailureCondition(e.target.value)}
                    placeholder="F=Invalid credentials"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Performance & Evasion Controls */}
          <div className="col-md-4">
            <label className="form-label small text-secondary fw-semibold">Concurrent Threads (-t)</label>
            <input
              type="number"
              min="1"
              max="64"
              className="form-control form-control-sm bg-black text-light border-secondary"
              value={threads}
              onChange={(e) => setThreads(parseInt(e.target.value) || 16)}
            />
            <div className="form-text text-muted small">SSH/FTP: 16 threads; Web: 4-8 threads.</div>
          </div>

          <div className="col-md-4">
            <label className="form-label small text-secondary fw-semibold">Delay Between Attempts (-W seconds)</label>
            <input
              type="number"
              min="0"
              max="60"
              className="form-control form-control-sm bg-black text-light border-secondary"
              value={delaySeconds}
              onChange={(e) => setDelaySeconds(parseInt(e.target.value) || 0)}
            />
            <div className="form-text text-muted small">Evasion delay to bypass fail2ban / rate-limiting.</div>
          </div>

          <div className="col-md-4 d-flex flex-column justify-content-center pt-2">
            <div className="form-check mb-1">
              <input
                className="form-check-input bg-dark border-secondary"
                type="checkbox"
                id="exitFoundCheck"
                checked={exitOnFound}
                onChange={(e) => setExitOnFound(e.target.checked)}
              />
              <label className="form-check-label small text-light cursor-pointer" htmlFor="exitFoundCheck">
                Exit upon first valid login (-f)
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input bg-dark border-secondary"
                type="checkbox"
                id="verboseCheck"
                checked={verbose}
                onChange={(e) => setVerbose(e.target.checked)}
              />
              <label className="form-check-label small text-light cursor-pointer" htmlFor="verboseCheck">
                Verbose output (-V)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
