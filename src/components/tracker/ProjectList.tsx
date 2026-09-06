'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProject, ProjectStatus, DomainFilter } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { StatusFilter } from './StatusFilter';
import { Plus, ArrowRight, FolderGit2 } from 'lucide-react';

interface ProjectListProps {
  projects: UserProject[];
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteProject: (id: string) => void;
  onOpenAddModal: () => void;
  onSwitchToGenerator: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteProject,
  onOpenAddModal,
  onSwitchToGenerator,
}) => {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Compute counts
  const counts = useMemo(() => {
    return {
      all: projects.length,
      idea: projects.filter((p) => p.status === 'idea').length,
      inProgress: projects.filter((p) => p.status === 'in-progress').length,
      completed: projects.filter((p) => p.status === 'completed').length,
    };
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (domainFilter !== 'all' && p.domain !== domainFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchTagline = p.tagline?.toLowerCase().includes(query);
        const matchStack = p.suggestedStack?.some((s) => s.toLowerCase().includes(query));
        const matchProblem = p.problem?.toLowerCase().includes(query);
        if (!matchTitle && !matchTagline && !matchStack && !matchProblem) return false;
      }

      return true;
    });
  }, [projects, statusFilter, domainFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Bento Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="salam-stat-card">
          <div className="text-xs font-mono text-[#9CA3AF] uppercase">01 // TOTAL_LOGGED</div>
          <div className="salam-stat-num mt-1">{counts.all}</div>
          <div className="salam-stat-bar">
            <div className="salam-stat-bar-fill" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="salam-stat-card">
          <div className="text-xs font-mono text-[#9CA3AF] uppercase">02 // ACTIVE_SPRINTS</div>
          <div className="salam-stat-num mt-1 text-[#C9A76C]">{counts.inProgress}</div>
          <div className="salam-stat-bar">
            <div
              className="salam-stat-bar-fill"
              style={{ width: `${counts.all > 0 ? (counts.inProgress / counts.all) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="salam-stat-card">
          <div className="text-xs font-mono text-[#9CA3AF] uppercase">03 // SHIPPED_ENTRIES</div>
          <div className="salam-stat-num mt-1 text-white">{counts.completed}</div>
          <div className="salam-stat-bar">
            <div
              className="salam-stat-bar-fill"
              style={{ width: `${counts.all > 0 ? (counts.completed / counts.all) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Header of Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="text-xs font-mono text-[#C9A76C] uppercase tracking-wider mb-1">
            // WORKSPACE_DATABASE
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Tracked Projects
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="salam-gold-btn flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#0A0A0C]" />
            <span>ADD_MANUAL_ENTRY</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <StatusFilter
        statusFilter={statusFilter}
        onSelectStatus={setStatusFilter}
        domainFilter={domainFilter}
        onSelectDomain={setDomainFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      {/* Project Grid with clean fade transition on filter switch */}
      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          <motion.div
            key={`grid-${statusFilter}-${domainFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                onUpdateStatus={onUpdateStatus}
                onUpdateNotes={onUpdateNotes}
                onDelete={onDeleteProject}
              />
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            key={`empty-${statusFilter}-${domainFilter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="salam-boot-terminal p-8 sm:p-12 text-center"
          >
            <div className="w-10 h-10 rounded-lg bg-[#121216] border border-[#C9A76C]/30 flex items-center justify-center mx-auto mb-3 text-[#C9A76C]">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-heading">
              {projects.length === 0
                ? 'NO_PROJECT_ENTRIES_FOUND'
                : 'FILTER_RETURNED_ZERO_RESULTS'}
            </h3>
            <p className="text-xs font-mono text-[#9CA3AF] max-w-md mx-auto mt-1 mb-5">
              {projects.length === 0
                ? 'Spin the Idea Matrix to choose a random software project or create a manual specification.'
                : 'Try clearing your active filter query.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {projects.length === 0 ? (
                <button
                  onClick={onSwitchToGenerator}
                  className="salam-gold-btn flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold cursor-pointer"
                >
                  <span>OPEN_IDEA_MATRIX</span>
                  <ArrowRight className="w-4 h-4 text-[#0A0A0C]" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setDomainFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] text-xs font-mono border border-white/[0.08]"
                >
                  RESET_FILTERS
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
