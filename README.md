# ⚡ DEVSPARK // SYS_ORACLE
> **Autonomous Software Project Matrix & Real-time AI Synthesis Engine for Builders, Hackers, and Engineers.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-C9A76C?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**DevSpark** is an editorial-grade developer companion built to cure developer paralysis and inspire your next high-impact software venture. Whether you need a quick weekend hackathon idea, an in-depth distributed systems blueprint, or an AI agent prototype, DevSpark delivers structured, production-ready specifications with an interactive terminal aesthetic.

Featuring an **offline curated database of 70+ deeply technical specifications** and an **autonomous AI synthesis engine** (supporting Google Gemini, OpenAI, and local Ollama), DevSpark provides instant roadmap architecture, tech stacks, and MVP milestone breakdowns with zero telemetry or backend lock-in.

---

## ✨ Key Features

### 1. 🎲 Curated Offline Matrix (70+ In-Depth Specs)
- **10 Specialized Technical Domains**:
  - `01. WEB_FULLSTACK` (High-concurrency platforms, real-time collaboration, state sync)
  - `02. MOBILE_APPS` (React Native, Flutter, offline-first local SQLite sync engines)
  - `03. AI_MACHINE_LEARNING` (Autonomous agents, vector search, multi-modal RAG pipelines)
  - `04. DEVOPS_CLOUD` (Zero-trust proxies, eBPF telemetry, edge deployment daemons)
  - `05. SYSTEMS_LOW_LEVEL` (Rust/C++ allocators, WebAssembly runtimes, time-series DB engines)
  - `06. GAME_DEV_GRAPHICS` (WebGPU path tracers, procedural voxel sandboxes, ECS engines)
  - `07. EMBEDDED_IOT` (ESP32 mesh networks, Edge AI anomaly detectors, MQTT bridges)
  - `08. BLOCKCHAIN_WEB3` (Zero-knowledge proof verifiers, MPC key signers, optimistic rollups)
  - `09. CYBERSECURITY_INFOSEC` (Automated SAST scanners, honeytoken listeners, canary tokens)
  - `10. DEVELOPER_TOOLS_CLI` (TUI dashboard engines, terminal debuggers, binary compressors)
- **Scope & Complexity Filtering**: Filter between `Weekend Project` (1-2 days), `Medium Project` (1-2 weeks), and `Full SaaS / Product` (1+ months).

---

### 2. 🤖 Autonomous Multi-Provider AI Synthesis Engine
- Connect your own API keys directly from the client to generate infinite, tailored specifications on demand.
- **Supported AI Providers**:
  - **Google Gemini** (Gemini 1.5 Flash / 2.0 Flash) — ultra-fast structured JSON generation.
  - **OpenAI** (GPT-4o / GPT-4o-mini).
  - **Local Ollama** (`http://localhost:11434`) — 100% private, offline, air-gapped local LLMs (Llama 3, Mistral, Qwen, DeepSeek).
- **Custom Prompt / Vibe Bar**: Inject specific constraints (e.g., *"WebAssembly audio synthesizer with zero backend"* or *"Distributed actor framework in Rust"*).

---

### 3. 💻 3D Interactive Code Window
- **Dynamic Multi-Tab Spec Inspector**:
  - `spec.brief`: High-level vision, problem statement, and 4-phase MVP roadmap with blinking gold cursor.
  - `features.json`: Formatted JSON payload with a one-click clipboard copy utility.
  - `stack.config`: Suggested system dependencies, runtime requirements, and automated `npm init` CLI scaffolding command.

---

### 4. 📊 Workspace Project Tracker
- **Bento Stat Counters**: Live KPI indicators for `TOTAL_LOGGED`, `ACTIVE_SPRINTS`, and `SHIPPED_ENTRIES`.
- **Status Workflows**: Seamlessly transition projects between `BACKLOG`, `ACTIVE_SPRINT`, and `SHIPPED`.
- **Confetti Engine**: Interactive celebration triggers upon shipping a project.
- **Search & Multi-Dimensional Filters**: Instant client-side search by title, stack keywords, or sector.
- **Private Notes**: Inline scratchpad for architecture thoughts, repo links, and sprint planning.

---

### 5. 💾 Client-Side Privacy & Full JSON Portability
- **100% LocalStorage Persistence**: Your projects and API keys stay exclusively on your device.
- **Backup & Restore**: Export your entire project portfolio to an encrypted JSON backup file, or restore from an existing backup in one click.
- **Full Legal Compliance**: Built-in cookie/storage consent banner and privacy dialogs.

---

### 6. 🎨 Editorial Cyberpunk Design System
- Built on custom **Champagne Gold (`#C9A76C`)** & **Obsidian Black (`#0A0A0C`)** design tokens.
- Custom typography pairing **Syne** (editorial headings) + **JetBrains Mono** (terminal code).
- Integrated synthesized 8-bit audio feedback with instant toggle.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.18.0 or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/) / [bun](https://bun.sh/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/heisenberg-611/Random_project_selector.git
   cd Random_project_selector
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16.3.4](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Design Tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Celebrations** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Typography** | Google Fonts (`Syne`, `JetBrains Mono`, `Inter`) |
| **AI Providers** | Google Gemini API, OpenAI API, Local Ollama REST API |

---

## 📂 Project Architecture

```
Random_project_selector/
├── src/
│   ├── app/
│   │   ├── globals.css         # Salam Sheikh theme design tokens & utilities
│   │   ├── layout.tsx          # Root layout & SEO metadata
│   │   └── page.tsx            # Main single-page application & tab router
│   ├── components/
│   │   ├── ai/                 # AI configuration modal & provider handlers
│   │   ├── backup/             # JSON backup export & restore dialog
│   │   ├── generator/          # Idea roulette, terminal screen & 3D code window
│   │   ├── legal/              # Cookie consent, terms, and privacy modals
│   │   ├── shared/             # Header, footer, confetti trigger
│   │   ├── tracker/            # Project cards, bento metrics, status filters
│   │   └── ui/                 # Domain icons and UI primitives
│   ├── data/
│   │   ├── curatedIdeas.ts     # 70+ deeply technical offline specifications
│   │   └── domains.ts          # 10 domain sector definitions and colors
│   ├── hooks/
│   │   ├── useCookieConsent.ts # Cookie and storage preference manager
│   │   └── useProjects.ts      # LocalStorage project persistence state hook
│   ├── services/
│   │   └── aiGenerator.ts      # Multi-provider AI generation pipeline
│   ├── types/
│   │   └── project.ts          # TypeScript schemas and data interfaces
│   └── utils/
│       └── soundEffects.ts     # Web Audio API synthesized sound generator
├── package.json
└── README.md
```

---

## 🔒 Privacy & Security

- **Zero Third-Party Telemetry**: DevSpark contains no external tracking scripts or advertising SDKs.
- **Client-Side API Key Storage**: When using the AI synthesis engine, your API keys are stored solely inside your browser's `localStorage` and sent directly to the respective AI provider endpoint.
- **Air-Gapped Local LLM Support**: For maximum security and zero cost, connect DevSpark directly to your local [Ollama](https://ollama.com/) instance at `http://localhost:11434`.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">
  <sub>Built with ⚡ for creators, developers, and engineers worldwide.</sub>
</div>
