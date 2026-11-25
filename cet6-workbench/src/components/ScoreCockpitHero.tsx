import { useState } from 'react';
import { ArrowRight, Check, Pencil, X } from 'lucide-react';
import type { ScoreProfile, SectionKey, StudyDay } from '../types';

interface ScoreCockpitHeroProps {
  profile: ScoreProfile;
  daysRemaining: number;
  streak: number;
  activeDay: StudyDay;
  currentScores: {
    total: number;
    listening: number;
    reading: number;
    writing: number;
    sourceLabel: string;
  };
  onLaunchSectionDrill: (section: SectionKey) => void;
  onJumpToPlan: () => void;
  onOpenSettings: () => void;
  onUpdateOneJob: (dayIndex: number, text: string, section: SectionKey) => void;
}

const SECTION_META: Record<
  SectionKey,
  { label: string; en: string; max: number; color: string; bgSoft: string; roleTag: string }
> = {
  listening: {
    label: '听力',
    en: 'Listening',
    max: 248.5,
    color: 'var(--accent-ochre)',
    bgSoft: 'var(--accent-ochre-soft)',
    roleTag: '首要保底',
  },
  writing: {
    label: '写作与翻译',
    en: 'Writing & Trans.',
    max: 213,
    color: 'var(--accent-cobalt)',
    bgSoft: 'var(--accent-cobalt-soft)',
    roleTag: '最大杠杆',
  },
  reading: {
    label: '阅读',
    en: 'Reading',
    max: 248.5,
    color: 'var(--accent-pine)',
    bgSoft: 'var(--accent-pine-soft)',
    roleTag: '核心优势',
  },
};

const SECTION_ACTION_LABEL: Record<SectionKey, string> = {
  listening: '开始听力专项',
  reading: '开始阅读提速',
  writing: '开始写作与翻译',
};

