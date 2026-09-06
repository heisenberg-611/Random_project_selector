import { ProjectIdea, DomainId, DomainFilter, Complexity, ComplexityFilter } from '@/types/project';

export type AiProvider = 'gemini' | 'openai' | 'ollama';

export interface AiConfig {
  provider: AiProvider;
  geminiKey?: string;
  openaiKey?: string;
  ollamaEndpoint?: string;
  ollamaModel?: string;
}

export const DEFAULT_AI_CONFIG: AiConfig = {
  provider: 'gemini',
  geminiKey: '',
  openaiKey: '',
  ollamaEndpoint: 'http://localhost:11434',
  ollamaModel: 'llama3',
};

const SYSTEM_PROMPT = `You are a Principal Software Architect and elite Creative Tech Lead. 
Your task is to generate a groundbreaking, highly practical, and technically inspiring software project specification for a developer.
Respond ONLY with a valid raw JSON object (without markdown code blocks, backticks, or other text) strictly adhering to this schema:
{
  "title": "string (Crisp, memorable name with 1-phrase hook, e.g. 'GitTimeMachine: Interactive Commit Visualizer')",
  "tagline": "string (Short 1-sentence elevator pitch starting with what it is and its unique twist)",
  "domain": "string (Must be one of: 'ai-ml', 'web-fullstack', 'mobile-apps', 'devops-cloud', 'cybersecurity', 'gamedev', 'devtools-cli', 'fintech', 'iot-hardware', 'creative-audio-media')",
  "complexity": "string (Must be one of: 'quick-hack', 'weekend-project', 'deep-dive')",
  "problem": "string (Clear 2-3 sentence problem statement describing real pain point or architectural opportunity)",
  "features": [
    "01. First core MVP feature with actionable detail",
    "02. Second core MVP feature",
    "03. Third core MVP feature",
    "04. Fourth core MVP feature"
  ],
  "suggestedStack": [
    "Tech1", "Tech2", "Tech3", "Tech4"
  ],
  "tips": "string (1 actionable pro-tip, architectural heuristic, or key library advice)"
}`;

export async function generateProjectWithAi(
  config: AiConfig,
  params: {
    domain?: DomainFilter;
    complexity?: ComplexityFilter;
    customPrompt?: string;
  }
): Promise<ProjectIdea> {
  const userPrompt = `Generate a unique project idea with these constraints:
- Domain Focus: ${params.domain && params.domain !== 'all' ? params.domain : 'Any tech domain'}
- Scope / Complexity: ${params.complexity && params.complexity !== 'all' ? params.complexity : 'Any scope'}
- User's Custom Inspiration/Trend/Vibe: ${params.customPrompt?.trim() || 'Cutting-edge modern developer utility or high-leverage software prototype'}

Return ONLY valid JSON.`;

  if (config.provider === 'gemini') {
    if (!config.geminiKey?.trim()) {
      throw new Error('Google Gemini API key is missing. Please configure your API key in AI Settings.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiKey.trim()}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API error (Status: ${res.status})`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Gemini returned an empty response.');

    return parseAiResponse(rawText);
  }

  if (config.provider === 'openai') {
    if (!config.openaiKey?.trim()) {
      throw new Error('OpenAI API key is missing. Please configure your API key in AI Settings.');
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openaiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI API error (Status: ${res.status})`);
    }

    const data = await res.json();
    const rawText = data.choices?.[0]?.message?.content;
    if (!rawText) throw new Error('OpenAI returned an empty response.');

    return parseAiResponse(rawText);
  }

  if (config.provider === 'ollama') {
    const endpoint = (config.ollamaEndpoint?.trim() || 'http://localhost:11434').replace(/\/$/, '');
    const model = config.ollamaModel?.trim() || 'llama3';

    const res = await fetch(`${endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
        stream: false,
        format: 'json',
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama connection failed at ${endpoint} (Status: ${res.status}). Ensure Ollama is running.`);
    }

    const data = await res.json();
    if (!data.response) throw new Error('Ollama returned an empty response.');

    return parseAiResponse(data.response);
  }

  throw new Error('Unsupported AI provider configured.');
}

function parseAiResponse(text: string): ProjectIdea {
  try {
    const cleanText = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    return {
      id: `ai-gen-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: parsed.title || 'Untitled AI Generated Project',
      tagline: parsed.tagline || 'Autonomous developer project blueprint',
      domain: (parsed.domain || 'web-fullstack') as DomainId,
      complexity: (parsed.complexity || 'weekend-project') as Complexity,
      problem: parsed.problem || 'Developers need focused, high-leverage software solutions for specialized workflows.',
      features: Array.isArray(parsed.features) ? parsed.features : ['01. Core MVP prototype implementation'],
      suggestedStack: Array.isArray(parsed.suggestedStack) ? parsed.suggestedStack : ['Next.js', 'TypeScript', 'Tailwind CSS'],
      tips: parsed.tips || undefined,
    };
  } catch (err) {
    throw new Error('Failed to parse AI output into valid specification schema. Please retry.');
  }
}
