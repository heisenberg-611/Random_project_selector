'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Check } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="salam-code-window relative w-full max-w-2xl p-6 sm:p-7 my-8 max-h-[85vh] flex flex-col font-mono"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#121216] border border-[#C9A76C]/30 flex items-center justify-center text-[#C9A76C]">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">TERMS_AND_CONDITIONS</h3>
                <p className="text-[11px] text-[#9CA3AF]">Version 1.0 // Effective September 2026</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#52525B] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto py-4 space-y-4 text-xs text-[#EDE8E8] leading-relaxed pr-1 scrollbar-thin">
            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">01. ACCEPTANCE_OF_TERMS</h4>
              <p className="text-[#9CA3AF]">
                By accessing and using DevSpark (&quot;the System&quot;), you acknowledge and agree to be bound by these Terms and Conditions.
              </p>
            </section>

            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">02. SYSTEM_PURPOSE</h4>
              <p className="text-[#9CA3AF]">
                DevSpark is a developer utility designed to randomly generate software specifications and track the progression of personal projects without third-party vendor lock-in.
              </p>
            </section>

            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">03. OPEN_IP_OWNERSHIP</h4>
              <p className="text-[#9CA3AF]">
                All generated project briefs and specifications are 100% open and royalty-free. You retain unconditional ownership over any software, code, or intellectual property you create inspired by this tool.
              </p>
            </section>

            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">04. LOCAL_PERSISTENCE_RESPONSIBILITY</h4>
              <p className="text-[#9CA3AF]">
                Data persistence is executed entirely within your browser sandbox via LocalStorage. You are encouraged to utilize the JSON Backup &amp; Restore utility prior to clearing browser cookies or site data.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/[0.08] shrink-0 flex justify-end">
            <button
              onClick={onClose}
              className="salam-gold-btn px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-[#0A0A0C]" />
              <span>ACKNOWLEDGE_AND_CLOSE</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
