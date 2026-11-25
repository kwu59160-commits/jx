export type SectionKey = 'listening' | 'reading' | 'writing';

export type WorkspaceTab = 'desk' | 'drills' | 'wrongbook' | 'mocks';

export interface ScoreProfile {
  userName: string;
  examDate: string; // YYYY-MM-DD
  recentRefLabel: string; // e.g. 研二英语期末 68/100
  baselineTotal: number;
  baseline: {
    listening: number;
    reading: number;
    writing: number;
  };
  targetTotal: number;
  target: {
    listening: number;
    reading: number;
    writing: number;
  };
  listeningFloor: number;
}

export interface DailyTask {
  id: string;
  section: SectionKey;
  title: string;
  minutes: number;
  priority: 'core' | 'secondary' | 'protect';
  completed: boolean;
  notes?: string;
}

export interface StudyDay {
  dayIndex: number; // 1..17
  date: string; // YYYY-MM-DD
  phase: string;
  focusTheme: string;
  oneJob: string;
  oneJobSection: SectionKey;
  tasks: DailyTask[];
}

export interface ListeningLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  drillType: string;
  minutes: number;
  correctCount: number;
  totalQuestions: number;
  estimatedScore: number; // out of 248.5
  note: string;
}

export interface WrongBookEntry {
  id: string;
  date: string;
  section: SectionKey | 'translation';
  source: string; // e.g. 2024.12 卷一 长对话 Q4
  questionType: string; // e.g. 转折细节 / 推理题 / 句式误译
  mistakeSummary: string;
  trapReason: string;
  fixRule: string;
  mastered: boolean;
}

export interface VocabPhraseEntry {
  id: string;
  term: string;
  meaning: string;
  tag: 'listening' | 'reading' | 'writing' | 'translation';
  example: string;
  mastered: boolean;
  addedAt: string;
}

export interface MockExamEntry {
  id: string;
  date: string;
  label: string; // e.g. 2025年6月六级真题(卷一)
  listening: number;
  reading: number;
  writing: number;
  total: number;
  notes: string;
  isBaseline?: boolean;
}

export interface WritingDraftState {
  activeMode: 'essay' | 'translation';
  selectedPromptId: string;
  draftsByPrompt: Record<string, string>;
  rubricChecksByPrompt: Record<string, string[]>;
}

export interface WorkbenchData {
  version: number;
  profile: ScoreProfile;
  days: StudyDay[];
  listeningLogs: ListeningLogEntry[];
  flaggedTraps: string[];
  wrongBook: WrongBookEntry[];
  vocabBank: VocabPhraseEntry[];
  mocks: MockExamEntry[];
  writingState: WritingDraftState;
}
