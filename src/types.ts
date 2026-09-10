/**
 * KayBiT_CEHinteractive - Core TypeScript Type Definitions
 */

export type CEHDomainStatus = 'not_started' | 'in_progress' | 'mastered';

export interface CEHChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface CEHDomain {
  id: number;
  code: string;
  title: string;
  weight: number; // Exam percentage weight
  description: string;
  objectives: string[];
  keyTools: string[];
  commonPorts: string[];
  relevantPorts?: string[];
  attackVectors: string[];
  status: CEHDomainStatus;
  userNotes: string;
  checklist: CEHChecklistItem[];
  countermeasures?: string[];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  domainId: number;
  domainCode?: string;
  domainName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Fundamentals' | 'Intermediate' | 'Advanced Scenario' | 'Easy' | 'Medium' | 'Hard';
  cveOrTool?: string;
  isCustom?: boolean;
}

export interface QuizScoreRecord {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  domainCode?: string;
  domainName?: string;
  mode: 'practice' | 'exam';
  timeSpentSeconds?: number;
}

export interface QuizAttemptResult extends QuizScoreRecord {
  total: number;
  percentage: number;
  domainBreakdown?: Record<string, { correct: number; total: number }>;
}

export interface NmapOptionConfig {
  flag: string;
  name: string;
  category: 'scan_type' | 'ports' | 'timing' | 'discovery' | 'scripts' | 'evasion' | 'output';
  description: string;
  requiresArg?: boolean;
  argPlaceholder?: string;
  argDefault?: string;
  requiresRoot?: boolean;
  dangerLevel?: 'normal' | 'noisy' | 'stealth';
}

export interface NmapPreset {
  id: string;
  name: string;
  description: string;
  target: string;
  ports: string;
  selectedFlags: string[];
  flagArgs: Record<string, string>;
  scanType?: string;
  timing?: string;
  osDetection?: boolean;
  versionDetection?: boolean;
  traceroute?: boolean;
  evasion?: string[];
  scripts?: string[];
}

export interface ProgrammingCheatSheet {
  languageId: string;
  languageName: string;
  family: string;
  fileExtension: string;
  snippetTitle: string;
  scenario: string;
  code: string;
  runtimeInstructions: string;
  offensiveSecurityUseCase: string;
  id?: string;
  language?: string;
  title?: string;
  snippet?: string;
  description?: string;
  moduleMapping?: string;
  executionCommand?: string;
}

export interface StudentNote {
  id: string;
  domainId?: number;
  domainCode?: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt?: string;
  updatedAt: string;
}

export interface FlashcardTerm {
  id: string;
  term: string;
  domainCode: string;
  domainName: string;
  category: string;
  definition: string;
  examTip: string;
  commandOrExample?: string;
}

export interface UserGuideLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
}
