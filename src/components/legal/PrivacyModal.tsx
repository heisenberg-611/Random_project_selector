'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Check } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
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
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">PRIVACY_PROTOCOL</h3>
                <p className="text-[11px] text-[#9CA3AF]">Zero Tracking // 100% Client-Side Sandbox</p>
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
            <section className="p-3.5 rounded-xl bg-[#0A0A0C] border border-[#C9A76C]/30 text-[#E4CCA1]">
              <h4 className="font-bold text-white mb-1 font-heading">// CORE_PRIVACY_MANDATE:</h4>
              <p className="text-xs text-[#9CA3AF]">
                DevSpark operates with zero telemetry, zero analytics trackers, and zero remote databases. All project entries, notes, and statuses remain strictly on your machine.
              </p>
            </section>

            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">01. ZERO_DATA_COLLECTION</h4>
              <p className="text-[#9CA3AF]">
                We do not collect names, email addresses, IP addresses, or project data. No network requests transmit your notes to external servers.
              </p>
            </section>

            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">02. LOCAL_BROWSER_SANDBOX</h4>
              <p className="text-[#9CA3AF]">
                All data is written directly to <code className="px-1.5 py-0.5 rounded bg-[#121216] text-[#C9A76C]">window.localStorage</code> on your client device.
              </p>
            </section>

            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">03. DATA_EXPORT_AND_PURGE</h4>
              <p className="text-[#9CA3AF]">
                You retain full sovereign control over your data. Export a complete JSON snapshot or purge the local database at any time from the Backup menu.
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
              <span>CONFIRMED</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
