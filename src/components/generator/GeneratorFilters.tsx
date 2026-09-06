'use client';

import React from 'react';
import { DomainId, DomainFilter, Complexity, ComplexityFilter } from '@/types/project';
import { DOMAINS, COMPLEXITY_CONFIG } from '@/data/domains';
import { DomainIcon } from '@/components/ui/DomainIcon';
import { Volume2, VolumeX, Shuffle, Terminal } from 'lucide-react';

interface GeneratorFiltersProps {
  selectedDomain: DomainFilter;
  onSelectDomain: (domain: DomainFilter) => void;
  selectedComplexity: ComplexityFilter;
  onSelectComplexity: (complexity: ComplexityFilter) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GeneratorFilters: React.FC<GeneratorFiltersProps> = ({
  selectedDomain,
  onSelectDomain,
  selectedComplexity,
  onSelectComplexity,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="space-y-4">
      {/* Top row controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#9CA3AF]">
          <span className="text-[#C9A76C] font-semibold">// FILTER_MATRIX:</span>
          <span>SELECT TARGET SECTOR</span>
        </div>

        {/* Sound toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Disable Audio FX' : 'Enable Audio FX'}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-md border border-white/[0.08] bg-[#121216] hover:bg-[#18181F] text-[#9CA3AF] hover:text-white transition-colors"
            title="Toggle Audio Feedback"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3 h-3 text-[#C9A76C]" />
                <span className="hidden xs:inline">AUDIO: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 text-[#52525B]" />
                <span className="hidden xs:inline text-[#52525B]">AUDIO: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Domain pills - horizontally scrollable on mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => onSelectDomain('all')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            selectedDomain === 'all'
              ? 'bg-[#C9A76C] text-[#0A0A0C] font-bold border border-[#C9A76C] shadow-md shadow-[#C9A76C]/20'
              : 'bg-[#121216] text-[#9CA3AF] hover:text-[#EDE8E8] hover:bg-[#18181F] border border-white/[0.08]'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>[ALL_DOMAINS]</span>
        </button>

        {(Object.keys(DOMAINS) as DomainId[]).map((key) => {
          const domain = DOMAINS[key];
          const isSelected = selectedDomain === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDomain(key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                isSelected
                  ? 'bg-white text-[#0A0A0C] font-bold border border-white shadow-md'
                  : 'bg-[#121216] text-[#9CA3AF] hover:text-[#EDE8E8] hover:bg-[#18181F] border border-white/[0.08]'
              }`}
            >
              <DomainIcon domain={domain.id} className="w-3 h-3" />
              <span>{domain.name.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Complexity Selector */}
      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
        <span className="text-[11px] text-[#52525B] mr-1 uppercase">
          [SCOPE]:
        </span>
        <button
          onClick={() => onSelectComplexity('all')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
            selectedComplexity === 'all'
              ? 'bg-white/10 text-white border border-white/20 font-bold'
              : 'bg-[#121216] text-[#52525B] hover:text-[#9CA3AF] border border-white/[0.06]'
          }`}
        >
          ALL_SCOPES
        </button>
        {(Object.keys(COMPLEXITY_CONFIG) as Complexity[]).map((cKey) => {
          const cfg = COMPLEXITY_CONFIG[cKey];
          const isSel = selectedComplexity === cKey;
          return (
            <button
              key={cKey}
              onClick={() => onSelectComplexity(cKey)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                isSel
                  ? 'bg-[#C9A76C]/15 text-[#E4CCA1] border border-[#C9A76C]/40 font-bold'
                  : 'bg-[#121216] text-[#9CA3AF] hover:text-[#EDE8E8] border border-white/[0.06]'
              }`}
            >
              <span className={`w-1 h-1 rounded-full ${cfg.dotColor}`} />
              <span>{cfg.label}</span>
              <span className="text-[9px] text-[#52525B]">({cfg.timeframe})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
