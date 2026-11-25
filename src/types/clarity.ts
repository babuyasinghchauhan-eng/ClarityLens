export type AnalysisMode =
  | 'explain_screen'
  | 'fix_error'
  | 'extract_tasks'
  | 'understand_notes';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface NextStepItem {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  completed?: boolean;
  codeSnippet?: string;
  category?: 'immediate' | 'diagnostic' | 'remediation' | 'verification';
}

export interface AnalysisResult {
  id?: string;
  image_summary: string;
  important_details: string[];
  explanation: string;
  next_steps: NextStepItem[];
  uncertainties: string[];
  follow_up_question: string;
  model_used: string;
  mode: AnalysisMode;
  timestamp: string;
  isDemoSample?: boolean;
  latencyMs?: number;
  fallbackUsed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  title: string;
  mode: AnalysisMode;
  thumbnailDataUrl: string;
  result: AnalysisResult;
  chatMessages: ChatMessage[];
  userQuestion?: string;
}

export interface SampleScenario {
  id: string;
  title: string;
  mode: AnalysisMode;
  badge: string;
  tagline: string;
  previewPrompt: string;
  defaultQuestion: string;
  imageDataUrl: string;
  demonstrationResult: AnalysisResult;
}

export type InferenceStatus =
  | 'ready'
  | 'analyzing'
  | 'complete'
  | 'error'
  | 'demo';

export interface ModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  isGemma: boolean;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemma-4-26b-a4b-it',
    name: 'Gemma 4 (26B Vision-Language)',
    badge: 'Challenge Target',
    description: 'Native multimodal open-weights transformer optimized for strict grounding.',
    isGemma: true,
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Ultra Fast Fallback',
    description: 'High-speed multimodal reasoning fallback for low-latency visual analysis.',
    isGemma: false,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    badge: 'High Reliability',
    description: 'General multimodal fallback when primary quota is constrained.',
    isGemma: false,
  },
];
