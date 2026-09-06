'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProject, ProjectStatus, BackupData, DomainId, Complexity } from '@/types/project';

const STORAGE_KEY = 'random_project_selector_data_v1';

const INITIAL_PROJECTS: UserProject[] = [
  {
    id: 'starter-1',
    title: 'SelfDestruct.link: Secret Message Vault',
    tagline: 'Client-side AES-256 encrypted pastebin where links self-destruct immediately after first read',
    domain: 'web-fullstack',
    complexity: 'quick-hack',
    status: 'in-progress',
    problem: 'Sending API keys or credentials over chat leaves permanent logs in history.',
    features: [
      'Client-side AES-GCM encryption in browser',
      'Encryption key stored in URL #hash only',
      'Burn on read with instant key purge',
    ],
    suggestedStack: ['Next.js', 'Web Crypto API', 'Tailwind CSS'],
    notes: 'Working on client-side Web Crypto AES-GCM wrapper.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'starter-2',
    title: 'VoicePersona Sandbox',
    tagline: 'Local LLM & TTS interactive persona debate simulator',
    domain: 'ai-ml',
    complexity: 'weekend-project',
    status: 'idea',
    problem: 'Visualizing multi-agent debates with realistic voice personas locally is tricky.',
    features: [
      'Dual LLM persona config',
      'Turn-based speech synthesis',
      'Live topic steer prompt',
    ],
    suggestedStack: ['Next.js', 'Web Speech API', 'Ollama API', 'Framer Motion'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'starter-3',
    title: 'AtomicGrid: Minimalist Habit Matrix',
    tagline: 'Fast, gesture-driven daily habit tracker with annual contribution heatmaps',
    domain: 'mobile-apps',
    complexity: 'quick-hack',
    status: 'completed',
    problem: 'Most habit apps are bloated with subscriptions and mandatory cloud sync.',
    features: [
      'Swipe gestures with haptics',
      'GitHub-style annual streak grid',
      '100% offline local storage',
    ],
    suggestedStack: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Shipped v1! Deployed to Vercel and configured PWA manifest.',
  },
];

export function useProjects() {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProjects(parsed);
        } else {
          setProjects(INITIAL_PROJECTS);
        }
      } else {
        setProjects(INITIAL_PROJECTS);
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
      setProjects(INITIAL_PROJECTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }, [projects, isLoaded]);

  // Add Project
  const addProject = useCallback(
    (
      newProj: Omit<UserProject, 'id' | 'createdAt'> & { id?: string }
    ): { success: boolean; id: string; message: string } => {
      const id = newProj.id || `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      
      // Check for duplicate title or id
      const exists = projects.some(
        (p) => p.id === id || p.title.toLowerCase() === newProj.title.toLowerCase()
      );

      if (exists) {
        return { success: false, id, message: 'This project is already in your tracker!' };
      }

      const createdProject: UserProject = {
        ...newProj,
        id,
        createdAt: new Date().toISOString(),
        status: newProj.status || 'idea',
      };

      setProjects((prev) => [createdProject, ...prev]);
      return { success: true, id, message: 'Added to your projects!' };
    },
    [projects]
  );

  // Update Status
  const updateProjectStatus = useCallback(
    (id: string, newStatus: ProjectStatus) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              status: newStatus,
              completedAt:
                newStatus === 'completed' ? p.completedAt || new Date().toISOString() : undefined,
            };
          }
          return p;
        })
      );
    },
    []
  );

  // Update Notes
  const updateProjectNotes = useCallback((id: string, notes: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, notes } : p))
    );
  }, []);

  // Delete Project
  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Clear All Projects
  const clearAllProjects = useCallback(() => {
    setProjects([]);
  }, []);

  // Reset to default sample
  const resetToSampleData = useCallback(() => {
    setProjects(INITIAL_PROJECTS);
  }, []);

  // Export JSON Backup
  const exportBackup = useCallback(() => {
    const backup: BackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      totalProjects: projects.length,
      projects,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStamp = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `project-selector-backup-${dateStamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [projects]);

  // Import JSON Backup
  const importBackup = useCallback(
    (jsonString: string): { success: boolean; count: number; error?: string } => {
      try {
        const parsed = JSON.parse(jsonString);
        let importedList: UserProject[] = [];

        if (Array.isArray(parsed)) {
          importedList = parsed;
        } else if (parsed && Array.isArray(parsed.projects)) {
          importedList = parsed.projects;
        } else {
          return { success: false, count: 0, error: 'Invalid backup file format.' };
        }

        // Validate basic project structure
        const validatedList = importedList.filter(
          (p) => p && typeof p.title === 'string' && typeof p.domain === 'string'
        ).map((p) => ({
          ...p,
          id: p.id || `restored-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          status: p.status || 'idea',
          createdAt: p.createdAt || new Date().toISOString(),
          complexity: p.complexity || 'weekend-project',
          tagline: p.tagline || '',
        })) as UserProject[];

        if (validatedList.length === 0) {
          return { success: false, count: 0, error: 'No valid project entries found in backup file.' };
        }

        setProjects(validatedList);
        return { success: true, count: validatedList.length };
      } catch (err) {
        return { success: false, count: 0, error: 'Failed to parse JSON file. Please ensure it is valid.' };
      }
    },
    []
  );

  // Helper stats
  const stats = {
    total: projects.length,
    ideas: projects.filter((p) => p.status === 'idea').length,
    inProgress: projects.filter((p) => p.status === 'in-progress').length,
    completed: projects.filter((p) => p.status === 'completed').length,
  };

  return {
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
  };
}
