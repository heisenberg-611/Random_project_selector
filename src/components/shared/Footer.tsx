'use client';

import React from 'react';
import { ShieldCheck, Cookie, FileText, HardDrive } from 'lucide-react';

interface FooterProps {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onOpenCookiePolicy: () => void;
  onOpenBackup: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onOpenPrivacy,
  onOpenCookiePolicy,
  onOpenBackup,
}) => {
  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-[#0A0A0C] text-xs font-mono text-[#9CA3AF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Brand & Mission */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-white font-heading">
              <span>DEVSPARK // RANDOM_IDEA_MATRIX</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#121216] text-[#C9A76C] border border-[#C9A76C]/30">
                v1.0.0
              </span>
            </div>
            <p className="text-[#52525B] text-[11px] font-mono mt-1">
              Engineered for builders facing creative blocks. 100% Client-Side Sandbox.
            </p>
          </div>

          {/* Legal and Compliance Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <button
              onClick={onOpenTerms}
              className="text-[#9CA3AF] hover:text-[#C9A76C] transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#C9A76C]" />
              <span>[TERMS]</span>
            </button>

            <span className="text-white/10 hidden sm:inline">•</span>

            <button
              onClick={onOpenPrivacy}
              className="text-[#9CA3AF] hover:text-[#C9A76C] transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A76C]" />
              <span>[PRIVACY]</span>
            </button>

            <span className="text-white/10 hidden sm:inline">•</span>

            <button
              onClick={onOpenCookiePolicy}
              className="text-[#9CA3AF] hover:text-[#C9A76C] transition-colors flex items-center gap-1.5"
            >
              <Cookie className="w-3.5 h-3.5 text-[#C9A76C]" />
              <span>[STORAGE_POLICY]</span>
            </button>

            <span className="text-white/10 hidden sm:inline">•</span>

            <button
              onClick={onOpenBackup}
              className="text-[#9CA3AF] hover:text-[#C9A76C] transition-colors flex items-center gap-1.5"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#C9A76C]" />
              <span>[DATA_BACKUP]</span>
            </button>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#52525B]">
          <p>© {new Date().getFullYear()} DEVSPARK. ZERO TELEMETRY • OPEN SPECIFICATIONS.</p>
        </div>
      </div>
    </footer>
  );
};
