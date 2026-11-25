import { useState } from 'react';
import { Play, Pause, RotateCcw, Flag, Plus, Check, Trash2 } from 'lucide-react';
import { READING_DRILL_PRESETS } from '../data/cet6Content';
import { formatClock, useTimer } from '../hooks/useTimer';
import type { WrongBookEntry } from '../types';

interface ReadingDrillProps {
  todayIso: string;
  wrongEntries: WrongBookEntry[];
  onAddWrongEntry: (entry: Omit<WrongBookEntry, 'id' | 'mastered'>) => void;
  onToggleMastered: (id: string) => void;
  onDeleteWrongEntry: (id: string) => void;
}

const READING_Q_TYPES = ['仔细阅读·推理题', '仔细阅读·主旨态度', '仔细阅读·细节定位', '长篇信息匹配', '选词填空·词性搭配'];

export function ReadingDrill({
  todayIso,
  wrongEntries,
  onAddWrongEntry,
  onToggleMastered,
  onDeleteWrongEntry,
}: ReadingDrillProps) {
  const [selectedPresetId, setSelectedPresetId] = useState(READING_DRILL_PRESETS[0].id);
  const preset =
    READING_DRILL_PRESETS.find((p) => p.id === selectedPresetId) ?? READING_DRILL_PRESETS[0];

  const timer = useTimer(preset.minutes);

  // Reading wrong-question quick form
  const [source, setSource] = useState('');
  const [questionType, setQuestionType] = useState(READING_Q_TYPES[0]);
  const [mistakeSummary, setMistakeSummary] = useState('');
  const [trapReason, setTrapReason] = useState('');
  const [fixRule, setFixRule] = useState('');

  const handleSelectPreset = (id: string) => {
    const found = READING_DRILL_PRESETS.find((p) => p.id === id);
    if (!found) return;
    setSelectedPresetId(id);
    timer.setMinutes(found.minutes);
  };

  const handleSubmitWrong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mistakeSummary.trim()) return;
    onAddWrongEntry({
      date: todayIso,
      section: 'reading',
      source: source.trim() || `${preset.name} 练习`,
      questionType,
      mistakeSummary: mistakeSummary.trim(),
      trapReason: trapReason.trim() || '定位偏移 / 干扰项误判',
      fixRule: fixRule.trim() || '回到原文出题句核对主语与限定程度词',
    });
    setSource('');
    setMistakeSummary('');
    setTrapReason('');
    setFixRule('');
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left: Skimming / Scanning Pacing Timer */}
      <div className="desk-surface rounded-xl p-5 sm:p-6 lg:col-span-5">
        <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--accent-pine)] uppercase">
          SKIMMING & SCANNING PACE TIMER
        </div>
        <h2 className="mt-0.5 text-lg font-semibold text-[var(--ink-primary)]">
          阅读配速与分段计时
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--ink-secondary)]">
          你已有 ~200 分阅读底子，考场推荐做题顺序：<strong>仔细阅读 (18m) → 长篇匹配 (12m) → 选词填空 (7m)</strong>，确保高分板块不赶工。
        </p>

        <div className="mt-4 space-y-2">
          {READING_DRILL_PRESETS.map((p) => {
            const active = p.id === preset.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
                  active
                    ? 'border-[var(--accent-pine)] bg-[var(--accent-pine-soft)]'
                    : 'border-[var(--line-subtle)] bg-white hover:border-[var(--line-strong)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink-primary)]">
                  <span>{p.name}</span>
                  <span className="font-mono-num text-[var(--accent-pine)]">
                    {p.minutes} 分钟 · {p.targetPerUnit}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-[var(--ink-secondary)]">{p.weightNote}</div>
              </button>
            );
          })}
        </div>

        {/* Clock Display + Controls */}
        <div className="mt-5 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono-num text-4xl font-semibold tracking-tight text-[var(--ink-primary)]">
              {formatClock(timer.remainingSeconds)}
            </span>
            <span className="font-mono-num text-xs text-[var(--ink-muted)]">
              已用 {formatClock(timer.elapsedSeconds)}
            </span>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface-muted)]">
            <div
              className="bar-fill-transition h-full rounded-full bg-[var(--accent-pine)]"
              style={{ width: `${Math.min(100, Math.round(timer.progress * 100))}%` }}
            />
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[var(--ink-secondary)]">
            策略：{preset.strategy}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={timer.toggle}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-pine)] px-4 py-2 text-xs font-medium text-white hover:opacity-95"
            >
              {timer.isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{timer.isRunning ? '暂停' : '开始配速'}</span>
            </button>
            <button
              type="button"
              onClick={() => timer.recordLap(`Passage / 题组 ${timer.laps.length + 1}`)}
              disabled={timer.elapsedSeconds === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs font-medium text-[var(--ink-primary)] disabled:opacity-40"
            >
              <Flag className="h-3.5 w-3.5" />
              <span>记录分段</span>
            </button>
            <button
              type="button"
              onClick={timer.reset}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>重置</span>
            </button>
          </div>

          {timer.laps.length > 0 && (
            <div className="mt-4 border-t border-[var(--line-subtle)] pt-3">
              <div className="text-[11px] font-semibold text-[var(--ink-muted)]">本次分段耗时</div>
              <ul className="mt-1.5 space-y-1">
                {timer.laps.map((lap) => (
                  <li
                    key={lap.id}
                    className="font-mono-num flex items-center justify-between text-xs text-[var(--ink-secondary)]"
                  >
                    <span>{lap.label}</span>
                    <span>
                      本段 <strong className="text-[var(--ink-primary)]">{formatClock(lap.deltaSeconds)}</strong>
                      {' · '}累计 {formatClock(lap.elapsedSeconds)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right: Integrated Reading Wrong-Question Journal */}
      <div className="desk-surface rounded-xl p-5 sm:p-6 lg:col-span-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)] uppercase">
              READING WRONG-QUESTION JOURNAL
            </div>
            <h2 className="mt-0.5 text-lg font-semibold text-[var(--ink-primary)]">
              阅读错题速记（自动同步至总错题本）
            </h2>
          </div>
          <span className="font-mono-num text-xs text-[var(--ink-muted)]">
            共 {wrongEntries.length} 条记录
          </span>
        </div>

        <form
          onSubmit={handleSubmitWrong}
          className="mt-4 space-y-3 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-4"
        >
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="题源（如 2024.06 卷一 Passage 2 Q52）"
              className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none"
            />
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-xs text-[var(--ink-primary)]"
            >
              {READING_Q_TYPES.map((qt) => (
                <option key={qt} value={qt}>
                  {qt}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={2}
            value={mistakeSummary}
            onChange={(e) => setMistakeSummary(e.target.value)}
            placeholder="简述错选原因（如：误选了含 only 的绝对选项，未注意原文第 3 段末的转折）"
            className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none"
          />

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <input
              type="text"
              value={trapReason}
              onChange={(e) => setTrapReason(e.target.value)}
              placeholder="命题陷阱（过度推断 / 偷换主语 / 长难句误读）"
              className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none"
            />
            <input
              type="text"
              value={fixRule}
              onChange={(e) => setFixRule(e.target.value)}
              placeholder="下次避坑动作（1句话）"
              className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-teal)] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#0b4a5a]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>记录阅读错题</span>
            </button>
          </div>
        </form>

        <div className="mt-4 space-y-2.5">
          {wrongEntries.map((item) => (
            <div
              key={item.id}
              className="group rounded-lg border border-[var(--line-subtle)] bg-white p-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-[var(--accent-pine-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-pine)]">
                    {item.questionType}
                  </span>
                  <span className="font-medium text-[var(--ink-primary)]">{item.source}</span>
                  <span className="font-mono-num text-[11px] text-[var(--ink-muted)]">
                    {item.date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggleMastered(item.id)}
                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium ${
                      item.mastered
                        ? 'bg-[var(--accent-pine-soft)] text-[var(--accent-pine)]'
                        : 'border border-[var(--line-strong)] text-[var(--ink-secondary)]'
                    }`}
                  >
                    <Check className="h-3 w-3" />
                    <span>{item.mastered ? '已掌握' : '待复盘'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteWrongEntry(item.id)}
                    className="rounded p-1 text-[var(--ink-muted)] opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-700"
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--ink-secondary)]">
                {item.mistakeSummary}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--ink-muted)]">
                <span>陷阱：{item.trapReason}</span>
                <span className="font-medium text-[var(--ink-primary)]">对策：{item.fixRule}</span>
              </div>
            </div>
          ))}
          {wrongEntries.length === 0 && (
            <div className="rounded-lg border border-dashed border-[var(--line-strong)] py-8 text-center text-xs text-[var(--ink-muted)]">
              暂无阅读错题，每次刷完仔细阅读或匹配题随手记下误选题即可。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
