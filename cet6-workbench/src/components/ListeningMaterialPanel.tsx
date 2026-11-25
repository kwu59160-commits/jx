import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Pause, Play, RotateCcw, Square } from 'lucide-react';
import {
  countListeningQuestions,
  getListeningSet,
  type ListeningQuestion,
} from '../data/listeningMaterials';
import { useScriptPlayer } from '../hooks/useScriptPlayer';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const RATES = [0.9, 1, 1.1] as const;

interface ListeningMaterialPanelProps {
  presetId: string;
  onApplyScore: (correct: number, total: number, label: string) => void;
}

export function ListeningMaterialPanel({ presetId, onApplyScore }: ListeningMaterialPanelProps) {
  const set = getListeningSet(presetId);
  const player = useScriptPlayer();
  const [pieceIndex, setPieceIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [graded, setGraded] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [rate, setRate] = useState<(typeof RATES)[number]>(1);

  useEffect(() => {
    player.stop();
    setPieceIndex(0);
    setAnswers({});
    setGraded(false);
    setShowScript(false);
    setRate(1);
    // Reset only when the loaded section changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetId]);

  const piece = set?.pieces[pieceIndex];
  const totalQuestions = set ? countListeningQuestions(set) : 0;

  const score = useMemo(() => {
    if (!set) return { correct: 0, answered: 0 };
    let correct = 0;
    let answered = 0;
    for (const item of set.pieces) {
      for (const question of item.questions) {
        const chosen = answers[question.id];
        if (chosen === undefined) continue;
        answered += 1;
        if (chosen === question.answer) correct += 1;
      }
    }
    return { correct, answered };
  }, [answers, set]);

  if (!set || !piece) return null;

  const activeLine = player.playing ? player.lineIndex : -1;

  const playCurrent = () => {
    if (player.playing) {
      player.stop();
      return;
    }
    player.play(piece.lines, rate);
  };

  const selectPiece = (index: number) => {
    player.stop();
    setPieceIndex(index);
  };

  const choose = (question: ListeningQuestion, optionIndex: number) => {
    setAnswers((current) => ({ ...current, [question.id]: optionIndex }));
  };

  const resetAttempt = () => {
    player.stop();
    setAnswers({});
    setGraded(false);
    setShowScript(!set.blindFirst);
  };

  return (
    <section id="listening-material" className="desk-surface rounded-xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-mono-num text-[11px] font-semibold tracking-[0.12em] text-[var(--accent-ochre)] uppercase">
            Listening source
          </div>
          <h2 className="mt-0.5 text-lg font-semibold text-[var(--ink-primary)]">{set.title}</h2>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[var(--ink-secondary)]">
            原创六级题型稿，不是历年真题录音。点播放后由浏览器用英语朗读；题目和选项一直可见，原文默认先藏住。
            {set.blindFirst ? ' 这一篇是盲听，对答案前不要展开原文。' : ''}
          </p>
        </div>
        <div className="font-mono-num text-xs text-[var(--ink-secondary)]">
          {set.pieces.length} 篇 · {totalQuestions} 题
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {set.pieces.map((item, index) => {
          const selected = index === pieceIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectPiece(index)}
              className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                selected
                  ? 'border-[var(--accent-ochre)] bg-[var(--accent-ochre-soft)] text-[var(--ink-primary)]'
                  : 'border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
              }`}
            >
              <span className="font-semibold">{item.title}</span>
              <span className="font-mono-num ml-2 text-[11px] text-[var(--ink-muted)]">
                {item.questions.length} 题
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-4">
        <p className="text-xs leading-relaxed text-[var(--ink-secondary)]">
          <span className="font-semibold text-[var(--ink-primary)]">场景 </span>
          {piece.scene}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={playCurrent}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-ochre)] px-4 py-2 text-xs font-medium text-white hover:opacity-95"
          >
            {player.playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{player.playing ? '停止' : '播放本篇'}</span>
          </button>
          <button
            type="button"
            onClick={player.stop}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
          >
            <Square className="h-3.5 w-3.5" />
            <span>停下</span>
          </button>
          {RATES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRate(value)}
              className={`font-mono-num rounded-lg border px-2.5 py-2 text-xs ${
                rate === value
                  ? 'border-[var(--accent-ochre)] bg-white text-[var(--accent-ochre)]'
                  : 'border-[var(--line-strong)] bg-white text-[var(--ink-secondary)]'
              }`}
            >
              {value === 1 ? '1.0×' : `${value.toFixed(1)}×`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowScript((current) => !current)}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
          >
            {showScript ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showScript ? '收起原文' : '展开原文'}</span>
          </button>
          {player.playing && player.chunkTotal > 0 && (
            <span className="font-mono-num text-[11px] text-[var(--ink-muted)]">
              第 {player.chunkIndex + 1}/{player.chunkTotal} 句
            </span>
          )}
        </div>

        {!player.supported && (
          <p className="mt-3 text-xs text-[var(--accent-ochre)]">
            这台浏览器不能朗读。展开原文后，可以把这一篇当成精听文本。
          </p>
        )}
        {player.error && <p className="mt-3 text-xs text-[var(--accent-ochre)]">{player.error}</p>}

        {showScript ? (
          <div className="mt-4 max-h-72 space-y-2.5 overflow-y-auto pr-1">
            {piece.lines.map((line, index) => {
              const speaking = index === activeLine;
              return (
                <p
                  key={`${piece.id}-${index}`}
                  className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    speaking
                      ? 'bg-[var(--accent-ochre-soft)] text-[var(--ink-primary)]'
                      : 'text-[var(--ink-primary)]'
                  }`}
                >
                  {line.speaker !== 'N' && (
                    <span className="font-mono-num mr-2 text-[11px] font-semibold text-[var(--accent-teal)]">
                      {line.speaker === 'W' ? 'W' : 'M'}
                    </span>
                  )}
                  {line.text}
                </p>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-xs leading-relaxed text-[var(--ink-muted)]">
            原文已收起。先听完再作答；想核对连读时再展开。
          </p>
        )}

        {showScript && piece.speechNotes && piece.speechNotes.length > 0 && (
          <div className="mt-4 border-t border-[var(--line-subtle)] pt-3">
            <div className="text-xs font-semibold text-[var(--ink-primary)]">连读、弱读、重音</div>
            <ul className="mt-2 space-y-2">
              {piece.speechNotes.map((note) => (
                <li key={note.phrase} className="text-xs leading-relaxed text-[var(--ink-secondary)]">
                  <span className="font-medium text-[var(--ink-primary)]">{note.phrase}</span>
                  <span className="mx-1 text-[var(--ink-muted)]">·</span>
                  {note.hear}
                  <span className="mt-0.5 block">{note.note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {piece.questions.map((question, questionIndex) => {
          const chosen = answers[question.id];
          const number =
            set.pieces.slice(0, pieceIndex).reduce((sum, item) => sum + item.questions.length, 0) +
            questionIndex +
            1;
          return (
            <fieldset key={question.id} className="rounded-xl border border-[var(--line-subtle)] bg-white p-4">
              <legend className="px-1 text-sm font-medium text-[var(--ink-primary)]">
                <span className="font-mono-num mr-2 text-[var(--accent-teal)]">{number}.</span>
                {question.stem}
              </legend>
              <div className="mt-3 space-y-2">
                {question.options.map((option, optionIndex) => {
                  const selected = chosen === optionIndex;
                  const showKey = graded;
                  const isAnswer = optionIndex === question.answer;
                  const wrongPick = showKey && selected && !isAnswer;
                  const right = showKey && isAnswer;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => choose(question, optionIndex)}
                      aria-pressed={selected}
                      className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-xs leading-relaxed transition-colors ${
                        right
                          ? 'border-[var(--accent-pine)] bg-[var(--accent-pine-soft)] text-[var(--ink-primary)]'
                          : wrongPick
                            ? 'border-red-300 bg-red-50 text-red-900'
                            : selected
                              ? 'border-[var(--accent-ochre)] bg-[var(--accent-ochre-soft)] text-[var(--ink-primary)]'
                              : 'border-[var(--line-subtle)] bg-white text-[var(--ink-secondary)] hover:border-[var(--line-strong)]'
                      }`}
                    >
                      <span className="font-mono-num mt-0.5 font-semibold">{LETTERS[optionIndex]}</span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              {graded && (
                <p className="mt-2 text-xs leading-relaxed text-[var(--ink-secondary)]">
                  {chosen === undefined
                    ? '这题还没选。'
                    : chosen === question.answer
                      ? '选对了。'
                      : `选了 ${LETTERS[chosen]}，答案是 ${LETTERS[question.answer]}。`}{' '}
                  {question.why}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setGraded(true);
            setShowScript(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-teal)] px-4 py-2 text-xs font-medium text-white hover:bg-[#0b4a5a]"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>对答案并看原文</span>
        </button>
        <button
          type="button"
          onClick={resetAttempt}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>重做</span>
        </button>
        {graded && (
          <button
            type="button"
            onClick={() =>
              onApplyScore(score.correct, totalQuestions, `${set.title} ${score.correct}/${totalQuestions}`)
            }
            className="text-xs font-medium text-[var(--accent-teal)] underline underline-offset-4"
          >
            把 {score.correct}/{totalQuestions} 填入右侧日志
          </button>
        )}
        <span className="font-mono-num text-[11px] text-[var(--ink-muted)]">
          已答 {score.answered}/{totalQuestions}
          {graded ? ` · 对 ${score.correct}` : ''}
        </span>
      </div>
    </section>
  );
}
