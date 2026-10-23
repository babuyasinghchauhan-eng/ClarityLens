# ClarityLens 🔍

> **"See the problem. Find the next step."**

ClarityLens is a multimodal AI product powered by **Gemma 4** (`gemma-4-26b-a4b-it`), built for the **Hacktoberfest Hack Day x Oracle Kolkata** under the **Best Use of Gemma 4** category.

Instead of a generic chatbot or static mockup, ClarityLens uses Gemma 4's native multimodal vision-language weights to directly interpret confusing visual artifacts — software crashes, obscure cloud IAM dialogs, complex hackathon briefs, or handwritten lecture notes — and convert them into grounded explanations and prioritized, actionable next steps.

---

## 🌟 The Core Product

ClarityLens supports four purpose-engineered multimodal intelligence modes:

1. **Explain this screen**: Understand unfamiliar software interfaces, cloud security dialogs, or confusing notices before taking action.
2. **Fix this error**: Parse developer terminal crashes, stack traces, and build errors into beginner-friendly explanations with safe recovery commands.
3. **Turn this into tasks**: Read assignment briefs, project requirements, or event notices and extract discrete deliverables, deadlines, and prioritized checklists.
4. **Understand these notes**: Explain photographed handwritten notes, whiteboard diagrams, or study slides, deciphering mathematical formulas and generating study checklists.

### 🔄 The 7-Step Workflow

1. **Upload or Select Sample**: Upload your own image (PNG, JPEG, WebP, SVG up to 15MB) or choose from 4 pre-seeded realistic scenario samples.
2. **Image Preview**: Verify the image dimensions and context before analysis.
3. **Choose Analysis Mode**: Select from the 4 intelligence modes.
4. **Optional Prompt / Question**: Add a specific question or leave blank for a comprehensive overview.
5. **Analyze with Gemma 4**: Send image pixels and instructions to Gemma 4 via the server-side API proxy.
6. **Review Grounded Output**:
   - **What I see**: Concise scene description.
   - **The important details**: Verbatim extracted error codes, warnings, and elements.
   - **What it means**: Mode-tailored deep analytical explanation.
   - **Your next steps**: Checkable, prioritized action items (High, Medium, Low).
   - **Things to verify**: Explicit uncertainty boundaries and missing context.
   - **Follow-up question**: A proactive question to help you continue.
7. **Copy or Export**: Copy individual sections, copy the full report, or download a clean `.txt` report file.

---

## 🧠 Gemma 4 Model Integration

ClarityLens uses the official Google Gen AI SDK (`@google/genai`) to communicate with:

- **Model Identifier**: `gemma-4-26b-a4b-it`
- **Documentation**: [Google Gen AI — Gemma on Gemini API](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api)
- **Modalities**: Multimodal (Image bytes + Text prompt in, Structured JSON out)
- **Sampling Temperature**: `0.2` (optimized for strict visual grounding and anti-hallucination)

### Server-Side Security Architecture

- **Zero Client Secrets**: The browser client never touches or stores API keys. All calls route through `POST /api/analyze` in `server.ts`.
- **Transparent Inference Status**: The UI displays honest indicators (`Gemma 4 ready`, `Analyzing image with Gemma 4...`, `Analysis complete`, `API unavailable`, or `Sample Demonstration`).
- **Data Privacy**: Images are processed ephemerally in server memory; they are not saved or logged to any database.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- A Google Gen AI / Gemini API key with access to Gemma 4 (`gemma-4-26b-a4b-it`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/claritylens.git
   cd claritylens
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📂 Project Structure

```
├── .env.example              # Environment variables template
├── index.html                # Entry HTML with typography and metadata
├── metadata.json             # AI Studio applet metadata & capabilities
├── package.json              # Full-stack dependencies & scripts
├── server.ts                 # Express full-stack backend with Gemma 4 API proxy
├── src/
│   ├── App.tsx               # Main application container
│   ├── main.tsx              # React DOM entry point
│   ├── index.css             # Tailwind CSS imports & theme base layers
│   ├── types/
│   │   └── clarity.ts        # TypeScript schemas for modes, results, and steps
│   ├── data/
│   │   └── samples.ts        # 4 high-fidelity SVG sample artifacts & demos
│   └── components/
│       ├── Navbar.tsx        # 3-zone Top Bar Contract navigation
│       ├── Hero.tsx          # Editorial hero with product preview
│       ├── TransformationSection.tsx # Section A: Visual noise to clarity
│       ├── ModesSection.tsx  # Section B: 4 intelligence modes showcase
│       ├── ArchitectureSection.tsx # Section C & D: Pillars & Gemma 4 spec
│       ├── Workspace.tsx     # Main interactive multimodal workspace
│       ├── ResultView.tsx    # Grounded result view with checkable steps & export
│       ├── FaqSection.tsx    # Frequently asked questions accordion
│       └── Footer.tsx        # Final CTA, licensing, and hackathon attribution
└── tsconfig.json             # TypeScript configuration
```

---

## ⚖️ Licensing & Attribution

- **Application Code**: Licensed under the [MIT License](LICENSE).
- **Gemma Model Terms**: Google Gemma model weights and hosted access are governed by the [Gemma Terms of Use](https://ai.google.dev/gemma/terms).
- **Hackathon Attribution**: Developed for **Hacktoberfest Hack Day x Oracle Kolkata** — Best Use of Gemma 4.
- **Platform Credit**: Built with Google AI Studio and `@google/genai`.
