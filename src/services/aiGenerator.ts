import { ProjectIdea, DomainId, DomainFilter, Complexity, ComplexityFilter } from '@/types/project';

export type AiProvider = 'gemini' | 'openai' | 'lmstudio' | 'ollama';

export interface AiConfig {
  provider: AiProvider;
  geminiKey?: string;
  openaiKey?: string;
  lmStudioEndpoint?: string;
  lmStudioModel?: string;
  ollamaEndpoint?: string;
  ollamaModel?: string;
}

export const DEFAULT_AI_CONFIG: AiConfig = {
  provider: 'gemini',
  geminiKey: '',
  openaiKey: '',
  lmStudioEndpoint: 'http://localhost:1234',
  lmStudioModel: '',
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

async function universalFetch(
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string } = {}
): Promise<Response> {
  try {
    const directRes = await fetch(url, {
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body,
    });
    return directRes;
  } catch (directErr) {
    // If browser blocks fetch (e.g. Chrome Private Network Access / CORS restrictions on 127.0.0.1),
    // fallback automatically to local Next.js server proxy route
    try {
      let parsedBody: unknown = undefined;
      if (options.body) {
        try {
          parsedBody = JSON.parse(options.body);
        } catch {
          parsedBody = options.body;
        }
      }

      const proxyRes = await fetch('/api/ai-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          method: options.method || 'GET',
          headers: options.headers || {},
          body: parsedBody,
        }),
      });
      return proxyRes;
    } catch {
      throw directErr;
    }
  }
}

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

  // 1. Google Gemini (Cloud)
  if (config.provider === 'gemini') {
    if (!config.geminiKey?.trim()) {
      throw new Error('Google Gemini API key is missing. Please configure your API key in AI Settings.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiKey.trim()}`;
    const res = await universalFetch(endpoint, {
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

  // 2. OpenAI (Cloud)
  if (config.provider === 'openai') {
    if (!config.openaiKey?.trim()) {
      throw new Error('OpenAI API key is missing. Please configure your API key in AI Settings.');
    }

    const res = await universalFetch('https://api.openai.com/v1/chat/completions', {
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

  // 3. LM Studio (Local Machine - Supports both REST API v1 and OpenAI-compatible endpoints)
  if (config.provider === 'lmstudio') {
    const rawEndpoint = (config.lmStudioEndpoint?.trim() || 'http://localhost:1234').replace(/\/$/, '');
    const model = config.lmStudioModel?.trim() || undefined;

    // Build candidate endpoints: OpenAI-compatible (/v1/chat/completions) & LM Studio Native REST API (/api/v1/chat)
    let candidateEndpoints: string[] = [];
    if (rawEndpoint.endsWith('/chat/completions') || rawEndpoint.endsWith('/api/v1/chat')) {
      candidateEndpoints = [rawEndpoint];
    } else if (rawEndpoint.endsWith('/v1')) {
      candidateEndpoints = [`${rawEndpoint}/chat/completions`, `${rawEndpoint.replace(/\/v1$/, '')}/api/v1/chat`];
    } else if (rawEndpoint.endsWith('/api/v1')) {
      candidateEndpoints = [`${rawEndpoint}/chat`, `${rawEndpoint.replace(/\/api\/v1$/, '')}/v1/chat/completions`];
    } else {
      candidateEndpoints = [
        `${rawEndpoint}/v1/chat/completions`,
        `${rawEndpoint}/api/v1/chat`,
      ];
    }

    let lastError: Error | null = null;
    let rawText: string | undefined = undefined;

    for (const endpoint of candidateEndpoints) {
      try {
        const isNativeApi = endpoint.includes('/api/v1/chat');
        const payload = isNativeApi
          ? {
              ...(model ? { model } : {}),
              input: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
              temperature: 0.7,
            }
          : {
              ...(model ? { model } : {}),
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt },
              ],
              temperature: 0.7,
            };

        const res = await universalFetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (res.status === 404 && candidateEndpoints.length > 1) {
          continue;
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.error?.message ||
            err.message ||
            `LM Studio returned HTTP status ${res.status}. Verify a model is loaded in LM Studio.`
          );
        }

        const data = await res.json();
        
        // Extract message from LM Studio REST API v1 or OpenAI format
        if (Array.isArray(data.output)) {
          const msgObj = data.output.find((o: { type?: string; content?: string }) => o.type === 'message') || data.output[data.output.length - 1];
          rawText = msgObj?.content;
        } else {
          rawText =
            data.choices?.[0]?.message?.content ||
            data.message?.content ||
            (Array.isArray(data.content) ? data.content[0]?.text : typeof data.content === 'string' ? data.content : undefined) ||
            data.output ||
            data.response;
        }

        if (rawText) break;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    if (!rawText) {
      if (lastError) {
        throw new Error(
          `Could not connect to LM Studio at "${rawEndpoint}". Please ensure LM Studio Local Server is running (port 1234). Details: ${lastError.message}`
        );
      }
      throw new Error('LM Studio returned an empty response. Verify your loaded model is ready.');
    }

    return parseAiResponse(rawText);
  }

  // 4. Ollama (Local Machine)
  if (config.provider === 'ollama') {
    const endpoint = (config.ollamaEndpoint?.trim() || 'http://localhost:11434').replace(/\/$/, '');
    const model = config.ollamaModel?.trim() || 'llama3';

    let res: Response;
    try {
      res = await universalFetch(`${endpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
          stream: false,
          format: 'json',
        }),
      });
    } catch {
      throw new Error(
        `Could not connect to Ollama at "${endpoint}". Please ensure Ollama is running on your machine.`
      );
    }

    if (!res.ok) {
      throw new Error(`Ollama connection failed at ${endpoint} (Status: ${res.status}). Ensure Ollama is running with model "${model}".`);
    }

    const data = await res.json();
    if (!data.response) throw new Error('Ollama returned an empty response.');

    return parseAiResponse(data.response);
  }

  throw new Error('Unsupported AI provider configured.');
}

function parseAiResponse(text: string): ProjectIdea {
  try {
    // 1. Strip reasoning blocks from models like Qwen 3.5, DeepSeek R1 (<think>...</think>)
    let cleanText = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    
    // 2. Strip markdown code blocks
    cleanText = cleanText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();

    // 3. Find first JSON object boundary
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }

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
  } catch {
    throw new Error('Failed to parse AI output into valid specification schema. Please retry.');
  }
}

export interface LmStudioModelInfo {
  id: string;
  name?: string;
  isLoaded?: boolean;
}

/**
 * Discovers loaded / available models from LM Studio using REST API v1 or OpenAI-compatible endpoints.
 */
export async function fetchLmStudioModels(rawUrl = 'http://localhost:1234'): Promise<LmStudioModelInfo[]> {
  const base = rawUrl.trim().replace(/\/$/, '').replace(/\/api\/v1$/, '').replace(/\/v1$/, '');
  const candidateUrls = [
    `${base}/api/v1/models`, // LM Studio Native REST API v1
    `${base}/v1/models`,     // OpenAI-compatible
  ];

  let lastError: unknown = null;
  for (const url of candidateUrls) {
    try {
      const res = await universalFetch(url);
      if (!res.ok) continue;
      const data = await res.json();

      // REST API v1 format: { models: [ { key, display_name, loaded_instances } ] }
      if (Array.isArray(data.models)) {
        return data.models.map((m: { id?: string; name?: string; key?: string; display_name?: string; is_loaded?: boolean; loaded?: boolean; loaded_instances?: unknown[] }) => ({
          id: m.key || m.id || m.name || 'unknown',
          name: m.display_name || m.name || m.key || m.id,
          isLoaded: (Array.isArray(m.loaded_instances) && m.loaded_instances.length > 0) || m.is_loaded || m.loaded || false,
        }));
      }

      // OpenAI format: { data: [ { id: "..." } ] }
      if (Array.isArray(data.data)) {
        return data.data.map((m: { id: string }) => ({
          id: m.id,
          name: m.id,
          isLoaded: true,
        }));
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    `Could not query LM Studio at "${base}". Make sure LM Studio Local Server is running (Status: Running) on port 1234.`
  );
}
