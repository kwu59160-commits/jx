import { useMemo, useState } from 'react';
import { Check, Eye, EyeOff, Plus, Search, Trash2 } from 'lucide-react';
import type { VocabPhraseEntry, WrongBookEntry } from '../types';

interface WrongBookViewProps {
  todayIso: string;
  wrongBook: WrongBookEntry[];
  vocabBank: VocabPhraseEntry[];
  onAddWrong: (entry: Omit<WrongBookEntry, 'id' | 'mastered'>) => void;
  onToggleWrongMastered: (id: string) => void;
  onDeleteWrong: (id: string) => void;
  onAddVocab: (entry: Omit<VocabPhraseEntry, 'id' | 'mastered' | 'addedAt'>) => void;
  onToggleVocabMastered: (id: string) => void;
  onDeleteVocab: (id: string) => void;
}

const SECTION_BADGE: Record<
  WrongBookEntry['section'],
  { label: string; color: string; soft: string }
> = {
  listening: { label: '听力', color: 'var(--accent-ochre)', soft: 'var(--accent-ochre-soft)' },
  reading: { label: '阅读', color: 'var(--accent-pine)', soft: 'var(--accent-pine-soft)' },
  writing: { label: '写作', color: 'var(--accent-cobalt)', soft: 'var(--accent-cobalt-soft)' },
  translation: { label: '翻译', color: 'var(--accent-teal)', soft: 'var(--accent-teal-soft)' },
};

