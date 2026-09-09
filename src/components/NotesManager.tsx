import React, { useState } from 'react';
import {
  FileText,
  Save,
  Download,
  Trash2,
  Sparkles,
  Search,
  Tag,
  CheckCircle
} from 'lucide-react';
import { StudentNote } from '../types';

interface NotesManagerProps {
  notes: StudentNote[];
  onSaveNote: (note: StudentNote) => void;
  onDeleteNote: (id: string) => void;
  domainCodes: { code: string; title: string }[];
}

export const NotesManager: React.FC<NotesManagerProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  domainCodes
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || 'new');
  const [activeTitle, setActiveTitle] = useState<string>(notes[0]?.title || '');
  const [activeContent, setActiveContent] = useState<string>(notes[0]?.content || '');
  const [activeDomain, setActiveDomain] = useState<string>(notes[0]?.domainCode || 'GENERAL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.domainCode || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectNote = (n: StudentNote) => {
    setSelectedNoteId(n.id);
    setActiveTitle(n.title);
    setActiveContent(n.content);
    setActiveDomain(n.domainCode || 'GENERAL');
  };

  const handleCreateNew = () => {
    const newId = `note-${Date.now()}`;
    setSelectedNoteId(newId);
    setActiveTitle('New Study Note');
    setActiveContent('');
    setActiveDomain('GENERAL');
  };

  const handleSave = () => {
    const noteToSave: StudentNote = {
      id: selectedNoteId === 'new' ? `note-${Date.now()}` : selectedNoteId,
      title: activeTitle.trim() || 'Untitled Note',
      content: activeContent,
      domainCode: activeDomain,
      updatedAt: new Date().toISOString()
    };
    onSaveNote(noteToSave);
    setSelectedNoteId(noteToSave.id);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const insertTemplate = (type: 'nmap' | 'sqli' | 'privesc') => {
    if (type === 'nmap') {
      setActiveContent((prev) =>
        prev +
        `\n\n### Tactical Nmap Flags\n- SYN Stealth: \`nmap -sS -T4 -p- <target>\`\n- Evasion Decoys: \`nmap -sS -D RND:5 -g 53 <target>\`\n- Vuln Engine: \`nmap --script=vuln -sV <target>\``
      );
    } else if (type === 'sqli') {
      setActiveContent((prev) =>
        prev +
        `\n\n### SQL Injection Quick Reference\n- Auth Bypass: \`' OR 1=1 -- -\`\n- UNION Column Check: \`' UNION SELECT NULL, NULL, NULL -- -\`\n- DB Version: \`' UNION SELECT @@version, user() -- -\``
      );
    } else if (type === 'privesc') {
      setActiveContent((prev) =>
        prev +
        `\n\n### Privilege Escalation Checklist\n- Linux: \`sudo -l\`, SUID binaries (\`find / -perm -u=s -type f 2>/dev/null\`)\n- Windows: \`whoami /priv\`, Unquoted Service Paths, SeImpersonatePrivilege (\`PrintSpoofer\`)`
      );
    }
  };

  const exportCurrentNote = () => {
    const blob = new Blob([`# ${activeTitle}\nDomain: ${activeDomain}\nUpdated: ${new Date().toISOString()}\n\n${activeContent}`], {
      type: 'text/markdown;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTitle.toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid px-3 py-4">
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded bg-info bg-opacity-10 text-info">
              <FileText size={20} />
            </div>
            <div>
              <h5 className="mb-0 text-light fw-bold">Permanent Offline Student Notes</h5>
              <small className="text-secondary">
                Saved instantly in browser HTML5 LocalStorage • Zero external database required
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-info btn-sm text-dark fw-bold" onClick={handleCreateNew}>
              + New Note
            </button>
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={exportCurrentNote}
              title="Download current note as Markdown"
            >
              <Download size={14} />
              <span>Export .md</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Notes List Column */}
        <div className="col-12 col-md-4">
          <div className="card bg-dark border-secondary shadow-sm mb-3">
            <div className="p-2.5 border-bottom border-secondary">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="list-group list-group-flush overflow-y-auto" style={{ maxHeight: '600px' }}>
              {filteredNotes.length === 0 ? (
                <div className="p-4 text-center text-secondary small">No notes found.</div>
              ) : (
                filteredNotes.map((n) => {
                  const isSelected = n.id === selectedNoteId;
                  return (
                    <button
                      key={n.id}
                      className={`list-group-item list-group-item-action border-secondary py-2.5 px-3 ${
                        isSelected ? 'bg-info text-dark fw-semibold' : 'bg-dark text-light'
                      }`}
                      onClick={() => handleSelectNote(n)}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small text-truncate" style={{ maxWidth: '180px' }}>
                          {n.title}
                        </span>
                        <span
                          className={`badge font-monospace ${
                            isSelected ? 'bg-dark text-info' : 'bg-secondary bg-opacity-25 text-secondary'
                          }`}
                          style={{ fontSize: '0.68rem' }}
                        >
                          {n.domainCode}
                        </span>
                      </div>
                      <small
                        className={`d-block text-truncate ${
                          isSelected ? 'text-dark text-opacity-75' : 'text-secondary'
                        }`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {n.content || 'Empty note'}
                      </small>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Note Editor Column */}
        <div className="col-12 col-md-8">
          <div className="card bg-dark border-secondary shadow-sm">
            <div className="card-header bg-dark border-secondary p-3">
              <div className="row g-2 align-items-center">
                <div className="col-12 col-sm-8">
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary fw-bold"
                    placeholder="Note Title..."
                    value={activeTitle}
                    onChange={(e) => setActiveTitle(e.target.value)}
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <select
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    value={activeDomain}
                    onChange={(e) => setActiveDomain(e.target.value)}
                  >
                    <option value="GENERAL">General Overview</option>
                    {domainCodes.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code}: {d.title.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Template Inserts */}
            <div className="px-3 py-2 bg-black bg-opacity-30 border-bottom border-secondary d-flex flex-wrap align-items-center gap-2">
              <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                Insert Cheat Sheet Template:
              </span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm py-0 px-2"
                style={{ fontSize: '0.72rem' }}
                onClick={() => insertTemplate('nmap')}
              >
                + Nmap Evasion
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm py-0 px-2"
                style={{ fontSize: '0.72rem' }}
                onClick={() => insertTemplate('sqli')}
              >
                + SQLi Payloads
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm py-0 px-2"
                style={{ fontSize: '0.72rem' }}
                onClick={() => insertTemplate('privesc')}
              >
                + Privilege Escalation
              </button>
            </div>

            <div className="card-body p-3">
              <textarea
                className="form-control bg-black text-light border-secondary font-monospace"
                rows={16}
                placeholder="Write your technical notes, payloads, exam formulas, or MITRE ATT&CK mappings here..."
                value={activeContent}
                onChange={(e) => setActiveContent(e.target.value)}
              />
            </div>

            <div className="card-footer bg-dark border-secondary p-3 d-flex justify-content-between align-items-center">
              <div>
                {notes.length > 1 && (
                  <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    onClick={() => onDeleteNote(selectedNoteId)}
                  >
                    <Trash2 size={14} />
                    <span>Delete Note</span>
                  </button>
                )}
              </div>

              <button
                className={`btn btn-sm ${
                  savedFeedback ? 'btn-success' : 'btn-info text-dark fw-bold'
                } d-flex align-items-center gap-1 px-4`}
                onClick={handleSave}
              >
                {savedFeedback ? <CheckCircle size={15} /> : <Save size={15} />}
                <span>{savedFeedback ? 'Saved to LocalStorage!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
