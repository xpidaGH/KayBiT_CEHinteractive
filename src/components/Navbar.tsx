import React, { useState } from 'react';
import {
  ShieldAlert,
  BookOpen,
  FileDown,
  Terminal,
  Code2,
  FileText,
  Package,
  Layers,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Sun,
  Moon
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUserGuide: () => void;
  onExportPdf: () => void;
  onExportHtml: () => void;
  onResetProgress: () => void;
  examReadinessPercentage: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUserGuide,
  onExportPdf,
  onExportHtml,
  onResetProgress,
  examReadinessPercentage,
  theme,
  onToggleTheme
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handlePdfClick = async () => {
    setIsExportingPdf(true);
    try {
      await onExportPdf();
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-xl navbar-dark bg-dark border-bottom border-secondary sticky-top py-2 px-3">
      <div className="container-fluid px-0">
        {/* Brand */}
        <div
          className="navbar-brand d-flex align-items-center gap-2 mb-0 py-0 cursor-pointer"
          onClick={() => setActiveTab('domains')}
          style={{ cursor: 'pointer' }}
        >
          <div className="p-2 rounded bg-info bg-opacity-10 text-info border border-info border-opacity-25">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold tracking-tight text-light">KayBiT_CEHinteractive</span>
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 small">
                CEH v13
              </span>
            </div>
            <div className="small text-secondary" style={{ fontSize: '0.72rem' }}>
              Offline Study Track • LocalStorage Engine
            </div>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="d-none d-lg-flex align-items-center gap-2 mx-3 px-3 py-1 rounded bg-black bg-opacity-40 border border-secondary">
          <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>
            Exam Readiness:
          </span>
          <div className="progress" style={{ width: '90px', height: '8px' }}>
            <div
              className={`progress-bar ${
                examReadinessPercentage > 75
                  ? 'bg-success'
                  : examReadinessPercentage > 40
                  ? 'bg-warning'
                  : 'bg-info'
              }`}
              role="progressbar"
              style={{ width: `${examReadinessPercentage}%` }}
              aria-valuenow={examReadinessPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="small fw-bold text-light" style={{ fontSize: '0.78rem' }}>
            {examReadinessPercentage}%
          </span>
        </div>

        {/* Nav Tabs */}
        <div className="d-flex align-items-center overflow-x-auto py-1 me-auto">
          <ul className="nav nav-pills gap-1 flex-nowrap mb-0">
            <li className="nav-item">
              <button
                id="nav-tab-domains"
                className={`nav-link btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${
                  activeTab === 'domains' ? 'active bg-info text-dark fw-semibold' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('domains')}
              >
                <Layers size={14} />
                <span>20 Domains</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                id="nav-tab-quiz"
                className={`nav-link btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${
                  activeTab === 'quiz' ? 'active bg-info text-dark fw-semibold' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('quiz')}
              >
                <CheckCircle size={14} />
                <span>Mock Quiz Engine</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                id="nav-tab-flashcards"
                className={`nav-link btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${
                  activeTab === 'flashcards' ? 'active bg-info text-dark fw-semibold' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('flashcards')}
              >
                <Sparkles size={14} />
                <span>Flashcards</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                id="nav-tab-leaderboard"
                className={`nav-link btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${
                  activeTab === 'leaderboard' ? 'active bg-info text-dark fw-semibold' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('leaderboard')}
              >
                <Trophy size={14} />
                <span>Leaderboard</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                id="nav-tab-nmap"
                className={`nav-link btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${
                  activeTab === 'nmap' ? 'active bg-info text-dark fw-semibold' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('nmap')}
                title="Scanner & Attack Tool Generators: Nmap, Metasploit, Wireshark, Hydra"
              >
                <Terminal size={14} />
                <span>Tool Generators</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                id="nav-tab-cheatsheets"
                className={`nav-link btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${
                  activeTab === 'cheatsheets' ? 'active bg-info text-dark fw-semibold' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('cheatsheets')}
              >
                <Code2 size={14} />
                <span>21 Languages</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                id="nav-tab-notes"
                className={`nav-link btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${
                  activeTab === 'notes' ? 'active bg-info text-dark fw-semibold' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('notes')}
              >
                <FileText size={14} />
                <span>Notes</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                id="nav-tab-packaging"
                className={`nav-link btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${
                  activeTab === 'packaging' ? 'active bg-info text-dark fw-semibold' : 'text-secondary'
                }`}
                onClick={() => setActiveTab('packaging')}
              >
                <Package size={14} />
                <span>Packaging Suites</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Action Controls */}
        <div className="d-flex align-items-center gap-2 mt-2 mt-xl-0">
          {/* User Guide Button */}
          <button
            id="btn-open-user-guide"
            className="btn btn-outline-info btn-sm d-flex align-items-center gap-1 fw-semibold"
            onClick={onOpenUserGuide}
            title="Open comprehensive User Guide (18 Translations)"
          >
            <BookOpen size={14} />
            <span>User Guide</span>
          </button>

          {/* Interactive AcroForm PDF Export Button */}
          <button
            id="btn-export-interactive-pdf"
            className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
            onClick={handlePdfClick}
            disabled={isExportingPdf}
            title="Generate Interactive Fillable AcroForm PDF with text fields, dropdowns, and reset buttons"
          >
            <FileDown size={14} />
            <span>{isExportingPdf ? 'Exporting...' : 'Interactive PDF'}</span>
          </button>

          {/* Single-File HTML Exporter */}
          <button
            id="btn-export-html5-app"
            className="btn btn-outline-secondary btn-sm d-none d-md-flex align-items-center gap-1"
            onClick={onExportHtml}
            title="Download portable single-file HTML5 app"
          >
            <Sparkles size={14} />
            <span>Single-File HTML</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Global Theme Switcher Button */}
          <button
            id="btn-toggle-theme"
            className={`btn btn-sm d-flex align-items-center gap-1.5 ${
              theme === 'dark'
                ? 'btn-outline-warning text-warning'
                : 'btn-outline-primary text-primary'
            }`}
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span className="d-none d-sm-inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Reset progress button */}
          <button
            id="btn-reset-storage"
            className="btn btn-outline-danger btn-sm p-1"
            onClick={onResetProgress}
            title="Reset domain checklists and quiz history"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
};
