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

// Generous payload limit for high-resolution image uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

const GEMMA_MODEL = 'gemma-4-26b-a4b-it';

// Server-side GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface AnalysisResponseData {
  image_summary: string;
  important_details: string[];
  explanation: string;
  next_steps: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  uncertainties: string[];
  follow_up_question: string;
  model_used: string;
  mode: string;
  timestamp: string;
}

// Mode-specific instructions ensuring strict image grounding
const MODE_INSTRUCTIONS: Record<string, string> = {
  explain_screen: `Mode: "Explain this screen".
Goal: Understand an unfamiliar interface, dialog, dashboard, or software notice.
Focus: Identify the main application context, active window/dialog, prominent controls or notifications, and explain what the screen represents in clear plain language. Provide safe navigational or configuration next steps.`,

  fix_error: `Mode: "Fix this error".
Goal: Explain a software error screenshot or terminal crash in beginner-friendly language and suggest safe troubleshooting steps.
Focus: Quote the exact error message or stack trace lines visible. Explain the immediate cause without inventing missing code. Outline safe, ordered diagnostic commands or checks. Do not hallucinate file paths or root causes not evident in the image.`,

  extract_tasks: `Mode: "Turn this into tasks".
Goal: Read an assignment brief, event announcement, project requirement document, or message and extract concrete action items.
Focus: Extract visible deliverables, stated deadlines, guidelines, and turn them into prioritized, discrete actionable checklist items. Note any missing constraints under uncertainties.`,

  understand_notes: `Mode: "Understand these notes".
Goal: Explain a study slide, textbook section, whiteboard drawing, or photographed handwritten notes.
Focus: Decipher visible terminology, formulas, conceptual diagrams, and relationships. Explain the core ideas in logical order and build an active recall / study checklist.`
};

app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ready',
    model: GEMMA_MODEL,
    hasApiKey: !!process.env.GEMINI_API_KEY,
    modeList: [
      { id: 'explain_screen', title: 'Explain this screen', desc: 'Interface, notice, or screenshot' },
      { id: 'fix_error', title: 'Fix this error', desc: 'Software error or terminal crash' },
      { id: 'extract_tasks', title: 'Turn this into tasks', desc: 'Assignment brief, requirements, or event' },
      { id: 'understand_notes', title: 'Understand these notes', desc: 'Study notes, slides, or diagram' },
    ],
  });
});

app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType, mode = 'explain_screen', userQuestion = '' } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Image data is required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in server environment.',
        model: GEMMA_MODEL,
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

    const systemInstruction = `You are ClarityLens, an intelligent multimodal analysis engine powered exclusively by Gemma 4 (${GEMMA_MODEL}).
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
      "priority": "high" // or "medium" or "low"
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

    // Call Gemma 4
    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    if (!rawText.trim()) {
      throw new Error('Gemma 4 returned an empty response.');
    }

    // Parse JSON safely
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Try stripping markdown fences if present
      const cleaned = rawText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*$/gi, '')
        .trim();
      parsed = JSON.parse(cleaned);
    }

    // Format & validate fields
    const formattedData: AnalysisResponseData = {
      image_summary: typeof parsed.image_summary === 'string'
        ? parsed.image_summary
        : 'Analysis completed of the provided visual artifact.',
      important_details: Array.isArray(parsed.important_details)
        ? parsed.important_details.map((d: any) => String(d))
        : [],
      explanation: typeof parsed.explanation === 'string'
        ? parsed.explanation
        : 'Gemma 4 analyzed the visible contents and identified key characteristics.',
      next_steps: Array.isArray(parsed.next_steps)
        ? parsed.next_steps.map((step: any, idx: number) => ({
            id: String(step.id || `step-${idx + 1}`),
            title: String(step.title || `Step ${idx + 1}`),
            description: String(step.description || ''),
            priority: ['high', 'medium', 'low'].includes(step.priority)
              ? step.priority
              : 'medium',
          }))
        : [],
      uncertainties: Array.isArray(parsed.uncertainties)
        ? parsed.uncertainties.map((u: any) => String(u))
        : [],
      follow_up_question: typeof parsed.follow_up_question === 'string'
        ? parsed.follow_up_question
        : 'Would you like to explore alternative resolutions or clarify any specific detail?',
      model_used: GEMMA_MODEL,
      mode,
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: formattedData,
    });
  } catch (error: any) {
    console.error('ClarityLens Gemma 4 analysis error:', error);
    const errorMessage = error?.message || 'Failed to process visual analysis with Gemma 4.';
    res.status(500).json({
      error: errorMessage,
      model: GEMMA_MODEL,
      status: 'error',
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
    console.log(`ClarityLens server running on http://0.0.0.0:${PORT} [Model: ${GEMMA_MODEL}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
