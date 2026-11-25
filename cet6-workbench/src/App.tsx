import { useMemo, useState } from 'react';
import { TopNav } from './components/TopNav';
import { ScoreCockpitHero } from './components/ScoreCockpitHero';
import { DailyPlanPanel } from './components/DailyPlanPanel';
import { DrillsView } from './components/DrillsView';
import { WrongBookView } from './components/WrongBookView';
import { MockTrackerView } from './components/MockTrackerView';
import { SettingsModal } from './components/SettingsModal';
import { useWorkbenchStore } from './hooks/useWorkbenchStore';
import type { SectionKey, WorkspaceTab } from './types';

export default function App() {
  const store = useWorkbenchStore();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('desk');
  const [activeDrillSection, setActiveDrillSection] = useState<SectionKey>('listening');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(store.recommendedDayIndex);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const activeDay = useMemo(
    () =>
      store.data.days.find((d) => d.dayIndex === selectedDayIndex) ??
      store.data.days[0],
    [store.data.days, selectedDayIndex]
  );

  const readingWrongEntries = useMemo(
    () => store.data.wrongBook.filter((w) => w.section === 'reading'),
    [store.data.wrongBook]
  );

  const handleLaunchSectionDrill = (section: SectionKey) => {
    setActiveDrillSection(section);
    setActiveTab('drills');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToPlan = () => {
    const el = document.getElementById('daily-plan');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <TopNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        daysRemaining={store.daysRemaining}
        unmasteredCount={store.studyStats.unmasteredWrongCount}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main>
        {activeTab === 'desk' && activeDay && (
          <>
            <ScoreCockpitHero
              profile={store.data.profile}
              daysRemaining={store.daysRemaining}
              streak={store.studyStats.streak}
              activeDay={activeDay}
              currentScores={store.studyStats.currentScores}
              onLaunchSectionDrill={handleLaunchSectionDrill}
              onJumpToPlan={handleJumpToPlan}
              onOpenSettings={() => setSettingsOpen(true)}
              onUpdateOneJob={store.updateDayOneJob}
            />
            <DailyPlanPanel
              days={store.data.days}
              selectedDayIndex={selectedDayIndex}
              todayIso={store.todayIso}
              onSelectDay={setSelectedDayIndex}
              onToggleTask={store.toggleTask}
              onAddTask={store.addTask}
              onDeleteTask={store.deleteTask}
              onLaunchSectionDrill={handleLaunchSectionDrill}
            />
          </>
        )}

        {activeTab === 'drills' && (
          <DrillsView
            activeSection={activeDrillSection}
            onSelectSection={setActiveDrillSection}
            listeningFloor={store.data.profile.listeningFloor}
            listeningLogs={store.data.listeningLogs}
            flaggedTraps={store.data.flaggedTraps}
            onAddListeningLog={store.addListeningLog}
            onDeleteListeningLog={store.deleteListeningLog}
            onToggleFlaggedTrap={store.toggleFlaggedTrap}
            readingWrongEntries={readingWrongEntries}
            onAddWrongBookEntry={store.addWrongBookEntry}
            onToggleWrongBookMastered={store.toggleWrongBookMastered}
            onDeleteWrongBookEntry={store.deleteWrongBookEntry}
            writingState={store.data.writingState}
            onSetWritingMode={store.setWritingMode}
            onUpdateWritingDraft={store.updateWritingDraft}
            onToggleRubricCheck={store.toggleRubricCheck}
            todayIso={store.todayIso}
          />
        )}

        {activeTab === 'wrongbook' && (
          <WrongBookView
            todayIso={store.todayIso}
            wrongBook={store.data.wrongBook}
            vocabBank={store.data.vocabBank}
            onAddWrong={store.addWrongBookEntry}
            onToggleWrongMastered={store.toggleWrongBookMastered}
            onDeleteWrong={store.deleteWrongBookEntry}
            onAddVocab={store.addVocabEntry}
            onToggleVocabMastered={store.toggleVocabMastered}
            onDeleteVocab={store.deleteVocabEntry}
          />
        )}

        {activeTab === 'mocks' && (
          <MockTrackerView
            profile={store.data.profile}
            mocks={store.data.mocks}
            todayIso={store.todayIso}
            onAddMock={store.addMockExam}
            onDeleteMock={store.deleteMockExam}
          />
        )}
      </main>

      <footer className="border-t border-[var(--line-subtle)] py-6 text-center text-[11px] text-[var(--ink-muted)]">
        六级冲刺台 · CET-6 Study Workbench · 全部进度自动保存在本机浏览器，支持右上角 JSON 导出备份
      </footer>

      {settingsOpen && (
        <SettingsModal
          profile={store.data.profile}
          onClose={() => setSettingsOpen(false)}
          onSaveProfile={store.updateProfile}
          onExportJson={store.exportJson}
          onImportJson={store.importJson}
          onResetAll={store.resetAllData}
        />
      )}
    </div>
  );
}
