import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_WORKBENCH_DATA } from '../data/seed';
import type {
  DailyTask,
  ListeningLogEntry,
  MockExamEntry,
  ScoreProfile,
  SectionKey,
  VocabPhraseEntry,
  WorkbenchData,
  WrongBookEntry,
} from '../types';

const STORAGE_KEY = 'cet6-study-workbench::v1';

function todayIsoLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysBetweenIso(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split('-').map(Number);
  const [ty, tm, td] = toIso.split('-').map(Number);
  if (!fy || !fm || !fd || !ty || !tm || !td) return 0;
  const fromUtc = Date.UTC(fy, fm - 1, fd);
  const toUtc = Date.UTC(ty, tm - 1, td);
  return Math.round((toUtc - fromUtc) / 86_400_000);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function validateWorkbenchData(raw: unknown): WorkbenchData | null {
  if (!isRecord(raw)) return null;
  if (!isRecord(raw.profile)) return null;
  if (!Array.isArray(raw.days)) return null;
  if (!Array.isArray(raw.listeningLogs)) return null;
  if (!Array.isArray(raw.wrongBook)) return null;
  if (!Array.isArray(raw.vocabBank)) return null;
  if (!Array.isArray(raw.mocks)) return null;

  const p = raw.profile;
  if (
    typeof p.examDate !== 'string' ||
    typeof p.baselineTotal !== 'number' ||
    typeof p.targetTotal !== 'number' ||
    !isRecord(p.baseline) ||
    !isRecord(p.target)
  ) {
    return null;
  }

  return {
    version: 1,
    profile: {
      userName: typeof p.userName === 'string' ? p.userName : DEFAULT_WORKBENCH_DATA.profile.userName,
      examDate: p.examDate,
      recentRefLabel:
        typeof p.recentRefLabel === 'string'
          ? p.recentRefLabel
          : DEFAULT_WORKBENCH_DATA.profile.recentRefLabel,
      baselineTotal: Number(p.baselineTotal) || 417,
      baseline: {
        listening: Number(p.baseline.listening) || 130,
        reading: Number(p.baseline.reading) || 200,
        writing: Number(p.baseline.writing) || 60,
      },
      targetTotal: Number(p.targetTotal) || 500,
      target: {
        listening: Number(p.target.listening) || 155,
        reading: Number(p.target.reading) || 205,
        writing: Number(p.target.writing) || 140,
      },
      listeningFloor:
        typeof p.listeningFloor === 'number'
          ? p.listeningFloor
          : DEFAULT_WORKBENCH_DATA.profile.listeningFloor,
    },
    days: raw.days as WorkbenchData['days'],
    listeningLogs: raw.listeningLogs as ListeningLogEntry[],
    flaggedTraps: Array.isArray(raw.flaggedTraps)
      ? raw.flaggedTraps.filter((t): t is string => typeof t === 'string')
      : DEFAULT_WORKBENCH_DATA.flaggedTraps,
    wrongBook: raw.wrongBook as WrongBookEntry[],
    vocabBank: raw.vocabBank as VocabPhraseEntry[],
    mocks: raw.mocks as MockExamEntry[],
    writingState: isRecord(raw.writingState)
      ? {
          activeMode: raw.writingState.activeMode === 'translation' ? 'translation' : 'essay',
          selectedPromptId:
            typeof raw.writingState.selectedPromptId === 'string'
              ? raw.writingState.selectedPromptId
              : DEFAULT_WORKBENCH_DATA.writingState.selectedPromptId,
          draftsByPrompt: isRecord(raw.writingState.draftsByPrompt)
            ? (raw.writingState.draftsByPrompt as Record<string, string>)
            : {},
          rubricChecksByPrompt: isRecord(raw.writingState.rubricChecksByPrompt)
            ? (raw.writingState.rubricChecksByPrompt as Record<string, string[]>)
            : {},
        }
      : DEFAULT_WORKBENCH_DATA.writingState,
  };
}

function loadInitialData(): WorkbenchData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WORKBENCH_DATA;
    const parsed: unknown = JSON.parse(raw);
    const validated = validateWorkbenchData(parsed);
    return validated ?? DEFAULT_WORKBENCH_DATA;
  } catch {
    return DEFAULT_WORKBENCH_DATA;
  }
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useWorkbenchStore() {
  const [data, setData] = useState<WorkbenchData>(loadInitialData);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [data]);

  const todayIso = useMemo(() => todayIsoLocal(), []);

  const daysRemaining = useMemo(() => {
    const diff = daysBetweenIso(todayIso, data.profile.examDate);
    return Math.max(0, diff);
  }, [todayIso, data.profile.examDate]);

  // Determine the default active day index based on today's date in the 17-day sprint
  const recommendedDayIndex = useMemo(() => {
    const exact = data.days.find((d) => d.date === todayIso);
    if (exact) return exact.dayIndex;
    if (data.days.length === 0) return 1;
    if (todayIso < data.days[0].date) return 1;
    return data.days[data.days.length - 1].dayIndex;
  }, [data.days, todayIso]);

  // Compute current streak: consecutive study days (ending at latest completed/active day) with >=1 completed task
  const studyStats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let daysWithProgress = 0;

    data.days.forEach((day) => {
      totalTasks += day.tasks.length;
      const done = day.tasks.filter((t) => t.completed).length;
      completedTasks += done;
      if (done > 0) daysWithProgress += 1;
    });

    // Calculate consecutive streak ending at the most recent day with progress (or today)
    let streak = 0;
    const activeDayIdx = Math.min(recommendedDayIndex, data.days.length);
    for (let i = activeDayIdx - 1; i >= 0; i -= 1) {
      const hasDone = data.days[i].tasks.some((t) => t.completed);
      if (hasDone) {
        streak += 1;
      } else if (i === activeDayIdx - 1) {
        // Today hasn't been checked off yet; check if yesterday keeps streak alive
        continue;
      } else {
        break;
      }
    }

    const latestSprintMock = [...data.mocks]
      .filter((m) => !m.isBaseline)
      .sort((a, b) => a.date.localeCompare(b.date))
      .at(-1);

    const currentScores = latestSprintMock
      ? {
          total: latestSprintMock.total,
          listening: latestSprintMock.listening,
          reading: latestSprintMock.reading,
          writing: latestSprintMock.writing,
          sourceLabel: `最近模考 · ${latestSprintMock.label}`,
        }
      : {
          total: data.profile.baselineTotal,
          listening: data.profile.baseline.listening,
          reading: data.profile.baseline.reading,
          writing: data.profile.baseline.writing,
          sourceLabel: '本科实考基线',
        };

    const totalListeningMinutes = data.listeningLogs.reduce((acc, l) => acc + l.minutes, 0);
    const unmasteredWrongCount = data.wrongBook.filter((w) => !w.mastered).length;

    return {
      totalTasks,
      completedTasks,
      daysWithProgress,
      streak,
      currentScores,
      totalListeningMinutes,
      unmasteredWrongCount,
    };
  }, [data, recommendedDayIndex]);

  const updateProfile = useCallback((next: ScoreProfile) => {
    setData((prev) => ({
      ...prev,
      profile: next,
      mocks: prev.mocks.map((m) =>
        m.isBaseline
          ? {
              ...m,
              total: next.baselineTotal,
              listening: next.baseline.listening,
              reading: next.baseline.reading,
              writing: next.baseline.writing,
            }
          : m
      ),
    }));
  }, []);

  const toggleTask = useCallback((dayIndex: number, taskId: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.dayIndex === dayIndex
          ? {
              ...d,
              tasks: d.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : d
      ),
    }));
  }, []);

  const addTask = useCallback(
    (
      dayIndex: number,
      input: { title: string; section: SectionKey; minutes: number; priority: DailyTask['priority'] }
    ) => {
      const trimmed = input.title.trim();
      if (!trimmed) return;
      setData((prev) => ({
        ...prev,
        days: prev.days.map((d) =>
          d.dayIndex === dayIndex
            ? {
                ...d,
                tasks: [
                  ...d.tasks,
                  {
                    id: uid('task'),
                    title: trimmed,
                    section: input.section,
                    minutes: Math.max(5, Math.min(180, input.minutes || 20)),
                    priority: input.priority,
                    completed: false,
                  },
                ],
              }
            : d
        ),
      }));
    },
    []
  );

  const deleteTask = useCallback((dayIndex: number, taskId: string) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.dayIndex === dayIndex
          ? { ...d, tasks: d.tasks.filter((t) => t.id !== taskId) }
          : d
      ),
    }));
  }, []);

  const updateDayOneJob = useCallback((dayIndex: number, oneJob: string, oneJobSection?: SectionKey) => {
    const trimmed = oneJob.trim();
    if (!trimmed) return;
    setData((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.dayIndex === dayIndex
          ? { ...d, oneJob: trimmed, oneJobSection: oneJobSection ?? d.oneJobSection }
          : d
      ),
    }));
  }, []);

  const addListeningLog = useCallback((entry: Omit<ListeningLogEntry, 'id'>) => {
    setData((prev) => ({
      ...prev,
      listeningLogs: [{ ...entry, id: uid('ll') }, ...prev.listeningLogs],
    }));
  }, []);

  const deleteListeningLog = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      listeningLogs: prev.listeningLogs.filter((l) => l.id !== id),
    }));
  }, []);

  const toggleFlaggedTrap = useCallback((trapId: string) => {
    setData((prev) => {
      const exists = prev.flaggedTraps.includes(trapId);
      return {
        ...prev,
        flaggedTraps: exists
          ? prev.flaggedTraps.filter((id) => id !== trapId)
          : [...prev.flaggedTraps, trapId],
      };
    });
  }, []);

  const addWrongBookEntry = useCallback((entry: Omit<WrongBookEntry, 'id' | 'mastered'>) => {
    setData((prev) => ({
      ...prev,
      wrongBook: [{ ...entry, id: uid('wb'), mastered: false }, ...prev.wrongBook],
    }));
  }, []);

  const toggleWrongBookMastered = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      wrongBook: prev.wrongBook.map((w) =>
        w.id === id ? { ...w, mastered: !w.mastered } : w
      ),
    }));
  }, []);

  const deleteWrongBookEntry = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      wrongBook: prev.wrongBook.filter((w) => w.id !== id),
    }));
  }, []);

  const addVocabEntry = useCallback((entry: Omit<VocabPhraseEntry, 'id' | 'mastered' | 'addedAt'>) => {
    setData((prev) => ({
      ...prev,
      vocabBank: [
        {
          ...entry,
          id: uid('vc'),
          mastered: false,
          addedAt: todayIsoLocal(),
        },
        ...prev.vocabBank,
      ],
    }));
  }, []);

  const toggleVocabMastered = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      vocabBank: prev.vocabBank.map((v) =>
        v.id === id ? { ...v, mastered: !v.mastered } : v
      ),
    }));
  }, []);

  const deleteVocabEntry = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      vocabBank: prev.vocabBank.filter((v) => v.id !== id),
    }));
  }, []);

  const addMockExam = useCallback((entry: Omit<MockExamEntry, 'id'>) => {
    setData((prev) => ({
      ...prev,
      mocks: [...prev.mocks, { ...entry, id: uid('mock') }],
    }));
  }, []);

  const deleteMockExam = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      mocks: prev.mocks.filter((m) => m.id !== id || m.isBaseline),
    }));
  }, []);

  const setWritingMode = useCallback((mode: 'essay' | 'translation', promptId: string) => {
    setData((prev) => ({
      ...prev,
      writingState: {
        ...prev.writingState,
        activeMode: mode,
        selectedPromptId: promptId,
      },
    }));
  }, []);

  const updateWritingDraft = useCallback((promptId: string, text: string) => {
    setData((prev) => ({
      ...prev,
      writingState: {
        ...prev.writingState,
        draftsByPrompt: {
          ...prev.writingState.draftsByPrompt,
          [promptId]: text,
        },
      },
    }));
  }, []);

  const toggleRubricCheck = useCallback((promptId: string, rubricId: string) => {
    setData((prev) => {
      const current = prev.writingState.rubricChecksByPrompt[promptId] ?? [];
      const exists = current.includes(rubricId);
      return {
        ...prev,
        writingState: {
          ...prev.writingState,
          rubricChecksByPrompt: {
            ...prev.writingState.rubricChecksByPrompt,
            [promptId]: exists
              ? current.filter((id) => id !== rubricId)
              : [...current, rubricId],
          },
        },
      };
    });
  }, []);

  const exportJson = useCallback(() => {
    const payload = JSON.stringify(data, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cet6-workbench-${todayIsoLocal()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importJson = useCallback((rawText: string): { ok: boolean; error?: string } => {
    try {
      const parsed: unknown = JSON.parse(rawText);
      const validated = validateWorkbenchData(parsed);
      if (!validated) {
        return { ok: false, error: 'JSON 格式不符合六级冲刺台数据结构，请检查备份文件。' };
      }
      setData(validated);
      return { ok: true };
    } catch {
      return { ok: false, error: '无法解析 JSON 文件，请确认文件内容完整。' };
    }
  }, []);

  const resetAllData = useCallback(() => {
    setData(DEFAULT_WORKBENCH_DATA);
  }, []);

  return {
    data,
    todayIso,
    daysRemaining,
    recommendedDayIndex,
    studyStats,
    updateProfile,
    toggleTask,
    addTask,
    deleteTask,
    updateDayOneJob,
    addListeningLog,
    deleteListeningLog,
    toggleFlaggedTrap,
    addWrongBookEntry,
    toggleWrongBookMastered,
    deleteWrongBookEntry,
    addVocabEntry,
    toggleVocabMastered,
    deleteVocabEntry,
    addMockExam,
    deleteMockExam,
    setWritingMode,
    updateWritingDraft,
    toggleRubricCheck,
    exportJson,
    importJson,
    resetAllData,
  };
}
