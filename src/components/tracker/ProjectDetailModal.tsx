'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProject, ProjectStatus } from '@/types/project';
import { DOMAINS, COMPLEXITY_CONFIG } from '@/data/domains';
import { DomainIcon } from '@/components/ui/DomainIcon';
import { triggerConfetti } from '@/components/shared/Confetti';
import { soundFX } from '@/utils/soundEffects';
import {
  X,
  FileCode,
  Layers,
  Code2,
  FileText,
  Calendar,
  Check,
  Copy,
  CheckCheck,
  Terminal,
  Zap,
  Lightbulb,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: UserProject | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'features' | 'stack' | 'log'>('brief');
  const [copied, setCopied] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Sync notes when project changes
  React.useEffect(() => {
    if (project) {
      setNotesInput(project.notes || '');
      setIsEditingNotes(!project.notes);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const domain = DOMAINS[project.domain] || DOMAINS['web-fullstack'];
  const complexity = COMPLEXITY_CONFIG[project.complexity] || COMPLEXITY_CONFIG['weekend-project'];

  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedJson = JSON.stringify(
    {
      id: project.id,
      title: project.title,
      tagline: project.tagline,
      domain: project.domain,
      scope: project.complexity,
      status: project.status,
      problem: project.problem || null,
      features: project.features || [],
      suggestedStack: project.suggestedStack || [],
      notes: project.notes || null,
      createdAt: project.createdAt,
    },
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      activeButton: 'bg-white/15 text-white border border-white/30',
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Dark Frosted Glass Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* 3D Code Window Spec Inspector Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-4xl salam-code-window z-10 my-auto shadow-2xl shadow-black max-h-[90vh] flex flex-col"
        >
          {/* Window Header & Tabs */}
          <div className="salam-code-tabbar flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <div className="flex items-center gap-1.5 px-2 mr-2 border-r border-white/[0.08]">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-2.5 h-2.5 rounded-full bg-[#EF4444] hover:brightness-125 inline-block cursor-pointer"
                  title="Close Inspector"
                />
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

              <button
                type="button"
                onClick={() => setActiveTab('log')}
                className={`salam-code-tab ${activeTab === 'log' ? 'active' : 'inactive'}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>devlog.md</span>
                {project.notes && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A76C]" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 pr-1">
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1 font-mono text-xs">
            {/* Top Info Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border ${domain.badgeBg}`}>
                  <DomainIcon domain={project.domain} className="w-3.5 h-3.5 text-[#C9A76C]" />
                  <span>{domain.name.toUpperCase()}</span>
                </span>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${complexity.badgeClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${complexity.dotColor}`} />
                  <span>{complexity.label}</span>
                </span>

                <span className="text-[11px] text-[#52525B] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>LOGGED: {formattedDate}</span>
                </span>
              </div>

              {/* Status Switcher In Inspector */}
              <div className="flex items-center gap-1 bg-[#0A0A0C] p-1 rounded-lg border border-white/[0.08]">
                {(['idea', 'in-progress', 'completed'] as ProjectStatus[]).map((st) => {
                  const isCurrent = project.status === st;
                  const meta = statusConfig[st];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
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
            </div>

            {/* TAB 1: spec.brief */}
            {activeTab === 'brief' && (
              <motion.div
                key="tab-brief"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight">
                    {project.title}
                    <span className="salam-gold-caret" />
                  </h3>
                  {project.tagline && (
                    <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1.5 leading-relaxed">
                      // {project.tagline}
                    </p>
                  )}
                </div>

                {/* Problem Statement */}
                {project.problem && (
                  <div className="rounded-xl bg-[#0A0A0C] border border-white/[0.08] p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#C9A76C] font-bold text-[11px] uppercase tracking-wider">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>01. OBJECTIVE &amp; PROBLEM STATEMENT</span>
                    </div>
                    <p className="text-[#EDE8E8] leading-relaxed pl-4 border-l-2 border-[#C9A76C]/40">
                      {project.problem}
                    </p>
                  </div>
                )}

                {/* Spec Features */}
                {project.features && project.features.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#C9A76C]" />
                      <span>02. MVP MILESTONES &amp; DELIVERABLES</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {project.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0A0A0C] border border-white/[0.06] text-xs text-[#EDE8E8]"
                        >
                          <span className="text-[#C9A76C] font-bold">0{idx + 1}.</span>
                          <span className="leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: features.json */}
            {activeTab === 'features' && (
              <motion.div
                key="tab-features"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#C9A76C] flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>RAW_SPECIFICATION_PAYLOAD // JSON</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#EDE8E8] border border-white/[0.08] hover:border-[#C9A76C]/40 text-xs transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-[#C9A76C]" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#C9A76C]" />
                        <span>COPY_JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="rounded-xl bg-[#0A0A0C] border border-white/[0.1] p-4 sm:p-5 max-h-[360px] overflow-x-auto scrollbar-thin">
                  <pre className="text-[#EDE8E8] leading-relaxed">
                    <code>{formattedJson}</code>
                  </pre>
                </div>
              </motion.div>
            )}

            {/* TAB 3: stack.config */}
            {activeTab === 'stack' && (
              <motion.div
                key="tab-stack"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                <div className="text-xs font-bold text-[#C9A76C] flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>CORE_SYSTEM_DEPENDENCIES</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.suggestedStack?.map((tech, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0A0A0C] border border-white/[0.08] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C9A76C]" />
                        <span className="text-sm font-bold text-white">{tech}</span>
                      </div>
                      <span className="text-[10px] text-[#52525B]">RUNTIME_MODULE</span>
                    </div>
                  ))}
                </div>

                {project.suggestedStack && project.suggestedStack.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.08] space-y-2">
                    <div className="text-[10px] text-[#52525B] uppercase">// CLI_INIT_SNIPPET:</div>
                    <div className="flex items-center gap-2 text-[#E4CCA1] bg-[#121216] p-2.5 rounded-lg border border-white/[0.06] overflow-x-auto">
                      <span className="text-[#C9A76C] select-none">$</span>
                      <code>npm init -y &amp;&amp; npm i {project.suggestedStack.map((s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')).slice(0, 3).join(' ')}</code>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: devlog.md */}
            {activeTab === 'log' && (
              <motion.div
                key="tab-log"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#C9A76C] flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>ENGINEERING_LOG &amp; REPO_URLS</span>
                  </div>

                  {!isEditingNotes && (
                    <button
                      type="button"
                      onClick={() => setIsEditingNotes(true)}
                      className="text-xs text-[#C9A76C] hover:underline cursor-pointer"
                    >
                      {project.notes ? 'EDIT_LOG' : '+ WRITE_LOG'}
                    </button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Enter GitHub repo link, commit hash, architectural notes, or deployment URL..."
                      rows={8}
                      className="w-full p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.15] text-[#EDE8E8] placeholder:text-[#52525B] focus:outline-none focus:border-[#C9A76C] leading-relaxed"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingNotes(false)}
                        className="px-3 py-1.5 rounded-lg text-[#52525B] hover:text-white"
                      >
                        CANCEL
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        className="salam-gold-btn px-4 py-1.5 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-[#0A0A0C]" />
                        <span>SAVE_DEVLOG</span>
                      </button>
                    </div>
                  </div>
                ) : project.notes ? (
                  <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.08] text-[#EDE8E8] whitespace-pre-wrap leading-relaxed">
                    {project.notes}
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-xl bg-[#0A0A0C] border border-white/[0.06] text-[#52525B] space-y-2">
                    <p>No engineering log or repository URL recorded yet.</p>
                    <button
                      type="button"
                      onClick={() => setIsEditingNotes(true)}
                      className="salam-gold-btn px-4 py-2 font-bold cursor-pointer inline-block"
                    >
                      + ADD_FIRST_ENTRY
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0A0A0C]/90 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                  onDelete(project.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono text-[#52525B] hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-500/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>DELETE_PROJECT</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="salam-gold-btn px-6 py-2.5 text-xs font-mono font-bold cursor-pointer"
            >
              DONE // CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
