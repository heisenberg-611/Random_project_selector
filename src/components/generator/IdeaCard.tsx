'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectIdea } from '@/types/project';
import { DOMAINS, COMPLEXITY_CONFIG } from '@/data/domains';
import { DomainIcon } from '@/components/ui/DomainIcon';
import {
  Check,
  Plus,
  ArrowRight,
  Code2,
  Terminal,
  FileCode,
  Layers,
  Flame,
  Zap,
  Copy,
  CheckCheck,
} from 'lucide-react';

interface IdeaCardProps {
  idea: ProjectIdea;
  isAlreadyAdded: boolean;
  onAddToProjects: () => void;
  onReroll: () => void;
  isRolling: boolean;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isAlreadyAdded,
  onAddToProjects,
  onReroll,
  isRolling,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'features' | 'stack'>('brief');
  const [copied, setCopied] = useState(false);

  const domain = DOMAINS[idea.domain] || DOMAINS['web-fullstack'];
  const complexity = COMPLEXITY_CONFIG[idea.complexity] || COMPLEXITY_CONFIG['weekend-project'];

  const formattedJson = JSON.stringify(
    {
      id: idea.id,
      title: idea.title,
      domain: idea.domain,
      scope: idea.complexity,
      problem: idea.problem,
      features: idea.features,
      suggestedStack: idea.suggestedStack,
      tips: idea.tips || null,
    },
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      key={idea.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="salam-code-window"
    >
      {/* 3D Code Window Tab Bar */}
      <div className="salam-code-tabbar flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 px-2 mr-2 border-r border-white/[0.08]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/60 inline-block" />
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('brief')}
            className={`salam-code-tab ${activeTab === 'brief' ? 'active' : 'inactive'}`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>spec.brief</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`salam-code-tab ${activeTab === 'features' ? 'active' : 'inactive'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>features.json</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stack')}
            className={`salam-code-tab ${activeTab === 'stack' ? 'active' : 'inactive'}`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>stack.config</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-2 font-mono text-[11px] text-[#52525B]">
          <span>UTF-8</span>
          <span>•</span>
          <span className="text-[#C9A76C]">{domain.name.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold bg-[#121216] border border-[#C9A76C]/30 text-[#E4CCA1]">
              <DomainIcon domain={idea.domain} className="w-3.5 h-3.5 text-[#C9A76C]" />
              {domain.name.toUpperCase()}
            </span>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border ${complexity.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${complexity.dotColor}`} />
              {complexity.label}
            </span>
          </div>

          <span className="text-xs font-mono text-[#52525B]">
            EST_EFFORT: {complexity.timeframe}
          </span>
        </div>

        {/* Tab 1: spec.brief */}
        {activeTab === 'brief' && (
          <motion.div
            key="tab-brief"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Project Title with Blinking Gold Caret */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading leading-tight">
                {idea.title}
                <span className="salam-gold-caret" />
              </h3>
              <p className="text-sm sm:text-base text-[#9CA3AF] mt-2 font-mono leading-relaxed">
                // {idea.tagline}
              </p>
            </div>

            {/* Problem Statement Box */}
            <div className="rounded-xl bg-[#0A0A0C] border border-white/[0.08] p-4 sm:p-5 font-mono text-xs text-[#EDE8E8] space-y-2">
              <div className="flex items-center gap-2 text-[#C9A76C] font-semibold text-[11px] uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>01. OBJECTIVE &amp; PROBLEM STATEMENT</span>
              </div>
              <p className="text-[#EDE8E8] leading-relaxed pl-5 border-l-2 border-[#C9A76C]/40">
                {idea.problem}
              </p>
            </div>

            {/* Roadmap Highlights */}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
                <Zap className="w-3.5 h-3.5 text-[#C9A76C]" />
                <span>02. MVP ROADMAP PREVIEW</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {idea.features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-[#EDE8E8] bg-[#121216] p-3 rounded-xl border border-white/[0.06] font-mono"
                  >
                    <span className="text-[#C9A76C] font-bold mt-0.5">0{i + 1}.</span>
                    <span className="leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            {idea.tips && (
              <div className="p-3.5 rounded-xl bg-[#121216] border border-white/[0.08] text-xs font-mono text-[#9CA3AF] flex items-start gap-2.5">
                <Flame className="w-4 h-4 text-[#C9A76C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#E4CCA1] font-bold">PRO_INSIGHT: </span>
                  {idea.tips}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: features.json */}
        {activeTab === 'features' && (
          <motion.div
            key="tab-features"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C9A76C] uppercase font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>SPEC_PAYLOAD // FEATURES.JSON</span>
              </div>

              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] border border-white/[0.08] text-xs font-mono transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-[#C9A76C]" />
                    <span>COPIED_TO_CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C9A76C]" />
                    <span>COPY_JSON</span>
                  </>
                )}
              </button>
            </div>

            {/* Formatted JSON Editor Box */}
            <div className="rounded-xl bg-[#0A0A0C] border border-white/[0.1] p-4 sm:p-5 font-mono text-xs text-[#9CA3AF] overflow-x-auto max-h-[350px] scrollbar-thin">
              <pre className="text-[#EDE8E8] leading-relaxed">
                <code>{formattedJson}</code>
              </pre>
            </div>
          </motion.div>
        )}

        {/* Tab 3: stack.config */}
        {activeTab === 'stack' && (
          <motion.div
            key="tab-stack"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#C9A76C] uppercase font-bold mb-3">
                <Code2 className="w-3.5 h-3.5" />
                <span>SYSTEM_DEPENDENCIES &amp; STACK ARCHITECTURE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {idea.suggestedStack.map((tech, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0A0A0C] border border-white/[0.08] font-mono flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C9A76C]" />
                      <span className="text-sm font-bold text-white">{tech}</span>
                    </div>
                    <span className="text-[10px] text-[#52525B] uppercase">CORE_PKG</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Command Snippet */}
            <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.08] font-mono text-xs space-y-2">
              <div className="text-[10px] text-[#52525B] uppercase">// QUICK_INIT_COMMAND:</div>
              <div className="flex items-center gap-2 text-[#E4CCA1] bg-[#121216] p-2.5 rounded-lg border border-white/[0.06] overflow-x-auto">
                <span className="text-[#C9A76C] select-none">$</span>
                <code>npm init -y &amp;&amp; npm i {idea.suggestedStack.map(s => s.toLowerCase().replace(/[^a-z0-9]/g, '')).slice(0, 3).join(' ')}</code>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onAddToProjects}
            disabled={isAlreadyAdded || isRolling}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 font-mono text-xs font-bold transition-all cursor-pointer ${
              isAlreadyAdded
                ? 'bg-white/10 text-white border border-white/20 rounded-xl cursor-default'
                : 'salam-gold-btn'
            }`}
          >
            {isAlreadyAdded ? (
              <>
                <Check className="w-4 h-4 text-[#C9A76C]" />
                <span>ENTRY_COMMITTED TO MY_PROJECTS</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#0A0A0C]" />
                <span>SAVE_TO_WORKSPACE // ADD PROJECT</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReroll}
            disabled={isRolling}
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-xs font-mono bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] hover:text-white border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
          >
            <span>REROLL_SEED</span>
            <ArrowRight className="w-4 h-4 text-[#C9A76C]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
