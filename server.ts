import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Generous payload limit for high-resolution image uploads and SVG Data URLs
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ limit: '35mb', extended: true }));

const DEFAULT_GEMMA_MODEL = 'gemma-4-26b-a4b-it';
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

/**
 * Helper to obtain a GoogleGenAI client with dynamic key resolution.
 * Supports environment GEMINI_API_KEY as well as optional request-level header/body keys.
 */
function getAiClient(customKey?: string): GoogleGenAI | null {
  const apiKey = (customKey || process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'claritylens-app',
      },
    },
  });
}

// Mode-specific instructions ensuring strict image grounding
const MODE_INSTRUCTIONS: Record<string, string> = {
  explain_screen: `Mode: "Explain this screen".
Goal: Understand an unfamiliar interface, dialog, dashboard, or software notice.
Focus: Identify the main application context, active window/dialog, prominent controls or notifications, and explain what the screen represents in clear plain language. Provide safe navigational or configuration next steps.`,

  fix_error: `Mode: "Fix this error".
Goal: Explain a software error screenshot or terminal crash in beginner-friendly language and suggest safe troubleshooting steps.
Focus: Quote the exact error message or stack trace lines visible. Explain the immediate cause without inventing missing code. Outline safe, ordered diagnostic commands or checks. If a CLI command or fix applies, provide it in the codeSnippet field.`,

  extract_tasks: `Mode: "Turn this into tasks".
Goal: Read an assignment brief, event announcement, project requirement document, or message and extract concrete action items.
Focus: Extract visible deliverables, stated deadlines, guidelines, and turn them into prioritized, discrete actionable checklist items. Note any missing constraints under uncertainties.`,

  understand_notes: `Mode: "Understand these notes".
Goal: Explain a study slide, textbook section, whiteboard drawing, or photographed handwritten notes.
Focus: Decipher visible terminology, formulas, conceptual diagrams, and relationships. Explain the core ideas in logical order and build an active recall / study checklist.`
};

/**
 * Safely parse JSON from LLM output, stripping Markdown code fences and trailing commas
 */
function cleanAndParseJson(rawText: string): any {
  let cleaned = rawText.trim();

  // Strip code blocks
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z0-9]*\s*/, '').replace(/\s*```$/, '');
  }

  // Attempt standard parse first
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Attempt relaxed regex extraction of the JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // Remove trailing commas before closing braces/brackets
        const sanitized = jsonMatch[0]
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/[\u0000-\u001F]+/g, ' ');
        return JSON.parse(sanitized);
      }
    }
    throw initialErr;
  }
}

/**
 * Extract executable code snippet or command from a step text if present
 */
function extractCommandOrSnippet(step: any): string | undefined {
  if (step.codeSnippet && typeof step.codeSnippet === 'string') {
    return step.codeSnippet.trim();
  }
  const combined = `${step.title || ''} ${step.description || ''}`;
  const codeRegex = /`([^`]+)`/;
  const match = combined.match(codeRegex);
  if (match && (match[1].startsWith('npm ') || match[1].startsWith('yarn ') || match[1].startsWith('pnpm ') || match[1].startsWith('git ') || match[1].startsWith('npx ') || match[1].startsWith('docker ') || match[1].startsWith('gcloud ') || match[1].startsWith('kubectl '))) {
    return match[1];
  }
  return undefined;
}

// System status & healthcheck endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  const hasEnvKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
  res.json({
    status: 'ready',
    primaryModel: DEFAULT_GEMMA_MODEL,
    fallbackModels: FALLBACK_MODELS,
    hasApiKey: hasEnvKey,
    version: '1.0.0',
    capabilities: [
      'multimodal-vision-grounding',
      'interactive-followup-chat',
      'clipboard-paste-ingestion',
      'multi-format-export',
      'interactive-checklist'
    ],
    modeList: [
      { id: 'explain_screen', title: 'Explain this screen', desc: 'Interface, notice, or screenshot' },
      { id: 'fix_error', title: 'Fix this error', desc: 'Software error or terminal crash' },
      { id: 'extract_tasks', title: 'Turn this into tasks', desc: 'Assignment brief, requirements, or event' },
      { id: 'understand_notes', title: 'Understand these notes', desc: 'Study notes, slides, or diagram' },
    ],
  });
});

