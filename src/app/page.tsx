'use client';

import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { IdeaRoulette } from '@/components/generator/IdeaRoulette';
import { ProjectList } from '@/components/tracker/ProjectList';
import { AddProjectModal } from '@/components/tracker/AddProjectModal';
import { BackupModal } from '@/components/backup/BackupModal';
import { CookieBanner } from '@/components/legal/CookieBanner';
import { TermsModal } from '@/components/legal/TermsModal';
import { PrivacyModal } from '@/components/legal/PrivacyModal';
import { CookiePolicyModal } from '@/components/legal/CookiePolicyModal';

export default function HomePage() {
  const {
    projects,
    isLoaded,
    stats,
    addProject,
    updateProjectStatus,
    updateProjectNotes,
    deleteProject,
    clearAllProjects,
    resetToSampleData,
    exportBackup,
    importBackup,
  } = useProjects();

  const {
    isBannerVisible,
    acceptConsent,
    declineConsent,
  } = useCookieConsent();

  // Active view on mobile & desktop
  const [activeTab, setActiveTab] = useState<'generator' | 'projects'>('generator');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCookiePolicyModalOpen, setIsCookiePolicyModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden bg-[#0A0A0C]">
      {/* Subtle Gold Ambient Gradient Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#C9A76C]/[0.05] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#C9A76C]/[0.03] rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Main Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        stats={stats}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenAddProject={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area with uniform max-width to eliminate width jumping */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Loading Skeleton */}
        {!isLoaded ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#9CA3AF]">
            <div className="w-8 h-8 border-2 border-[#C9A76C] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono">// INITIALIZING_SYSTEM_ORACLE...</p>
          </div>
        ) : (
          <div className="w-full">
            <div className={activeTab === 'generator' ? 'block' : 'hidden'}>
              <IdeaRoulette
                onAddProject={addProject}
                existingProjects={projects}
              />
            </div>

            <div className={activeTab === 'projects' ? 'block' : 'hidden'}>
              <ProjectList
                projects={projects}
                onUpdateStatus={updateProjectStatus}
                onUpdateNotes={updateProjectNotes}
                onDeleteProject={deleteProject}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onSwitchToGenerator={() => setActiveTab('generator')}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenCookiePolicy={() => setIsCookiePolicyModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* Modals */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProject={addProject}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        projects={projects}
        onExportBackup={exportBackup}
        onImportBackup={importBackup}
        onClearAll={clearAllProjects}
        onResetSample={resetToSampleData}
      />

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <CookiePolicyModal
        isOpen={isCookiePolicyModalOpen}
        onClose={() => setIsCookiePolicyModalOpen(false)}
      />

      {/* Cookie & Storage Consent Banner */}
      <CookieBanner
        isVisible={isBannerVisible}
        onAccept={acceptConsent}
        onDecline={declineConsent}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenCookiePolicy={() => setIsCookiePolicyModalOpen(true)}
      />
    </div>
  );
}
