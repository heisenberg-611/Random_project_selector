'use client';

import React from 'react';
import { ProjectStatus, DomainId, DomainFilter } from '@/types/project';
import { DOMAINS } from '@/data/domains';
import { Search, X, Filter, Terminal, Zap, CheckCircle2, Lightbulb } from 'lucide-react';

interface StatusFilterProps {
  statusFilter: ProjectStatus | 'all';
  onSelectStatus: (status: ProjectStatus | 'all') => void;
  domainFilter: DomainFilter;
  onSelectDomain: (domain: DomainFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    idea: number;
    inProgress: number;
    completed: number;
  };
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  statusFilter,
  onSelectStatus,
  domainFilter,
  onSelectDomain,
  searchQuery,
  onSearchChange,
  counts,
}) => {
  const tabs: { id: ProjectStatus | 'all'; label: string; icon: React.FC<{ className?: string }>; count: number }[] = [
    { id: 'all', label: 'ALL_PROJECTS', icon: Terminal, count: counts.all },
    { id: 'in-progress', label: 'ACTIVE_SPRINTS', icon: Zap, count: counts.inProgress },
    { id: 'idea', label: 'BACKLOG', icon: Lightbulb, count: counts.idea },
    { id: 'completed', label: 'SHIPPED', icon: CheckCircle2, count: counts.completed },
  ];

  return (
    <div className="space-y-3 font-mono">
      {/* Top row: Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => {
          const isSelected = statusFilter === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectStatus(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-white text-[#0A0A0C] border border-white shadow-md'
                  : 'bg-[#121216] text-[#9CA3AF] hover:text-[#EDE8E8] hover:bg-[#18181F] border border-white/[0.08]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded text-[10px] font-mono leading-none ${
                  isSelected ? 'bg-black/15 text-[#0A0A0C] font-bold' : 'bg-[#0A0A0C] text-[#C9A76C]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Second row: Search & Domain filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="FILTER_QUERY (title, stack, keyword)..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#121216] border border-white/[0.08] text-[#EDE8E8] placeholder:text-[#52525B] text-xs font-mono focus:outline-none focus:border-[#C9A76C]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#52525B] hover:text-[#EDE8E8]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Domain Filter Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={domainFilter}
            onChange={(e) => onSelectDomain(e.target.value as DomainFilter)}
            className="w-full sm:w-auto p-2 rounded-lg bg-[#121216] border border-white/[0.08] text-[#EDE8E8] text-xs font-mono focus:outline-none focus:border-[#C9A76C] cursor-pointer"
          >
            <option value="all">// ALL_SECTORS</option>
            {(Object.keys(DOMAINS) as DomainId[]).map((key) => (
              <option key={key} value={key}>
                {DOMAINS[key].name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
