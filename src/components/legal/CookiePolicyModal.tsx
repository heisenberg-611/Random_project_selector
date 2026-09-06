'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Check } from 'lucide-react';

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookiePolicyModal: React.FC<CookiePolicyModalProps> = ({ isOpen, onClose }) => {
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
                <Cookie className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">STORAGE_&amp;_COOKIE_POLICY</h3>
                <p className="text-[11px] text-[#9CA3AF]">Client persistence architecture explanation</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#52525B] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto py-4 space-y-4 text-xs text-[#EDE8E8] leading-relaxed pr-1 scrollbar-thin">
            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">01. LOCAL_STORAGE_VS_COOKIES</h4>
              <p className="text-[#9CA3AF]">
                Unlike traditional HTTP cookies which are transmitted with every server request, <strong className="text-white">LocalStorage</strong> remains strictly stored within your local browser sandbox and is never sent across the network.
              </p>
            </section>

            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">02. PERSISTENCE_KEYS</h4>
              <p className="mb-2 text-[#9CA3AF]">The application allocates two keys for essential operational functions:</p>
              <ul className="list-disc pl-4 space-y-1 text-[#9CA3AF]">
                <li>
                  <code className="text-[#C9A76C]">random_project_selector_data_v1</code>: Stores your tracked projects, custom specs, and dev notes.
                </li>
                <li>
                  <code className="text-[#C9A76C]">random_project_selector_cookie_consent_v1</code>: Records your acknowledgment of the offline storage notice.
                </li>
              </ul>
            </section>

            <section>
              <h4 className="text-sm font-bold text-white mb-1 font-heading">03. ZERO_THIRD_PARTY_COOKIES</h4>
              <p className="text-[#9CA3AF]">
                We strictly do <span className="text-[#C9A76C] font-bold">NOT</span> utilize third-party cookies, advertising trackers, or tracking pixels.
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
              <span>ACKNOWLEDGED</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