// Primary Multimodal Visual Analysis Endpoint
app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const {
      imageBase64,
      mimeType,
      mode = 'explain_screen',
      userQuestion = '',
      requestedModel,
      apiKey: clientKey,
    } = req.body;

    const requestHeaderKey = req.headers['x-gemini-api-key'] as string | undefined;
    const ai = getAiClient(clientKey || requestHeaderKey);

    if (!imageBase64) {
      res.status(400).json({ error: 'Image data is required.' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'No Gemini/Gemma API key configured. Provide an API key via environment or settings.',
        primaryModel: DEFAULT_GEMMA_MODEL,
      });
      return;
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
    const cleanMimeType = (mimeType && mimeType.startsWith('image/')) ? mimeType : 'image/png';

    const modePrompt = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.explain_screen;
    const additionalQuestion = userQuestion.trim()
      ? `User's specific question: "${userQuestion.trim()}"`
      : 'The user has not added a specific question; provide a thorough grounded analysis for this mode.';

    const systemInstruction = `You are ClarityLens, an intelligent multimodal analysis engine powered by Gemma 4 (${DEFAULT_GEMMA_MODEL}).
Your mission is: "See the problem. Find the next step."

CRITICAL GROUNDING & ACCURACY RULES:
1. Rely ONLY on visible contents of the image. Do NOT invent text, file paths, error codes, or UI controls that are not clearly visible.
2. If text or handwriting is blurry, small, or partially cut off, report it in "uncertainties" rather than guessing.
3. Tailor your response strictly to the chosen mode.
4. Output MUST be valid, parseable JSON matching the exact schema requested below. Do not wrap with conversational filler outside the JSON.

SCHEMA:
{
  "image_summary": "1-2 sentences summarizing what is shown in the image.",
  "important_details": [
    "Exact visible text, error message, UI component, date/time, or requirement found in the image",
    "Another distinct visible element"
  ],
  "explanation": "Clear, articulate explanation of what is going on, tailored to the selected mode (3-5 sentences).",
  "next_steps": [
    {
      "id": "step-1",
      "title": "Short imperative action title (e.g. Verify peer dependency version)",
      "description": "Concrete explanation of how to carry out this action safely.",
      "priority": "high", // or "medium" or "low"
      "category": "remediation", // "immediate" | "diagnostic" | "remediation" | "verification"
      "codeSnippet": "optional CLI command or code snippet, e.g. npm install --legacy-peer-deps"
    }
  ],
  "uncertainties": [
    "Context not visible in the screenshot, or details that cannot be confirmed without user input."
  ],
  "follow_up_question": "One practical question the user could ask or check to proceed."
}`;

    const promptText = `${modePrompt}

${additionalQuestion}

Analyze the provided image in detail and produce the structured JSON analysis following the schema exactly.`;

    const imagePart = {
      inlineData: {
        mimeType: cleanMimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    // Determine target model with graceful fallback
    const targetModel = requestedModel || DEFAULT_GEMMA_MODEL;
    let response: any = null;
    let actualModelUsed = targetModel;
    let fallbackUsed = false;

    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: {
          parts: [imagePart, textPart],
        },
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });
    } catch (primaryError: any) {
      console.warn(`Primary model call to ${targetModel} encountered notice:`, primaryError?.message || primaryError);
      
      // If primary model failed (e.g. 404 not found or unsupported model identifier on this key), try fallback
      if (targetModel !== 'gemini-2.5-flash') {
        try {
          console.log('Attempting fallback to gemini-2.5-flash for visual continuity...');
          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
              parts: [imagePart, textPart],
            },
            config: {
              systemInstruction,
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          });
          actualModelUsed = 'gemini-2.5-flash';
          fallbackUsed = true;
        } catch (fallbackError: any) {
          // If 2.5-flash failed, attempt 2.0-flash
          console.log('Attempting second fallback to gemini-2.0-flash...');
          response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: {
              parts: [imagePart, textPart],
            },
            config: {
              systemInstruction,
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          });
          actualModelUsed = 'gemini-2.0-flash';
          fallbackUsed = true;
        }
      } else {
        throw primaryError;
      }
    }

    const rawText = response.text || '';
    if (!rawText.trim()) {
      throw new Error('Multimodal model returned an empty response.');
    }

    const parsed = cleanAndParseJson(rawText);
    const latencyMs = Date.now() - startTime;

    // Format & validate fields
    const formattedData = {
      id: `analysis-${Date.now()}`,
      image_summary: typeof parsed.image_summary === 'string'
        ? parsed.image_summary
        : 'Analysis completed of the provided visual artifact.',
      important_details: Array.isArray(parsed.important_details)
        ? parsed.important_details.map((d: any) => String(d))
        : [],
      explanation: typeof parsed.explanation === 'string'
        ? parsed.explanation
        : 'The model analyzed the visible contents and identified key characteristics.',
      next_steps: Array.isArray(parsed.next_steps)
        ? parsed.next_steps.map((step: any, idx: number) => ({
            id: String(step.id || `step-${idx + 1}`),
            title: String(step.title || `Step ${idx + 1}`),
            description: String(step.description || ''),
            priority: ['high', 'medium', 'low'].includes(step.priority)
              ? step.priority
              : 'medium',
            category: ['immediate', 'diagnostic', 'remediation', 'verification'].includes(step.category)
              ? step.category
              : 'remediation',
            codeSnippet: extractCommandOrSnippet(step),
            completed: false,
          }))
        : [],
      uncertainties: Array.isArray(parsed.uncertainties)
        ? parsed.uncertainties.map((u: any) => String(u))
        : [],
      follow_up_question: typeof parsed.follow_up_question === 'string'
        ? parsed.follow_up_question
        : 'Would you like to explore alternative resolutions or clarify any specific detail?',
      model_used: actualModelUsed,
      mode,
      timestamp: new Date().toISOString(),
      latencyMs,
      fallbackUsed,
    };

    res.json({
      success: true,
      data: formattedData,
    });
  } catch (error: any) {
    console.error('ClarityLens visual analysis error:', error);
    const errorMessage = error?.message || 'Failed to process visual analysis with multimodal model.';
    res.status(500).json({
      error: errorMessage,
      model: DEFAULT_GEMMA_MODEL,
      status: 'error',
    });
  }
});

