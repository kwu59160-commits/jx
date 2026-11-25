import { useState } from 'react';
import { Check, Plus, Trash2, ArrowUpRight, Clock } from 'lucide-react';
import type { DailyTask, SectionKey, StudyDay } from '../types';

interface DailyPlanPanelProps {
  days: StudyDay[];
  selectedDayIndex: number;
  todayIso: string;
  onSelectDay: (dayIndex: number) => void;
  onToggleTask: (dayIndex: number, taskId: string) => void;
  onAddTask: (
    dayIndex: number,
    input: { title: string; section: SectionKey; minutes: number; priority: DailyTask['priority'] }
  ) => void;
  onDeleteTask: (dayIndex: number, taskId: string) => void;
  onLaunchSectionDrill: (section: SectionKey) => void;
}

const SECTION_STYLE: Record<SectionKey, { label: string; color: string; soft: string }> = {
  listening: { label: '听力', color: 'var(--accent-ochre)', soft: 'var(--accent-ochre-soft)' },
  writing: { label: '写作翻译', color: 'var(--accent-cobalt)', soft: 'var(--accent-cobalt-soft)' },
  reading: { label: '阅读', color: 'var(--accent-pine)', soft: 'var(--accent-pine-soft)' },
};

const PRIORITY_LABEL: Record<DailyTask['priority'], string> = {
  core: '第一优先',
  secondary: '高杠杆提分',
  protect: '保优势',
};

