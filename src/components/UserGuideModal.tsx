import React, { useState } from 'react';
import { BookOpen, Globe2, Download, Search, X } from 'lucide-react';
import { USER_GUIDE_TRANSLATIONS } from '../data/userGuideTranslations';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentGuide = USER_GUIDE_TRANSLATIONS[selectedLang] || USER_GUIDE_TRANSLATIONS.en;
  const isRtl = currentGuide.rtl === true;

  const filteredSections = currentGuide.sections.filter(
    (sec) =>
      sec.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadMarkdownGuide = () => {
    let mdContent = `# ${currentGuide.title}\n\n`;
    currentGuide.sections.forEach((sec) => {
      mdContent += `## ${sec.heading}\n\n${sec.content}\n\n`;
    });
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `USER_GUIDE_${selectedLang.toUpperCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="modal-user-guide"
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)', zIndex: 1060 }}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div className="modal-content bg-dark text-light border border-secondary shadow-lg">
          {/* Header */}
          <div className="modal-header border-secondary px-4 py-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 rounded bg-info bg-opacity-10 text-info">
                <BookOpen size={22} />
              </div>
              <div>
                <h5 className="modal-title fw-bold text-light mb-0">
                  KayBiT_CEHinteractive — User Guide
                </h5>
                <small className="text-secondary">
                  Certified Ethical Hacker (CEH v13) Self-Study Handbook • 18 Language Translations
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* 18-Language Dropdown Selector */}
              <div className="input-group input-group-sm" style={{ width: '230px' }}>
                <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary">
                  <Globe2 size={15} />
                </span>
                <select
                  id="select-guide-language"
                  className="form-select form-select-sm bg-dark text-light border-secondary"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                >
                  <option value="en">🇺🇸 English (Default)</option>
                  <option value="fr">🇫🇷 French (Français)</option>
                  <option value="de">🇩🇪 German (Deutsch)</option>
                  <option value="es">🇪🇸 Spanish (Español)</option>
                  <option value="it">🇮🇹 Italian (Italiano)</option>
                  <option value="pt">🇧🇷 Portuguese (Português)</option>
                  <option value="id">🇮🇩 Indonesian (Bahasa Indonesia)</option>
                  <option value="sw">🇰🇪 Swahili (Kiswahili)</option>
                  <option value="tr">🇹🇷 Turkish (Türkçe)</option>
                  <option value="ru">🇷🇺 Russian (Русский)</option>
                  <option value="zh">🇨🇳 Chinese (简体中文)</option>
                  <option value="ja">🇯🇵 Japanese (日本語)</option>
                  <option value="ar">🇸🇦 Arabic (العربية - RTL)</option>
                  <option value="ur">🇵🇰 Urdu (اردو - RTL)</option>
                  <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
                  <option value="mr">🇮🇳 Marathi (मराठी)</option>
                  <option value="bn">🇧🇩 Bengali (বাংলা)</option>
                  <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
                  <option value="te">🇮🇳 Telugu (తెలుగు)</option>
                </select>
              </div>

              {/* Download Markdown button */}
              <button
                id="btn-download-user-guide-md"
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                onClick={downloadMarkdownGuide}
                title="Download this localized guide as USER_GUIDE.md"
              >
                <Download size={14} />
                <span className="d-none d-md-inline">Save .md</span>
              </button>

              {/* Close Button */}
              <button
                id="btn-close-guide-modal"
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Search Filter Bar */}
          <div className="bg-dark px-4 py-2 border-bottom border-secondary">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary">
                <Search size={14} />
              </span>
              <input
                type="text"
                id="input-guide-search"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Search guide topics (e.g., Nmap, Mock Quiz, Offline, AcroForms)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Body with localized content */}
          <div
            className="modal-body px-4 py-4"
            dir={isRtl ? 'rtl' : 'ltr'}
            style={{ textAlign: isRtl ? 'right' : 'left' }}
          >
            <div className="p-3 mb-4 rounded border border-info border-opacity-25 bg-info bg-opacity-10 d-flex align-items-center justify-content-between">
              <div>
                <span className="badge bg-info text-dark me-2">
                  {currentGuide.flag} {currentGuide.name}
                </span>
                <span className="text-light fw-semibold">{currentGuide.title}</span>
              </div>
              <span className="badge bg-secondary bg-opacity-50 text-light small">
                {currentGuide.sections.length} Sections Available
              </span>
            </div>

            {filteredSections.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <p>No matching sections found for "{searchQuery}".</p>
                <button
                  className="btn btn-sm btn-outline-info"
                  onClick={() => setSearchQuery('')}
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredSections.map((sec, idx) => (
                  <div key={idx} className="col-12">
                    <div className="card bg-black bg-opacity-40 border-secondary h-100 p-4">
                      <h6 className="text-info fw-bold mb-2 d-flex align-items-center gap-2">
                        <span className="badge bg-secondary bg-opacity-25 text-info border border-secondary">
                          {idx + 1}
                        </span>
                        {sec.heading}
                      </h6>
                      <p className="text-secondary small mb-0 lh-lg" style={{ color: '#c9d1d9' }}>
                        {sec.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-secondary px-4 py-2 justify-content-between">
            <span className="text-secondary small">
              All 18 international languages included • Translated for global student accessibility
            </span>
            <button
              id="btn-close-guide-footer"
              type="button"
              className="btn btn-info btn-sm px-4"
              onClick={onClose}
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
