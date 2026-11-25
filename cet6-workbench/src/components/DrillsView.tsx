import { Headphones, BookOpen, PenTool } from 'lucide-react';
import type {
  ListeningLogEntry,
  SectionKey,
  WritingDraftState,
  WrongBookEntry,
} from '../types';
import { ListeningDrill } from './ListeningDrill';
import { ReadingDrill } from './ReadingDrill';
import { WritingDrill } from './WritingDrill';

interface DrillsViewProps {
  activeSection: SectionKey;
  onSelectSection: (section: SectionKey) => void;
  listeningFloor: number;
  listeningLogs: ListeningLogEntry[];
  flaggedTraps: string[];
  onAddListeningLog: (entry: Omit<ListeningLogEntry, 'id'>) => void;
  onDeleteListeningLog: (id: string) => void;
  onToggleFlaggedTrap: (trapId: string) => void;
  readingWrongEntries: WrongBookEntry[];
  onAddWrongBookEntry: (entry: Omit<WrongBookEntry, 'id' | 'mastered'>) => void;
  onToggleWrongBookMastered: (id: string) => void;
  onDeleteWrongBookEntry: (id: string) => void;
  writingState: WritingDraftState;
  onSetWritingMode: (mode: 'essay' | 'translation', promptId: string) => void;
  onUpdateWritingDraft: (promptId: string, text: string) => void;
  onToggleRubricCheck: (promptId: string, rubricId: string) => void;
  todayIso: string;
}

const SECTION_TABS: Array<{
  key: SectionKey;
  num: string;
  label: string;
  sub: string;
  accent: string;
  icon: typeof Headphones;
}> = [
  {
    key: 'listening',
    num: '01',
    label: '听力保底训练',
    sub: '优先突破 ≥150 底线',
    accent: 'var(--accent-ochre)',
    icon: Headphones,
  },
  {
    key: 'writing',
    num: '02',
    label: '写作与翻译',
    sub: '高杠杆提分 60→140',
    accent: 'var(--accent-cobalt)',
    icon: PenTool,
  },
  {
    key: 'reading',
    num: '03',
    label: '阅读提速护盘',
    sub: '稳守 200+ 优势区',
    accent: 'var(--accent-pine)',
    icon: BookOpen,
  },
];

export function DrillsView(props: DrillsViewProps) {
  const { activeSection, onSelectSection } = props;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="animate-desk-reveal flex flex-col justify-between gap-4 border-b border-[var(--line-strong)] pb-5 md:flex-row md:items-end">
        <div>
          <div className="font-mono-num text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-muted)] uppercase">
            SECTION DRILL STUDIO
          </div>
          <h1 className="font-display mt-1 text-3xl font-semibold text-[var(--ink-primary)]">
            专项训练台
          </h1>
        </div>

        {/* Focused 3-section switcher */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {SECTION_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeSection === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectSection(tab.key)}
                className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                  active
                    ? 'border-[var(--ink-primary)] bg-[var(--ink-primary)] text-white shadow-sm'
                    : 'border-[var(--line-subtle)] bg-white/85 text-[var(--ink-primary)] hover:border-[var(--line-strong)]'
                }`}
              >
                <Icon
                  className="h-4 w-4 shrink-0 stroke-[1.75]"
                  style={{ color: active ? '#ffffff' : tab.accent }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span className={`font-mono-num ${active ? 'text-white/70' : 'text-[var(--ink-muted)]'}`}>
                      {tab.num}
                    </span>
                    <span className="truncate">{tab.label}</span>
                  </div>
                  <div
                    className={`truncate text-[11px] ${
                      active ? 'text-white/75' : 'text-[var(--ink-muted)]'
                    }`}
                  >
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {activeSection === 'listening' && (
          <ListeningDrill
            listeningFloor={props.listeningFloor}
            logs={props.listeningLogs}
            flaggedTraps={props.flaggedTraps}
            todayIso={props.todayIso}
            onAddLog={props.onAddListeningLog}
            onDeleteLog={props.onDeleteListeningLog}
            onToggleFlaggedTrap={props.onToggleFlaggedTrap}
          />
        )}

        {activeSection === 'writing' && (
          <WritingDrill
            writingState={props.writingState}
            onSetWritingMode={props.onSetWritingMode}
            onUpdateDraft={props.onUpdateWritingDraft}
            onToggleRubric={props.onToggleRubricCheck}
          />
        )}

        {activeSection === 'reading' && (
          <ReadingDrill
            todayIso={props.todayIso}
            wrongEntries={props.readingWrongEntries}
            onAddWrongEntry={props.onAddWrongBookEntry}
            onToggleMastered={props.onToggleWrongBookMastered}
            onDeleteWrongEntry={props.onDeleteWrongBookEntry}
          />
        )}
      </div>
    </div>
  );
}
