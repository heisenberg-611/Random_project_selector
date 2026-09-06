'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainId, Complexity, ProjectStatus, UserProject } from '@/types/project';
import { DOMAINS } from '@/data/domains';
import { X, Plus, Terminal } from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (
    project: Omit<UserProject, 'id' | 'createdAt'>
  ) => { success: boolean; id: string; message: string };
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [domain, setDomain] = useState<DomainId>('web-fullstack');
  const [complexity, setComplexity] = useState<Complexity>('weekend-project');
  const [status, setStatus] = useState<ProjectStatus>('idea');
  const [problem, setProblem] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }

    const suggestedStack = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const features = featuresInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = onAddProject({
      title: title.trim(),
      tagline: tagline.trim(),
      domain,
      complexity,
      status,
      problem: problem.trim(),
      suggestedStack: suggestedStack.length > 0 ? suggestedStack : undefined,
      features: features.length > 0 ? features : undefined,
      isCustom: true,
    });

    if (!res.success) {
      setError(res.message);
      return;
    }

    setTitle('');
    setTagline('');
    setProblem('');
    setTechStackInput('');
    setFeaturesInput('');
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="salam-code-window relative w-full max-w-lg p-6 sm:p-7 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#121216] border border-[#C9A76C]/30 flex items-center justify-center text-[#C9A76C]">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">CREATE_MANUAL_SPEC</h3>
                <p className="text-[11px] font-mono text-[#9CA3AF]">Record custom software venture</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#52525B] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
              [ERROR]: {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-mono text-xs">
            {/* Title */}
            <div>
              <label className="block text-[#EDE8E8] font-bold mb-1">
                PROJECT_TITLE <span className="text-[#C9A76C]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GitTimeMachine: Interactive Commit Visualizer"
                required
                className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-[#EDE8E8] font-bold mb-1">
                ONE_LINE_PITCH
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. TUI tool that replays codebase evolution in real time"
                className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
              />
            </div>

            {/* Domain & Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#EDE8E8] font-bold mb-1">DOMAIN_SECTOR</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as DomainId)}
                  className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
                >
                  {Object.entries(DOMAINS).map(([key, d]) => (
                    <option key={key} value={key}>
                      {d.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#EDE8E8] font-bold mb-1">INITIAL_STATUS</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
                >
                  <option value="idea">01. BACKLOG</option>
                  <option value="in-progress">02. ACTIVE SPRINT</option>
                  <option value="completed">03. SHIPPED</option>
                </select>
              </div>
            </div>

            {/* Problem & Tech Stack */}
            <div>
              <label className="block text-[#EDE8E8] font-bold mb-1">
                STACK_ARCHITECTURE (comma-separated)
              </label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="e.g. Next.js, TypeScript, Tailwind, Rust"
                className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
              />
            </div>

            <div>
              <label className="block text-[#EDE8E8] font-bold mb-1">
                PROBLEM_STATEMENT &amp; NOTES
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={2}
                placeholder="What core architectural or workflow friction does this eliminate?"
                className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
              />
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-[#52525B] hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="salam-gold-btn px-5 py-2.5 text-xs font-mono font-bold"
              >
                COMMIT_SPEC
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
