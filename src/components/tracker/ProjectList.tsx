'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProject, ProjectStatus, DomainFilter } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { StatusFilter } from './StatusFilter';
import { ProjectDetailModal } from './ProjectDetailModal';
import {
  Plus,
  ArrowRight,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Calendar,
} from 'lucide-react';
import { DomainIcon } from '@/components/ui/DomainIcon';
import { DOMAINS, COMPLEXITY_CONFIG } from '@/data/domains';

interface ProjectListProps {
  projects: UserProject[];
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteProject: (id: string) => void;
  onOpenAddModal: () => void;
  onSwitchToGenerator: () => void;
}

const ITEMS_PER_PAGE = 20;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Spec Inspector Modal State
  const [inspectingProject, setInspectingProject] = useState<UserProject | null>(null);

  // Keep inspectingProject synced if user updates status/notes
  useEffect(() => {
    if (inspectingProject) {
      const updated = projects.find((p) => p.id === inspectingProject.id);
      if (updated) {
        setInspectingProject(updated);
      } else {
        setInspectingProject(null);
      }
    }
  }, [projects, inspectingProject?.id]);

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

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, domainFilter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProjects.length);
  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, startIndex, endIndex]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      {/* Top Header of Tracker with View Mode Toggles */}
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
          {/* Grid vs List View Toggle */}
          <div className="flex items-center gap-1 bg-[#121216] p-1 rounded-lg border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0A0A0C] shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-[#0A0A0C] shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
              title="Dense List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="salam-gold-btn flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#0A0A0C]" />
            <span>ADD_ENTRY</span>
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

      {/* Project Grid / List View */}
      <AnimatePresence mode="wait">
        {paginatedProjects.length > 0 ? (
          <div className="space-y-6">
            {viewMode === 'grid' ? (
              /* Bento 2-Column Grid */
              <motion.div
                key={`grid-${statusFilter}-${domainFilter}-page-${validCurrentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
              >
                {paginatedProjects.map((project, idx) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={startIndex + idx}
                    onUpdateStatus={onUpdateStatus}
                    onOpenInspect={(p) => setInspectingProject(p)}
                    onDelete={onDeleteProject}
                  />
                ))}
              </motion.div>
            ) : (
              /* Dense Engineering List View */
              <motion.div
                key={`list-${statusFilter}-${domainFilter}-page-${validCurrentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                className="space-y-2 font-mono text-xs"
              >
                {paginatedProjects.map((project, idx) => {
                  const domain = DOMAINS[project.domain] || DOMAINS['web-fullstack'];
                  const complexity = COMPLEXITY_CONFIG[project.complexity] || COMPLEXITY_CONFIG['weekend-project'];
                  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div
                      key={project.id}
                      onClick={() => setInspectingProject(project)}
                      className="salam-bevel group p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-[#C9A76C]/40 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[#C9A76C] font-bold shrink-0">
                          #{String(startIndex + idx + 1).padStart(2, '0')}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white group-hover:text-[#E4CCA1] transition-colors truncate">
                              {project.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] border ${domain.badgeBg}`}>
                              {domain.name.toUpperCase()}
                            </span>
                          </div>
                          {project.tagline && (
                            <p className="text-[11px] text-[#52525B] truncate mt-0.5">
                              {project.tagline}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <span className="text-[10px] text-[#52525B] hidden md:inline">
                          {formattedDate}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                            project.status === 'completed'
                              ? 'bg-white text-[#0A0A0C]'
                              : project.status === 'in-progress'
                              ? 'bg-[#C9A76C] text-[#0A0A0C]'
                              : 'bg-white/10 text-[#9CA3AF] border border-white/10'
                          }`}
                        >
                          {project.status === 'completed'
                            ? 'SHIPPED'
                            : project.status === 'in-progress'
                            ? 'BUILDING'
                            : 'BACKLOG'}
                        </span>

                        <span className="text-xs text-[#C9A76C] group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Pagination Controls when project count > 20 */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.08] font-mono text-xs">
                <div className="text-[#9CA3AF]">
                  PAGE <span className="text-[#C9A76C] font-bold">{validCurrentPage}</span> OF{' '}
                  <span className="text-white font-semibold">{totalPages}</span>
                  <span className="text-[#52525B] ml-2">
                    [SHOWING {startIndex + 1}–{endIndex} OF {filteredProjects.length} PROJECTS]
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.max(1, validCurrentPage - 1))}
                    disabled={validCurrentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] border border-white/[0.08] hover:border-[#C9A76C]/40 disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>PREV</span>
                  </button>

                  {/* Page number pills */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[32px] h-8 px-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                          validCurrentPage === pageNum
                            ? 'salam-gold-btn text-[#0A0A0C]'
                            : 'bg-[#121216] hover:bg-[#18181F] text-[#9CA3AF] hover:text-white border border-white/[0.08]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.min(totalPages, validCurrentPage + 1))}
                    disabled={validCurrentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] border border-white/[0.08] hover:border-[#C9A76C]/40 disabled:opacity-35 disabled:pointer-events-none transition-all cursor-pointer text-xs"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
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

      {/* 3D Code Window Spec Inspector Modal */}
      <ProjectDetailModal
        project={inspectingProject}
        isOpen={Boolean(inspectingProject)}
        onClose={() => setInspectingProject(null)}
        onUpdateStatus={onUpdateStatus}
        onUpdateNotes={onUpdateNotes}
        onDelete={onDeleteProject}
      />
    </div>
  );
};
