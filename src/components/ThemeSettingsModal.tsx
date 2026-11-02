import React from 'react';
import {
  Palette,
  X,
  Check,
  Sparkles,
  BookOpen,
  Terminal,
  Heart,
  Moon,
  Zap
} from 'lucide-react';

export type ThemeVariation = 'editorial' | 'technical' | 'warm' | 'dark' | 'vibrant';

export interface ThemeOption {
  id: ThemeVariation;
  name: string;
  category: string;
  description: string;
  fontBadge: string;
  previewBg: string;
  previewCardBg: string;
  previewBorder: string;
  previewAccent: string;
  previewTextColor: string;
  bsTheme: 'light' | 'dark';
  icon: React.ReactNode;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'editorial',
    name: 'Editorial & Refined',
    category: 'Clean Light',
    description: 'Serif typography, generous whitespace, warm newsprint paper, and literary academic discipline.',
    fontBadge: 'Georgia / Serif',
    previewBg: '#faf8f5',
    previewCardBg: '#ffffff',
    previewBorder: '#e7e2d7',
    previewAccent: '#9a3412',
    previewTextColor: '#1c1917',
    bsTheme: 'light',
    icon: <BookOpen size={18} />
  },
  {
    id: 'technical',
    name: 'Technical & Systematic',
    category: 'Terminal Matrix',
    description: 'Monospace fonts, high-density data layouts, sharp 0px corners, and visible grid borders.',
    fontBadge: 'JetBrains / Mono',
    previewBg: '#07090e',
    previewCardBg: '#0c1017',
    previewBorder: '#1a2e26',
    previewAccent: '#00ff66',
    previewTextColor: '#00ff88',
    bsTheme: 'dark',
    icon: <Terminal size={18} />
  },
  {
    id: 'warm',
    name: 'Warm & Approachable',
    category: 'Soft Pastel',
    description: 'Soft peach cards, full pill buttons, rounded comfortable corners, and warm espresso typography.',
    fontBadge: 'Jakarta / Sans',
    previewBg: '#fffbf5',
    previewCardBg: '#ffffff',
    previewBorder: '#ffe4d6',
    previewAccent: '#ea580c',
    previewTextColor: '#43281c',
    bsTheme: 'light',
    icon: <Heart size={18} />
  },
  {
    id: 'dark',
    name: 'Elegant Dark',
    category: 'Obsidian Modern',
    description: 'Sleek dark mode with tailored high-contrast accents, metallic slate borders, and cyber blue highlights.',
    fontBadge: 'Inter / System',
    previewBg: '#090d16',
    previewCardBg: '#0f1626',
    previewBorder: '#1e293b',
    previewAccent: '#00f2fe',
    previewTextColor: '#f8fafc',
    bsTheme: 'dark',
    icon: <Moon size={18} />
  },
  {
    id: 'vibrant',
    name: 'Vibrant Palette',
    category: 'Cyber Neon',
    description: 'High-energy cosmic violet gradients, neon magenta glows, and bold cyber aesthetic.',
    fontBadge: 'Neon / Modern',
    previewBg: '#0c081f',
    previewCardBg: '#150f2e',
    previewBorder: '#7c3aed',
    previewAccent: '#ff007f',
    previewTextColor: '#ffffff',
    bsTheme: 'dark',
    icon: <Zap size={18} />
  }
];

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeVariation;
  onSelectTheme: (themeId: ThemeVariation) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm"
      style={{ position: 'fixed', inset: 0, zIndex: 1100 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card bg-dark border-secondary shadow-2xl text-light w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ borderRadius: 'var(--app-card-radius, 0.75rem)' }}
      >
        {/* Header */}
        <div className="card-header bg-black bg-opacity-40 border-secondary py-3 px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-info bg-opacity-15 text-info border border-info border-opacity-30">
              <Palette size={20} />
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-light">Theme Settings & UI Personalization</h5>
              <div className="text-secondary small">
                Choose from 5 curated design systems with instant CSS variable re-skinning
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm p-1.5 text-light"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="card-body p-4">
          <div className="row g-3">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <div key={theme.id} className="col-md-6 col-12">
                  <div
                    className={`p-3 rounded-3 border h-100 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-2 shadow-lg ring-2 ring-info ring-opacity-50'
                        : 'border-secondary hover-border-light'
                    }`}
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected ? theme.previewAccent : undefined,
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.2)'
                    }}
                    onClick={() => {
                      onSelectTheme(theme.id);
                      onClose();
                    }}
                  >
                    {/* Top Row */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="p-1.5 rounded-2 d-flex align-items-center justify-center text-dark fw-bold"
                          style={{ backgroundColor: theme.previewAccent }}
                        >
                          {theme.icon}
                        </span>
                        <div>
                          <div className="fw-bold text-light small d-flex align-items-center gap-1.5">
                            <span>{theme.name}</span>
                            {isSelected && (
                              <span
                                className="badge text-dark fw-bold"
                                style={{ backgroundColor: theme.previewAccent, fontSize: '0.62rem' }}
                              >
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <span className="text-secondary small" style={{ fontSize: '0.7rem' }}>
                            {theme.category}
                          </span>
                        </div>
                      </div>

                      {/* Font Badge */}
                      <span
                        className="badge bg-black text-secondary border border-secondary"
                        style={{ fontSize: '0.65rem' }}
                      >
                        {theme.fontBadge}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-secondary small mb-3" style={{ fontSize: '0.78rem', minHeight: '38px' }}>
                      {theme.description}
                    </p>

                    {/* Visual Color Palette Swatches */}
                    <div className="p-2 rounded-2 border border-secondary bg-black bg-opacity-40 d-flex align-items-center justify-content-between">
                      <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                        Palette:
                      </span>
                      <div className="d-flex gap-1.5">
                        <div
                          className="rounded-circle border border-dark"
                          style={{ width: '16px', height: '16px', backgroundColor: theme.previewBg }}
                          title={`Background: ${theme.previewBg}`}
                        />
                        <div
                          className="rounded-circle border border-dark"
                          style={{ width: '16px', height: '16px', backgroundColor: theme.previewCardBg }}
                          title={`Surface: ${theme.previewCardBg}`}
                        />
                        <div
                          className="rounded-circle border border-dark"
                          style={{ width: '16px', height: '16px', backgroundColor: theme.previewBorder }}
                          title={`Border: ${theme.previewBorder}`}
                        />
                        <div
                          className="rounded-circle border border-dark"
                          style={{ width: '16px', height: '16px', backgroundColor: theme.previewAccent }}
                          title={`Accent: ${theme.previewAccent}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer bg-black bg-opacity-40 border-secondary py-3 px-4 d-flex justify-content-between align-items-center">
          <div className="small text-secondary">
            Settings automatically persist in <span className="font-monospace text-info">localStorage</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm px-4"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
