'use client';

import React from 'react';
import {
  BrainCircuit,
  Globe,
  Smartphone,
  Server,
  ShieldAlert,
  Gamepad2,
  Terminal,
  Coins,
  Cpu,
  Music,
  Shuffle,
  Layers,
  LucideProps,
} from 'lucide-react';
import { DomainFilter } from '@/types/project';

interface DomainIconProps extends LucideProps {
  domain: DomainFilter;
}

export const DomainIcon: React.FC<DomainIconProps> = ({ domain, ...props }) => {
  switch (domain) {
    case 'ai-ml':
      return <BrainCircuit {...props} />;
    case 'web-fullstack':
      return <Globe {...props} />;
    case 'mobile-apps':
      return <Smartphone {...props} />;
    case 'devops-cloud':
      return <Server {...props} />;
    case 'cybersecurity':
      return <ShieldAlert {...props} />;
    case 'gamedev':
      return <Gamepad2 {...props} />;
    case 'devtools-cli':
      return <Terminal {...props} />;
    case 'fintech':
      return <Coins {...props} />;
    case 'iot-hardware':
      return <Cpu {...props} />;
    case 'creative-audio-media':
      return <Music {...props} />;
    case 'all':
      return <Shuffle {...props} />;
    default:
      return <Layers {...props} />;
  }
};
