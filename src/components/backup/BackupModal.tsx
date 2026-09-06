'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, Trash2, RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck, X, HardDrive } from 'lucide-react';
import { UserProject } from '@/types/project';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: UserProject[];
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => { success: boolean; count: number; error?: string };
  onClearAll: () => void;
  onResetSample: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  projects,
  onExportBackup,
  onImportBackup,
  onClearAll,
  onResetSample,
}) => {
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [confirmClear, setConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = onImportBackup(content);
        if (result.success) {
          setImportStatus({
            type: 'success',
            message: `Successfully restored ${result.count} project specifications!`,
          });
        } else {
          setImportStatus({
            type: 'error',
            message: result.error || 'Failed to parse backup.',
          });
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">DATA_PORTABILITY // BACKUP</h3>
                <p className="text-[11px] font-mono text-[#9CA3AF]">Zero-cloud offline state preservation</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#52525B] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Explanation notice */}
          <div className="mt-4 p-3.5 rounded-xl bg-[#0A0A0C] border border-[#C9A76C]/30 text-xs font-mono text-[#EDE8E8] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#C9A76C] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-[#E4CCA1]">// LOCAL_STORAGE_SAFEGUARD:</span>
              <p className="text-[#9CA3AF] mt-0.5">
                Clearing cookies or browser history? Export your JSON backup and restore anytime without losing active project notes or status.
              </p>
            </div>
          </div>

          {/* Status Message */}
          {importStatus.type && (
            <div
              className={`mt-4 p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                importStatus.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/40 border-red-500/30 text-red-300'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Action Boxes */}
          <div className="mt-5 space-y-3 font-mono">
            {/* Export Section */}
            <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase">
                  01. EXPORT_DATABASE (JSON)
                </h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                  Package all <span className="text-[#C9A76C] font-bold">{projects.length}</span> specs into a timestamped file.
                </p>
              </div>

              <button
                onClick={onExportBackup}
                disabled={projects.length === 0}
                className="salam-gold-btn px-4 py-2 text-xs font-mono font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5 text-[#0A0A0C]" />
                <span>DOWNLOAD</span>
              </button>
            </div>

            {/* Import Section */}
            <div className="p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase">
                  02. RESTORE_FROM_FILE
                </h4>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                  Import previously exported `.json` file.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-[#18181F] hover:bg-[#20202A] text-white text-xs font-mono font-semibold border border-white/[0.1] flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#C9A76C]" />
                <span>UPLOAD</span>
              </button>
            </div>
          </div>

          {/* Danger / Reset Zone */}
          <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col xs:flex-row items-center justify-between gap-2.5 font-mono">
            <button
              onClick={onResetSample}
              className="w-full xs:w-auto flex items-center justify-center gap-1.5 text-xs text-[#9CA3AF] hover:text-white px-3 py-2 rounded hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REVERT_TO_SEED_DATA</span>
            </button>

            {confirmClear ? (
              <div className="flex items-center gap-2 w-full xs:w-auto">
                <button
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="flex-1 xs:flex-none px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  CONFIRM_PURGE
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#18181F] text-[#9CA3AF] text-xs"
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full xs:w-auto flex items-center justify-center gap-1.5 text-xs text-[#EF4444] px-3 py-2 rounded hover:bg-[#EF4444]/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>PURGE_ALL_DATA</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