export function ScoreCockpitHero({
  profile,
  daysRemaining,
  streak,
  activeDay,
  currentScores,
  onLaunchSectionDrill,
  onJumpToPlan,
  onOpenSettings,
  onUpdateOneJob,
}: ScoreCockpitHeroProps) {
  const [editingJob, setEditingJob] = useState(false);
  const [draftJob, setDraftJob] = useState(activeDay.oneJob);
  const [draftSection, setDraftSection] = useState<SectionKey>(activeDay.oneJobSection);

  const totalGap = Math.max(0, profile.targetTotal - currentScores.total);
  const listeningFloorGap = Math.max(0, profile.listeningFloor - currentScores.listening);
  const doneInDay = activeDay.tasks.filter((t) => t.completed).length;

  const sections: Array<{
    key: SectionKey;
    current: number;
    target: number;
    floor?: number;
  }> = [
    {
      key: 'listening',
      current: currentScores.listening,
      target: profile.target.listening,
      floor: profile.listeningFloor,
    },
    {
      key: 'writing',
      current: currentScores.writing,
      target: profile.target.writing,
    },
    {
      key: 'reading',
      current: currentScores.reading,
      target: profile.target.reading,
    },
  ];

  const handleSaveOneJob = () => {
    if (draftJob.trim()) {
      onUpdateOneJob(activeDay.dayIndex, draftJob.trim(), draftSection);
    }
    setEditingJob(false);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:px-6 sm:pt-11 sm:pb-8">
      {/* Top Hero Editorial Band */}
      <div className="animate-desk-reveal flex flex-col justify-between gap-6 border-b border-[var(--line-strong)] pb-6 lg:flex-row lg:items-end">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-[0.14em] text-[var(--ink-secondary)] uppercase">
            <span className="font-mono-num font-semibold text-[var(--accent-teal)]">
              CET-6 SPRINT WORKBENCH
            </span>
            <span aria-hidden="true" className="text-[var(--line-strong)]">
              /
            </span>
            <span>{profile.userName}</span>
            <span aria-hidden="true" className="text-[var(--line-strong)]">
              /
            </span>
            <span>考期 {profile.examDate}</span>
            <span aria-hidden="true" className="text-[var(--line-strong)]">
              /
            </span>
            <span>{profile.recentRefLabel}</span>
          </div>

          <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--ink-primary)] sm:text-5xl">
            六级冲刺台
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-[15px]">
            以 <span className="font-mono-num font-semibold text-[var(--ink-primary)]">{profile.targetTotal}</span> 分为终点、
            听力 <span className="font-mono-num font-semibold text-[var(--accent-ochre)]">≥{profile.listeningFloor}</span> 为刚性底线：
            每天先守听力，再抓写作翻译高杠杆提分，稳住阅读既有优势。
          </p>
        </div>

        {/* Sculptural Countdown & Streak Anchor */}
        <div className="flex items-end gap-7 self-start lg:self-end">
          <div>
            <div className="text-[11px] font-medium tracking-[0.12em] text-[var(--ink-muted)] uppercase">
              距 12 月 12 日开考
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display font-mono-num text-5xl leading-none font-semibold tracking-tight text-[var(--ink-primary)] sm:text-6xl">
                {daysRemaining}
              </span>
              <span className="text-sm font-medium text-[var(--ink-secondary)]">天</span>
            </div>
          </div>

          <div className="h-11 w-px bg-[var(--line-subtle)]" aria-hidden="true" />

          <div>
            <div className="text-[11px] font-medium tracking-[0.12em] text-[var(--ink-muted)] uppercase">
              冲刺连续打卡
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display font-mono-num text-3xl leading-none font-semibold text-[var(--accent-teal)] sm:text-4xl">
                {streak}
              </span>
              <span className="text-xs font-medium text-[var(--ink-secondary)]">日</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Primary Workbench Composition: Today's One Job + Score Cockpit */}
      <div className="desk-surface animate-desk-reveal delay-1 mt-6 overflow-hidden rounded-xl">
        <div className="grid grid-cols-1 divide-y divide-[var(--line-subtle)] lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          {/* Left Column (5/12): Today's One Job */}
          <div className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-teal)]" />
                  <span className="font-mono-num text-[11px] font-semibold tracking-[0.14em] text-[var(--accent-teal)] uppercase">
                    DAY {String(activeDay.dayIndex).padStart(2, '0')} · 今日唯一核心任务
                  </span>
                </div>
                {!editingJob && (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftJob(activeDay.oneJob);
                      setDraftSection(activeDay.oneJobSection);
                      setEditingJob(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-[var(--ink-muted)] transition-colors hover:text-[var(--ink-primary)]"
                    title="自定义今日核心任务"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>调整</span>
                  </button>
                )}
              </div>

              <div className="mt-1.5 text-xs text-[var(--ink-muted)]">
                {activeDay.date} · {activeDay.phase}
              </div>

              {editingJob ? (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={draftJob}
                    onChange={(e) => setDraftJob(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-sm text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <select
                      value={draftSection}
                      onChange={(e) => setDraftSection(e.target.value as SectionKey)}
                      className="rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs text-[var(--ink-primary)]"
                    >
                      <option value="listening">关联模块：听力</option>
                      <option value="writing">关联模块：写作与翻译</option>
                      <option value="reading">关联模块：阅读</option>
                    </select>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingJob(false)}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--line-strong)] px-2.5 py-1 text-xs text-[var(--ink-secondary)] hover:bg-[var(--bg-surface-muted)]"
                      >
                        <X className="h-3.5 w-3.5" />
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveOneJob}
                        className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-teal)] px-3 py-1 text-xs font-medium text-white hover:opacity-95"
                      >
                        <Check className="h-3.5 w-3.5" />
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <h2 className="font-display mt-4 text-xl leading-snug font-semibold text-[var(--ink-primary)] sm:text-[23px]">
                  {activeDay.oneJob}
                </h2>
              )}

              <p className="mt-3 text-xs leading-relaxed text-[var(--ink-secondary)]">
                当日主题：{activeDay.focusTheme}。
                今日清单已完成{' '}
                <span className="font-mono-num font-semibold text-[var(--ink-primary)]">
                  {doneInDay}/{activeDay.tasks.length}
                </span>{' '}
                项。先把这一件事做透，再推进其余科目。
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onLaunchSectionDrill(activeDay.oneJobSection)}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-teal)] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#0b4a5a]"
              >
                <span>{SECTION_ACTION_LABEL[activeDay.oneJobSection]}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onJumpToPlan}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line-strong)] bg-white px-3.5 py-2.5 text-sm font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--accent-teal)] hover:text-[var(--accent-teal)]"
              >
                查看今日清单
              </button>
            </div>
          </div>

          {/* Right Column (7/12): Score Cockpit */}
          <div className="flex flex-col justify-between p-6 sm:p-7 lg:col-span-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-mono-num text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-muted)] uppercase">
                  SCORE COCKPIT · {currentScores.sourceLabel}
                </div>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-2.5">
                  <span className="font-mono-num text-3xl font-semibold tracking-tight text-[var(--ink-primary)]">
                    {currentScores.total}
                  </span>
                  <span className="text-sm text-[var(--ink-muted)]">→</span>
                  <span className="font-mono-num text-3xl font-semibold tracking-tight text-[var(--accent-teal)]">
                    {profile.targetTotal}
                  </span>
                  <span className="font-mono-num ml-1 text-xs font-medium text-[var(--accent-ochre)]">
                    {totalGap > 0 ? `还差 +${totalGap} 分` : '已达成总分目标'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenSettings}
                className="text-xs font-medium text-[var(--ink-secondary)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--accent-teal)] hover:decoration-[var(--accent-teal)]"
              >
                编辑基线与目标
              </button>
            </div>

            {/* Three Architectural Section Progress Bars */}
            <div className="mt-5 space-y-4">
              {sections.map((sec) => {
                const meta = SECTION_META[sec.key];
                const currentPct = Math.min(100, (sec.current / meta.max) * 100);
                const targetPct = Math.min(100, (sec.target / meta.max) * 100);
                const floorPct = sec.floor ? Math.min(100, (sec.floor / meta.max) * 100) : null;
                const gapToTarget = Math.max(0, sec.target - sec.current);

                return (
                  <div key={sec.key} className="space-y-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--ink-primary)]">{meta.label}</span>
                        <span className="text-[11px] text-[var(--ink-muted)]">{meta.en}</span>
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: meta.bgSoft, color: meta.color }}
                        >
                          {meta.roleTag}
                        </span>
                      </div>

                      <div className="font-mono-num flex items-center gap-2 text-xs">
                        <span className="font-semibold text-[var(--ink-primary)]">{sec.current}</span>
                        <span className="text-[var(--ink-muted)]">/ {sec.target}</span>
                        <span className="text-[11px] text-[var(--ink-secondary)]">
                          {sec.key === 'listening' && listeningFloorGap > 0
                            ? `距底线150差 +${listeningFloorGap}`
                            : gapToTarget > 0
                              ? `差 +${gapToTarget}`
                              : '已达标'}
                        </span>
                      </div>
                    </div>

                    {/* Track with target & floor markers */}
                    <div className="relative h-2.5 w-full overflow-visible rounded-full bg-[var(--bg-surface-muted)]">
                      {/* Target ghost band */}
                      <div
                        className="absolute top-0 bottom-0 left-0 rounded-full opacity-20"
                        style={{
                          width: `${targetPct}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                      {/* Current score bar */}
                      <div
                        className="bar-fill-transition absolute top-0 bottom-0 left-0 rounded-full"
                        style={{
                          width: `${currentPct}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                      {/* Floor marker for Listening (150) */}
                      {floorPct !== null && (
                        <div
                          className="absolute -top-1 -bottom-1 w-[2px] bg-[var(--ink-primary)]"
                          style={{ left: `${floorPct}%` }}
                          title={`听力保底线 ${sec.floor}`}
                        />
                      )}
                      {/* Target tick */}
                      <div
                        className="absolute -top-0.5 -bottom-0.5 w-[2px] rounded-full"
                        style={{
                          left: `${targetPct}%`,
                          backgroundColor: meta.color,
                        }}
                        title={`目标分 ${sec.target}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line-subtle)] pt-3 text-[11px] text-[var(--ink-muted)]">
              <span>
                CET-6 满分 710（听力 248.5 · 阅读 248.5 · 写译 213）；深色竖线标示听力 ≥{profile.listeningFloor} 底线。
              </span>
              <span className="font-mono-num">
                目标拆分 {profile.target.listening}+{profile.target.reading}+{profile.target.writing} ={' '}
                {profile.target.listening + profile.target.reading + profile.target.writing}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
