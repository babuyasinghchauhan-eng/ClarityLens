export type AnalysisMode =
  | 'explain_screen'
  | 'fix_error'
  | 'extract_tasks'
  | 'understand_notes';

export interface NextStepItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

export interface AnalysisResult {
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
