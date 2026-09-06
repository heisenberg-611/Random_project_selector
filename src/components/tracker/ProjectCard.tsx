'use client';

import React from 'react';
import { UserProject, ProjectStatus } from '@/types/project';
import { DOMAINS, COMPLEXITY_CONFIG } from '@/data/domains';
import { DomainIcon } from '@/components/ui/DomainIcon';
import { triggerConfetti } from '@/components/shared/Confetti';
import { soundFX } from '@/utils/soundEffects';
import {
  Trash2,
  CheckCircle2,
  Zap,
  Lightbulb,
  Calendar,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface ProjectCardProps {
  project: UserProject;
  index: number;
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
  onOpenInspect: (project: UserProject) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onUpdateStatus,
  onOpenInspect,
  onDelete,
}) => {
  const domain = DOMAINS[project.domain] || DOMAINS['web-fullstack'];
  const complexity = COMPLEXITY_CONFIG[project.complexity] || COMPLEXITY_CONFIG['weekend-project'];

  const handleStatusChange = (newStatus: ProjectStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (newStatus === project.status) return;

    if (newStatus === 'completed') {
      triggerConfetti();
      soundFX.playComplete();
    }

    onUpdateStatus(project.id, newStatus);
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
      onClick={() => onOpenInspect(project)}
      className={`salam-bevel group p-5 sm:p-6 space-y-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
        project.status === 'completed'
          ? 'border-[#C9A76C]/40 shadow-lg shadow-[#C9A76C]/5'
          : 'hover:border-[#C9A76C]/40'
      }`}
    >
      {/* Top Header: Index, Domain, Scope, Date, Delete */}
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            aria-label="Delete project"
            className="p-1.5 rounded-md text-[#52525B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
            title="Delete Project Entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Project Title & Tagline */}
      <div>
        <h4 className="text-lg font-bold text-white font-heading tracking-tight leading-snug group-hover:text-[#E4CCA1] transition-colors flex items-center justify-between gap-2">
          <span>{project.title}</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#52525B] opacity-0 group-hover:opacity-100 group-hover:text-[#C9A76C] transition-all shrink-0" />
        </h4>
        {project.tagline && (
          <p className="text-xs text-[#9CA3AF] font-mono mt-1 line-clamp-2 leading-relaxed">
            // {project.tagline}
          </p>
        )}
      </div>

      {/* Tech Stack Preview Chips */}
      {project.suggestedStack && project.suggestedStack.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Code2 className="w-3 h-3 text-[#52525B] mr-0.5" />
          {project.suggestedStack.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-[#0A0A0C] text-[#9CA3AF] border border-white/[0.06] text-[10px] font-mono"
            >
              {tech}
            </span>
          ))}
          {project.suggestedStack.length > 3 && (
            <span className="text-[10px] text-[#52525B] font-mono">
              +{project.suggestedStack.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Status Switcher & Inspect CTA */}
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
                onClick={(e) => handleStatusChange(st, e)}
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

        {/* View / Inspect Spec CTA */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenInspect(project);
          }}
          className="flex items-center justify-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] border border-white/[0.08] hover:border-[#C9A76C]/40 transition-colors cursor-pointer"
        >
          <span className="text-[#C9A76C]">VIEW_SPEC</span>
          <span className="text-[#52525B] group-hover:text-white transition-colors">&gt;</span>
        </button>
      </div>
    </div>
  );
};
