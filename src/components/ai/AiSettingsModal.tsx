'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiConfig, AiProvider, DEFAULT_AI_CONFIG } from '@/services/aiGenerator';
import { X, Cpu, Key, Check, ShieldCheck, Server, ExternalLink, HardDrive, Terminal } from 'lucide-react';

const AI_CONFIG_KEY = 'devspark_ai_config_v1';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (config: AiConfig) => void;
}

export function loadStoredAiConfig(): AiConfig {
  if (typeof window === 'undefined') return DEFAULT_AI_CONFIG;
  try {
    const saved = localStorage.getItem(AI_CONFIG_KEY);
    if (saved) return { ...DEFAULT_AI_CONFIG, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_AI_CONFIG;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveConfig,
}) => {
  const [config, setConfig] = useState<AiConfig>(DEFAULT_AI_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(loadStoredAiConfig());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
    } catch {}
    onSaveConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="salam-code-window relative w-full max-w-xl p-6 sm:p-7 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#121216] border border-[#C9A76C]/30 flex items-center justify-center text-[#C9A76C]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">AI_SYNTHESIS_ENGINE</h3>
                <p className="text-[11px] text-[#9CA3AF]">Connect Cloud AI or Local LLMs (LM Studio / Ollama)</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#52525B] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy info */}
          <div className="mt-4 p-3 rounded-xl bg-[#0A0A0C] border border-[#C9A76C]/30 text-xs text-[#EDE8E8] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#C9A76C] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-[#9CA3AF]">
              <span className="font-bold text-[#E4CCA1]">100% PRIVATE CLIENT-SIDE CONNECTION: </span>
              Your keys and local endpoint queries are sent directly from your browser to the local or cloud provider.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
            {/* Provider Switcher Tabs (4 Options: Gemini, OpenAI, LM Studio, Ollama) */}
            <div>
              <label className="block text-[#EDE8E8] font-bold mb-2">
                01. SELECT_LLM_PROVIDER
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, provider: 'gemini' })}
                  className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                    config.provider === 'gemini'
                      ? 'bg-white text-[#0A0A0C] border-white shadow-md'
                      : 'bg-[#0A0A0C] text-[#9CA3AF] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div>Gemini</div>
                  <div className="text-[9px] opacity-70 font-normal mt-0.5">Flash Tier</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig({ ...config, provider: 'openai' })}
                  className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                    config.provider === 'openai'
                      ? 'bg-white text-[#0A0A0C] border-white shadow-md'
                      : 'bg-[#0A0A0C] text-[#9CA3AF] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div>OpenAI</div>
                  <div className="text-[9px] opacity-70 font-normal mt-0.5">GPT-4o Mini</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig({ ...config, provider: 'lmstudio' })}
                  className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                    config.provider === 'lmstudio'
                      ? 'salam-gold-btn text-[#0A0A0C] shadow-md shadow-[#C9A76C]/30'
                      : 'bg-[#0A0A0C] text-[#9CA3AF] border-white/[0.08] hover:border-[#C9A76C]/40'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>LM Studio</span>
                  </div>
                  <div className="text-[9px] opacity-80 font-normal mt-0.5">Local Server</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfig({ ...config, provider: 'ollama' })}
                  className={`p-2.5 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                    config.provider === 'ollama'
                      ? 'bg-white text-[#0A0A0C] border-white shadow-md'
                      : 'bg-[#0A0A0C] text-[#9CA3AF] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div>Ollama</div>
                  <div className="text-[9px] opacity-70 font-normal mt-0.5">100% Offline</div>
                </button>
              </div>
            </div>

            {/* Provider Details: 1. Google Gemini */}
            {config.provider === 'gemini' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[#EDE8E8] font-bold">
                    GEMINI_API_KEY <span className="text-[#C9A76C]">*</span>
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#C9A76C] hover:underline flex items-center gap-1"
                  >
                    <span>Get free key</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={config.geminiKey || ''}
                    onChange={(e) => setConfig({ ...config, geminiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
                  />
                </div>
              </div>
            )}

            {/* Provider Details: 2. OpenAI */}
            {config.provider === 'openai' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[#EDE8E8] font-bold">
                    OPENAI_API_KEY <span className="text-[#C9A76C]">*</span>
                  </label>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#C9A76C] hover:underline flex items-center gap-1"
                  >
                    <span>OpenAI Dashboard</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={config.openaiKey || ''}
                    onChange={(e) => setConfig({ ...config, openaiKey: e.target.value })}
                    placeholder="sk-proj-..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
                  />
                </div>
              </div>
            )}

            {/* Provider Details: 3. LM Studio (Local Machine) */}
            {config.provider === 'lmstudio' && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#EDE8E8] font-bold">
                      LM_STUDIO_SERVER_URL
                    </label>
                    <span className="text-[10px] text-[#C9A76C]">Default: http://localhost:1234</span>
                  </div>
                  <input
                    type="text"
                    value={config.lmStudioEndpoint || 'http://localhost:1234'}
                    onChange={(e) => setConfig({ ...config, lmStudioEndpoint: e.target.value })}
                    placeholder="http://localhost:1234"
                    className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
                  />
                </div>

                <div>
                  <label className="block text-[#EDE8E8] font-bold mb-1">
                    MODEL_IDENTIFIER <span className="text-[#52525B] font-normal">(OPTIONAL)</span>
                  </label>
                  <input
                    type="text"
                    value={config.lmStudioModel || ''}
                    onChange={(e) => setConfig({ ...config, lmStudioModel: e.target.value })}
                    placeholder="e.g. qwen2.5-coder-7b, deepseek-r1, or leave blank to use loaded model"
                    className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
                  />
                </div>

                {/* LM Studio Help Box */}
                <div className="p-3 rounded-lg bg-[#0A0A0C] border border-[#C9A76C]/30 text-[11px] text-[#9CA3AF] space-y-1 leading-relaxed">
                  <div className="text-[#E4CCA1] font-bold flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-[#C9A76C]" />
                    <span>LM Studio Setup Instructions:</span>
                  </div>
                  <p>1. Open <strong>LM Studio</strong> on your machine.</p>
                  <p>2. Click the <strong>Local Server</strong> icon (<code className="text-[#C9A76C]">&lt;-&gt;</code>) in the left sidebar.</p>
                  <p>3. Load any model (e.g. Qwen, Llama 3, DeepSeek) and click <strong>Start Server</strong> on port 1234.</p>
                  <p>4. Ensure <strong>Enable CORS</strong> is checked in LM Studio server settings.</p>
                </div>
              </div>
            )}

            {/* Provider Details: 4. Ollama (Local Machine) */}
            {config.provider === 'ollama' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[#EDE8E8] font-bold mb-1">
                    OLLAMA_ENDPOINT_URL
                  </label>
                  <input
                    type="text"
                    value={config.ollamaEndpoint || 'http://localhost:11434'}
                    onChange={(e) => setConfig({ ...config, ollamaEndpoint: e.target.value })}
                    placeholder="http://localhost:11434"
                    className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
                  />
                </div>

                <div>
                  <label className="block text-[#EDE8E8] font-bold mb-1">
                    MODEL_NAME
                  </label>
                  <input
                    type="text"
                    value={config.ollamaModel || 'llama3'}
                    onChange={(e) => setConfig({ ...config, ollamaModel: e.target.value })}
                    placeholder="llama3, mistral, qwen2.5-coder"
                    className="w-full p-2.5 rounded-lg bg-[#0A0A0C] border border-white/[0.1] text-[#EDE8E8] focus:outline-none focus:border-[#C9A76C]"
                  />
                </div>
              </div>
            )}

            {/* Submit & Status */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              {savedSuccess ? (
                <div className="text-emerald-400 flex items-center gap-1.5 text-xs font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>SETTINGS_SAVED</span>
                </div>
              ) : (
                <span className="text-[10px] text-[#52525B]">PERSISTED IN LOCALSTORAGE</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded text-[#52525B] hover:text-white cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="salam-gold-btn px-4 py-2 text-xs font-bold cursor-pointer"
                >
                  SAVE_CONFIG
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
