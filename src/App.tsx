import React, { useState, useEffect } from 'react';
import { CEHDomain, QuizQuestion, StudentNote, QuizScoreRecord } from './types';
import { INITIAL_CEH_DOMAINS } from './data/cehDomains';
import { INITIAL_MOCK_QUESTIONS } from './data/mockQuestions';
import { Navbar } from './components/Navbar';
import { DomainTracker } from './components/DomainTracker';
import { MockQuizEngine } from './components/MockQuizEngine';
import { Flashcards } from './components/Flashcards';
import { Leaderboard } from './components/Leaderboard';
import { ScannerToolsSuite } from './components/ScannerToolsSuite';
import { CheatSheetViewer } from './components/CheatSheetViewer';
import { NotesManager } from './components/NotesManager';
import { PackagingSuite } from './components/PackagingSuite';
import { UserGuideModal } from './components/UserGuideModal';
import { generateInteractiveAcroFormPdf } from './utils/pdfGenerator';
import { exportSingleFileHtmlApp } from './utils/htmlExporter';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const STORAGE_KEYS = {
  DOMAINS: 'kaybit_ceh_domains_v1',
  QUESTIONS: 'kaybit_ceh_questions_v1',
  NOTES: 'kaybit_ceh_notes_v1',
  HISTORY: 'kaybit_ceh_history_v1',
  EXAM_DATE: 'kaybit_ceh_exam_date_v1',
  STUDENT_NAME: 'kaybit_ceh_student_name_v1',
  THEME: 'kaybit_ceh_theme_v1'
};

