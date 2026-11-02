import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Smartphone,
  Monitor,
  Globe,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { KBTBrandLogo } from './KBTBrandLogo';

interface BrandAssetShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandAssetShowcaseModal: React.FC<BrandAssetShowcaseModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm"
      style={{ position: 'fixed', inset: 0, zIndex: 1100 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card bg-dark border-secondary shadow-2xl text-light w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ borderRadius: 'var(--app-card-radius, 0.75rem)' }}
      >
        {/* Header */}
        <div className="card-header bg-black bg-opacity-40 border-secondary py-3 px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <KBTBrandLogo variant="web-header" size={28} />
            <div>
              <h5 className="mb-0 fw-bold text-light">KBT Brand Logo & Multiplatform Asset Guide</h5>
              <div className="text-secondary small">
                Cyber Spider Icon Specifications • Authentic Squircle Geometry
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
        <div className="card-body p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
          {/* Top Showcase Banner */}
          <div className="p-4 mb-4 rounded-3 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-lime-400/30 d-flex flex-column flex-md-row align-items-center gap-4">
            <div className="flex-shrink-0">
              <KBTBrandLogo variant="showcase" size={96} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-lime-500/20 text-lime-400 border border-lime-500/30">
                  KBT Vector Logo Asset
                </span>
                <span className="badge bg-black text-secondary border border-secondary">
                  512x512 High-Res
                </span>
              </div>
              <h5 className="fw-bold text-light mb-1">The Tech-Styled Cyber Spider Icon</h5>
              <p className="text-secondary small mb-2">
                Designed with lime-green and cyber-yellow circuit traces. Uses authentic continuous
                superellipse squircle masking rather than standard corner radii for flawless rendering on modern operating systems.
              </p>
              <div className="d-flex gap-2">
                <a
                  href="/assets/kbt-logo.png"
                  download="kbt-app-logo.png"
                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download Logo (PNG)</span>
                </a>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 text-light"
                  onClick={() =>
                    handleCopy(
                      `<img src="/assets/kbt-logo.png" alt="KBT Logo" className="mask-squircle" />`,
                      'img-tag'
                    )
                  }
                >
                  {copiedSnippet === 'img-tag' ? <Check size={13} /> : <Copy size={13} />}
                  <span>Copy React Tag</span>
                </button>
              </div>
            </div>
          </div>

          {/* Three Resized Multiplatform Use Cases */}
          <div className="mb-4">
            <h6 className="fw-bold text-light small text-uppercase tracking-wider mb-3">
              Multiplatform Platform Use Cases & Simulated Views
            </h6>

            <div className="row g-3">
              {/* 1. Desktop Title Bar (Windows / macOS) */}
              <div className="col-12">
                <div className="p-3 rounded-3 bg-black border border-secondary">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Monitor size={16} className="text-info" />
                      <span className="fw-bold text-light small">
                        1. Desktop Title Bar (Windows 11 / macOS Universal)
                      </span>
                    </div>
                    <span className="badge bg-dark text-info border border-info border-opacity-30 small">
                      16px – 24px (.ico / .icns)
                    </span>
                  </div>

                  {/* Simulated Windows/macOS Title Bar */}
                  <div className="rounded-2 bg-zinc-900 border border-zinc-700 px-3 py-1.5 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <KBTBrandLogo variant="desktop-titlebar" size={20} />
                      <span className="small font-monospace text-zinc-300">
                        KayBiT CEH v13 — Ethical Hacking Operations v1.0.0
                      </span>
                    </div>
                    {/* Window Controls */}
                    <div className="d-flex gap-2">
                      <div className="rounded-circle bg-zinc-700" style={{ width: '10px', height: '10px' }} />
                      <div className="rounded-circle bg-zinc-700" style={{ width: '10px', height: '10px' }} />
                      <div className="rounded-circle bg-zinc-700" style={{ width: '10px', height: '10px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Mobile App Bar (iOS / Android) */}
              <div className="col-12">
                <div className="p-3 rounded-3 bg-black border border-secondary">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Smartphone size={16} className="text-warning" />
                      <span className="fw-bold text-light small">
                        2. Mobile App Bar (iOS Navigation / Android Material)
                      </span>
                    </div>
                    <span className="badge bg-dark text-warning border border-warning border-opacity-30 small">
                      28px – 32px (Adaptive Vector / Squircle)
                    </span>
                  </div>

                  {/* Simulated Mobile App Bar */}
                  <div className="rounded-2 bg-zinc-950 border border-zinc-800 px-3 py-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2.5">
                      <KBTBrandLogo variant="mobile-appbar" size={30} />
                      <div>
                        <div className="fw-bold text-light small leading-tight">KayBiT Mobile</div>
                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                          CEH v13 Study Track
                        </div>
                      </div>
                    </div>
                    <div className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 small">
                      Offline Synced
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Web Header Bar (Web Browsers / Web Apps) */}
              <div className="col-12">
                <div className="p-3 rounded-3 bg-black border border-secondary">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Globe size={16} className="text-success" />
                      <span className="fw-bold text-light small">
                        3. Web Header Bar (Vite PWA / Modern Web App Header)
                      </span>
                    </div>
                    <span className="badge bg-dark text-success border border-success border-opacity-30 small">
                      34px – 40px (Squircle Mask + Neon Glow)
                    </span>
                  </div>

                  {/* Simulated Web Header Bar */}
                  <div className="rounded-2 bg-zinc-900 border border-zinc-700 px-3 py-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2.5">
                      <KBTBrandLogo variant="web-header" size={34} />
                      <div>
                        <div className="fw-bold text-light small">KayBiT_CEHinteractive</div>
                        <div className="text-secondary small" style={{ fontSize: '0.68rem' }}>
                          CEH v13 Cybersecurity Suite
                        </div>
                      </div>
                    </div>
                    <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30">
                      PWA Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tauri Terminal Command per kbt-integration-guide.txt */}
          <div className="p-3 rounded-3 bg-black border border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small text-secondary fw-semibold">
                TAURI CLI MULTIPLATFORM ICON GENERATOR
              </span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm py-0 px-2 text-light"
                onClick={() =>
                  handleCopy(
                    'npm run tauri icon ./public/assets/kbt-logo.png',
                    'tauri-cmd'
                  )
                }
              >
                {copiedSnippet === 'tauri-cmd' ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
            <pre className="p-2.5 rounded bg-dark border border-secondary text-info font-monospace small mb-0">
              <code>npm run tauri icon ./public/assets/kbt-logo.png</code>
            </pre>
            <div className="text-secondary small mt-1.5" style={{ fontSize: '0.72rem' }}>
              Automatically generates all .ico, .icns, and Android mipmap resolution assets.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer bg-black bg-opacity-40 border-secondary py-3 px-4 d-flex justify-content-end">
          <button type="button" className="btn btn-secondary btn-sm px-4" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
