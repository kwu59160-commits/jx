import { useMemo, useState } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { MockExamEntry, ScoreProfile } from '../types';

interface MockTrackerViewProps {
  profile: ScoreProfile;
  mocks: MockExamEntry[];
  todayIso: string;
  onAddMock: (entry: Omit<MockExamEntry, 'id'>) => void;
  onDeleteMock: (id: string) => void;
}

export function MockTrackerView({
  profile,
  mocks,
  todayIso,
  onAddMock,
  onDeleteMock,
}: MockTrackerViewProps) {
  const [chartMode, setChartMode] = useState<'total' | 'listening'>('total');
  const [label, setLabel] = useState('');
  const [date, setDate] = useState(todayIso);
  const [listening, setListening] = useState(148);
  const [reading, setReading] = useState(202);
  const [writing, setWriting] = useState(118);
  const [notes, setNotes] = useState('');

  const sortedMocks = useMemo(
    () => [...mocks].sort((a, b) => a.date.localeCompare(b.date)),
    [mocks]
  );

  const computedTotal = listening + reading + writing;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanListening = Math.max(0, Math.min(249, listening));
    const cleanReading = Math.max(0, Math.min(249, reading));
    const cleanWriting = Math.max(0, Math.min(213, writing));
    onAddMock({
      date: date || todayIso,
      label: label.trim() || `冲刺全真模考 #${mocks.filter((m) => !m.isBaseline).length + 1}`,
      listening: cleanListening,
      reading: cleanReading,
      writing: cleanWriting,
      total: cleanListening + cleanReading + cleanWriting,
      notes: notes.trim() || '完成全套计时模拟',
    });
    setLabel('');
    setNotes('');
  };

  // Build SVG trajectory points: all recorded exams + Target endpoint
  const svgConfig = useMemo(() => {
    const width = 760;
    const height = 270;
    const padL = 52;
    const padR = 46;
    const padT = 26;
    const padB = 42;
    const innerW = width - padL - padR;
    const innerH = height - padT - padB;

    const isTotal = chartMode === 'total';
    const minY = isTotal ? 360 : 90;
    const maxY = isTotal ? 540 : 210;
    const goalYValue = isTotal ? profile.targetTotal : profile.listeningFloor;
    const passYValue = isTotal ? 425 : profile.target.listening;

    const points = [
      ...sortedMocks.map((m, idx) => ({
        id: m.id,
        shortLabel: m.isBaseline ? '历史基线' : `模考 ${idx}`,
        date: m.date.slice(5),
        value: isTotal ? m.total : m.listening,
        isGoal: false,
        isBaseline: Boolean(m.isBaseline),
      })),
      {
        id: 'target-endpoint',
        shortLabel: '12.12 目标',
        date: profile.examDate.slice(5),
        value: isTotal ? profile.targetTotal : profile.target.listening,
        isGoal: true,
        isBaseline: false,
      },
    ];

    const toY = (val: number) => {
      const clamped = Math.max(minY, Math.min(maxY, val));
      const ratio = (clamped - minY) / (maxY - minY);
      return padT + innerH * (1 - ratio);
    };

    const plotted = points.map((pt, idx) => {
      const x =
        points.length === 1
          ? padL + innerW / 2
          : padL + (innerW * idx) / (points.length - 1);
      return { ...pt, x, y: toY(pt.value) };
    });

    const actualPoints = plotted.filter((p) => !p.isGoal);
    const actualPath = actualPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');

    const lastActual = actualPoints[actualPoints.length - 1];
    const goalPoint = plotted[plotted.length - 1];
    const projectedPath =
      lastActual && goalPoint
        ? `M ${lastActual.x.toFixed(1)} ${lastActual.y.toFixed(1)} L ${goalPoint.x.toFixed(1)} ${goalPoint.y.toFixed(1)}`
        : '';

    const yTicks = isTotal ? [380, 425, 460, 500, 530] : [100, 130, 150, 175, 200];

    return {
      width,
      height,
      padL,
      padR,
      padT,
      padB,
      plotted,
      actualPath,
      projectedPath,
      goalLineY: toY(goalYValue),
      passLineY: toY(passYValue),
      goalYValue,
      passYValue,
      yTicks,
      toY,
    };
  }, [chartMode, sortedMocks, profile]);

  const latestMock = sortedMocks[sortedMocks.length - 1];
  const sprintCount = sortedMocks.filter((m) => !m.isBaseline).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="animate-desk-reveal flex flex-col justify-between gap-4 border-b border-[var(--line-strong)] pb-5 md:flex-row md:items-end">
        <div>
          <div className="font-mono-num text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-muted)] uppercase">
            MOCK EXAM TRAJECTORY
          </div>
          <h1 className="font-display mt-1 text-3xl font-semibold text-[var(--ink-primary)]">
            模考分数轨迹追踪
          </h1>
          <p className="mt-1 text-xs text-[var(--ink-secondary)]">
            历史基线 {profile.baselineTotal} 分（{profile.recentRefLabel}），已录入{' '}
            <strong className="font-mono-num text-[var(--ink-primary)]">{sprintCount}</strong> 次冲刺模考。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChartMode('total')}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              chartMode === 'total'
                ? 'bg-[var(--accent-teal)] text-white'
                : 'border border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)]'
            }`}
          >
            总分曲线（目标 {profile.targetTotal}）
          </button>
          <button
            type="button"
            onClick={() => setChartMode('listening')}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              chartMode === 'listening'
                ? 'bg-[var(--accent-ochre)] text-white'
                : 'border border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)]'
            }`}
          >
            听力底线曲线（≥{profile.listeningFloor}）
          </button>
        </div>
      </div>

      {/* Trajectory SVG Chart */}
      <div className="desk-surface animate-desk-reveal delay-1 mt-6 rounded-xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          <div className="text-sm font-semibold text-[var(--ink-primary)]">
            {chartMode === 'total'
              ? `总分跃迁路线：${profile.baselineTotal} → ${profile.targetTotal}`
              : `听力保底路线：${profile.baseline.listening} → 底线 ${profile.listeningFloor} / 目标 ${profile.target.listening}`}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[var(--ink-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-4 rounded-full"
                style={{
                  backgroundColor:
                    chartMode === 'total' ? 'var(--accent-teal)' : 'var(--accent-ochre)',
                }}
              />
              已考轨迹
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[var(--ink-muted)]" />
              冲刺预期线
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgConfig.width} ${svgConfig.height}`}
            className="h-auto min-w-[540px] w-full"
            role="img"
            aria-label="模考分数趋势图"
          >
            {/* Horizontal gridlines */}
            {svgConfig.yTicks.map((tick) => {
              const y = svgConfig.toY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={svgConfig.padL}
                    x2={svgConfig.width - svgConfig.padR}
                    y1={y}
                    y2={y}
                    stroke="rgba(16,33,43,0.08)"
                    strokeWidth="1"
                  />
                  <text
                    x={svgConfig.padL - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="font-mono-num fill-[#6f8490] text-[11px]"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Reference Goal / Floor Line */}
            <line
              x1={svgConfig.padL}
              x2={svgConfig.width - svgConfig.padR}
              y1={svgConfig.goalLineY}
              y2={svgConfig.goalLineY}
              stroke={chartMode === 'total' ? '#0e5a6d' : '#b85614'}
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            <text
              x={svgConfig.width - svgConfig.padR}
              y={svgConfig.goalLineY - 7}
              textAnchor="end"
              className="font-mono-num text-[11px] font-semibold"
              fill={chartMode === 'total' ? '#0e5a6d' : '#b85614'}
            >
              {chartMode === 'total'
                ? `目标线 ${svgConfig.goalYValue}`
                : `保底红线 ${svgConfig.goalYValue}`}
            </text>

            {/* Secondary Reference Line (425 pass or target listening) */}
            <line
              x1={svgConfig.padL}
              x2={svgConfig.width - svgConfig.padR}
              y1={svgConfig.passLineY}
              y2={svgConfig.passLineY}
              stroke="rgba(30,107,86,0.45)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <text
              x={svgConfig.width - svgConfig.padR}
              y={svgConfig.passLineY + 12}
              textAnchor="end"
              className="font-mono-num text-[10px]"
              fill="#1e6b56"
            >
              {chartMode === 'total' ? '及格线 425' : `听力目标 ${svgConfig.passYValue}`}
            </text>

            {/* Projected dashed path to Dec 12 target */}
            {svgConfig.projectedPath && (
              <path
                d={svgConfig.projectedPath}
                fill="none"
                stroke="#6f8490"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            )}

            {/* Actual recorded path */}
            {svgConfig.actualPath && (
              <path
                key={chartMode + sortedMocks.length}
                d={svgConfig.actualPath}
                fill="none"
                stroke={chartMode === 'total' ? '#0e5a6d' : '#b85614'}
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-trajectory"
              />
            )}

            {/* Nodes & Labels */}
            {svgConfig.plotted.map((pt) => {
              const strokeColor = pt.isGoal
                ? '#1e6b56'
                : chartMode === 'total'
                  ? '#0e5a6d'
                  : '#b85614';
              return (
                <g key={pt.id}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={pt.isGoal ? 6 : 5.5}
                    fill={pt.isGoal ? '#ffffff' : strokeColor}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    className="font-mono-num text-[12px] font-semibold"
                    fill="#10212b"
                  >
                    {pt.value}
                  </text>
                  <text
                    x={pt.x}
                    y={svgConfig.height - 20}
                    textAnchor="middle"
                    className="fill-[#425966] text-[11px]"
                  >
                    {pt.shortLabel}
                  </text>
                  <text
                    x={pt.x}
                    y={svgConfig.height - 6}
                    textAnchor="middle"
                    className="font-mono-num fill-[#6f8490] text-[10px]"
                  >
                    {pt.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Lower Split: Record New Mock + History Table */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="desk-surface rounded-xl p-5 sm:p-6 lg:col-span-5"
        >
          <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)] uppercase">
            LOG NEW MOCK EXAM
          </div>
          <h2 className="mt-0.5 text-lg font-semibold text-[var(--ink-primary)]">
            录入一次全真模考
          </h2>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                试卷名称
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="例如：2025年12月六级真题（卷一）"
                className="mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                模考日期
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-mono-num mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-primary)]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-[var(--accent-ochre)]">
                  听力 (248.5)
                </label>
                <input
                  type="number"
                  min={0}
                  max={249}
                  value={listening}
                  onChange={(e) => setListening(Number(e.target.value))}
                  className="font-mono-num mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-sm font-semibold text-[var(--ink-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--accent-pine)]">
                  阅读 (248.5)
                </label>
                <input
                  type="number"
                  min={0}
                  max={249}
                  value={reading}
                  onChange={(e) => setReading(Number(e.target.value))}
                  className="font-mono-num mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-sm font-semibold text-[var(--ink-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--accent-cobalt)]">
                  写译 (213)
                </label>
                <input
                  type="number"
                  min={0}
                  max={213}
                  value={writing}
                  onChange={(e) => setWriting(Number(e.target.value))}
                  className="font-mono-num mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-sm font-semibold text-[var(--ink-primary)]"
                />
              </div>
            </div>

            {/* Live total preview */}
            <div className="flex items-center justify-between rounded-lg border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] px-3.5 py-2.5 text-xs">
              <span className="text-[var(--ink-secondary)]">本次模考总分</span>
              <div className="font-mono-num flex items-center gap-2">
                <span className="text-lg font-semibold text-[var(--ink-primary)]">
                  {computedTotal}
                </span>
                {listening >= profile.listeningFloor ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--accent-pine)]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    听力过底线
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--accent-ochre)]">
                    <AlertCircle className="h-3.5 w-3.5" />
                    听力差 {profile.listeningFloor - listening}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">
                考后复盘备注
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="记录时间分配、听力节奏或写译失误..."
                className="mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-teal)] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0b4a5a]"
            >
              <Plus className="h-4 w-4" />
              <span>记录到轨迹并更新驾驶舱</span>
            </button>
          </div>
        </form>

        {/* History Table */}
        <div className="desk-surface rounded-xl p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                EXAM RECORD LEDGER
              </div>
              <h2 className="mt-0.5 text-lg font-semibold text-[var(--ink-primary)]">
                成绩台账
              </h2>
            </div>
            {latestMock && (
              <span className="font-mono-num text-xs text-[var(--ink-secondary)]">
                距 500 目标还差{' '}
                <strong className="text-[var(--accent-teal)]">
                  {Math.max(0, profile.targetTotal - latestMock.total)}
                </strong>{' '}
                分
              </span>
            )}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--line-strong)] text-[11px] text-[var(--ink-muted)]">
                  <th className="py-2 pr-3 font-medium">日期 / 试卷</th>
                  <th className="px-2 py-2 text-right font-medium">听力</th>
                  <th className="px-2 py-2 text-right font-medium">阅读</th>
                  <th className="px-2 py-2 text-right font-medium">写译</th>
                  <th className="px-2 py-2 text-right font-medium">总分</th>
                  <th className="py-2 pl-2 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-subtle)]">
                {sortedMocks.map((m) => {
                  const deltaTotal = m.total - profile.baselineTotal;
                  return (
                    <tr key={m.id} className="group align-top">
                      <td className="py-3 pr-3">
                        <div className="font-medium text-[var(--ink-primary)]">{m.label}</div>
                        <div className="font-mono-num mt-0.5 text-[11px] text-[var(--ink-muted)]">
                          {m.date}
                        </div>
                        {m.notes && (
                          <p className="mt-1 text-[11px] leading-relaxed text-[var(--ink-secondary)]">
                            {m.notes}
                          </p>
                        )}
                      </td>
                      <td className="font-mono-num px-2 py-3 text-right font-semibold">
                        <span
                          className={
                            m.listening >= profile.listeningFloor
                              ? 'text-[var(--accent-pine)]'
                              : 'text-[var(--accent-ochre)]'
                          }
                        >
                          {m.listening}
                        </span>
                      </td>
                      <td className="font-mono-num px-2 py-3 text-right text-[var(--ink-primary)]">
                        {m.reading}
                      </td>
                      <td className="font-mono-num px-2 py-3 text-right text-[var(--ink-primary)]">
                        {m.writing}
                      </td>
                      <td className="font-mono-num px-2 py-3 text-right">
                        <div className="font-semibold text-[var(--ink-primary)]">{m.total}</div>
                        {!m.isBaseline && (
                          <div
                            className={`text-[10px] ${
                              deltaTotal >= 0
                                ? 'text-[var(--accent-pine)]'
                                : 'text-[var(--accent-ochre)]'
                            }`}
                          >
                            {deltaTotal >= 0 ? `+${deltaTotal}` : deltaTotal}
                          </div>
                        )}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        {m.isBaseline ? (
                          <span className="text-[10px] text-[var(--ink-muted)]">基线</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onDeleteMock(m.id)}
                            className="rounded p-1 text-[var(--ink-muted)] hover:bg-red-50 hover:text-red-700"
                            title="删除此次模考"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
