'use client';

import React, { useState } from 'react';
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

  const domain = DOMAINS[project.domain] || DOMAINS['web-fullstack'];
  const complexity = COMPLEXITY_CONFIG[project.complexity] || COMPLEXITY_CONFIG['weekend-project'];

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
      className={`salam-bevel p-5 sm:p-6 space-y-4 ${
        project.status === 'completed' ? 'border-[#C9A76C]/40' : ''
      }`}
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
            onClick={() => onDelete(project.id)}
            aria-label="Delete project"
            className="p-1 rounded-md text-[#52525B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
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
                onClick={() => handleStatusChange(st)}
                className={`flex-1 xs:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] transition-all cursor-pointer ${
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

        {/* Expand / Details Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-1 text-[11px] font-mono text-[#9CA3AF] hover:text-[#EDE8E8] px-2 py-1 rounded hover:bg-white/5 transition-colors"
        >
          <span>{isExpanded ? 'LESS' : 'SPEC_DOCS'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#C9A76C]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#C9A76C]" />}
        </button>
      </div>

      {/* Expandable Details & Notes Area */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 pt-3 border-t border-white/[0.06] space-y-3 font-mono text-xs text-[#EDE8E8]"
          >
            {/* Problem Statement */}
            {project.problem && (
              <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/[0.06]">
                <div className="text-[10px] text-[#C9A76C] font-bold uppercase mb-1">
                  // PROBLEM_STATEMENT:
                </div>
                <p className="text-[#9CA3AF] leading-relaxed text-xs">{project.problem}</p>
              </div>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <div className="text-[10px] text-[#C9A76C] font-bold uppercase mb-1.5">
                  // SPEC_FEATURES:
                </div>
                <ul className="space-y-1 text-xs">
                  {project.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[#EDE8E8]">
                      <span className="text-[#C9A76C]">0{idx + 1}.</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Stack */}
            {project.suggestedStack && project.suggestedStack.length > 0 && (
              <div>
                <div className="text-[10px] text-[#C9A76C] font-bold uppercase mb-1">
                  // STACK_ARCHITECTURE:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.suggestedStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#0A0A0C] text-[#E4CCA1] border border-white/[0.08] text-[11px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[10px] text-[#C9A76C] font-bold uppercase">
                  // DEV_LOG &amp; REPO_URL:
                </div>
                {!isEditingNotes && (
                  <button
                    onClick={() => {
                      setNotesInput(project.notes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-[11px] text-[#C9A76C] hover:underline"
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
                      onClick={() => setIsEditingNotes(false)}
                      className="px-2.5 py-1 rounded text-[#52525B] hover:text-white"
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="salam-gold-btn px-3 py-1 text-xs flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-[#0A0A0C]" />
                      SAVE
                    </button>
                  </div>
                </div>
              ) : project.notes ? (
                <div className="p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.06] text-[#EDE8E8] whitespace-pre-wrap text-xs">
                  {project.notes}
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
