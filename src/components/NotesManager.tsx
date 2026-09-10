import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  FileText,
  Save,
  Download,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Check,
  X,
  Filter,
  Mic,
  MicOff,
  Radio,
  ChevronDown,
  AlertCircle,
  Plus
} from 'lucide-react';
import { StudentNote } from '../types';

// Web Speech API TypeScript Interfaces
interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface ISpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

const getSpeechRecognitionConstructor = (): (new () => ISpeechRecognitionInstance) | null => {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: new () => ISpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => ISpeechRecognitionInstance;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
};

interface NotesManagerProps {
  notes?: StudentNote[];
  onSaveNote: (note: StudentNote, options?: { silent?: boolean }) => void;
  onDeleteNote: (id: string) => void;
  domainCodes?: { code: string; title: string }[];
}

export const NotesManager: React.FC<NotesManagerProps> = ({
  notes = [],
  onSaveNote,
  onDeleteNote,
  domainCodes = []
}) => {
  const initialNote = notes[0];
  const [selectedNoteId, setSelectedNoteId] = useState<string>(initialNote?.id || `note-${Date.now()}`);
  const [activeTitle, setActiveTitle] = useState<string>(initialNote?.title || 'New Study Note');
  const [activeContent, setActiveContent] = useState<string>(initialNote?.content || '');
  const [activeDomain, setActiveDomain] = useState<string>(initialNote?.domainCode || 'GENERAL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchScope, setSearchScope] = useState<'all' | 'title' | 'content'>('all');
  const [searchDomainFilter, setSearchDomainFilter] = useState<string>('ALL');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Web Speech API / Dictation state
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isDictateMenuOpen, setIsDictateMenuOpen] = useState<boolean>(false);
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);
  const dictateMenuRef = useRef<HTMLDivElement>(null);

  // Auto-save debounce state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'dirty' | 'saving'>('saved');
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string | null>(null);
  const [manualSavedFeedback, setManualSavedFeedback] = useState<boolean>(false);

  // Mutable ref to always hold latest values without triggering re-renders
  const activeDataRef = useRef({
    id: selectedNoteId,
    title: activeTitle,
    content: activeContent,
    domainCode: activeDomain
  });
  activeDataRef.current = {
    id: selectedNoteId,
    title: activeTitle,
    content: activeContent,
    domainCode: activeDomain
  };

  // Track last committed values to detect genuine changes
  const lastCommittedRef = useRef<{
    id: string;
    title: string;
    content: string;
    domainCode: string;
  }>({
    id: selectedNoteId,
    title: activeTitle,
    content: activeContent,
    domainCode: activeDomain
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Commit save to memory and persistent LocalStorage
  const commitSave = useCallback(
    (isManual = false) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      const { id, title, content, domainCode } = activeDataRef.current;
      const noteToSave: StudentNote = {
        id,
        title: title.trim() || 'Untitled Note',
        content,
        domainCode,
        updatedAt: new Date().toISOString()
      };

      // Call parent onSaveNote with silent option for auto-save
      onSaveNote(noteToSave, { silent: !isManual });

      // Immediate fail-safe direct write to LocalStorage
      try {
        const stored = localStorage.getItem('kaybit_ceh_notes_v1');
        const currentList: StudentNote[] = stored ? JSON.parse(stored) : [];
        const exists = currentList.some((n) => n.id === noteToSave.id);
        const updatedList = exists
          ? currentList.map((n) => (n.id === noteToSave.id ? noteToSave : n))
          : [noteToSave, ...currentList];
        localStorage.setItem('kaybit_ceh_notes_v1', JSON.stringify(updatedList));
      } catch (e) {
        console.warn('Fallback direct localStorage write:', e);
      }

      lastCommittedRef.current = {
        id,
        title,
        content,
        domainCode
      };

      setSaveStatus('saved');
      const timeStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastSavedTimestamp(timeStr);

      if (isManual) {
        setManualSavedFeedback(true);
        setTimeout(() => setManualSavedFeedback(false), 2200);
      }
    },
    [onSaveNote]
  );

  // Debounce effect: triggers 800ms after user stops typing
  useEffect(() => {
    const committed = lastCommittedRef.current;
    const isDifferent =
      activeDataRef.current.id !== committed.id ||
      activeDataRef.current.title !== committed.title ||
      activeDataRef.current.content !== committed.content ||
      activeDataRef.current.domainCode !== committed.domainCode;

    if (!isDifferent) {
      return;
    }

    setSaveStatus('dirty');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setSaveStatus('saving');
      commitSave(false);
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [activeTitle, activeContent, activeDomain, selectedNoteId, commitSave]);

  // Flush pending changes when unmounting component
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        const committed = lastCommittedRef.current;
        if (
          activeDataRef.current.title !== committed.title ||
          activeDataRef.current.content !== committed.content ||
          activeDataRef.current.domainCode !== committed.domainCode
        ) {
          const { id, title, content, domainCode } = activeDataRef.current;
          onSaveNote(
            {
              id,
              title: title.trim() || 'Untitled Note',
              content,
              domainCode,
              updatedAt: new Date().toISOString()
            },
            { silent: true }
          );
        }
      }
    };
  }, [onSaveNote]);

  // Keyboard shortcut: pressing '/' (outside form inputs) or 'Ctrl+K' / 'Cmd+K' focuses the search filter bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

      if ((e.key === '/' && !isTyping) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dictate menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dictateMenuRef.current && !dictateMenuRef.current.contains(event.target as Node)) {
        setIsDictateMenuOpen(false);
      }
    };
    if (isDictateMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDictateMenuOpen]);

  // Clean up Web Speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }
    };
  }, []);

  // Helper to highlight matching keywords within title or content
  const highlightMatch = (text: string, query: string): React.ReactNode => {
    const q = query.trim();
    if (!q) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    if (parts.length === 1) return text;
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-warning bg-opacity-30 text-warning px-0.5 rounded fw-semibold"
          style={{ padding: '0 2px' }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Helper to extract a smart contextual excerpt around the matched search term in note content
  const getContextSnippet = (content: string, query: string): { snippet: string; matchedInContent: boolean } => {
    if (!content) return { snippet: 'Empty note', matchedInContent: false };
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        snippet: content.substring(0, 80) + (content.length > 80 ? '...' : ''),
        matchedInContent: false
      };
    }
    const idx = content.toLowerCase().indexOf(q);
    if (idx === -1) {
      return {
        snippet: content.substring(0, 80) + (content.length > 80 ? '...' : ''),
        matchedInContent: false
      };
    }
    const start = Math.max(0, idx - 25);
    const end = Math.min(content.length, idx + q.length + 50);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < content.length ? '...' : '';
    return {
      snippet: `${prefix}${content.substring(start, end)}${suffix}`,
      matchedInContent: true
    };
  };

  // Real-time filtered notes with scope & domain support
  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes.filter((n) => {
      // Domain filter check
      if (searchDomainFilter !== 'ALL' && n.domainCode !== searchDomainFilter) {
        return false;
      }

      if (!q) return true;

      const titleMatches = (n.title || '').toLowerCase().includes(q);
      const contentMatches = (n.content || '').toLowerCase().includes(q);
      const domainMatches = (n.domainCode || '').toLowerCase().includes(q);

      if (searchScope === 'title') {
        return titleMatches;
      }
      if (searchScope === 'content') {
        return contentMatches;
      }
      // 'all' includes title, content, and domain code
      return titleMatches || contentMatches || domainMatches;
    });
  }, [notes, searchQuery, searchScope, searchDomainFilter]);

  const handleSelectNote = (n: StudentNote) => {
    if (n.id === selectedNoteId) return;

    // If current note had unsaved changes, commit them before switching
    const committed = lastCommittedRef.current;
    const hasUnsaved =
      activeDataRef.current.id === committed.id &&
      (activeDataRef.current.title !== committed.title ||
        activeDataRef.current.content !== committed.content ||
        activeDataRef.current.domainCode !== committed.domainCode);

    if (hasUnsaved) {
      commitSave(false);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSelectedNoteId(n.id);
    setActiveTitle(n.title);
    setActiveContent(n.content);
    setActiveDomain(n.domainCode || 'GENERAL');

    lastCommittedRef.current = {
      id: n.id,
      title: n.title,
      content: n.content,
      domainCode: n.domainCode || 'GENERAL'
    };
    setSaveStatus('saved');
  };

  const handleCreateNew = () => {
    // Flush current note if unsaved
    const committed = lastCommittedRef.current;
    const hasUnsaved =
      activeDataRef.current.id === committed.id &&
      (activeDataRef.current.title !== committed.title ||
        activeDataRef.current.content !== committed.content ||
        activeDataRef.current.domainCode !== committed.domainCode);

    if (hasUnsaved) {
      commitSave(false);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const newId = `note-${Date.now()}`;
    const defaultTitle = 'New Study Note';
    const defaultContent = '';
    const defaultDomain = 'GENERAL';

    setSelectedNoteId(newId);
    setActiveTitle(defaultTitle);
    setActiveContent(defaultContent);
    setActiveDomain(defaultDomain);

    lastCommittedRef.current = {
      id: newId,
      title: defaultTitle,
      content: defaultContent,
      domainCode: defaultDomain
    };
    setSaveStatus('saved');
  };

  const handleDelete = (id: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    onDeleteNote(id);
    const remaining = notes.filter((n) => n.id !== id);
    if (remaining.length > 0) {
      handleSelectNote(remaining[0]);
    } else {
      handleCreateNew();
    }
  };

  const handleManualSave = () => {
    commitSave(true);
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

  const stopDictation = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try {
          recognitionRef.current.abort();
        } catch (err) {}
      }
      recognitionRef.current = null;
    }
    setIsDictating(false);
    setInterimTranscript('');
  }, []);

  const startDictation = useCallback(
    (mode: 'append' | 'new_note' = 'append') => {
      setIsDictateMenuOpen(false);
      setSpeechError(null);

      const SpeechConstructor = getSpeechRecognitionConstructor();
      if (!SpeechConstructor) {
        setSpeechError(
          'Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or a supported Chromium browser with microphone access.'
        );
        return;
      }

      // If user requests a new note, create one and initialize its title
      if (mode === 'new_note') {
        const committed = lastCommittedRef.current;
        const hasUnsaved =
          activeDataRef.current.id === committed.id &&
          (activeDataRef.current.title !== committed.title ||
            activeDataRef.current.content !== committed.content ||
            activeDataRef.current.domainCode !== committed.domainCode);

        if (hasUnsaved) {
          commitSave(false);
        }

        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }

        const newId = `note-${Date.now()}`;
        const now = new Date();
        const defaultTitle = `Voice Note - ${now.toLocaleDateString([], {
          month: 'short',
          day: 'numeric'
        })} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const defaultContent = '';
        const defaultDomain = 'GENERAL';

        setSelectedNoteId(newId);
        setActiveTitle(defaultTitle);
        setActiveContent(defaultContent);
        setActiveDomain(defaultDomain);

        lastCommittedRef.current = {
          id: newId,
          title: defaultTitle,
          content: defaultContent,
          domainCode: defaultDomain
        };
        setSaveStatus('saved');
      }

      // Stop any active recognition instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }

      try {
        const recognition = new SpeechConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsDictating(true);
          setSpeechError(null);
          setInterimTranscript('');
        };

        recognition.onresult = (event: ISpeechRecognitionEvent) => {
          let currentInterim = '';
          let finalizedChunk = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item.isFinal) {
              finalizedChunk += item[0].transcript;
            } else {
              currentInterim += item[0].transcript;
            }
          }

          setInterimTranscript(currentInterim);

          if (finalizedChunk.trim()) {
            const textToAppend = finalizedChunk.trim();
            setActiveContent((prev) => {
              if (!prev.trim()) {
                return textToAppend;
              }
              const separator = prev.endsWith('\n') ? '\n' : ' ';
              return prev + separator + textToAppend;
            });
          }
        };

        recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
          console.warn('Speech recognition error event:', event.error);
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            setSpeechError(
              'Microphone permission was denied. Please allow microphone access in your browser settings to dictate notes.'
            );
            setIsDictating(false);
          } else if (event.error === 'no-speech') {
            // Keep listening during pauses
          } else if (event.error === 'network') {
            setSpeechError('Network error encountered by speech recognition service.');
            setIsDictating(false);
          } else if (event.error === 'audio-capture') {
            setSpeechError('No microphone detected or audio capture failed.');
            setIsDictating(false);
          } else {
            setSpeechError(`Speech recognition notice: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsDictating(false);
          setInterimTranscript('');
          recognitionRef.current = null;
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err: any) {
        console.error('Failed to initialize Web Speech API:', err);
        setSpeechError(err?.message || 'Failed to start microphone recognition.');
        setIsDictating(false);
      }
    },
    [commitSave]
  );

  const exportCurrentNote = () => {
    const blob = new Blob(
      [`# ${activeTitle}\nDomain: ${activeDomain}\nUpdated: ${new Date().toISOString()}\n\n${activeContent}`],
      {
        type: 'text/markdown;charset=utf-8'
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTitle.toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = activeContent.trim() ? activeContent.trim().split(/\s+/).length : 0;
  const charCount = activeContent.length;

  return (
    <div className="container-fluid px-3 py-4">
      {/* Header Banner */}
      <div className="card bg-dark border-secondary p-3 mb-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded bg-info bg-opacity-10 text-info">
              <FileText size={20} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0 text-light fw-bold">Permanent Offline Student Notes</h5>
                {/* Real-time Auto-Save Badge in Banner */}
                {saveStatus === 'saved' ? (
                  <span
                    id="badge-autosave-status"
                    className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-30 d-inline-flex align-items-center gap-1 font-monospace"
                    style={{ fontSize: '0.72rem' }}
                    title="All modifications safely saved to LocalStorage"
                  >
                    <CheckCircle2 size={12} />
                    <span>Auto-saved{lastSavedTimestamp ? ` • ${lastSavedTimestamp}` : ''}</span>
                  </span>
                ) : (
                  <span
                    id="badge-autosave-status"
                    className="badge bg-warning bg-opacity-15 text-warning border border-warning border-opacity-30 d-inline-flex align-items-center gap-1 font-monospace"
                    style={{ fontSize: '0.72rem' }}
                    title="Debouncing changes... will persist automatically"
                  >
                    <Clock size={12} />
                    <span>{saveStatus === 'saving' ? 'Saving to LocalStorage...' : 'Saving in 800ms...'}</span>
                  </span>
                )}
              </div>
              <small className="text-secondary">
                Auto-saved with 800ms debounce into HTML5 LocalStorage • Offline & zero data loss
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Dictate Note Button & Dropdown */}
            <div className="position-relative" ref={dictateMenuRef}>
              <div className="btn-group">
                <button
                  id="btn-dictate-note-main"
                  type="button"
                  className={`btn btn-sm d-flex align-items-center gap-1.5 fw-bold ${
                    isDictating ? 'btn-danger text-white' : 'btn-outline-info'
                  }`}
                  onClick={() => (isDictating ? stopDictation() : startDictation('append'))}
                  title={isDictating ? 'Stop microphone dictation' : 'Dictate note using Web Speech microphone'}
                >
                  {isDictating ? (
                    <>
                      <span
                        className="spinner-grow spinner-grow-sm text-white"
                        style={{ width: '10px', height: '10px' }}
                        role="status"
                      />
                      <MicOff size={14} />
                      <span>Stop Dictating</span>
                    </>
                  ) : (
                    <>
                      <Mic size={14} />
                      <span>Dictate Note</span>
                    </>
                  )}
                </button>
                {!isDictating && (
                  <button
                    id="btn-dictate-dropdown-toggle"
                    type="button"
                    className="btn btn-sm btn-outline-info dropdown-toggle dropdown-toggle-split px-1.5"
                    onClick={() => setIsDictateMenuOpen((prev) => !prev)}
                    title="Dictation options"
                  >
                    <ChevronDown size={13} />
                  </button>
                )}
              </div>

              {/* Dictate options menu */}
              {isDictateMenuOpen && (
                <div
                  id="menu-dictate-options"
                  className="position-absolute end-0 mt-1 p-1 bg-dark border border-secondary rounded shadow-lg"
                  style={{ zIndex: 1050, minWidth: '230px' }}
                >
                  <button
                    id="btn-dictate-append-current"
                    type="button"
                    className="btn btn-dark w-100 text-start d-flex align-items-center gap-2 p-2 rounded hover:bg-secondary hover:bg-opacity-25"
                    onClick={() => startDictation('append')}
                  >
                    <Mic size={15} className="text-info flex-shrink-0" />
                    <div>
                      <div className="small fw-semibold text-light">Append to Current Note</div>
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                        Dictates speech into "{activeTitle.substring(0, 18)}..."
                      </div>
                    </div>
                  </button>

                  <div className="dropdown-divider border-secondary my-1" />

                  <button
                    id="btn-dictate-create-new"
                    type="button"
                    className="btn btn-dark w-100 text-start d-flex align-items-center gap-2 p-2 rounded hover:bg-secondary hover:bg-opacity-25"
                    onClick={() => startDictation('new_note')}
                  >
                    <Plus size={15} className="text-success flex-shrink-0" />
                    <div>
                      <div className="small fw-semibold text-light">Dictate New Note</div>
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                        Creates a fresh note and begins dictation
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              id="btn-new-note"
              className="btn btn-info btn-sm text-dark fw-bold"
              onClick={handleCreateNew}
            >
              + New Note
            </button>
            <button
              id="btn-export-note-md"
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
            {/* Real-time Search Filter Bar */}
            <div className="p-3 border-bottom border-secondary bg-black bg-opacity-25">
              <div className="position-relative mb-2">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-info">
                    <Search size={14} />
                  </span>
                  <input
                    ref={searchInputRef}
                    id="input-search-notes"
                    type="text"
                    className="form-control bg-dark text-light border-secondary pe-5"
                    placeholder="Search title or content... (/ or Ctrl+K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchQuery('');
                      }
                    }}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  {searchQuery && (
                    <button
                      id="btn-clear-search-notes"
                      type="button"
                      className="btn btn-sm btn-outline-secondary border-secondary text-secondary position-absolute end-0 top-0 bottom-0 px-2 d-flex align-items-center justify-content-center"
                      style={{ zIndex: 5, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      title="Clear search query (Esc)"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Scope Pills and Live Match Counter */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 pt-1">
                <div className="btn-group btn-group-sm" role="group" aria-label="Search filter scope">
                  <button
                    id="btn-scope-all"
                    type="button"
                    className={`btn btn-xs py-0.5 px-2 font-monospace ${
                      searchScope === 'all'
                        ? 'btn-info text-dark fw-bold'
                        : 'btn-outline-secondary text-light'
                    }`}
                    style={{ fontSize: '0.72rem' }}
                    onClick={() => setSearchScope('all')}
                    title="Search both title and body content"
                  >
                    All
                  </button>
                  <button
                    id="btn-scope-title"
                    type="button"
                    className={`btn btn-xs py-0.5 px-2 font-monospace ${
                      searchScope === 'title'
                        ? 'btn-info text-dark fw-bold'
                        : 'btn-outline-secondary text-light'
                    }`}
                    style={{ fontSize: '0.72rem' }}
                    onClick={() => setSearchScope('title')}
                    title="Search title only"
                  >
                    Title
                  </button>
                  <button
                    id="btn-scope-content"
                    type="button"
                    className={`btn btn-xs py-0.5 px-2 font-monospace ${
                      searchScope === 'content'
                        ? 'btn-info text-dark fw-bold'
                        : 'btn-outline-secondary text-light'
                    }`}
                    style={{ fontSize: '0.72rem' }}
                    onClick={() => setSearchScope('content')}
                    title="Search note body content only"
                  >
                    Content
                  </button>
                </div>

                {/* Match Count Indicator */}
                <span
                  id="badge-search-match-count"
                  className={`small font-monospace ${
                    searchQuery ? 'text-info fw-semibold' : 'text-secondary'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                >
                  {searchQuery || searchDomainFilter !== 'ALL'
                    ? `${filteredNotes.length} of ${notes.length} match`
                    : `${notes.length} note${notes.length === 1 ? '' : 's'}`}
                </span>
              </div>

              {/* Optional Domain Filter Dropdown */}
              {domainCodes && domainCodes.length > 0 && (
                <div className="mt-2 pt-1">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-secondary bg-opacity-15 border-secondary text-secondary py-0 px-2" style={{ fontSize: '0.7rem' }}>
                      <Filter size={11} className="me-1" /> Module:
                    </span>
                    <select
                      id="select-search-domain-filter"
                      className="form-select form-select-sm bg-dark text-light border-secondary py-0"
                      style={{ fontSize: '0.72rem', height: '26px' }}
                      value={searchDomainFilter}
                      onChange={(e) => setSearchDomainFilter(e.target.value)}
                    >
                      <option value="ALL">All Modules ({notes.length})</option>
                      <option value="GENERAL">GENERAL</option>
                      {domainCodes.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.code}: {d.title.substring(0, 24)}...
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Filtered Notes List */}
            <div className="list-group list-group-flush overflow-y-auto" style={{ maxHeight: '600px' }}>
              {filteredNotes.length === 0 ? (
                <div className="p-4 text-center text-secondary">
                  <div className="mb-2 text-secondary opacity-50">
                    <Search size={28} className="mx-auto" />
                  </div>
                  <p className="small mb-1 fw-semibold text-light">No notes match your filter</p>
                  <p className="small text-secondary mb-3 lh-sm" style={{ fontSize: '0.76rem' }}>
                    {searchQuery
                      ? `No matches for "${searchQuery}" in ${
                          searchScope === 'all' ? 'title or content' : searchScope
                        }${searchDomainFilter !== 'ALL' ? ` (${searchDomainFilter})` : ''}.`
                      : 'No notes in this module.'}
                  </p>
                  <button
                    id="btn-reset-search-filter"
                    type="button"
                    className="btn btn-outline-info btn-sm px-3 d-inline-flex align-items-center gap-1.5"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchScope('all');
                      setSearchDomainFilter('ALL');
                      searchInputRef.current?.focus();
                    }}
                  >
                    <X size={13} />
                    <span>Reset Filter</span>
                  </button>
                </div>
              ) : (
                filteredNotes.map((n) => {
                  const isSelected = n.id === selectedNoteId;
                  const { snippet, matchedInContent } = getContextSnippet(n.content || '', searchQuery);

                  return (
                    <button
                      key={n.id}
                      id={`btn-note-item-${n.id}`}
                      className={`list-group-item list-group-item-action border-secondary py-2.5 px-3 text-start ${
                        isSelected ? 'bg-info text-dark fw-semibold' : 'bg-dark text-light'
                      }`}
                      onClick={() => handleSelectNote(n)}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small text-truncate me-2" style={{ maxWidth: '180px' }}>
                          {highlightMatch(n.title, searchQuery)}
                        </span>
                        <div className="d-flex align-items-center gap-1 flex-shrink-0">
                          {matchedInContent && searchQuery && searchScope !== 'title' && (
                            <span
                              className={`badge ${
                                isSelected
                                  ? 'bg-dark text-warning'
                                  : 'bg-warning bg-opacity-15 text-warning border border-warning border-opacity-30'
                              }`}
                              style={{ fontSize: '0.62rem', padding: '1px 4px' }}
                              title="Search match found in note body"
                            >
                              content
                            </span>
                          )}
                          <span
                            className={`badge font-monospace ${
                              isSelected ? 'bg-dark text-info' : 'bg-secondary bg-opacity-25 text-secondary'
                            }`}
                            style={{ fontSize: '0.68rem' }}
                          >
                            {n.domainCode}
                          </span>
                        </div>
                      </div>
                      <small
                        className={`d-block text-truncate ${
                          isSelected ? 'text-dark text-opacity-75' : 'text-secondary'
                        }`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {highlightMatch(snippet, searchQuery)}
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
                    id="input-note-title"
                    type="text"
                    className="form-control bg-dark text-light border-secondary fw-bold"
                    placeholder="Note Title..."
                    value={activeTitle}
                    onChange={(e) => setActiveTitle(e.target.value)}
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <select
                    id="select-note-domain"
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    value={activeDomain}
                    onChange={(e) => setActiveDomain(e.target.value)}
                  >
                    <option value="GENERAL">General Overview</option>
                    {(domainCodes || []).map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code}: {d.title.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Template Inserts & Auto-Save status */}
            <div className="px-3 py-2 bg-black bg-opacity-30 border-bottom border-secondary d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                  Insert Cheat Sheet:
                </span>
                <button
                  id="btn-template-nmap"
                  type="button"
                  className="btn btn-outline-secondary btn-sm py-0 px-2"
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => insertTemplate('nmap')}
                >
                  + Nmap Evasion
                </button>
                <button
                  id="btn-template-sqli"
                  type="button"
                  className="btn btn-outline-secondary btn-sm py-0 px-2"
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => insertTemplate('sqli')}
                >
                  + SQLi Payloads
                </button>
                <button
                  id="btn-template-privesc"
                  type="button"
                  className="btn btn-outline-secondary btn-sm py-0 px-2"
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => insertTemplate('privesc')}
                >
                  + Privilege Escalation
                </button>

                <div className="vr bg-secondary opacity-50 mx-1 d-none d-sm-block" />

                <button
                  id="btn-dictate-inline-toggle"
                  type="button"
                  className={`btn btn-sm py-0 px-2 d-flex align-items-center gap-1 ${
                    isDictating
                      ? 'btn-danger text-white fw-bold'
                      : 'btn-outline-info text-info'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => (isDictating ? stopDictation() : startDictation('append'))}
                  title={isDictating ? 'Stop microphone dictation' : 'Speak to dictate and append to this note'}
                >
                  {isDictating ? (
                    <>
                      <span
                        className="spinner-grow spinner-grow-sm text-white"
                        style={{ width: '8px', height: '8px' }}
                        role="status"
                      />
                      <MicOff size={11} />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Mic size={11} />
                      <span>Dictate (Mic)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Character & Word counter */}
              <div id="text-note-stats" className="text-secondary small font-monospace" style={{ fontSize: '0.72rem' }}>
                {wordCount} words • {charCount} chars
              </div>
            </div>

            {/* Textarea */}
            <div className="card-body p-3">
              {/* Active Dictation Live Feedback Banner */}
              {isDictating && (
                <div
                  id="banner-active-dictation"
                  className="mb-3 p-3 rounded border border-danger border-opacity-40 bg-danger bg-opacity-10 shadow-sm"
                >
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="spinner-grow spinner-grow-sm text-danger"
                        role="status"
                        style={{ width: '12px', height: '12px' }}
                      />
                      <span className="fw-bold text-danger d-flex align-items-center gap-1 small font-monospace">
                        <Radio size={14} className="text-danger" />
                        <span>LISTENING TO MICROPHONE...</span>
                      </span>
                      <span
                        className="badge bg-dark text-info border border-secondary font-monospace"
                        style={{ fontSize: '0.68rem' }}
                      >
                        Active note: {activeTitle}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        id="btn-dictation-stop-banner"
                        type="button"
                        className="btn btn-danger btn-sm py-0.5 px-3 d-flex align-items-center gap-1.5 fw-bold"
                        style={{ fontSize: '0.75rem' }}
                        onClick={stopDictation}
                      >
                        <MicOff size={13} />
                        <span>Stop Dictating</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-time transcript preview */}
                  <div className="bg-black bg-opacity-50 p-2.5 rounded border border-secondary border-opacity-50">
                    <small className="text-secondary d-block mb-1" style={{ fontSize: '0.7rem' }}>
                      Live Transcribed Speech:
                    </small>
                    <div
                      id="text-live-speech-preview"
                      className="font-monospace small text-light"
                      style={{ minHeight: '22px' }}
                    >
                      {interimTranscript ? (
                        <span className="text-info fst-italic">"{interimTranscript}..."</span>
                      ) : (
                        <span className="text-secondary opacity-75">
                          Speak clearly into your microphone (say notes, commands, or answers)...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Speech Recognition Error Banner */}
              {speechError && (
                <div
                  id="alert-speech-error"
                  className="alert alert-warning alert-dismissible fade show p-2.5 mb-3 d-flex align-items-start gap-2 small"
                  role="alert"
                >
                  <AlertCircle size={18} className="text-warning flex-shrink-0 mt-0.5" />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">Microphone / Speech Notice</div>
                    <div>{speechError}</div>
                  </div>
                  <button
                    id="btn-dismiss-speech-error"
                    type="button"
                    className="btn-close p-2"
                    aria-label="Close"
                    onClick={() => setSpeechError(null)}
                  />
                </div>
              )}

              <textarea
                id="textarea-note-content"
                className="form-control bg-black text-light border-secondary font-monospace"
                rows={16}
                placeholder="Write your technical notes, payloads, exam formulas, or MITRE ATT&CK mappings here..."
                value={activeContent}
                onChange={(e) => setActiveContent(e.target.value)}
              />
            </div>

            {/* Footer with Auto-Save status & buttons */}
            <div className="card-footer bg-dark border-secondary p-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                {notes.length > 1 && (
                  <button
                    id="btn-delete-note"
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleDelete(selectedNoteId)}
                  >
                    <Trash2 size={14} />
                    <span>Delete Note</span>
                  </button>
                )}
              </div>

              {/* Status and manual Save button */}
              <div className="d-flex align-items-center gap-3">
                {saveStatus === 'saved' ? (
                  <span
                    id="status-autosave-footer"
                    className="small text-success d-flex align-items-center gap-1 font-monospace"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Auto-saved to LocalStorage{lastSavedTimestamp ? ` (${lastSavedTimestamp})` : ''}</span>
                  </span>
                ) : (
                  <span
                    id="status-autosave-footer"
                    className="small text-warning d-flex align-items-center gap-1 font-monospace"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <Clock size={14} />
                    <span>{saveStatus === 'saving' ? 'Saving to LocalStorage...' : 'Unsaved changes (saving in 800ms)'}</span>
                  </span>
                )}

                <button
                  id="btn-save-note"
                  className={`btn btn-sm ${
                    manualSavedFeedback ? 'btn-success' : 'btn-info text-dark fw-bold'
                  } d-flex align-items-center gap-1 px-4`}
                  onClick={handleManualSave}
                >
                  {manualSavedFeedback ? <Check size={15} /> : <Save size={15} />}
                  <span>{manualSavedFeedback ? 'Saved!' : 'Save Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