const DEFAULT_INITIAL_NOTES: StudentNote[] = [
  {
    id: 'note-default-1',
    title: 'CEH v13 Exam Strategy & Key Formulae',
    content: `# Certified Ethical Hacker (CEH v13) Tactical Study Notes
- Total Exam Questions: 125 Multiple Choice
- Duration: 4 Hours (240 Minutes)
- Passing Score: Scaled cut-score between 70% and 80%

## High Priority Port Cheat Sheet
- Port 21: FTP (Check anonymous login)
- Port 22: SSH (V2 vs V1, key exchange)
- Port 53: DNS (UDP for queries, TCP 53 for AXFR Zone Transfers)
- Port 88: Kerberos (AS-REQ / AS-REP Roasting)
- Port 135: RPC Endpoint Mapper
- Port 139 / 445: NetBIOS / SMB (EternalBlue CVE-2017-0144, SMB signing)
- Port 161/162: SNMP (Public / Private community strings v1/v2c)
- Port 389 / 636: LDAP / LDAPS
- Port 3389: RDP (BlueKeep CVE-2019-0708)

## Nmap Evasion Essentials
- Packet Fragmentation: \`nmap -f <target>\` or \`--mtu 24\`
- Decoy IPs: \`nmap -D RND:5 <target>\`
- Source Port Spoofing: \`nmap -g 53 <target>\`
- Data Padding: \`nmap --data-length 25 <target>\``,
    domainCode: 'MOD-03',
    updatedAt: new Date().toISOString()
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('domains');
  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 0. Theme State: 'dark' (default) or 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.warn('Failed to load theme preference:', e);
    }
    return 'dark';
  });

  // Apply theme attributes to document & meta tags
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-bs-theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
        document.documentElement.classList.remove('theme-dark');
      } else {
        document.documentElement.classList.add('theme-dark');
        document.documentElement.classList.remove('theme-light');
      }
      localStorage.setItem(STORAGE_KEYS.THEME, theme);

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0d1117' : '#ffffff');
      }
    } catch (e) {
      console.warn('Failed to sync theme to DOM/storage:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
      return nextTheme;
    });
  };

  // 1. Domains State with LocalStorage
  const [domains, setDomains] = useState<CEHDomain[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOMAINS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load domains from storage:', e);
    }
    return INITIAL_CEH_DOMAINS;
  });

  // 2. Mock Questions State with LocalStorage
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (saved) {
        const parsed: QuizQuestion[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((q) => q.id));
        const missingDefaults = INITIAL_MOCK_QUESTIONS.filter((q) => !existingIds.has(q.id));
        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults];
          localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load questions from storage:', e);
    }
    return INITIAL_MOCK_QUESTIONS;
  });

  // 3. Notes State with LocalStorage
  const [notes, setNotes] = useState<StudentNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load notes from storage:', e);
    }
    return DEFAULT_INITIAL_NOTES;
  });

  // 4. Score History State with LocalStorage
  const [quizHistory, setQuizHistory] = useState<QuizScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load quiz history from storage:', e);
    }
    return [];
  });

  // 5. Target Exam Date
  const [targetExamDate, setTargetExamDate] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.EXAM_DATE) || '2026-12-15';
  });

  // 6. Active domain filter for quiz
  const [activeQuizDomain, setActiveQuizDomain] = useState<string>('all');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(domains));
    } catch (e) {
      console.warn('Error saving domains to localStorage:', e);
    }
  }, [domains]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.warn('Error saving questions to localStorage:', e);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn('Error saving notes to localStorage:', e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(quizHistory));
    } catch (e) {
      console.warn('Error saving quiz history to localStorage:', e);
    }
  }, [quizHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateDomain = (updatedDomain: CEHDomain) => {
    setDomains((prev) => prev.map((d) => (d.code === updatedDomain.code ? updatedDomain : d)));
  };

  const handleSelectDomainForQuiz = (domainCode: string) => {
    setActiveQuizDomain(domainCode);
    setActiveTab('quiz');
  };

  const handleUpdateExamDate = (date: string) => {
    setTargetExamDate(date);
    localStorage.setItem(STORAGE_KEYS.EXAM_DATE, date);
    showToast('Target exam date updated!');
  };

  const handleAddCustomQuestion = (newQuestion: QuizQuestion) => {
    setQuestions((prev) => [newQuestion, ...prev]);
    showToast('Custom question saved to local question bank!');
  };

  const handleImportQuestions = (imported: QuizQuestion[]) => {
    setQuestions(imported);
    showToast(`Loaded ${imported.length} questions into offline bank!`);
  };

  const handleSaveScoreRecord = (record: QuizScoreRecord) => {
    setQuizHistory((prev) => [record, ...prev]);
    showToast(`Exam assessment score (${record.score}%) recorded!`);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all recorded exam scores?')) {
      setQuizHistory([]);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      showToast('Exam history cleared.');
    }
  };

  const handleSaveNote = (note: StudentNote, options?: { silent?: boolean }) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === note.id);
      if (exists) {
        return prev.map((n) => (n.id === note.id ? note : n));
      }
      return [note, ...prev];
    });
    if (!options?.silent) {
      showToast('Note saved to LocalStorage!');
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Note deleted.');
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all domain checklists and quiz history to initial state?')) {
      localStorage.removeItem(STORAGE_KEYS.DOMAINS);
      localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      setDomains(INITIAL_CEH_DOMAINS);
      setQuestions(INITIAL_MOCK_QUESTIONS);
      setNotes(DEFAULT_INITIAL_NOTES);
      setQuizHistory([]);
      showToast('All data reset to default factory state.');
    }
  };

  const handleAddSampleHistory = () => {
    const sampleRecords: QuizScoreRecord[] = [
      {
        id: 'sample-1',
        date: new Date(Date.now() - 6 * 86400000).toISOString(),
        score: 60,
        totalQuestions: 20,
        correctAnswers: 12,
        domainCode: 'MOD-01',
        domainName: 'Information Security Overview',
        mode: 'practice',
        timeSpentSeconds: 420
      },
      {
        id: 'sample-2',
        date: new Date(Date.now() - 4 * 86400000).toISOString(),
        score: 72,
        totalQuestions: 20,
        correctAnswers: 14,
        domainCode: 'MOD-02',
        domainName: 'Footprinting & Reconnaissance',
        mode: 'practice',
        timeSpentSeconds: 490
      },
      {
        id: 'sample-3',
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        score: 68,
        totalQuestions: 25,
        correctAnswers: 17,
        domainCode: 'MOD-03',
        domainName: 'Scanning Networks',
        mode: 'exam',
        timeSpentSeconds: 780
      },
      {
        id: 'sample-4',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        score: 80,
        totalQuestions: 20,
        correctAnswers: 16,
        domainCode: 'MOD-04',
        domainName: 'Enumeration',
        mode: 'practice',
        timeSpentSeconds: 380
      },
      {
        id: 'sample-5',
        date: new Date(Date.now() - 1 * 86400000).toISOString(),
        score: 87,
        totalQuestions: 30,
        correctAnswers: 26,
        domainCode: 'MOD-06',
        domainName: 'System Hacking',
        mode: 'exam',
        timeSpentSeconds: 940
      },
      {
        id: 'sample-6',
        date: new Date().toISOString(),
        score: 92,
        totalQuestions: 25,
        correctAnswers: 23,
        domainCode: 'MOD-20',
        domainName: 'AI and Machine Learning Security',
        mode: 'exam',
        timeSpentSeconds: 610
      }
    ];
    setQuizHistory(sampleRecords);
    showToast('Loaded 6 practice test records into Leaderboard!');
  };

  // Export Interactive AcroForm PDF
  const handleExportInteractivePdf = async () => {
    try {
      const pdfBytes = await generateInteractiveAcroFormPdf(
        domains,
        'Advanced CEH Candidate',
        'CEH v13 Comprehensive Module Track'
      );
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'KayBiT_CEH_Interactive_Study_Template.pdf';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Interactive fillable AcroForm PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF Export Error:', err);
      showToast('Failed to generate interactive PDF.');
    }
  };

  // Export Standalone Single-File HTML5 Bundle
  const handleExportStandaloneHtml = () => {
    try {
      const activeNotesContent = (notes || []).map((n) => `${n.title}:\n${n.content}`).join('\n\n---\n\n');
      const htmlString = exportSingleFileHtmlApp(domains, questions, activeNotesContent);
      const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'KayBiT_CEH_standalone.html';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Standalone single-file HTML5 app downloaded! Open anywhere offline.');
    } catch (err) {
      console.error('HTML Export Error:', err);
      showToast('Failed to generate single-file HTML bundle.');
    }
  };

  // Weighted Exam Readiness calculation
  const totalWeight = (domains || []).reduce((acc, d) => acc + (d.weight || 0), 0);
  const earnedWeight = (domains || []).reduce((acc, d) => {
    if (d.status === 'mastered') return acc + (d.weight || 0);
    if (d.status === 'in_progress') {
      const list = d.checklist || [];
      const checklistDone = list.filter((s) => s.completed).length;
      const ratio = list.length > 0 ? checklistDone / list.length : 0.5;
      return acc + (d.weight || 0) * (0.3 + 0.5 * ratio);
    }
    return acc;
  }, 0);
  const examReadinessPercentage = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  const domainCodesList = (domains || []).map((d) => ({ code: d.code, title: d.title }));

  return (
    <div
      className={`min-vh-100 ${theme === 'dark' ? 'bg-black text-light' : 'bg-light text-dark'} app-theme-container d-flex flex-column`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUserGuide={() => setIsUserGuideOpen(true)}
        onExportPdf={handleExportInteractivePdf}
        onExportHtml={handleExportStandaloneHtml}
        onResetProgress={handleResetProgress}
        examReadinessPercentage={examReadinessPercentage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Floating Alert / Toast */}
      {toastMessage && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1090 }}
        >
          <div className="toast show align-items-center text-bg-info border-0 shadow-lg" role="alert">
            <div className="d-flex">
              <div className="toast-body fw-semibold text-dark d-flex align-items-center gap-2">
                <CheckCircle2 size={18} />
                <span>{toastMessage}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area Based on Active Tab */}
      <main className="flex-grow-1">
        {activeTab === 'domains' && (
          <DomainTracker
            domains={domains}
            onUpdateDomain={handleUpdateDomain}
            onSelectForQuiz={handleSelectDomainForQuiz}
            targetExamDate={targetExamDate}
            onUpdateTargetExamDate={handleUpdateExamDate}
          />
        )}

        {activeTab === 'quiz' && (
          <MockQuizEngine
            questions={questions}
            onAddQuestion={handleAddCustomQuestion}
            onImportQuestions={handleImportQuestions}
            activeDomainFilter={activeQuizDomain}
            setActiveDomainFilter={setActiveQuizDomain}
            domainCodes={domainCodesList}
            quizHistory={quizHistory}
            onSaveScoreRecord={handleSaveScoreRecord}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'flashcards' && <Flashcards />}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            quizHistory={quizHistory}
            onTakeQuiz={() => setActiveTab('quiz')}
            onClearHistory={handleClearHistory}
            onAddSampleHistory={handleAddSampleHistory}
          />
        )}

        {activeTab === 'nmap' && <ScannerToolsSuite />}

        {activeTab === 'cheatsheets' && <CheatSheetViewer />}

        {activeTab === 'notes' && (
          <NotesManager
            notes={notes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            domainCodes={domainCodesList}
          />
        )}

        {activeTab === 'packaging' && <PackagingSuite />}
      </main>

      {/* 18-Language User Guide Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-dark border-top border-secondary py-3 px-4 mt-auto">
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 small text-secondary">
            <ShieldCheck size={16} className="text-success" />
            <span>KayBiT_CEHinteractive • Certified Ethical Hacker (CEH v13) Self-Study Track</span>
          </div>

          <div className="small text-secondary">
            100% Serverless • LocalStorage Engine • 21 Languages • Open Source Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
