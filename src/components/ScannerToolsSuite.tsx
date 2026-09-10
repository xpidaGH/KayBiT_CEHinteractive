import React, { useState } from 'react';
import {
  Terminal,
  Shield,
  Network,
  KeyRound,
  Layers,
  Wrench,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { NmapBuilder } from './NmapBuilder';
import { MetasploitBuilder } from './MetasploitBuilder';
import { WiresharkBuilder } from './WiresharkBuilder';
import { HydraBuilder } from './HydraBuilder';

export const ScannerToolsSuite: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'nmap' | 'metasploit' | 'wireshark' | 'hydra'>('nmap');

  return (
    <div className="container-fluid py-3 px-md-4">
      {/* Top Suite Switcher Navigation */}
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded bg-info bg-opacity-10 text-info border border-info border-opacity-25">
                <Wrench size={20} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold text-light d-flex align-items-center gap-2">
                  <span>CEH v13 Security Tools & Scanner Generator Suite</span>
                  <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 small">
                    4 Core Scanners
                  </span>
                </h4>
                <div className="text-secondary small mt-0.5">
                  Generate command-line syntax, evasive probes, exploit scripts, and filter expressions for ethical hacking operations.
                </div>
              </div>
            </div>
          </div>

          {/* Tool Tab Switcher */}
          <div className="btn-group p-1 bg-black bg-opacity-60 rounded-3 border border-secondary" role="group">
            <button
              id="tool-tab-nmap"
              type="button"
              className={`btn btn-sm px-3 py-1.5 rounded-2 d-flex align-items-center gap-2 fw-semibold transition-all ${
                activeTool === 'nmap'
                  ? 'btn-info text-dark shadow-sm'
                  : 'btn-dark text-secondary border-0 hover-text-light'
              }`}
              onClick={() => setActiveTool('nmap')}
            >
              <Terminal size={15} />
              <span>Nmap Scanner</span>
            </button>

            <button
              id="tool-tab-metasploit"
              type="button"
              className={`btn btn-sm px-3 py-1.5 rounded-2 d-flex align-items-center gap-2 fw-semibold transition-all ${
                activeTool === 'metasploit'
                  ? 'btn-danger text-light shadow-sm'
                  : 'btn-dark text-secondary border-0 hover-text-light'
              }`}
              onClick={() => setActiveTool('metasploit')}
            >
              <Layers size={15} />
              <span>Metasploit</span>
            </button>

            <button
              id="tool-tab-wireshark"
              type="button"
              className={`btn btn-sm px-3 py-1.5 rounded-2 d-flex align-items-center gap-2 fw-semibold transition-all ${
                activeTool === 'wireshark'
                  ? 'btn-primary text-light shadow-sm'
                  : 'btn-dark text-secondary border-0 hover-text-light'
              }`}
              onClick={() => setActiveTool('wireshark')}
            >
              <Network size={15} />
              <span>Wireshark / Tshark</span>
            </button>

            <button
              id="tool-tab-hydra"
              type="button"
              className={`btn btn-sm px-3 py-1.5 rounded-2 d-flex align-items-center gap-2 fw-semibold transition-all ${
                activeTool === 'hydra'
                  ? 'btn-warning text-dark shadow-sm'
                  : 'btn-dark text-secondary border-0 hover-text-light'
              }`}
              onClick={() => setActiveTool('hydra')}
            >
              <KeyRound size={15} />
              <span>THC-Hydra</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Tool Workspace */}
      <div className="transition-fade">
        {activeTool === 'nmap' && <NmapBuilder />}
        {activeTool === 'metasploit' && <MetasploitBuilder />}
        {activeTool === 'wireshark' && <WiresharkBuilder />}
        {activeTool === 'hydra' && <HydraBuilder />}
      </div>
    </div>
  );
};