// Follow-up Chat Q&A Endpoint
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      imageBase64,
      mimeType,
      mode = 'explain_screen',
      history = [],
      message,
      analysisSummary,
      requestedModel,
      apiKey: clientKey,
    } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const requestHeaderKey = req.headers['x-gemini-api-key'] as string | undefined;
    const ai = getAiClient(clientKey || requestHeaderKey);

    if (!ai) {
      res.status(503).json({ error: 'No Gemini/Gemma API key configured.' });
      return;
    }

    const cleanBase64 = (imageBase64 || '').replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
    const cleanMimeType = (mimeType && mimeType.startsWith('image/')) ? mimeType : 'image/png';

    const systemInstruction = `You are ClarityLens Assistant, directly analyzing the user's uploaded image and previous visual analysis report.
Maintain conversational continuity and provide accurate, direct, well-grounded answers.
Use Markdown formatting: bold headings, backticks for commands/code, and bullet points where helpful.
If you suggest terminal commands or code, format them in clear code blocks.`;

    const parts: any[] = [];

    // Attach image if provided
    if (cleanBase64) {
      parts.push({
        inlineData: {
          mimeType: cleanMimeType,
          data: cleanBase64,
        },
      });
    }

    // Build context
    let promptContext = `Analysis Mode: ${mode}\n`;
    if (analysisSummary) {
      promptContext += `Initial Analysis Summary: ${analysisSummary}\n\n`;
    }

    if (Array.isArray(history) && history.length > 0) {
      promptContext += 'Conversation History:\n';
      history.slice(-6).forEach((h: any) => {
        promptContext += `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}\n`;
      });
      promptContext += '\n';
    }

    promptContext += `User Question: "${message.trim()}"\n\nProvide a helpful, precise, grounded answer.`;

    parts.push({ text: promptContext });

    const targetModel = requestedModel || DEFAULT_GEMMA_MODEL;
    let response: any = null;
    let actualModelUsed = targetModel;

    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: { parts },
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });
    } catch (primaryErr: any) {
      console.warn(`Chat model call fallback for ${targetModel}:`, primaryErr?.message || primaryErr);
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });
      actualModelUsed = 'gemini-2.5-flash';
    }

    const reply = response.text || 'I analyzed your request but could not produce a response.';

    res.json({
      success: true,
      reply,
      modelUsed: actualModelUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (chatError: any) {
    console.error('ClarityLens chat error:', chatError);
    res.status(500).json({
      error: chatError?.message || 'Failed to process follow-up chat.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ClarityLens server running on http://0.0.0.0:${PORT} [Primary: ${DEFAULT_GEMMA_MODEL}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
