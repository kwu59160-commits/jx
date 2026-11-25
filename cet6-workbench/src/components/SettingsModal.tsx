import { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, X, Check } from 'lucide-react';
import type { ScoreProfile } from '../types';

interface SettingsModalProps {
  profile: ScoreProfile;
  onClose: () => void;
  onSaveProfile: (next: ScoreProfile) => void;
  onExportJson: () => void;
  onImportJson: (raw: string) => { ok: boolean; error?: string };
  onResetAll: () => void;
}

export function SettingsModal({
  profile,
  onClose,
  onSaveProfile,
  onExportJson,
  onImportJson,
  onResetAll,
}: SettingsModalProps) {
  const [form, setForm] = useState<ScoreProfile>(profile);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const result = onImportJson(text);
      if (result.ok) {
        setImportMsg({ ok: true, text: '备份已成功恢复，页面数据已同步更新。' });
      } else {
        setImportMsg({ ok: false, text: result.error ?? '导入失败' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10212b]/40 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--line-strong)] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--line-subtle)] pb-4">
          <div>
            <div className="font-mono-num text-[11px] font-semibold tracking-[0.14em] text-[var(--accent-teal)] uppercase">
              CALIBRATION & DATA BACKUP
            </div>
            <h2
              id="settings-modal-title"
              className="font-display mt-0.5 text-xl font-semibold text-[var(--ink-primary)]"
            >
              基线校准与本地数据备份
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[var(--ink-muted)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--ink-primary)]"
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          {/* Basic info */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">称呼</label>
              <input
                type="text"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[var(--line-strong)] px-3 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">考试日期</label>
              <input
                type="date"
                value={form.examDate}
                onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                className="font-mono-num mt-1 w-full rounded-lg border border-[var(--line-strong)] px-3 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--ink-secondary)]">近期参考</label>
              <input
                type="text"
                value={form.recentRefLabel}
                onChange={(e) => setForm({ ...form, recentRefLabel: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[var(--line-strong)] px-3 py-1.5 text-xs"
              />
            </div>
          </div>

          {/* Baseline scores */}
          <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-4">
            <div className="text-xs font-semibold text-[var(--ink-primary)]">
              历史基线成绩（可自由修改）
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="block text-[11px] text-[var(--ink-muted)]">基线总分</label>
                <input
                  type="number"
                  min={0}
                  max={710}
                  value={form.baselineTotal}
                  onChange={(e) => setForm({ ...form, baselineTotal: Number(e.target.value) })}
                  className="font-mono-num mt-1 w-full rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--ink-muted)]">基线听力</label>
                <input
                  type="number"
                  min={0}
                  max={249}
                  value={form.baseline.listening}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      baseline: { ...form.baseline, listening: Number(e.target.value) },
                    })
                  }
                  className="font-mono-num mt-1 w-full rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--ink-muted)]">基线阅读</label>
                <input
                  type="number"
                  min={0}
                  max={249}
                  value={form.baseline.reading}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      baseline: { ...form.baseline, reading: Number(e.target.value) },
                    })
                  }
                  className="font-mono-num mt-1 w-full rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--ink-muted)]">基线写译</label>
                <input
                  type="number"
                  min={0}
                  max={213}
                  value={form.baseline.writing}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      baseline: { ...form.baseline, writing: Number(e.target.value) },
                    })
                  }
                  className="font-mono-num mt-1 w-full rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Target scores */}
          <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--bg-surface-soft)] p-4">
            <div className="text-xs font-semibold text-[var(--ink-primary)]">
              本次目标设定
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div>
                <label className="block text-[11px] text-[var(--ink-muted)]">目标总分</label>
                <input
                  type="number"
                  min={425}
                  max={710}
                  value={form.targetTotal}
                  onChange={(e) => setForm({ ...form, targetTotal: Number(e.target.value) })}
                  className="font-mono-num mt-1 w-full rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--accent-ochre)]">听力底线</label>
                <input
                  type="number"
                  min={100}
                  max={249}
                  value={form.listeningFloor}
                  onChange={(e) => setForm({ ...form, listeningFloor: Number(e.target.value) })}
                  className="font-mono-num mt-1 w-full rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--ink-muted)]">目标听力</label>
                <input
                  type="number"
                  min={0}
                  max={249}
                  value={form.target.listening}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      target: { ...form.target, listening: Number(e.target.value) },
                    })
                  }
                  className="font-mono-num mt-1 w-full rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--ink-muted)]">目标阅读</label>
                <input
                  type="number"
                  min={0}
                  max={249}
                  value={form.target.reading}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      target: { ...form.target, reading: Number(e.target.value) },
                    })
                  }
                  className="font-mono-num mt-1 w-full rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--ink-muted)]">目标写译</label>
                <input
                  type="number"
                  min={0}
                  max={213}
                  value={form.target.writing}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      target: { ...form.target, writing: Number(e.target.value) },
                    })
                  }
                  className="font-mono-num mt-1 w-full rounded-md border border-[var(--line-strong)] bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--line-strong)] px-4 py-2 text-xs font-medium text-[var(--ink-secondary)]"
            >
              取消
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-teal)] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0b4a5a]"
            >
              <Check className="h-3.5 w-3.5" />
              <span>保存校准</span>
            </button>
          </div>
        </form>

        {/* Export / Import / Reset */}
        <div className="mt-6 border-t border-[var(--line-subtle)] pt-5">
          <div className="text-xs font-semibold text-[var(--ink-primary)]">
            本地数据迁移（全部学习记录存储在浏览器 localStorage）
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-teal)] hover:text-[var(--accent-teal)]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>导出 JSON 备份</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-teal)] hover:text-[var(--accent-teal)]"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>导入 JSON 恢复</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="ml-auto inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs text-[var(--ink-muted)] hover:bg-red-50 hover:text-red-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>恢复初始种子数据</span>
              </button>
            ) : (
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-[11px] text-red-700">确认清空并重置？</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetAll();
                    setConfirmReset(false);
                    onClose();
                  }}
                  className="rounded bg-red-600 px-2.5 py-1 text-[11px] font-medium text-white"
                >
                  确认重置
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded border border-[var(--line-strong)] px-2 py-1 text-[11px]"
                >
                  取消
                </button>
              </div>
            )}
          </div>

          {importMsg && (
            <p
              className={`mt-2.5 text-xs ${
                importMsg.ok ? 'text-[var(--accent-pine)]' : 'text-red-700'
              }`}
            >
              {importMsg.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
