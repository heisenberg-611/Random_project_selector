'use client';

import React from 'react';
import {
  Terminal,
  FolderGit2,
  HardDrive,
  Plus,
  Zap,
  CheckCircle2,
  Cpu,
  GitBranch,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'generator' | 'projects';
  onSelectTab: (tab: 'generator' | 'projects') => void;
  stats: {
    total: number;
    ideas: number;
    inProgress: number;
    completed: number;
  };
  onOpenBackup: () => void;
  onOpenAddProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  stats,
  onOpenBackup,
  onOpenAddProject,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0A0A0C]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Brand - Editorial Terminal */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#121216] border border-[#C9A76C]/40 flex items-center justify-center shadow-lg shadow-[#C9A76C]/10 shrink-0">
              <Cpu className="w-4 h-4 text-[#C9A76C]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white font-heading">
                  DEVSPARK
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#C9A76C]/10 text-[#E4CCA1] border border-[#C9A76C]/30">
                  SYS_ORACLE
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#9CA3AF]">
                <span className="flex items-center gap-1 text-[#52525B]">
                  <GitBranch className="w-3 h-3 text-[#C9A76C]" />
                  main:7f8e3a
                </span>
                <span className="hidden sm:inline text-[#52525B]">•</span>
                <span className="hidden sm:inline text-[#9CA3AF]">Random Idea Matrix</span>
              </div>
            </div>
          </div>

          {/* Center Tabs - Salam Code Window Tabbar Style */}
          <div className="hidden md:flex items-center gap-1 bg-[#121216] p-1 rounded-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => onSelectTab('generator')}
              className={`salam-code-tab ${activeTab === 'generator' ? 'active' : 'inactive'}`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>01. IDEA_ROULETTE</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('projects')}
              className={`salam-code-tab ${activeTab === 'projects' ? 'active' : 'inactive'}`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>02. MY_PROJECTS</span>
              <span
                className={`ml-1.5 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded text-[10px] font-mono font-bold leading-none transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-[#0A0A0C]/12 text-[#0A0A0C]'
                    : 'bg-white/[0.08] text-[#9CA3AF]'
                }`}
              >
                {stats.total}
              </span>
            </button>
          </div>

          {/* Right Action Icons & Status Pills */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick KPI stats on desktop */}
            <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-white/[0.08] text-xs font-mono">
              <div
                title="Active Projects"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121216] border border-white/[0.08] text-[#EDE8E8]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A76C] animate-pulse" />
                <span>{stats.inProgress} ACTIVE</span>
              </div>
              <div
                title="Completed Projects"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121216] border border-white/[0.08] text-[#9CA3AF]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E4CCA1]" />
                <span>{stats.completed} SHIPPED</span>
              </div>
            </div>

            {/* Backup / Export Button */}
            <button
              onClick={onOpenBackup}
              title="Backup & Restore System"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] border border-white/[0.08] hover:border-[#C9A76C]/40 text-xs font-mono transition-all cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#C9A76C]" />
              <span className="hidden sm:inline">BACKUP</span>
            </button>

            {/* Quick Add Project */}
            <button
              onClick={onOpenAddProject}
              title="Add Custom Project"
              className="salam-gold-btn flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0A0A0C]" />
              <span className="hidden xs:inline">NEW_ENTRY</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Tab Bar */}
        <div className="flex md:hidden items-center gap-1.5 pb-3 pt-1">
          <button
            type="button"
            onClick={() => onSelectTab('generator')}
            className={`flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-xs font-mono font-semibold transition-colors ${
              activeTab === 'generator'
                ? 'bg-white text-[#0A0A0C] font-bold border border-white shadow-md'
                : 'bg-[#121216] text-[#9CA3AF] border border-white/[0.08] hover:text-[#EDE8E8]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>01. ROULETTE</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('projects')}
            className={`flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-xs font-mono font-semibold transition-colors ${
              activeTab === 'projects'
                ? 'bg-white text-[#0A0A0C] font-bold border border-white shadow-md'
                : 'bg-[#121216] text-[#9CA3AF] border border-white/[0.08] hover:text-[#EDE8E8]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>02. PROJECTS</span>
            <span
              className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded text-[10px] font-mono leading-none ${
                activeTab === 'projects'
                  ? 'bg-[#0A0A0C]/12 text-[#0A0A0C] font-bold'
                  : 'bg-white/[0.08] text-[#9CA3AF]'
              }`}
            >
              {stats.total}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
