import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Search,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { PROGRAMMING_CHEATSHEETS } from '../data/programmingCheatSheets';

export const CheatSheetViewer: React.FC = () => {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('python');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredSheets = PROGRAMMING_CHEATSHEETS.filter(
    (sheet) =>
      sheet.languageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.snippetTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.scenario.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSheet =
    PROGRAMMING_CHEATSHEETS.find((s) => s.languageId === selectedLanguageId) || PROGRAMMING_CHEATSHEETS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSheet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container-fluid px-3 py-4">
      {/* Top Banner */}
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded bg-info bg-opacity-10 text-info">
              <Code2 size={20} />
            </div>
            <div>
              <h5 className="mb-0 text-light fw-bold">21-Language Cyber Security Cheat Sheets</h5>
              <small className="text-secondary">
                Production-grade offensive and defensive implementations across all required programming stacks
              </small>
            </div>
          </div>

          <div className="input-group input-group-sm w-auto" style={{ minWidth: '240px' }}>
            <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary">
              <Search size={14} />
            </span>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Search 21 languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Sidebar: 21 Languages Selector */}
        <div className="col-12 col-md-4 col-xl-3">
          <div className="card bg-dark border-secondary shadow-sm">
            <div className="card-header bg-dark border-secondary p-2.5 d-flex justify-content-between align-items-center">
              <span className="small text-secondary fw-semibold text-uppercase">
                Language Stacks ({filteredSheets.length})
              </span>
              <span className="badge bg-secondary bg-opacity-40 text-info small">21 Stacks</span>
            </div>

            <div className="list-group list-group-flush overflow-y-auto" style={{ maxHeight: '680px' }}>
              {filteredSheets.map((sheet) => {
                const isSelected = sheet.languageId === currentSheet.languageId;
                return (
                  <button
                    key={sheet.languageId}
                    className={`list-group-item list-group-item-action border-secondary d-flex justify-content-between align-items-center py-2.5 px-3 ${
                      isSelected ? 'bg-info text-dark fw-bold' : 'bg-dark text-light'
                    }`}
                    onClick={() => setSelectedLanguageId(sheet.languageId)}
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="small">{sheet.languageName}</span>
                      </div>
                      <span
                        className={`d-block small text-truncate ${
                          isSelected ? 'text-dark text-opacity-75' : 'text-secondary'
                        }`}
                        style={{ fontSize: '0.72rem', maxWidth: '170px' }}
                      >
                        {sheet.snippetTitle}
                      </span>
                    </div>

                    <span
                      className={`badge font-monospace ${
                        isSelected ? 'bg-dark text-info' : 'bg-secondary bg-opacity-25 text-secondary'
                      }`}
                      style={{ fontSize: '0.68rem' }}
                    >
                      .{sheet.fileExtension}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Code Display, Execution, & Security Analysis */}
        <div className="col-12 col-md-8 col-xl-9">
          <div className="card bg-dark border-secondary shadow-sm mb-4">
            {/* Header */}
            <div className="card-header bg-dark border-secondary p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-info text-dark fw-bold">{currentSheet.languageName}</span>
                  <span className="badge bg-secondary bg-opacity-40 text-light border border-secondary font-monospace">
                    {currentSheet.family}
                  </span>
                </div>
                <h5 className="text-light mb-0 fw-bold">{currentSheet.snippetTitle}</h5>
              </div>

              <button
                id="btn-copy-code-snippet"
                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-info'} d-flex align-items-center gap-1.5`}
                onClick={handleCopyCode}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied Code!' : 'Copy Snippet'}</span>
              </button>
            </div>

            {/* Code Block Container */}
            <div className="card-body p-0 bg-black font-monospace">
              <pre
                className="p-4 m-0 text-light overflow-x-auto"
                style={{ fontSize: '0.84rem', lineHeight: '1.55', maxHeight: '420px' }}
              >
                <code>{currentSheet.code}</code>
              </pre>
            </div>

            {/* Explanation and Execution Details */}
            <div className="card-footer bg-dark border-secondary p-4">
              <div className="row g-3">
                <div className="col-12 col-lg-7">
                  <h6 className="text-info fw-bold mb-2 d-flex align-items-center gap-1.5">
                    <ShieldCheck size={16} />
                    <span>Offensive & Defensive Security Rationale</span>
                  </h6>
                  <p className="text-secondary small mb-2 lh-lg" style={{ color: '#c9d1d9' }}>
                    {currentSheet.scenario}
                  </p>
                  <p className="text-secondary small mb-0 lh-lg" style={{ color: '#8b949e' }}>
                    {currentSheet.offensiveSecurityUseCase}
                  </p>
                </div>

                <div className="col-12 col-lg-5">
                  <h6 className="text-info fw-bold mb-2 d-flex align-items-center gap-1.5">
                    <Terminal size={16} />
                    <span>Execution & Compilation Command</span>
                  </h6>
                  <div className="p-2.5 rounded bg-black border border-secondary font-monospace small text-success">
                    {currentSheet.runtimeInstructions}
                  </div>
                  <span className="small text-secondary d-block mt-1" style={{ fontSize: '0.72rem' }}>
                    Native runtime command tested across Linux, macOS, and Windows.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