export function WrongBookView({
  todayIso,
  wrongBook,
  vocabBank,
  onAddWrong,
  onToggleWrongMastered,
  onDeleteWrong,
  onAddVocab,
  onToggleVocabMastered,
  onDeleteVocab,
}: WrongBookViewProps) {
  const [subTab, setSubTab] = useState<'errors' | 'vocab'>('errors');
  const [query, setQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<'all' | WrongBookEntry['section']>('all');
  const [onlyPending, setOnlyPending] = useState(false);

  // Add wrong form
  const [showAddWrong, setShowAddWrong] = useState(false);
  const [wSection, setWSection] = useState<WrongBookEntry['section']>('listening');
  const [wSource, setWSource] = useState('');
  const [wType, setWType] = useState('');
  const [wSummary, setWSummary] = useState('');
  const [wTrap, setWTrap] = useState('');
  const [wFix, setWFix] = useState('');

  // Vocab state
  const [vocabFilter, setVocabFilter] = useState<'all' | VocabPhraseEntry['tag']>('all');
  const [quizMode, setQuizMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [showAddVocab, setShowAddVocab] = useState(false);
  const [vTerm, setVTerm] = useState('');
  const [vMeaning, setVMeaning] = useState('');
  const [vTag, setVTag] = useState<VocabPhraseEntry['tag']>('listening');
  const [vExample, setVExample] = useState('');

  const filteredErrors = useMemo(() => {
    const q = query.trim().toLowerCase();
    return wrongBook.filter((item) => {
      if (sectionFilter !== 'all' && item.section !== sectionFilter) return false;
      if (onlyPending && item.mastered) return false;
      if (!q) return true;
      return (
        item.source.toLowerCase().includes(q) ||
        item.questionType.toLowerCase().includes(q) ||
        item.mistakeSummary.toLowerCase().includes(q) ||
        item.trapReason.toLowerCase().includes(q) ||
        item.fixRule.toLowerCase().includes(q)
      );
    });
  }, [wrongBook, sectionFilter, onlyPending, query]);

  const filteredVocab = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vocabBank.filter((item) => {
      if (vocabFilter !== 'all' && item.tag !== vocabFilter) return false;
      if (onlyPending && item.mastered) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q)
      );
    });
  }, [vocabBank, vocabFilter, onlyPending, query]);

  const handleSubmitWrong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wSummary.trim()) return;
    onAddWrong({
      date: todayIso,
      section: wSection,
      source: wSource.trim() || '真题专项训练',
      questionType: wType.trim() || '典型错题',
      mistakeSummary: wSummary.trim(),
      trapReason: wTrap.trim() || '待补充陷阱分析',
      fixRule: wFix.trim() || '复盘后补写下一次防错规则',
    });
    setWSource('');
    setWType('');
    setWSummary('');
    setWTrap('');
    setWFix('');
    setShowAddWrong(false);
  };

  const handleSubmitVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vTerm.trim() || !vMeaning.trim()) return;
    onAddVocab({
      term: vTerm.trim(),
      meaning: vMeaning.trim(),
      tag: vTag,
      example: vExample.trim(),
    });
    setVTerm('');
    setVMeaning('');
    setVExample('');
    setShowAddVocab(false);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="animate-desk-reveal flex flex-col justify-between gap-4 border-b border-[var(--line-strong)] pb-5 md:flex-row md:items-end">
        <div>
          <div className="font-mono-num text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-muted)] uppercase">
            ERROR LOG & PHRASE ARCHIVE
          </div>
          <h1 className="font-display mt-1 text-3xl font-semibold text-[var(--ink-primary)]">
            错题本与核心语料库
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('errors')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
              subTab === 'errors'
                ? 'bg-[var(--ink-primary)] text-white'
                : 'border border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
            }`}
          >
            错题复盘本 ({wrongBook.filter((w) => !w.mastered).length} 待清零)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('vocab')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
              subTab === 'vocab'
                ? 'bg-[var(--ink-primary)] text-white'
                : 'border border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
            }`}
          >
            词汇与高分表达 ({vocabBank.length})
          </button>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={subTab === 'errors' ? '搜索题源、陷阱、避坑规则...' : '搜索词组、释义、例句...'}
              className="w-56 rounded-lg border border-[var(--line-strong)] bg-white py-1.5 pr-3 pl-8 text-xs text-[var(--ink-primary)] focus:border-[var(--accent-teal)] focus:outline-none sm:w-64"
            />
          </div>

          {subTab === 'errors' ? (
            <div className="flex flex-wrap items-center gap-1">
              {(['all', 'listening', 'writing', 'translation', 'reading'] as const).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSectionFilter(sec)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    sectionFilter === sec
                      ? 'bg-[var(--accent-teal)] text-white'
                      : 'bg-white text-[var(--ink-secondary)] ring-1 ring-[var(--line-subtle)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  {sec === 'all' ? '全部' : SECTION_BADGE[sec].label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1">
              {(['all', 'listening', 'writing', 'translation', 'reading'] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setVocabFilter(tag)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    vocabFilter === tag
                      ? 'bg-[var(--accent-teal)] text-white'
                      : 'bg-white text-[var(--ink-secondary)] ring-1 ring-[var(--line-subtle)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  {tag === 'all' ? '全部' : SECTION_BADGE[tag].label}
                </button>
              ))}
            </div>
          )}

          <label className="ml-1 inline-flex cursor-pointer items-center gap-1.5 text-xs text-[var(--ink-secondary)]">
            <input
              type="checkbox"
              checked={onlyPending}
              onChange={(e) => setOnlyPending(e.target.checked)}
              className="rounded border-[var(--line-strong)] accent-[var(--accent-teal)]"
            />
            <span>仅看未掌握</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'vocab' && (
            <button
              type="button"
              onClick={() => {
                setQuizMode((v) => !v);
                setRevealedIds([]);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                quizMode
                  ? 'border-[var(--accent-ochre)] bg-[var(--accent-ochre-soft)] text-[var(--accent-ochre)]'
                  : 'border-[var(--line-strong)] bg-white text-[var(--ink-primary)] hover:border-[var(--accent-teal)]'
              }`}
            >
              {quizMode ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span>{quizMode ? '退出自测遮挡' : '遮挡释义自测'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              subTab === 'errors' ? setShowAddWrong((v) => !v) : setShowAddVocab((v) => !v)
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-teal)] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#0b4a5a]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{subTab === 'errors' ? '新增错题' : '录入语料'}</span>
          </button>
        </div>
      </div>

      {/* Add Error Form */}
      {subTab === 'errors' && showAddWrong && (
        <form
          onSubmit={handleSubmitWrong}
          className="desk-surface mt-4 space-y-3 rounded-xl p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <select
              value={wSection}
              onChange={(e) => setWSection(e.target.value as WrongBookEntry['section'])}
              className="rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-xs sm:col-span-2"
            >
              <option value="listening">听力</option>
              <option value="writing">写作</option>
              <option value="translation">翻译</option>
              <option value="reading">阅读</option>
            </select>
            <input
              type="text"
              value={wSource}
              onChange={(e) => setWSource(e.target.value)}
              placeholder="题源（如 2024.12 卷二 讲座 Q21）"
              className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs sm:col-span-5"
            />
            <input
              type="text"
              value={wType}
              onChange={(e) => setWType(e.target.value)}
              placeholder="题型/失分点（如 举例题 / 时态错误）"
              className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs sm:col-span-5"
            />
          </div>
          <textarea
            rows={2}
            value={wSummary}
            onChange={(e) => setWSummary(e.target.value)}
            placeholder="发生了什么错误？"
            className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={wTrap}
              onChange={(e) => setWTrap(e.target.value)}
              placeholder="命题陷阱 / 根因"
              className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs"
            />
            <input
              type="text"
              value={wFix}
              onChange={(e) => setWFix(e.target.value)}
              placeholder="下次考场防错动作"
              className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddWrong(false)}
              className="rounded-md px-3 py-1.5 text-xs text-[var(--ink-secondary)] hover:bg-[var(--bg-surface-muted)]"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-md bg-[var(--accent-teal)] px-4 py-1.5 text-xs font-medium text-white"
            >
              写入错题本
            </button>
          </div>
        </form>
      )}

      {/* Add Vocab Form */}
      {subTab === 'vocab' && showAddVocab && (
        <form
          onSubmit={handleSubmitVocab}
          className="desk-surface mt-4 space-y-3 rounded-xl p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <select
              value={vTag}
              onChange={(e) => setVTag(e.target.value as VocabPhraseEntry['tag'])}
              className="rounded-lg border border-[var(--line-strong)] bg-white px-2.5 py-2 text-xs sm:col-span-2"
            >
              <option value="listening">听力</option>
              <option value="writing">写作</option>
              <option value="translation">翻译</option>
              <option value="reading">阅读</option>
            </select>
            <input
              type="text"
              value={vTerm}
              onChange={(e) => setVTerm(e.target.value)}
              placeholder="英文词汇 / 同义替换 / 亮点表达"
              className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs sm:col-span-5"
            />
            <input
              type="text"
              value={vMeaning}
              onChange={(e) => setVMeaning(e.target.value)}
              placeholder="中文释义与考场用法提示"
              className="rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs sm:col-span-5"
            />
          </div>
          <input
            type="text"
            value={vExample}
            onChange={(e) => setVExample(e.target.value)}
            placeholder="例句（选填）"
            className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddVocab(false)}
              className="rounded-md px-3 py-1.5 text-xs text-[var(--ink-secondary)] hover:bg-[var(--bg-surface-muted)]"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-md bg-[var(--accent-teal)] px-4 py-1.5 text-xs font-medium text-white"
            >
              保存语料
            </button>
          </div>
        </form>
      )}

      {/* Content List */}
      {subTab === 'errors' ? (
        <div className="mt-5 space-y-3">
          {filteredErrors.map((entry) => {
            const badge = SECTION_BADGE[entry.section];
            return (
              <article
                key={entry.id}
                className={`desk-surface group rounded-xl p-5 transition-opacity ${
                  entry.mastered ? 'opacity-75' : ''
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className="rounded px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: badge.soft, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                    <span className="font-semibold text-[var(--ink-primary)]">
                      {entry.questionType}
                    </span>
                    <span className="text-[var(--ink-muted)]">·</span>
                    <span className="text-[var(--ink-secondary)]">{entry.source}</span>
                    <span className="font-mono-num text-[11px] text-[var(--ink-muted)]">
                      {entry.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleWrongMastered(entry.id)}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        entry.mastered
                          ? 'bg-[var(--accent-pine-soft)] text-[var(--accent-pine)]'
                          : 'border border-[var(--line-strong)] bg-white text-[var(--ink-secondary)] hover:border-[var(--accent-pine)] hover:text-[var(--accent-pine)]'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{entry.mastered ? '已掌握' : '标为已掌握'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteWrong(entry.id)}
                      className="rounded-md p-1.5 text-[var(--ink-muted)] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-700"
                      title="删除错题"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-primary)]">
                  {entry.mistakeSummary}
                </p>

                <div className="mt-3 grid grid-cols-1 gap-2 border-t border-[var(--line-subtle)] pt-3 text-xs sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-[var(--ink-muted)]">失分根因：</span>
                    <span className="text-[var(--ink-secondary)]">{entry.trapReason}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[var(--accent-teal)]">考场防错规则：</span>
                    <span className="font-medium text-[var(--ink-primary)]">{entry.fixRule}</span>
                  </div>
                </div>
              </article>
            );
          })}
          {filteredErrors.length === 0 && (
            <div className="desk-surface rounded-xl py-12 text-center text-sm text-[var(--ink-muted)]">
              当前筛选条件下没有错题记录。
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredVocab.map((item) => {
            const badge = SECTION_BADGE[item.tag];
            const isHidden = quizMode && !revealedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="desk-surface group flex flex-col justify-between rounded-xl p-4 sm:p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{ backgroundColor: badge.soft, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                        <span className="font-mono-num text-[10px] text-[var(--ink-muted)]">
                          {item.addedAt}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-base font-semibold text-[var(--ink-primary)]">
                        {item.term}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleVocabMastered(item.id)}
                        className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                          item.mastered
                            ? 'bg-[var(--accent-pine-soft)] text-[var(--accent-pine)]'
                            : 'border border-[var(--line-strong)] bg-white text-[var(--ink-secondary)]'
                        }`}
                      >
                        {item.mastered ? '已熟记' : '记住了'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteVocab(item.id)}
                        className="rounded p-1 text-[var(--ink-muted)] opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-700"
                        title="删除语料"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {isHidden ? (
                    <button
                      type="button"
                      onClick={() => toggleReveal(item.id)}
                      className="mt-3 w-full rounded-lg border border-dashed border-[var(--line-strong)] bg-[var(--bg-surface-soft)] py-3 text-xs font-medium text-[var(--accent-teal)] hover:bg-[var(--accent-teal-soft)]/50"
                    >
                      先在脑中回想中文意思与用法 · 点击揭示
                    </button>
                  ) : (
                    <div className="mt-2.5 space-y-1.5">
                      <p className="text-xs leading-relaxed text-[var(--ink-primary)]">
                        {item.meaning}
                      </p>
                      {item.example && (
                        <p className="border-l-2 border-[var(--line-strong)] pl-2.5 text-xs italic text-[var(--ink-secondary)]">
                          {item.example}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filteredVocab.length === 0 && (
            <div className="desk-surface col-span-full rounded-xl py-12 text-center text-sm text-[var(--ink-muted)]">
              当前筛选条件下暂无词汇语料。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
