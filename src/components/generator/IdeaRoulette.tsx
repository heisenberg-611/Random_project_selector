'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainId, DomainFilter, Complexity, ComplexityFilter, ProjectIdea, UserProject } from '@/types/project';
import { CURATED_IDEAS, generateHybridIdea } from '@/data/curatedIdeas';
import { DOMAINS } from '@/data/domains';
import { GeneratorFilters } from './GeneratorFilters';
import { IdeaCard } from './IdeaCard';
import { DomainIcon } from '@/components/ui/DomainIcon';
import { AiSettingsModal, loadStoredAiConfig } from '@/components/ai/AiSettingsModal';
import { generateProjectWithAi, AiConfig } from '@/services/aiGenerator';
import { RefreshCw, Cpu, Terminal, CheckCircle2, Settings, Bot, Wand2, Send, AlertTriangle } from 'lucide-react';
import { soundFX } from '@/utils/soundEffects';

interface IdeaRouletteProps {
  onAddProject: (
    project: Omit<UserProject, 'id' | 'createdAt'> & { id?: string }
  ) => { success: boolean; id: string; message: string };
  existingProjects: UserProject[];
}

export const IdeaRoulette: React.FC<IdeaRouletteProps> = ({
  onAddProject,
  existingProjects,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainFilter>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<ComplexityFilter>('all');
  
  // Eager initialization to guarantee 0 blank frames on initial render
  const [currentIdea, setCurrentIdea] = useState<ProjectIdea>(() => {
    const randomIdx = Math.floor(Math.random() * CURATED_IDEAS.length);
    return CURATED_IDEAS[randomIdx] || CURATED_IDEAS[0];
  });
  
  const [isRolling, setIsRolling] = useState(false);
  const [slotDomain, setSlotDomain] = useState<DomainId>(() => currentIdea?.domain || 'web-fullstack');
  const [slotTitle, setSlotTitle] = useState<string>(() => currentIdea?.title || 'Ready to Spark Your Next Project?');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // AI Generation State
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState<AiConfig>(loadStoredAiConfig());
  const [aiError, setAiError] = useState<string | null>(null);

  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getFilteredPool = (domain: DomainFilter, complexity: ComplexityFilter) => {
    return CURATED_IDEAS.filter((idea) => {
      const matchDomain = domain === 'all' || idea.domain === domain;
      const matchComplexity = complexity === 'all' || idea.complexity === complexity;
      return matchDomain && matchComplexity;
    });
  };

  // Perform standard offline matrix spin
  const spinRoulette = (targetDomain = selectedDomain, targetComplexity = selectedComplexity) => {
    if (isRolling) return;
    setIsRolling(true);
    setAiError(null);

    const pool = getFilteredPool(targetDomain, targetComplexity);
    const allDomainKeys = Object.keys(DOMAINS) as DomainId[];

    let ticks = 0;
    const maxTicks = 16;
    const intervalDuration = 60;

    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

    rollIntervalRef.current = setInterval(() => {
      ticks++;

      const randomDomain = allDomainKeys[Math.floor(Math.random() * allDomainKeys.length)];
      const randomIdea = CURATED_IDEAS[Math.floor(Math.random() * CURATED_IDEAS.length)];

      setSlotDomain(randomDomain);
      setSlotTitle(randomIdea.title);

      if (soundEnabled) {
        soundFX.playTick();
      }

      if (ticks >= maxTicks) {
        if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

        let chosen: ProjectIdea;
        if (pool.length > 0) {
          const validPool = pool.filter((p) => !currentIdea || p.id !== currentIdea.id);
          const pickList = validPool.length > 0 ? validPool : pool;
          chosen = pickList[Math.floor(Math.random() * pickList.length)];
        } else {
          chosen = generateHybridIdea(targetDomain !== 'all' ? targetDomain : undefined);
        }

        setCurrentIdea(chosen);
        setSlotDomain(chosen.domain);
        setSlotTitle(chosen.title);
        setIsRolling(false);

        if (soundEnabled) {
          soundFX.playReveal();
        }
      }
    }, intervalDuration);
  };

  // Perform live AI synthesis
  const executeAiGeneration = async () => {
    if (isRolling) return;

    // Check if key exists for cloud providers
    if (aiConfig.provider === 'gemini' && !aiConfig.geminiKey?.trim()) {
      setIsAiSettingsOpen(true);
      return;
    }
    if (aiConfig.provider === 'openai' && !aiConfig.openaiKey?.trim()) {
      setIsAiSettingsOpen(true);
      return;
    }

    setIsRolling(true);
    setAiError(null);
    setSlotTitle(`SYNTHESIZING WITH ${aiConfig.provider.toUpperCase()}...`);

    if (soundEnabled) soundFX.playTick();

    try {
      const generated = await generateProjectWithAi(aiConfig, {
        domain: selectedDomain !== 'all' ? selectedDomain : undefined,
        complexity: selectedComplexity !== 'all' ? selectedComplexity : undefined,
        customPrompt: aiCustomPrompt,
      });

      setCurrentIdea(generated);
      setSlotDomain(generated.domain);
      setSlotTitle(generated.title);

      if (soundEnabled) soundFX.playReveal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI generation failed.';
      setAiError(msg);
      setSlotTitle('AI SYNTHESIS ERROR - RETRY OR CHECK SETTINGS');
    } finally {
      setIsRolling(false);
    }
  };

  const handleSurpriseMe = () => {
    if (isAiMode) {
      executeAiGeneration();
    } else {
      setSelectedDomain('all');
      setSelectedComplexity('all');
      spinRoulette('all', 'all');
    }
  };

  const handleAddToProjects = () => {
    if (!currentIdea) return;
    const res = onAddProject({
      id: currentIdea.id,
      title: currentIdea.title,
      tagline: currentIdea.tagline,
      domain: currentIdea.domain,
      complexity: currentIdea.complexity,
      problem: currentIdea.problem,
      features: currentIdea.features,
      suggestedStack: currentIdea.suggestedStack,
      status: 'idea',
    });

    setFeedbackToast(res.message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  const isCurrentIdeaSaved = Boolean(
    currentIdea &&
      existingProjects.some(
        (p) => p.id === currentIdea.id || p.title.toLowerCase() === currentIdea.title.toLowerCase()
      )
  );

  const currentDomainMeta = DOMAINS[slotDomain] || DOMAINS['web-fullstack'];

  return (
    <div className="space-y-6">
      {/* Terminal Generator Header & Machine */}
      <div className="salam-boot-terminal relative overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Top Mode Selector: Offline Catalog vs Live AI */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0A0A0C] border border-white/[0.08] w-full sm:w-auto font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setIsAiMode(false);
                setAiError(null);
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                !isAiMode
                  ? 'bg-white text-[#0A0A0C] shadow-md'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>OFFLINE_MATRIX ({CURATED_IDEAS.length}+ SPECS)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAiMode(true);
                setAiError(null);
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                isAiMode
                  ? 'salam-gold-btn text-[#0A0A0C]'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>LIVE_AI_ENGINE (INFINITE)</span>
            </button>
          </div>

          {/* AI Settings Trigger */}
          <button
            type="button"
            onClick={() => setIsAiSettingsOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] border border-white/[0.08] hover:border-[#C9A76C]/40 text-xs font-mono transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#C9A76C]" />
            <span>AI_CONFIG [{aiConfig.provider.toUpperCase()}]</span>
          </button>
        </div>

        {/* AI Custom Prompt Bar (Visible in AI Mode) */}
        {isAiMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 font-mono text-xs"
          >
            <div className="flex items-center justify-between text-[11px] text-[#C9A76C] font-bold">
              <span>// CUSTOM_AI_PROMPT_OR_VIBE (OPTIONAL):</span>
              <span className="text-[#52525B]">PROVIDER: {aiConfig.provider.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                placeholder="e.g. A WebAssembly audio synthesizer with zero backend, or Web3 AI agent..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') executeAiGeneration();
                }}
                className="flex-1 p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] placeholder:text-[#52525B] focus:outline-none focus:border-[#C9A76C]"
              />
              <button
                type="button"
                onClick={executeAiGeneration}
                disabled={isRolling}
                className="salam-gold-btn flex items-center gap-1.5 px-4 py-2.5 font-bold cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-[#0A0A0C]" />
                <span>GENERATE</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Error Notification */}
        {aiError && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">[AI_ENGINE_ERROR]: </span>
              {aiError}
              <button
                onClick={() => setIsAiSettingsOpen(true)}
                className="ml-2 text-[#C9A76C] underline cursor-pointer"
              >
                Configure API Key
              </button>
            </div>
          </div>
        )}

        {/* Terminal Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C9A76C] uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A76C] animate-ping" />
              <span>// {isAiMode ? 'AI_AUTONOMOUS_ORACLE' : 'OFFLINE_IDEA_MATRIX_V1.0.0'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {isAiMode ? 'Autonomous AI Synthesis' : 'Curated Project Matrix'}
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] font-mono mt-1">
              {isAiMode
                ? 'Generate endless real-time software specifications using Gemini, OpenAI, or Local Ollama.'
                : 'Over 50+ specialized offline project blueprints spanning 10 modern technical domains.'}
            </p>
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={handleSurpriseMe}
            disabled={isRolling}
            className="salam-gold-btn flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-mono font-bold cursor-pointer disabled:opacity-50"
          >
            <Cpu className={`w-4 h-4 text-[#0A0A0C] ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isAiMode ? 'EXECUTE_AI_SYNTHESIS' : 'GENERATE_RANDOM_SEED'}</span>
          </button>
        </div>

        {/* Terminal Screen Display Box */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0C] p-4 sm:p-5 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-[#C9A76C]/30 bg-[#121216]">
                <DomainIcon
                  domain={slotDomain}
                  className="w-5 h-5 text-[#C9A76C] animate-pulse"
                />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A76C] flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" />
                  SECTOR: {currentDomainMeta.name.toUpperCase()}
                </span>
                <div className="text-sm sm:text-base font-bold text-white line-clamp-1 font-mono mt-0.5">
                  {slotTitle}
                </div>
              </div>
            </div>

            {/* Spin / Roll Button */}
            <button
              type="button"
              onClick={() => (isAiMode ? executeAiGeneration() : spinRoulette(selectedDomain, selectedComplexity))}
              disabled={isRolling}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] text-xs font-mono font-semibold border border-white/[0.08] hover:border-[#C9A76C]/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C9A76C] ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'SYNTHESIZING...' : 'REROLL'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="pt-2 border-t border-white/[0.08]">
          <GeneratorFilters
            selectedDomain={selectedDomain}
            onSelectDomain={(d) => {
              setSelectedDomain(d);
              if (!isAiMode) spinRoulette(d, selectedComplexity);
            }}
            selectedComplexity={selectedComplexity}
            onSelectComplexity={(c) => {
              setSelectedComplexity(c);
              if (!isAiMode) spinRoulette(selectedDomain, c);
            }}
            soundEnabled={soundEnabled}
            onToggleSound={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundFX.enabled = next;
            }}
          />
        </div>
      </div>

      {/* Toast Notification if project added */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#121216] border border-[#C9A76C]/40 text-[#E4CCA1] text-xs font-mono shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-[#C9A76C]" />
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Idea Brief Card */}
      {currentIdea && (
        <IdeaCard
          idea={currentIdea}
          isAlreadyAdded={isCurrentIdeaSaved}
          onAddToProjects={handleAddToProjects}
          onReroll={() => (isAiMode ? executeAiGeneration() : spinRoulette(selectedDomain, selectedComplexity))}
          isRolling={isRolling}
        />
      )}

      {/* AI Settings Modal */}
      <AiSettingsModal
        isOpen={isAiSettingsOpen}
        onClose={() => setIsAiSettingsOpen(false)}
        onSaveConfig={(cfg) => setAiConfig(cfg)}
      />
    </div>
  );
};
