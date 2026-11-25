import { useMemo, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  FilePlus2,
} from 'lucide-react';
import {
  CET6_RUBRIC,
  OUTLINE_TEMPLATES,
  WRITING_PROMPTS,
} from '../data/cet6Content';
import { formatClock, useTimer } from '../hooks/useTimer';
import type { WritingDraftState } from '../types';

interface WritingDrillProps {
  writingState: WritingDraftState;
  onSetWritingMode: (mode: 'essay' | 'translation', promptId: string) => void;
  onUpdateDraft: (promptId: string, text: string) => void;
  onToggleRubric: (promptId: string, rubricId: string) => void;
}

function countEnglishWords(text: string): number {
  const cleaned = text.trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function WritingDrill({
  writingState,
  onSetWritingMode,
  onUpdateDraft,
  onToggleRubric,
}: WritingDrillProps) {
  const [showRef, setShowRef] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(OUTLINE_TEMPLATES[0].id);

  const modePrompts = useMemo(
    () => WRITING_PROMPTS.filter((p) => p.mode === writingState.activeMode),
    [writingState.activeMode]
  );

  const activePrompt =
    modePrompts.find((p) => p.id === writingState.selectedPromptId) ?? modePrompts[0];

  const timer = useTimer(writingState.activeMode === 'essay' ? 30 : 25);

  const draftText = writingState.draftsByPrompt[activePrompt.id] ?? '';
  const wordCount = countEnglishWords(draftText);
  const checkedRubricIds = writingState.rubricChecksByPrompt[activePrompt.id] ?? [];

  const rawRubricScore = useMemo(
    () =>
      CET6_RUBRIC.reduce(
        (sum, item) => (checkedRubricIds.includes(item.id) ? sum + item.weight : sum),
        0
      ),
    [checkedRubricIds]
  );

  // CET-6 single section (Writing OR Translation) is 106.5 max (15 raw points)
  const scaledSingleScore = Math.round((rawRubricScore / 15) * 106.5);

  const handleSwitchMode = (mode: 'essay' | 'translation') => {
    const first = WRITING_PROMPTS.find((p) => p.mode === mode);
    if (first) {
      onSetWritingMode(mode, first.id);
      timer.setMinutes(mode === 'essay' ? 30 : 25);
      setShowRef(false);
    }
  };

  const handleInsertTemplate = (templateId: string) => {
    const tpl = OUTLINE_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    const skeleton = tpl.structure.map((s) => s.frame).join('\n\n');
    const next = draftText.trim() ? `${draftText.trim()}\n\n${skeleton}` : skeleton;
    onUpdateDraft(activePrompt.id, next);
  };

  const activeTemplate =
    OUTLINE_TEMPLATES.find((t) => t.id === selectedTemplateId) ?? OUTLINE_TEMPLATES[0];

  const wordStatusColor =
    writingState.activeMode === 'translation'
      ? 'text-[var(--accent-cobalt)]'
      : wordCount >= 150 && wordCount <= 205
        ? 'text-[var(--accent-pine)]'
        : wordCount > 205
          ? 'text-[var(--accent-ochre)]'
          : 'text-[var(--ink-secondary)]';

  return (
    <div className="space-y-6">
      {/* Mode & Prompt Selector Bar */}
      <div className="desk-surface rounded-xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSwitchMode('essay')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                writingState.activeMode === 'essay'
                  ? 'bg-[var(--accent-cobalt)] text-white'
                  : 'border border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              作文 Essay（30m / 106.5分）
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('translation')}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                writingState.activeMode === 'translation'
                  ? 'bg-[var(--accent-cobalt)] text-white'
                  : 'border border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              汉译英 Translation（25m / 106.5分）
            </button>
          </div>

          {/* Inline compact timer */}
          <div className="flex items-center gap-2">
            <span className="font-mono-num text-base font-semibold text-[var(--ink-primary)]">
              {formatClock(timer.remainingSeconds)}
            </span>
            <button
              type="button"
              onClick={timer.toggle}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-cobalt)] px-2.5 py-1.5 text-xs font-medium text-white hover:opacity-95"
            >
              {timer.isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              <span>{timer.isRunning ? '暂停' : '计时'}</span>
            </button>
            <button
              type="button"
              onClick={timer.reset}
              className="rounded-md border border-[var(--line-strong)] bg-white p-1.5 text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
              title="重置计时器"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Prompt bank pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {modePrompts.map((p) => {
            const active = p.id === activePrompt.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSetWritingMode(writingState.activeMode, p.id);
                  setShowRef(false);
                }}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  active
                    ? 'border-[var(--accent-cobalt)] bg-[var(--accent-cobalt-soft)] text-[var(--ink-primary)]'
                    : 'border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
                }`}
              >
                <div className="font-semibold">{p.title}</div>
                <div className="mt-0.5 text-[10px] text-[var(--ink-muted)]">
                  {p.yearTag} · {p.topicTag}
                </div>
              </button>
            );
          })}
        </div>

        {/* Prompt Body */}
        <div className="mt-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-4">
          <p className="text-sm leading-relaxed whitespace-pre-line text-[var(--ink-primary)]">
            {activePrompt.promptText}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-[var(--ink-muted)]">可用表达：</span>
            {activePrompt.keyVocab.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  const eng = v.split(' (')[0];
                  onUpdateDraft(activePrompt.id, draftText ? `${draftText} ${eng}` : eng);
                }}
                className="rounded bg-white px-2 py-0.5 text-[11px] text-[var(--accent-cobalt)] ring-1 ring-[var(--line-subtle)] transition-colors hover:bg-[var(--accent-cobalt-soft)]"
                title="点击插入到草稿末尾"
              >
                {v}
              </button>
            ))}
          </div>

          <div className="mt-3 border-t border-[var(--line-subtle)] pt-3">
            <button
              type="button"
              onClick={() => setShowRef((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-teal)] hover:underline"
            >
              {showRef ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showRef ? '隐藏构思思路与高分示范句' : '查看构思思路与高分示范句'}</span>
            </button>

            {showRef && (
              <div className="mt-3 space-y-2 text-xs leading-relaxed text-[var(--ink-secondary)]">
                <ul className="list-disc space-y-1 pl-4">
                  {activePrompt.sampleOutline.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="rounded-lg border border-[var(--line-subtle)] bg-white p-3 text-[var(--ink-primary)]">
                  <div className="text-[10px] font-semibold tracking-wider text-[var(--ink-muted)] uppercase">
                    REFERENCE SNIPPET
                  </div>
                  <p className="mt-1 leading-relaxed">{activePrompt.referenceSnippet}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Split: Scratchpad (Left 7) + Outline Templates & CET-6 Rubric (Right 5) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Scratchpad */}
        <div className="desk-surface flex flex-col rounded-xl p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                TIMED WRITING SCRATCHPAD
              </div>
              <h2 className="mt-0.5 text-base font-semibold text-[var(--ink-primary)]">
                实时练笔区（自动存入本地）
              </h2>
            </div>

            <div className="font-mono-num flex items-center gap-2 text-xs">
              <span className={`font-semibold ${wordStatusColor}`}>
                {wordCount} words
              </span>
              {writingState.activeMode === 'essay' && (
                <span className="text-[11px] text-[var(--ink-muted)]">目标 150–200 词</span>
              )}
            </div>
          </div>

          <textarea
            value={draftText}
            onChange={(e) => onUpdateDraft(activePrompt.id, e.target.value)}
            rows={13}
            placeholder={
              writingState.activeMode === 'essay'
                ? '在此直接起草三段式六级作文（建议：首段 40 词 + 中段 95 词 + 末段 40 词）...'
                : '在此写出你的英文译文，完成后对照右侧自检表核查时态、主谓一致与漏译...'
            }
            className="mt-4 w-full flex-1 resize-y rounded-xl border border-[var(--line-strong)] bg-white p-4 text-sm leading-7 text-[var(--ink-primary)] focus:border-[var(--accent-cobalt)] focus:outline-none"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--ink-muted)]">
            <span>
              历史写译仅 ~60 分意味着提升空间高达 +80 分：把“无硬伤 + 结构清晰”做稳，单科即可冲到 70+（双项合计 140+）。
            </span>
          </div>
        </div>

        {/* Right: Outline Templates + Official Self-Rubric */}
        <div className="space-y-6 lg:col-span-5">
          {/* Templates */}
          <div className="desk-surface rounded-xl p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                  OUTLINE TEMPLATES
                </div>
                <h3 className="mt-0.5 text-base font-semibold text-[var(--ink-primary)]">
                  高分框架模板
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleInsertTemplate(activeTemplate.id)}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--accent-cobalt)] bg-[var(--accent-cobalt-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-cobalt)] hover:opacity-90"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                <span>插入练笔区</span>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {OUTLINE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    tpl.id === activeTemplate.id
                      ? 'bg-[var(--ink-primary)] text-white'
                      : 'bg-[var(--bg-surface-muted)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  {tpl.name.split('（')[0]}
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-2.5">
              {activeTemplate.structure.map((step) => (
                <div
                  key={step.para}
                  className="rounded-lg border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-3"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--accent-cobalt)]">
                    <span>{step.para}</span>
                    <span className="font-normal text-[var(--ink-muted)]">{step.role}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--ink-primary)]">
                    {step.frame}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Rubric Checklist */}
          <div className="desk-surface rounded-xl p-5">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--ink-muted)] uppercase">
                  CET-6 SELF-RUBRIC
                </div>
                <h3 className="mt-0.5 text-base font-semibold text-[var(--ink-primary)]">
                  交卷前 6 项评分自检
                </h3>
              </div>

              <div className="text-right">
                <div className="font-mono-num text-sm font-semibold text-[var(--accent-cobalt)]">
                  ≈ {scaledSingleScore} / 106.5
                </div>
                <div className="font-mono-num text-[10px] text-[var(--ink-muted)]">
                  原始分 {rawRubricScore.toFixed(1)} / 15
                </div>
              </div>
            </div>

            <ul className="mt-3 space-y-2">
              {CET6_RUBRIC.map((item) => {
                const checked = checkedRubricIds.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onToggleRubric(activePrompt.id, item.id)}
                      className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                        checked
                          ? 'border-[var(--accent-pine)]/40 bg-[var(--accent-pine-soft)]/70'
                          : 'border-[var(--line-subtle)] bg-white hover:border-[var(--line-strong)]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          checked
                            ? 'border-[var(--accent-pine)] bg-[var(--accent-pine)] text-white'
                            : 'border-[var(--line-strong)] bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3 stroke-[2.5]" />}
                      </span>
                      <span className="flex-1 text-xs leading-snug text-[var(--ink-primary)]">
                        <strong className="mr-1.5 text-[var(--ink-secondary)]">
                          [{item.category}]
                        </strong>
                        {item.label}
                      </span>
                      <span className="font-mono-num shrink-0 text-[10px] text-[var(--ink-muted)]">
                        +{item.weight}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