export function DailyPlanPanel({
  days,
  selectedDayIndex,
  todayIso,
  onSelectDay,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onLaunchSectionDrill,
}: DailyPlanPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSection, setNewSection] = useState<SectionKey>('listening');
  const [newMinutes, setNewMinutes] = useState(25);
  const [newPriority, setNewPriority] = useState<DailyTask['priority']>('core');

  const activeDay = days.find((d) => d.dayIndex === selectedDayIndex) ?? days[0];
  if (!activeDay) return null;

  const totalMinutes = activeDay.tasks.reduce((sum, t) => sum + t.minutes, 0);
  const doneMinutes = activeDay.tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.minutes, 0);
  const completedCount = activeDay.tasks.filter((t) => t.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(activeDay.dayIndex, {
      title: newTitle.trim(),
      section: newSection,
      minutes: newMinutes,
      priority: newPriority,
    });
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <section id="daily-plan" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="animate-desk-reveal delay-2 space-y-5">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono-num text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-muted)] uppercase">
              17-DAY SPRINT SCHEDULE
            </div>
            <h2 className="font-display mt-1 text-2xl font-semibold text-[var(--ink-primary)]">
              每日冲刺日程
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--ink-secondary)]">
            <span>权重策略：听力优先保底 → 写译快速上分 → 阅读定时护盘</span>
          </div>
        </div>

        {/* 17-Day Sprint Strip */}
        <div className="desk-surface rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 pb-3 text-xs">
            <span className="font-medium text-[var(--ink-secondary)]">
              点击任意冲刺日切换清单（11.25 – 12.11）
            </span>
            <span className="font-mono-num text-[var(--ink-muted)]">
              总完成度 {days.reduce((a, d) => a + d.tasks.filter((t) => t.completed).length, 0)}/
              {days.reduce((a, d) => a + d.tasks.length, 0)} 项
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9 lg:grid-cols-17">
            {days.map((day) => {
              const done = day.tasks.filter((t) => t.completed).length;
              const total = day.tasks.length;
              const ratio = total > 0 ? done / total : 0;
              const isSelected = day.dayIndex === activeDay.dayIndex;
              const isToday = day.date === todayIso;
              const shortDate = day.date.slice(5); // MM-DD

              return (
                <button
                  key={day.dayIndex}
                  type="button"
                  onClick={() => onSelectDay(day.dayIndex)}
                  className={`group relative flex flex-col items-center rounded-lg border px-1.5 py-2 transition-all ${
                    isSelected
                      ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)] text-white shadow-sm'
                      : ratio === 1
                        ? 'border-[var(--accent-pine)]/40 bg-[var(--accent-pine-soft)] text-[var(--ink-primary)] hover:border-[var(--accent-pine)]'
                        : 'border-[var(--line-subtle)] bg-white/80 text-[var(--ink-primary)] hover:border-[var(--line-strong)]'
                  }`}
                >
                  <span
                    className={`font-mono-num text-[10px] font-semibold ${
                      isSelected ? 'text-white/80' : 'text-[var(--ink-muted)]'
                    }`}
                  >
                    D{day.dayIndex}
                  </span>
                  <span className="font-mono-num mt-0.5 text-[10px]">{shortDate}</span>
                  {/* Tiny completion bar */}
                  <span
                    className={`mt-1.5 h-1 w-full overflow-hidden rounded-full ${
                      isSelected ? 'bg-white/25' : 'bg-[var(--bg-surface-muted)]'
                    }`}
                  >
                    <span
                      className="block h-full rounded-full transition-all"
                      style={{
                        width: `${Math.round(ratio * 100)}%`,
                        backgroundColor: isSelected
                          ? '#ffffff'
                          : ratio === 1
                            ? 'var(--accent-pine)'
                            : 'var(--accent-teal)',
                      }}
                    />
                  </span>
                  {isToday && (
                    <span
                      className={`mt-1 text-[9px] font-semibold ${
                        isSelected ? 'text-white' : 'text-[var(--accent-ochre)]'
                      }`}
                    >
                      今日
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Day Checklist Panel */}
        <div className="desk-surface rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-subtle)] px-5 py-4 sm:px-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
                <span className="font-mono-num font-semibold text-[var(--accent-teal)]">
                  DAY {String(activeDay.dayIndex).padStart(2, '0')}
                </span>
                <span>{activeDay.date}</span>
                <span>·</span>
                <span>{activeDay.phase}</span>
              </div>
              <h3 className="mt-1 text-base font-semibold text-[var(--ink-primary)]">
                {activeDay.focusTheme}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-mono-num text-sm font-semibold text-[var(--ink-primary)]">
                  {completedCount}/{activeDay.tasks.length} 项
                </div>
                <div className="font-mono-num flex items-center justify-end gap-1 text-[11px] text-[var(--ink-muted)]">
                  <Clock className="h-3 w-3" />
                  <span>
                    {doneMinutes}/{totalMinutes} 分钟
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--accent-teal)] hover:text-[var(--accent-teal)]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>添加任务</span>
              </button>
            </div>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleSubmit}
              className="border-b border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] px-5 py-4 sm:px-6"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="输入自定义任务，例如：精听 2024.12 卷二讲座 2 篇"
                  className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-sm text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none sm:col-span-6"
                />
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value as SectionKey)}
                  className="rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-xs text-[var(--ink-primary)] sm:col-span-2"
                >
                  <option value="listening">听力</option>
                  <option value="writing">写作翻译</option>
                  <option value="reading">阅读</option>
                </select>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as DailyTask['priority'])}
                  className="rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-xs text-[var(--ink-primary)] sm:col-span-2"
                >
                  <option value="core">第一优先</option>
                  <option value="secondary">高杠杆提分</option>
                  <option value="protect">保优势</option>
                </select>
                <div className="flex items-center gap-1.5 sm:col-span-2">
                  <input
                    type="number"
                    min={5}
                    max={180}
                    step={5}
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="font-mono-num w-full rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-xs text-[var(--ink-primary)]"
                    aria-label="预计用时分钟"
                  />
                  <span className="shrink-0 text-xs text-[var(--ink-muted)]">分</span>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-md px-3 py-1.5 text-xs text-[var(--ink-secondary)] hover:bg-[var(--bg-surface-muted)]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[var(--accent-teal)] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#0b4a5a]"
                >
                  加入 Day {activeDay.dayIndex}
                </button>
              </div>
            </form>
          )}

          <ul className="divide-y divide-[var(--line-subtle)]">
            {activeDay.tasks.map((task) => {
              const style = SECTION_STYLE[task.section];
              return (
                <li
                  key={task.id}
                  className="group flex items-start justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--bg-surface-soft)] sm:items-center sm:px-6"
                >
                  <div className="flex flex-1 items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => onToggleTask(activeDay.dayIndex, task.id)}
                      aria-label={task.completed ? '标记为未完成' : '标记为已完成'}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                        task.completed
                          ? 'border-[var(--accent-pine)] bg-[var(--accent-pine)] text-white'
                          : 'border-[var(--line-strong)] bg-white hover:border-[var(--accent-teal)]'
                      }`}
                    >
                      {task.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{ backgroundColor: style.soft, color: style.color }}
                        >
                          {style.label}
                        </span>
                        <span className="text-[11px] text-[var(--ink-muted)]">
                          {PRIORITY_LABEL[task.priority]}
                        </span>
                        <span className="font-mono-num text-[11px] text-[var(--ink-muted)]">
                          {task.minutes} min
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-sm leading-snug ${
                          task.completed
                            ? 'text-[var(--ink-muted)] line-through'
                            : 'text-[var(--ink-primary)]'
                        }`}
                      >
                        {task.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onLaunchSectionDrill(task.section)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--accent-teal)] opacity-90 transition-colors hover:bg-[var(--accent-teal-soft)]"
                      title={`打开${style.label}训练模块`}
                    >
                      <span className="hidden sm:inline">去训练</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask(activeDay.dayIndex, task.id)}
                      className="rounded-md p-1.5 text-[var(--ink-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-700 focus:opacity-100"
                      title="删除任务"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
            {activeDay.tasks.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-[var(--ink-muted)]">
                当日尚无任务，点击右上角“添加任务”补充安排。
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
