export type DomainId =
  | 'ai-ml'
  | 'web-fullstack'
  | 'mobile-apps'
  | 'devops-cloud'
  | 'cybersecurity'
  | 'gamedev'
  | 'devtools-cli'
  | 'fintech'
  | 'iot-hardware'
  | 'creative-audio-media';

export type DomainFilter = DomainId | 'all';

export type Complexity = 'quick-hack' | 'weekend-project' | 'deep-dive';

export type ComplexityFilter = Complexity | 'all';

export type ProjectStatus = 'idea' | 'in-progress' | 'completed';

export interface DomainInfo {
  id: DomainId;
  name: string;
  description: string;
  iconName: string;
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  tagline: string;
  domain: DomainId;
  complexity: Complexity;
  problem: string;
  features: string[];
  suggestedStack: string[];
  tips?: string;
}

export interface UserProject {
  id: string;
  title: string;
  tagline: string;
  domain: DomainId;
  complexity: Complexity;
  problem?: string;
  features?: string[];
  suggestedStack?: string[];
  status: ProjectStatus;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  isCustom?: boolean;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  totalProjects: number;
  projects: UserProject[];
}
