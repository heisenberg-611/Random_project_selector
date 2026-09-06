'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProject, ProjectStatus } from '@/types/project';
import { DOMAINS, COMPLEXITY_CONFIG } from '@/data/domains';
import { DomainIcon } from '@/components/ui/DomainIcon';
import { triggerConfetti } from '@/components/shared/Confetti';
import { soundFX } from '@/utils/soundEffects';
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Zap,
  Lightbulb,
  Calendar,
  Check,
  Terminal,
  X,
  FileCode,
} from 'lucide-react';

interface ProjectCardProps {
  project: UserProject;
  index: number;
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onUpdateStatus,
  onUpdateNotes,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState(project.notes || '');
  const cardRef = useRef<HTMLDivElement>(null);

  const domain = DOMAINS[project.domain] || DOMAINS['web-fullstack'];
  const complexity = COMPLEXITY_CONFIG[project.complexity] || COMPLEXITY_CONFIG['weekend-project'];

  // Close floating popover on click outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const handleStatusChange = (newStatus: ProjectStatus) => {
    if (newStatus === project.status) return;

    if (newStatus === 'completed') {
      triggerConfetti();
      soundFX.playComplete();
    }

    onUpdateStatus(project.id, newStatus);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(project.id, notesInput);
    setIsEditingNotes(false);
  };

  const statusConfig = {
    idea: {
      label: 'BACKLOG',
      icon: Lightbulb,
      activeButton: 'bg-white/10 text-white border border-white/20',
    },
    'in-progress': {
      label: 'BUILDING',
      icon: Zap,
      activeButton: 'bg-[#C9A76C] text-[#0A0A0C] font-bold shadow-md shadow-[#C9A76C]/20',
    },
    completed: {
      label: 'SHIPPED',
      icon: CheckCircle2,
      activeButton: 'bg-white text-[#0A0A0C] font-bold shadow-md',
    },
  };

  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      ref={cardRef}
      className={`salam-bevel relative p-5 sm:p-6 space-y-4 h-fit !overflow-visible ${
        isExpanded ? 'z-40 border-[#C9A76C]/60 shadow-xl shadow-[#C9A76C]/10' : 'z-10'
      } ${project.status === 'completed' ? 'border-[#C9A76C]/40' : ''}`}
    >
      {/* Top Bar: Index number, Domain badge, Date, Delete */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-[#C9A76C] font-bold">
            #{String(index + 1).padStart(2, '0')}
          </span>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono border ${domain.badgeBg}`}>
            <DomainIcon domain={project.domain} className="w-3 h-3 text-[#C9A76C]" />
            <span>{domain.name.toUpperCase()}</span>
          </span>

          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border ${complexity.badgeClass}`}>
            <span>{complexity.label}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#52525B] hidden xs:inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>

          <button
            type="button"
            onClick={() => onDelete(project.id)}
            aria-label="Delete project"
            className="p-1 rounded-md text-[#52525B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
            title="Delete Project Entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Project Title & Tagline */}
      <div>
        <h4 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight leading-snug">
          {project.title}
        </h4>
        {project.tagline && (
          <p className="text-xs sm:text-sm text-[#9CA3AF] font-mono mt-1 line-clamp-2 leading-relaxed">
            // {project.tagline}
          </p>
        )}
      </div>

      {/* Status Switcher Bar */}
      <div className="pt-3 border-t border-white/[0.08] flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 bg-[#0A0A0C] p-1 rounded-lg border border-white/[0.08] w-full xs:w-auto font-mono">
          {(['idea', 'in-progress', 'completed'] as ProjectStatus[]).map((st) => {
            const isCurrent = project.status === st;
            const meta = statusConfig[st];
            const Icon = meta.icon;
            return (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                className={`flex-1 xs:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? meta.activeButton
                    : 'text-[#52525B] hover:text-[#EDE8E8] hover:bg-white/5'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Floating Spec Docs Dropdown Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          className={`flex items-center justify-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            isExpanded
              ? 'bg-[#C9A76C] text-[#0A0A0C] font-bold border-[#C9A76C] shadow-md shadow-[#C9A76C]/20'
              : 'bg-[#121216] text-[#9CA3AF] hover:text-[#EDE8E8] border-white/[0.08] hover:border-white/20'
          }`}
        >
          <FileCode className={`w-3.5 h-3.5 ${isExpanded ? 'text-[#0A0A0C]' : 'text-[#C9A76C]'}`} />
          <span>{isExpanded ? 'CLOSE_DOCS' : 'SPEC_DOCS'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#0A0A0C]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#C9A76C]" />
          )}
        </button>
      </div>

      {/* Floating Dropdown Overlay Popover for Expanded Spec Docs */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[#16161D] border-2 border-[#C9A76C]/60 rounded-xl p-4 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.95)] font-mono text-xs text-[#EDE8E8] max-h-[460px] overflow-y-auto scrollbar-thin"
          >
            {/* Popover Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.1]">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-[#C9A76C]">
                <Terminal className="w-3.5 h-3.5" />
                <span>SPEC_MANIFEST // {project.title.slice(0, 32)}{project.title.length > 32 ? '...' : ''}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1 text-[10px] text-[#9CA3AF] hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>ESC</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Problem Statement */}
              {project.problem && (
                <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/[0.06]">
                  <div className="text-[10px] text-[#C9A76C] font-bold uppercase mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A76C]" />
                    <span>PROBLEM_STATEMENT:</span>
                  </div>
                  <p className="text-[#9CA3AF] leading-relaxed text-xs">{project.problem}</p>
                </div>
              )}

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div>
                  <div className="text-[10px] text-[#C9A76C] font-bold uppercase mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A76C]" />
                    <span>SPEC_FEATURES:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {project.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#EDE8E8] bg-[#0A0A0C] p-2 rounded-md border border-white/[0.04]">
                        <span className="text-[#C9A76C] font-bold">0{idx + 1}.</span>
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Stack */}
              {project.suggestedStack && project.suggestedStack.length > 0 && (
                <div>
                  <div className="text-[10px] text-[#C9A76C] font-bold uppercase mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A76C]" />
                    <span>STACK_ARCHITECTURE:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.suggestedStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-[#0A0A0C] text-[#E4CCA1] border border-white/[0.08] text-[11px] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[10px] text-[#C9A76C] font-bold uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A76C]" />
                    <span>DEV_LOG &amp; REPO_URL:</span>
                  </div>
                  {!isEditingNotes && (
                    <button
                      type="button"
                      onClick={() => {
                        setNotesInput(project.notes || '');
                        setIsEditingNotes(true);
                      }}
                      className="text-[11px] text-[#C9A76C] hover:underline cursor-pointer"
                    >
                      {project.notes ? 'EDIT_LOG' : '+ WRITE_LOG'}
                    </button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Enter commit URLs, architectural decisions, or notes..."
                      rows={3}
                      className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.15] text-[#EDE8E8] text-xs font-mono focus:outline-none focus:border-[#C9A76C]"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingNotes(false)}
                        className="px-2.5 py-1 rounded text-[#52525B] hover:text-white cursor-pointer"
                      >
                        CANCEL
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        className="salam-gold-btn px-3 py-1 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3 text-[#0A0A0C]" />
                        SAVE
                      </button>
                    </div>
                  </div>
                ) : project.notes ? (
                  <div className="p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.06] text-[#EDE8E8] whitespace-pre-wrap text-xs leading-relaxed">
                    {project.notes}
                  </div>
                ) : (
                  <div className="text-[11px] text-[#52525B] italic">
                    No engineering log recorded. Click + WRITE_LOG to document repo links or milestones.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
