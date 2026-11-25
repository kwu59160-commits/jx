import { useMemo, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Volume2,
  VolumeX,
  Flag,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  CET6_LISTENING_TRAPS,
  LISTENING_DRILL_PRESETS,
  NOTE_TAKING_SYMBOLS,
} from '../data/cet6Content';
import { formatClock, useTimer } from '../hooks/useTimer';
import type { ListeningLogEntry } from '../types';

interface ListeningDrillProps {
  listeningFloor: number;
  logs: ListeningLogEntry[];
  flaggedTraps: string[];
  todayIso: string;
  onAddLog: (entry: Omit<ListeningLogEntry, 'id'>) => void;
  onDeleteLog: (id: string) => void;
  onToggleFlaggedTrap: (trapId: string) => void;
}

function estimateCet6ListeningScore(correct: number, total: number): number {
  if (total <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, correct / total));
  // Realistic CET-6 scaled curve approximation (248.5 max, ~60% accuracy ≈ 149-155)
  const scaled = 72 + ratio * 176.5;
  return Math.round(scaled);
}

export function ListeningDrill({
  listeningFloor,
  logs,
  flaggedTraps,
  todayIso,
  onAddLog,
  onDeleteLog,
  onToggleFlaggedTrap,
}: ListeningDrillProps) {
  const [selectedPresetId, setSelectedPresetId] = useState(LISTENING_DRILL_PRESETS[2].id);
  const activePreset =
    LISTENING_DRILL_PRESETS.find((p) => p.id === selectedPresetId) ?? LISTENING_DRILL_PRESETS[0];

  const timer = useTimer(activePreset.minutes);

  // Daily log form state
  const [logDrillType, setLogDrillType] = useState(activePreset.name);
  const [logMinutes, setLogMinutes] = useState(activePreset.minutes);
  const [logCorrect, setLogCorrect] = useState(16);
  const [logTotal, setLogTotal] = useState(25);
  const [logScoreManual, setLogScoreManual] = useState<string>('');
  const [logNote, setLogNote] = useState('');

  const autoEstimated = useMemo(
    () => estimateCet6ListeningScore(logCorrect, logTotal),
    [logCorrect, logTotal]
  );

  const stats = useMemo(() => {
    const totalMinutes = logs.reduce((s, l) => s + l.minutes, 0);
    const totalQ = logs.reduce((s, l) => s + l.totalQuestions, 0);
    const totalC = logs.reduce((s, l) => s + l.correctCount, 0);
    const avgAcc = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
    const latestEst = logs[0]?.estimatedScore ?? 130;
    return { totalMinutes, avgAcc, latestEst };
  }, [logs]);

  const handleSelectPreset = (presetId: string) => {
    const found = LISTENING_DRILL_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setSelectedPresetId(presetId);
    timer.setMinutes(found.minutes);
    setLogDrillType(found.name);
    setLogMinutes(found.minutes);
    setLogTotal(found.questions);
    setLogCorrect(Math.min(found.questions, Math.ceil(found.questions * 0.65)));
    setLogScoreManual('');
  };

  const handleFillFromTimer = () => {
    const elapsedMins = Math.max(1, Math.round(timer.elapsedSeconds / 60) || activePreset.minutes);
    setLogDrillType(activePreset.name);
    setLogMinutes(elapsedMins);
    setLogTotal(activePreset.questions);
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    const score =
      logScoreManual.trim() !== ''
        ? Math.max(0, Math.min(249, Number(logScoreManual) || autoEstimated))
        : autoEstimated;
    onAddLog({
      date: todayIso,
      drillType: logDrillType.trim() || activePreset.name,
      minutes: Math.max(1, logMinutes),
      correctCount: Math.max(0, Math.min(logTotal, logCorrect)),
      totalQuestions: Math.max(1, logTotal),
      estimatedScore: score,
      note: logNote.trim() || '完成限时听力训练',
    });
    setLogNote('');
    setLogScoreManual('');
  };

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - timer.progress);

  return (
    <div className="space-y-6">
      {/* Upper Row: Timed Mini Drill + Daily Listening Log */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Timed Mini Drill */}
        <div className="desk-surface rounded-xl p-5 sm:p-6 lg:col-span-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--accent-ochre)] uppercase">
                TIMED LISTENING MINI-DRILL
              </div>
              <h2 className="mt-0.5 text-lg font-semibold text-[var(--ink-primary)]">
                听力限时专项计步器
              </h2>
            </div>
            <button
              type="button"
              onClick={() => timer.setSoundEnabled(!timer.soundEnabled)}
              className="rounded-md border border-[var(--line-subtle)] p-2 text-[var(--ink-secondary)] hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]"
              title={timer.soundEnabled ? '关闭结束提示音' : '开启结束提示音'}
            >
              {timer.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>

          {/* Preset pills */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {LISTENING_DRILL_PRESETS.map((preset) => {
              const selected = preset.id === activePreset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                    selected
                      ? 'border-[var(--accent-ochre)] bg-[var(--accent-ochre-soft)] text-[var(--ink-primary)]'
                      : 'border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{preset.name}</span>
                    <span className="font-mono-num text-[11px] text-[var(--accent-ochre)]">
                      {preset.minutes}m
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-[var(--ink-muted)]">
                    {preset.questions} 题 · 点击载入
                  </div>
                </button>
              );
            })}
          </div>

          {/* Timer Ring + Active Tip */}
          <div className="mt-5 flex flex-col items-center gap-5 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-5 sm:flex-row">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg className="h-36 w-36 -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="var(--bg-surface-muted)"
                  strokeWidth="7"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="var(--accent-ochre)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  className="transition-[stroke-dashoffset] duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono-num text-2xl font-semibold text-[var(--ink-primary)]">
                  {formatClock(timer.remainingSeconds)}
                </span>
                <span
                  className={`mt-0.5 text-[11px] ${
                    timer.isRunning
                      ? 'animate-breath font-medium text-[var(--accent-ochre)]'
                      : 'text-[var(--ink-muted)]'
                  }`}
                >
                  {timer.isRunning ? '计时进行中' : '准备开始'}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="text-xs font-semibold text-[var(--ink-primary)]">
                {activePreset.weightNote}
              </div>
              <p className="text-xs leading-relaxed text-[var(--ink-secondary)]">
                执行要点：{activePreset.tip}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={timer.toggle}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-ochre)] px-4 py-2 text-xs font-medium text-white hover:opacity-95"
                >
                  {timer.isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{timer.isRunning ? '暂停' : '开始计时'}</span>
                </button>
                <button
                  type="button"
                  onClick={timer.reset}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>重置</span>
                </button>
                <button
                  type="button"
                  onClick={timer.addMinute}
                  className="font-mono-num rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                >
                  +1m
                </button>
                <button
                  type="button"
                  onClick={handleFillFromTimer}
                  className="text-xs font-medium text-[var(--accent-teal)] underline underline-offset-4"
                >
                  填入右侧日志
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Daily Listening Log */}
        <div className="desk-surface flex flex-col justify-between rounded-xl p-5 sm:p-6 lg:col-span-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                  DAILY LISTENING LOG
                </div>
                <h2 className="mt-0.5 text-lg font-semibold text-[var(--ink-primary)]">
                  每日听力打卡与估分
                </h2>
              </div>

              <div className="font-mono-num flex items-center gap-3 text-xs">
                <span className="text-[var(--ink-secondary)]">
                  累计 <strong className="text-[var(--ink-primary)]">{stats.totalMinutes}m</strong>
                </span>
                <span className="text-[var(--ink-secondary)]">
                  均正确率 <strong className="text-[var(--ink-primary)]">{stats.avgAcc}%</strong>
                </span>
                <span
                  className={`font-semibold ${
                    stats.latestEst >= listeningFloor
                      ? 'text-[var(--accent-pine)]'
                      : 'text-[var(--accent-ochre)]'
                  }`}
                >
                  近次≈{stats.latestEst}
                </span>
              </div>
            </div>

            <form
              onSubmit={handleSubmitLog}
              className="mt-4 space-y-3 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-4"
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-12">
                <input
                  type="text"
                  value={logDrillType}
                  onChange={(e) => setLogDrillType(e.target.value)}
                  placeholder="训练内容（如 2024.12 卷一 完整听力）"
                  className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none sm:col-span-6"
                />
                <div className="flex items-center gap-1 sm:col-span-3">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={logMinutes}
                    onChange={(e) => setLogMinutes(Number(e.target.value))}
                    className="font-mono-num w-full rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-xs text-[var(--ink-primary)]"
                    aria-label="时长分钟"
                  />
                  <span className="shrink-0 text-[11px] text-[var(--ink-muted)]">分</span>
                </div>
                <div className="flex items-center gap-1 sm:col-span-3">
                  <input
                    type="number"
                    min={0}
                    max={logTotal}
                    value={logCorrect}
                    onChange={(e) => setLogCorrect(Number(e.target.value))}
                    className="font-mono-num w-full rounded-lg border border-[var(--line-strong)] bg-white px-2 py-2 text-xs text-[var(--ink-primary)]"
                    aria-label="答对题数"
                  />
                  <span className="text-xs text-[var(--ink-muted)]">/</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={logTotal}
                    onChange={(e) => setLogTotal(Number(e.target.value))}
                    className="font-mono-num w-full rounded-lg border border-[var(--line-strong)] bg-white px-2 py-2 text-xs text-[var(--ink-primary)]"
                    aria-label="总题数"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-12">
                <input
                  type="text"
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  placeholder="一句话复盘（如：讲座第2篇漏听转折词，已精听补齐）"
                  className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none sm:col-span-7"
                />
                <input
                  type="number"
                  min={0}
                  max={249}
                  value={logScoreManual}
                  onChange={(e) => setLogScoreManual(e.target.value)}
                  placeholder={`估分 ${autoEstimated}`}
                  className="font-mono-num rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-xs text-[var(--ink-primary)] sm:col-span-2"
                  title="可留空自动换算，或手填估算分"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-[var(--accent-teal)] px-3 py-2 text-xs font-medium text-white hover:bg-[#0b4a5a] sm:col-span-3"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>记一笔</span>
                </button>
              </div>
            </form>

            {/* Recent logs */}
            <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
              {logs.map((item) => {
                const hitFloor = item.estimatedScore >= listeningFloor;
                return (
                  <div
                    key={item.id}
                    className="group flex items-start justify-between gap-3 rounded-lg border border-[var(--line-subtle)] bg-white px-3.5 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono-num text-[11px] text-[var(--ink-muted)]">
                          {item.date}
                        </span>
                        <span className="font-medium text-[var(--ink-primary)]">
                          {item.drillType}
                        </span>
                        <span className="font-mono-num text-[11px] text-[var(--ink-secondary)]">
                          {item.minutes}m · {item.correctCount}/{item.totalQuestions}
                        </span>
                      </div>
                      {item.note && (
                        <p className="mt-1 text-xs text-[var(--ink-secondary)]">{item.note}</p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`font-mono-num inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
                          hitFloor
                            ? 'bg-[var(--accent-pine-soft)] text-[var(--accent-pine)]'
                            : 'bg-[var(--accent-ochre-soft)] text-[var(--accent-ochre)]'
                        }`}
                      >
                        {hitFloor && <CheckCircle2 className="h-3 w-3" />}
                        ≈{item.estimatedScore}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteLog(item.id)}
                        className="rounded p-1 text-[var(--ink-muted)] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-700"
                        title="删除记录"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: CET-6 Listening Traps + Note-taking Symbols */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Traps list */}
        <div className="desk-surface rounded-xl p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                CET-6 LISTENING TRAPS
              </div>
              <h2 className="mt-0.5 text-lg font-semibold text-[var(--ink-primary)]">
                六级听力六大高频陷阱
              </h2>
            </div>
            <span className="text-xs text-[var(--ink-muted)]">
              已标红重点盯防 <strong className="font-mono-num text-[var(--accent-ochre)]">{flaggedTraps.length}</strong> 项
            </span>
          </div>

          <div className="mt-4 divide-y divide-[var(--line-subtle)]">
            {CET6_LISTENING_TRAPS.map((trap) => {
              const flagged = flaggedTraps.includes(trap.id);
              return (
                <div key={trap.id} className="py-3.5 first:pt-1 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono-num text-[11px] font-semibold text-[var(--accent-teal)]">
                          {trap.code}
                        </span>
                        <h3 className="text-sm font-semibold text-[var(--ink-primary)]">
                          {trap.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {trap.signalWords.slice(0, 4).map((w) => (
                            <span
                              key={w}
                              className="font-mono-num rounded bg-[var(--bg-surface-muted)] px-1.5 py-0.5 text-[10px] text-[var(--ink-secondary)]"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--ink-secondary)]">
                        {trap.detail}
                      </p>
                      <p className="text-xs font-medium text-[var(--ink-primary)]">
                        破解动作：{trap.counterMove}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleFlaggedTrap(trap.id)}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                        flagged
                          ? 'border-[var(--accent-ochre)] bg-[var(--accent-ochre-soft)] text-[var(--accent-ochre)]'
                          : 'border-[var(--line-subtle)] bg-white text-[var(--ink-muted)] hover:border-[var(--line-strong)] hover:text-[var(--ink-primary)]'
                      }`}
                    >
                      <Flag className="h-3 w-3" />
                      <span>{flagged ? '常踩坑' : '标记'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note-taking Symbols & 3-step method */}
        <div className="desk-surface rounded-xl p-5 sm:p-6 lg:col-span-5">
          <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)] uppercase">
            NOTE-TAKING SHORTHAND
          </div>
          <h2 className="mt-0.5 text-lg font-semibold text-[var(--ink-primary)]">
            考场速记符号与三步节奏
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {NOTE_TAKING_SYMBOLS.map((sym) => (
              <div
                key={sym.symbol}
                className="rounded-lg border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-3"
              >
                <div className="font-mono-num text-base font-semibold text-[var(--accent-teal)]">
                  {sym.symbol}
                </div>
                <div className="mt-1 text-xs font-medium text-[var(--ink-primary)]">
                  {sym.meaning}
                </div>
                <div className="font-mono-num mt-0.5 text-[11px] text-[var(--ink-muted)]">
                  {sym.example}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5 border-t border-[var(--line-subtle)] pt-4">
            <div className="text-xs font-semibold text-[var(--ink-primary)]">
              单套真题听力提分闭环（35 分钟）
            </div>
            <ol className="space-y-2 text-xs leading-relaxed text-[var(--ink-secondary)]">
              <li>
                <span className="font-mono-num mr-1.5 font-semibold text-[var(--accent-teal)]">
                  01
                </span>
                <strong>读指令间隙扫选项：</strong>只划 4 个选项里的差异动词与态度词，预判问题类型。
              </li>
              <li>
                <span className="font-mono-num mr-1.5 font-semibold text-[var(--accent-teal)]">
                  02
                </span>
                <strong>边听边定锚：</strong>Section C 讲座每题 14.2 分，听到开头主旨/转折/例子立刻圈选，绝不回想上一题。
              </li>
              <li>
                <span className="font-mono-num mr-1.5 font-semibold text-[var(--accent-teal)]">
                  03
                </span>
                <strong>只精听错题段：</strong>不整套逐字听写，把错题对应的 40 秒盲听 2 遍并记录同义替换词组。
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
