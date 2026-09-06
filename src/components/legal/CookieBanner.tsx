'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck } from 'lucide-react';

interface CookieBannerProps {
  isVisible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onOpenPrivacy: () => void;
  onOpenCookiePolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  isVisible,
  onAccept,
  onDecline,
  onOpenPrivacy,
  onOpenCookiePolicy,
}) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="LocalStorage and privacy protocol notice"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-auto sm:right-5 sm:max-w-md z-40"
      >
        <div className="salam-code-window p-4 sm:p-5 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#121216] border border-[#C9A76C]/30 flex items-center justify-center shrink-0 text-[#C9A76C]">
              <Cookie className="w-4 h-4" />
            </div>

            <div className="flex-1 font-mono text-xs">
              <h4 className="font-bold text-white mb-1 flex items-center gap-1.5 font-heading">
                <span>LOCAL_STORAGE &amp; PRIVACY NOTICE</span>
              </h4>
              <p className="text-[#9CA3AF] leading-relaxed text-[11px]">
                We use browser <span className="text-white font-bold">LocalStorage</span> solely to persist your ideas, project statuses, and developer logs offline. Zero third-party ad pixels or tracking telemetry.
              </p>

              <div className="flex items-center gap-2 mt-2 text-[10px]">
                <button
                  onClick={onOpenCookiePolicy}
                  className="text-[#C9A76C] hover:underline"
                >
                  [COOKIE_POLICY]
                </button>
                <span className="text-[#52525B]">•</span>
                <button
                  onClick={onOpenPrivacy}
                  className="text-[#C9A76C] hover:underline"
                >
                  [PRIVACY_PROTOCOL]
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/[0.08]">
                <button
                  onClick={onAccept}
                  className="salam-gold-btn flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-bold cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0C]" />
                  <span>ACKNOWLEDGE</span>
                </button>

                <button
                  onClick={onDecline}
                  className="py-2 px-3 rounded-lg bg-[#121216] hover:bg-[#18181F] text-[#9CA3AF] hover:text-white text-[11px] border border-white/[0.08] transition-colors"
                >
                  DECLINE
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
