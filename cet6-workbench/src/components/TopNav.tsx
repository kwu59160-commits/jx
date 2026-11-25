import { SlidersHorizontal, BookOpenCheck, Headphones, LineChart, LayoutDashboard } from 'lucide-react';
import type { WorkspaceTab } from '../types';

interface TopNavProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  daysRemaining: number;
  unmasteredCount: number;
  onOpenSettings: () => void;
}

const TABS: Array<{
  id: WorkspaceTab;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'desk', label: '今日台与日程', shortLabel: '今日台', icon: LayoutDashboard },
  { id: 'drills', label: '专项训练', shortLabel: '训练', icon: Headphones },
  { id: 'wrongbook', label: '错题与语料', shortLabel: '错题本', icon: BookOpenCheck },
  { id: 'mocks', label: '模考轨迹', shortLabel: '模考', icon: LineChart },
];

export function TopNav({
  activeTab,
  onSelectTab,
  daysRemaining,
  unmasteredCount,
  onOpenSettings,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line-subtle)] bg-[#f3f6f7]/88 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onSelectTab('desk')}
          className="group flex items-baseline gap-2.5 text-left focus:outline-none"
        >
          <span className="font-mono-num text-[11px] font-semibold tracking-[0.18em] text-[var(--accent-teal)] uppercase">
            CET-6
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-[var(--ink-primary)] sm:text-lg">
            六级冲刺台
          </span>
        </button>

        <nav aria-label="主工作区导航" className="hidden items-center gap-1 md:flex">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-4 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--ink-primary)]'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5 stroke-[1.75]" />
                <span>{tab.label}</span>
                {tab.id === 'wrongbook' && unmasteredCount > 0 && (
                  <span className="font-mono-num ml-0.5 text-[11px] text-[var(--accent-ochre)]">
                    {unmasteredCount}
                  </span>
                )}
                <span
                  className={`absolute right-3 bottom-0 left-3 h-[2px] bg-[var(--accent-teal)] transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 text-xs text-[var(--ink-secondary)] sm:flex">
            <span className="text-[var(--ink-muted)]">倒计时</span>
            <span className="font-mono-num font-semibold text-[var(--ink-primary)]">
              D-{daysRemaining}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--line-strong)] bg-white/80 px-2.5 py-1.5 text-xs font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--accent-teal)] hover:text-[var(--accent-teal)]"
            title="基线校准与数据备份"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 stroke-[1.75]" />
            <span className="hidden sm:inline">校准与备份</span>
          </button>
        </div>
      </div>

      {/* Mobile compact navigation */}
      <nav
        aria-label="移动端主工作区导航"
        className="grid grid-cols-4 border-t border-[var(--line-subtle)] bg-white/75 md:hidden"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
                isActive ? 'text-[var(--accent-teal)]' : 'text-[var(--ink-secondary)]'
              }`}
            >
              <Icon className="h-4 w-4 stroke-[1.75]" />
              <span>{tab.shortLabel}</span>
              {isActive && (
                <span className="absolute right-4 bottom-0 left-4 h-[2px] bg-[var(--accent-teal)]" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
