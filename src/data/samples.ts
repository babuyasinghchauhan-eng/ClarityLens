import { SampleScenario } from '../types/clarity';

// High-fidelity SVG-based realistic screenshots converted to Data URLs
// This ensures crisp, self-contained visual inputs that Gemma 4 can visually read and process.

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}

const ERROR_TERMINAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" width="1000" height="640">
  <rect width="1000" height="640" fill="#0D1117" rx="16"/>
  <!-- Window Header -->
  <rect width="1000" height="48" fill="#161B22" rx="16"/>
  <rect y="32" width="1000" height="16" fill="#161B22"/>
  <circle cx="28" cy="24" r="6.5" fill="#FF5F56"/>
  <circle cx="48" cy="24" r="6.5" fill="#FFBD2E"/>
  <circle cx="68" cy="24" r="6.5" fill="#27C93F"/>
  <text x="500" y="29" fill="#8B949E" font-family="JetBrains Mono, monospace" font-size="13" text-anchor="middle">zsh — npm install @tanstack/react-query — claritylens-workspace</text>
  
  <!-- Terminal Content -->
  <g font-family="JetBrains Mono, monospace" font-size="14" fill="#C9D1D9">
    <text x="32" y="86" fill="#58A6FF"><tspan fill="#7EE787">➜</tspan> <tspan fill="#79C0FF">claritylens</tspan> <tspan fill="#D2A8FF">git:(main)</tspan> <tspan fill="#C9D1D9">npm install @tanstack/react-query</tspan></text>
    
    <text x="32" y="122" fill="#FFA657">npm warn deprecated @types/history@4.17.22: This is a stub types definition.</text>
    <text x="32" y="152" fill="#FFA657">npm warn deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec</text>
    
    <!-- Red Error Block -->
    <rect x="28" y="174" width="944" height="230" fill="#3D1217" rx="8" stroke="#F85149" stroke-width="1.5"/>
    <text x="44" y="206" fill="#FF7B72" font-weight="bold">npm ERR! code ERESOLVE</text>
    <text x="44" y="234" fill="#FF7B72" font-weight="bold">npm ERR! ERESOLVE could not resolve</text>
    <text x="44" y="262" fill="#E6EDF3">npm ERR! </text>
    <text x="44" y="290" fill="#E6EDF3">npm ERR! While resolving: <tspan fill="#79C0FF">@tanstack/react-query@5.28.4</tspan></text>
    <text x="44" y="318" fill="#E6EDF3">npm ERR! Found: <tspan fill="#FF7B72" font-weight="bold">react@19.0.0</tspan> in root package.json</text>
    <text x="44" y="346" fill="#E6EDF3">npm ERR! node_modules/react</text>
    <text x="44" y="374" fill="#E6EDF3">npm ERR!   peer react@"^18.0.0" from <tspan fill="#FFA657">@tanstack/react-query@5.28.4</tspan></text>
    
    <text x="32" y="440" fill="#8B949E">npm ERR! Fix the upstream dependency conflict, or retry</text>
    <text x="32" y="468" fill="#8B949E">npm ERR! this command with --force or --legacy-peer-deps</text>
    <text x="32" y="496" fill="#8B949E">npm ERR! to accept an incorrect (and potentially broken) dependency resolution.</text>
    
    <text x="32" y="540" fill="#8B949E">npm ERR! A complete log of this run can be found in:</text>
    <text x="32" y="566" fill="#58A6FF">npm ERR!     /Users/developer/.npm/_logs/2026-10-23T11_04_38_812Z-eresolve.log</text>
    
    <text x="32" y="608" fill="#58A6FF"><tspan fill="#7EE787">➜</tspan> <tspan fill="#79C0FF">claritylens</tspan> <tspan fill="#D2A8FF">git:(main)</tspan> <tspan fill="#C9D1D9">▋</tspan></text>
  </g>
</svg>`;

const CLOUD_IAM_MODAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" width="1000" height="640">
  <rect width="1000" height="640" fill="#EEF1F6"/>
  <!-- Backdrop Window -->
  <rect x="50" y="30" width="900" height="580" fill="#FFFFFF" rx="14" stroke="#D0D7DE" stroke-width="1.5" filter="drop-shadow(0 12px 32px rgba(0,0,0,0.08))"/>
  
  <!-- Header -->
  <rect x="50" y="30" width="900" height="64" fill="#F8FAFC" rx="14"/>
  <rect x="50" y="80" width="900" height="14" fill="#F8FAFC"/>
  <text x="82" y="70" fill="#0F172A" font-family="system-ui, sans-serif" font-size="18" font-weight="700">Modify Role Definition: Cloud-Admin-L3</text>
  <text x="82" y="118" fill="#475569" font-family="system-ui, sans-serif" font-size="13">Target Scope: Production-Cluster-East · Assigned to: devops-automation-bot</text>
  
  <!-- Warning Banner -->
  <rect x="82" y="140" width="836" height="74" fill="#FFFBEB" rx="8" stroke="#FDE68A" stroke-width="1.5"/>
  <circle cx="112" cy="177" r="14" fill="#F59E0B"/>
  <text x="112" y="182" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">!</text>
  <text x="140" y="167" fill="#92400E" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Elevated Privilege Hazard: Wildcard Policy Detected</text>
  <text x="140" y="193" fill="#B45309" font-family="system-ui, sans-serif" font-size="12.5">Granting iam:* and storage:* gives unrestricted deletion and token impersonation privileges.</text>
  
  <!-- Form Options -->
  <rect x="82" y="234" width="836" height="88" fill="#F8FAFC" rx="8" stroke="#E2E8F0"/>
  <rect x="104" y="254" width="18" height="18" fill="#2563EB" rx="4"/>
  <path d="M108 263 L112 267 L119 259" stroke="#FFFFFF" stroke-width="2.2" fill="none"/>
  <text x="134" y="268" fill="#0F172A" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Propagate recursively to 14 child organizational units</text>
  <text x="134" y="294" fill="#64748B" font-family="system-ui, sans-serif" font-size="12.5">Applies this IAM definition down the folder tree including Staging, Sandbox, and Billing Accounts.</text>
  
  <rect x="82" y="336" width="836" height="76" fill="#FFFFFF" rx="8" stroke="#E2E8F0"/>
  <circle cx="113" cy="374" r="9" fill="#10B981"/>
  <text x="134" y="370" fill="#0F172A" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Enforce Multi-Factor Authentication (MFA) on every invocation</text>
  <text x="134" y="392" fill="#64748B" font-family="system-ui, sans-serif" font-size="12">Requires hardware security key (FIDO2/WebAuthn) prompt before API dispatch.</text>
  
  <rect x="82" y="426" width="836" height="70" fill="#FFFFFF" rx="8" stroke="#E2E8F0"/>
  <rect x="104" y="444" width="18" height="18" fill="#FFFFFF" rx="4" stroke="#94A3B8" stroke-width="1.5"/>
  <text x="134" y="458" fill="#0F172A" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Bypass audit log telemetry for automated tasks (Breakglass only)</text>
  <text x="134" y="480" fill="#DC2626" font-family="system-ui, sans-serif" font-size="12" font-weight="500">Not recommended for production environments. Generates compliance review trigger.</text>
  
  <!-- Footer Buttons -->
  <line x1="50" y1="520" x2="950" y2="520" stroke="#E2E8F0" stroke-width="1"/>
  <rect x="620" y="542" width="110" height="42" fill="#F1F5F9" rx="8" stroke="#CBD5E1"/>
  <text x="675" y="568" fill="#334155" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">Cancel</text>
  
  <rect x="744" y="542" width="174" height="42" fill="#6742F5" rx="8"/>
  <text x="831" y="568" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">Apply Changes (MFA)</text>
</svg>`;

const HACKATHON_BRIEF_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" width="1000" height="640">
  <rect width="1000" height="640" fill="#FBFBFC"/>
  <!-- Document Sheet -->
  <rect x="70" y="24" width="860" height="592" fill="#FFFFFF" rx="10" stroke="#E5E7EB" stroke-width="1.5" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>
  
  <!-- Doc Header -->
  <rect x="70" y="24" width="860" height="8" fill="#6742F5"/>
  <text x="110" y="76" fill="#17151F" font-family="system-ui, sans-serif" font-size="22" font-weight="800">Hacktoberfest Hack Day x Oracle Kolkata</text>
  <text x="110" y="104" fill="#6742F5" font-family="system-ui, sans-serif" font-size="14" font-weight="700">OFFICIAL CHALLENGE BRIEF: Best Use of Gemma 4</text>
  <line x1="110" y1="120" x2="890" y2="120" stroke="#F0ECFF" stroke-width="2"/>
  
  <!-- Deadline Callout Box -->
  <rect x="110" y="138" width="780" height="56" fill="#FFF1F2" rx="6" stroke="#FECDD3"/>
  <text x="130" y="172" fill="#E11D48" font-family="system-ui, sans-serif" font-size="14" font-weight="700">SUBMISSION DEADLINE: October 26, 2026 at 23:59 IST</text>
  <text x="590" y="172" fill="#9F1239" font-family="system-ui, sans-serif" font-size="13">Strict cutoff · Late PRs disqualified</text>
  
  <!-- Requirements List -->
  <text x="110" y="230" fill="#17151F" font-family="system-ui, sans-serif" font-size="16" font-weight="700">Mandatory Deliverables:</text>
  
  <rect x="110" y="246" width="780" height="64" fill="#F9FAFB" rx="6" stroke="#E5E7EB"/>
  <text x="130" y="274" fill="#111827" font-family="system-ui, sans-serif" font-size="13.5" font-weight="600">1. Multimodal Implementation</text>
  <text x="130" y="296" fill="#4B5563" font-family="system-ui, sans-serif" font-size="12.5">Must execute actual image-to-text inference with Gemma 4 (model: gemma-4-26b-a4b-it). No mock shortcuts.</text>
  
  <rect x="110" y="322" width="780" height="64" fill="#F9FAFB" rx="6" stroke="#E5E7EB"/>
  <text x="130" y="350" fill="#111827" font-family="system-ui, sans-serif" font-size="13.5" font-weight="600">2. Open Source Repository &amp; Documentation</text>
  <text x="130" y="372" fill="#4B5563" font-family="system-ui, sans-serif" font-size="12.5">Include README with local setup, server env vars (.env.example), MIT license, and Gemma model attribution.</text>
  
  <rect x="110" y="398" width="780" height="64" fill="#F9FAFB" rx="6" stroke="#E5E7EB"/>
  <text x="130" y="426" fill="#111827" font-family="system-ui, sans-serif" font-size="13.5" font-weight="600">3. Functional Web App &amp; 2-Minute Video Demo</text>
  <text x="130" y="448" fill="#4B5563" font-family="system-ui, sans-serif" font-size="12.5">Live accessible deployment URL showing responsive UI, error recovery states, and copy/download reports.</text>
  
  <!-- Rubric -->
  <text x="110" y="494" fill="#17151F" font-family="system-ui, sans-serif" font-size="15" font-weight="700">Evaluation Scoring Rubric:</text>
  
  <g font-family="system-ui, sans-serif" font-size="13" fill="#374151">
    <rect x="110" y="510" width="246" height="58" fill="#F3F4F6" rx="6"/>
    <text x="130" y="534" font-weight="700" fill="#1F2937">Multimodal Grounding: 40%</text>
    <text x="130" y="554" font-size="11.5" fill="#4B5563">True visual insight &amp; zero hallucination</text>
    
    <rect x="376" y="510" width="246" height="58" fill="#F3F4F6" rx="6"/>
    <text x="396" y="534" font-weight="700" fill="#1F2937">Architecture &amp; Safety: 30%</text>
    <text x="396" y="554" font-size="11.5" fill="#4B5563">Server-side SDK, no leaked secrets</text>
    
    <rect x="644" y="510" width="246" height="58" fill="#F3F4F6" rx="6"/>
    <text x="664" y="534" font-weight="700" fill="#1F2937">Frontend Craft &amp; UX: 30%</text>
    <text x="664" y="554" font-size="11.5" fill="#4B5563">Editorial Polish &amp; accessibility</text>
  </g>
</svg>`;

const STUDY_NOTES_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" width="1000" height="640">
  <rect width="1000" height="640" fill="#FBF8EE"/>
  <!-- Paper Texture & Grid -->
  <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E8E2CD" stroke-width="0.8"/>
  </pattern>
  <rect width="1000" height="640" fill="url(#grid)"/>
  
  <!-- Red Margin Line -->
  <line x1="120" y1="0" x2="120" y2="640" stroke="#F87171" stroke-width="1.5" opacity="0.85"/>
  
  <!-- Handwritten Style Content -->
  <g font-family="system-ui, sans-serif" fill="#1E293B">
    <text x="140" y="60" font-size="22" font-weight="800" fill="#1E1B4B">CS 224N · Lecture 09: Transformer Scaled Dot-Product Attention</text>
    <text x="140" y="90" font-size="14" fill="#64748B">Key Insight: Dot product variance grows linearly with dimension d_k</text>
    
    <!-- Formula Box -->
    <rect x="140" y="114" width="780" height="90" fill="#FEF3C7" rx="8" stroke="#FDE047" stroke-width="1"/>
    <text x="170" y="152" font-size="20" font-weight="700" fill="#78350F" font-family="JetBrains Mono, monospace">Attention(Q, K, V) = softmax( (Q · K^T) / √d_k ) · V</text>
    <text x="170" y="184" font-size="13" fill="#92400E">Note: Division by √d_k prevents dot product magnitudes from exploding, keeping softmax gradients alive!</text>
    
    <!-- Diagram Section -->
    <rect x="140" y="224" width="370" height="280" fill="#FFFFFF" rx="8" stroke="#CBD5E1"/>
    <text x="160" y="254" font-size="15" font-weight="700" fill="#334155">Attention Flow Architecture</text>
    
    <!-- Blocks in Diagram -->
    <rect x="170" y="275" width="100" height="34" fill="#E0E7FF" rx="4" stroke="#6366F1"/>
    <text x="220" y="297" font-size="13" font-weight="600" fill="#3730A3" text-anchor="middle">MatMul (Q, K)</text>
    
    <line x1="220" y1="310" x2="220" y2="330" stroke="#475569" stroke-width="1.5"/>
    <rect x="170" y="330" width="100" height="30" fill="#FEF3C7" rx="4" stroke="#F59E0B"/>
    <text x="220" y="350" font-size="12" font-weight="600" fill="#92400E" text-anchor="middle">Scale: 1/√d_k</text>
    
    <line x1="220" y1="360" x2="220" y2="380" stroke="#475569" stroke-width="1.5"/>
    <rect x="170" y="380" width="100" height="30" fill="#FEE2E2" rx="4" stroke="#EF4444"/>
    <text x="220" y="400" font-size="12" font-weight="600" fill="#991B1B" text-anchor="middle">Mask (opt)</text>
    
    <line x1="220" y1="410" x2="220" y2="430" stroke="#475569" stroke-width="1.5"/>
    <rect x="170" y="430" width="100" height="32" fill="#D1FAE5" rx="4" stroke="#10B981"/>
    <text x="220" y="451" font-size="12" font-weight="600" fill="#065F46" text-anchor="middle">Softmax</text>
    
    <line x1="270" y1="446" x2="310" y2="446" stroke="#475569" stroke-width="1.5"/>
    <rect x="310" y="430" width="160" height="32" fill="#E0E7FF" rx="4" stroke="#6366F1"/>
    <text x="390" y="451" font-size="12" font-weight="600" fill="#3730A3" text-anchor="middle">MatMul with Values (V)</text>
    
    <!-- Right Explanation Column -->
    <rect x="530" y="224" width="390" height="280" fill="#FFFFFF" rx="8" stroke="#CBD5E1"/>
    <text x="550" y="254" font-size="15" font-weight="700" fill="#334155">Multi-Head Concatenation</text>
    <text x="550" y="285" font-size="13" fill="#475569">• MultiHead(Q,K,V) = Concat(head_1, ..., head_h) · W^O</text>
    <text x="550" y="315" font-size="13" fill="#475569">• Allows the model to jointly attend to info from</text>
    <text x="560" y="338" font-size="13" fill="#475569">different representation subspaces simultaneously.</text>
    <text x="550" y="375" font-size="13" font-weight="600" fill="#1E293B">Dimensions in Base Transformer:</text>
    <text x="550" y="402" font-size="12.5" font-family="JetBrains Mono, monospace" fill="#2563EB">d_model = 512,  h = 8 heads</text>
    <text x="550" y="426" font-size="12.5" font-family="JetBrains Mono, monospace" fill="#2563EB">d_k = d_v = 512 / 8 = 64</text>
    <text x="550" y="465" font-size="12" fill="#94A3B8" font-style="italic">Exam focus: Explain why single-head attention underperforms!</text>
    
    <text x="140" y="540" font-size="13" fill="#64748B">Next week: RoPE (Rotary Position Embeddings) as used in modern Gemma architectures...</text>
  </g>
</svg>`;

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'sample-error',
    title: 'Fix React 19 Dependency Crash',
    mode: 'fix_error',
    badge: 'Software Error',
    tagline: 'Terminal crash with npm peer dependency conflict during React 19 upgrade',
    previewPrompt: 'Explain this npm ERESOLVE error and suggest safe recovery steps without breaking my app.',
    defaultQuestion: 'Why is npm install failing on @tanstack/react-query and how do I fix it safely?',
    imageDataUrl: svgToDataUrl(ERROR_TERMINAL_SVG),
    demonstrationResult: {
      image_summary: 'A dark terminal session showing an npm dependency resolution error (ERESOLVE) during an npm install execution.',
      important_details: [
        'Error code: ERESOLVE (unable to resolve dependency tree)',
        'Target package being installed: @tanstack/react-query@5.28.4',
        'Conflicting dependency: package expects peer react@"^18.0.0", but root package.json has react@19.0.0',
        'Command executed: npm install @tanstack/react-query',
        'Suggested npm flags: --legacy-peer-deps or --force mentioned in npm warning output'
      ],
      explanation: 'The package manager cannot resolve conflicting peer dependencies. The library `@tanstack/react-query@5.28.4` strictly declared a peer dependency for React 18, but the workspace is using React 19. Node\'s strict peer dependency resolver aborts the installation rather than creating an inconsistent dependency graph.',
      next_steps: [
        {
          id: 'step-1',
          title: 'Check for React 19 compatible version',
          description: 'Run `npm view @tanstack/react-query versions` or inspect the official TanStack Query changelog to see if version 5.35+ or experimental releases declare support for React 19.',
          priority: 'high'
        },
        {
          id: 'step-2',
          title: 'Install safely with --legacy-peer-deps',
          description: 'Run `npm install @tanstack/react-query --legacy-peer-deps` to instruct npm to ignore peer dependency mismatches if TanStack Query has verified runtime compatibility.',
          priority: 'medium'
        },
        {
          id: 'step-3',
          title: 'Consider npm overrides in package.json',
          description: 'If you manage a monorepo, add `"overrides": { "@tanstack/react-query": { "react": "$react" } }` in package.json for clean reproducibility across team builds.',
          priority: 'low'
        }
      ],
      uncertainties: [
        'Whether other packages in this workspace also declare strict React 18 peer requirements cannot be seen from this single terminal log window.'
      ],
      follow_up_question: 'Would you like to see how to add an overrides block in package.json to permanently resolve peer conflicts?',
      model_used: 'gemma-4-26b-a4b-it',
      mode: 'fix_error',
      timestamp: '2026-10-23T11:05:00.000Z',
      isDemoSample: true
    }
  },
  {
    id: 'sample-brief',
    title: 'Extract Hackathon Requirements',
    mode: 'extract_tasks',
    badge: 'Assignment Brief',
    tagline: 'Oracle Kolkata x Hacktoberfest challenge brief with rubric & deadlines',
    previewPrompt: 'Extract all hard deadlines, mandatory deliverables, and evaluation scoring criteria into an actionable checklist.',
    defaultQuestion: 'What are the exact submission deliverables and deadline for the Best Use of Gemma 4 challenge?',
    imageDataUrl: svgToDataUrl(HACKATHON_BRIEF_SVG),
    demonstrationResult: {
      image_summary: 'Official challenge specification sheet for the Oracle Kolkata x Hacktoberfest Hack Day competing in the Best Use of Gemma 4 category.',
      important_details: [
        'Challenge track: "Best Use of Gemma 4"',
        'Hard submission cutoff: October 26, 2026 at 23:59 IST (penalties/disqualification for late commits)',
        'Mandatory Deliverable 1: Multimodal implementation using real Gemma 4 model (gemma-4-26b-a4b-it) without mock substitutions',
        'Mandatory Deliverable 2: Open-source repository with setup documentation, .env.example, MIT license, and Gemma model attribution',
        'Mandatory Deliverable 3: Live web application deployment and a 2-minute video demonstration',
        'Scoring Rubric: Multimodal Grounding (40%), Architecture & Safety (30%), Frontend Craft & UX (30%)'
      ],
      explanation: 'The document establishes the submission criteria and timeline for the hackathon. To achieve maximum marks under the 40% Multimodal Grounding and 30% Architecture rubrics, the application must execute real server-side image-to-text inference with Gemma 4, secure the API keys, and deliver an editorial-grade user interface.',
      next_steps: [
        {
          id: 'step-1',
          title: 'Verify real Gemma 4 model calls on the server',
          description: 'Ensure the backend server endpoint invokes `gemma-4-26b-a4b-it` via @google/genai with base64 image parts, avoiding proprietary proxies.',
          priority: 'high'
        },
        {
          id: 'step-2',
          title: 'Prepare demo video screen capture',
          description: 'Record a concise 2-minute demonstration showing image upload, mode selection, Gemma 4 inference status, and structured actionable results.',
          priority: 'high'
        },
        {
          id: 'step-3',
          title: 'Complete documentation and open-source licensing',
          description: 'Publish repository with MIT license for app code, distinguish Google Gemma model terms, and provide .env.example instructions before Oct 26, 23:59 IST.',
          priority: 'medium'
        }
      ],
      uncertainties: [
        'The document does not state whether team presentations will take place in-person at Oracle Kolkata or virtually.'
      ],
      follow_up_question: 'Would you like a pre-submission checklist verification against the 3 evaluation rubrics?',
      model_used: 'gemma-4-26b-a4b-it',
      mode: 'extract_tasks',
      timestamp: '2026-10-23T11:06:00.000Z',
      isDemoSample: true
    }
  },
  {
    id: 'sample-screen',
    title: 'Explain Cloud IAM Privilege Modal',
    mode: 'explain_screen',
    badge: 'Interface Notice',
    tagline: 'Cryptic cloud security configuration with recursive organizational permissions',
    previewPrompt: 'Explain what this security dialog does and warn me about any unintended permission risks.',
    defaultQuestion: 'What does this IAM screen modify and is it safe to click Apply Changes?',
    imageDataUrl: svgToDataUrl(CLOUD_IAM_MODAL_SVG),
    demonstrationResult: {
      image_summary: 'A cloud infrastructure IAM console configuration modal for modifying the "Cloud-Admin-L3" role on Production-Cluster-East.',
      important_details: [
        'Role being edited: "Cloud-Admin-L3" assigned to devops-automation-bot',
        'Warning banner: "Elevated Privilege Hazard: Wildcard Policy Detected (iam:* and storage:*)"',
        'Selected checkbox: "Propagate recursively to 14 child organizational units (Staging, Sandbox, Billing)"',
        'Active security control: "Enforce Multi-Factor Authentication (MFA) on every invocation"',
        'Unchecked dangerous option: "Bypass audit log telemetry for automated tasks"',
        'Primary action button: "Apply Changes (MFA)"'
      ],
      explanation: 'This screen is attempting to apply an administrative role with wildcard permissions (`iam:*` and `storage:*`) and propagate it recursively across 14 child accounts. If approved, the automated bot will gain root-level deletion and impersonation access across your entire organization, which creates a major security surface.',
      next_steps: [
        {
          id: 'step-1',
          title: 'Deselect recursive propagation to 14 child units',
          description: 'Restrict the role scope strictly to the target Production-Cluster-East resource instead of broad organization-wide inheritance.',
          priority: 'high'
        },
        {
          id: 'step-2',
          title: 'Replace wildcard permissions with specific action verbs',
          description: 'Audit the bot\'s actual requirements and replace `iam:*` with granular read-only or scoped deployment policies.',
          priority: 'high'
        },
        {
          id: 'step-3',
          title: 'Keep MFA enforcement enabled',
          description: 'Ensure hardware security token verification remains checked as a secondary barrier.',
          priority: 'medium'
        }
      ],
      uncertainties: [
        'The specific identity of the administrator initiating this change is not shown in the modal preview.'
      ],
      follow_up_question: 'Would you like a sample least-privilege IAM policy tailored for a Kubernetes CI/CD bot?',
      model_used: 'gemma-4-26b-a4b-it',
      mode: 'explain_screen',
      timestamp: '2026-10-23T11:07:00.000Z',
      isDemoSample: true
    }
  },
  {
    id: 'sample-notes',
    title: 'Understand Transformer Attention Notes',
    mode: 'understand_notes',
    badge: 'Study Notes',
    tagline: 'Handwritten lecture notes on Scaled Dot-Product Attention & Multi-Head mechanisms',
    previewPrompt: 'Synthesize the core mathematical definitions, explain the flow diagram, and generate an active study checklist.',
    defaultQuestion: 'Why do we divide by sqrt(d_k) in the attention equation and how does multi-head attention work?',
    imageDataUrl: svgToDataUrl(STUDY_NOTES_SVG),
    demonstrationResult: {
      image_summary: 'Handwritten and diagrammed lecture notes from CS 224N discussing Transformer Scaled Dot-Product Attention and Multi-Head projection.',
      important_details: [
        'Governing formula: Attention(Q, K, V) = softmax( (Q · K^T) / √d_k ) · V',
        'Key rationale for scaling: Vector dot product variance scales with dimension d_k; dividing by √d_k keeps variance near 1 so softmax gradients do not vanish',
        'Architecture flow blocks: MatMul(Q,K) → Scale(1/√d_k) → Optional Mask → Softmax → MatMul with V',
        'Multi-Head formula: MultiHead(Q,K,V) = Concat(head_1, ..., head_h) · W^O',
        'Standard dimensions listed: d_model = 512, h = 8 heads, d_k = d_v = 64'
      ],
      explanation: 'These study notes summarize the core mathematical mechanism behind Transformers. Scaled dot-product attention computes pairwise compatibility scores between Queries and Keys, weights them with softmax, and computes a weighted average of Values. Multi-head projection allows the network to jointly attend to different representation subspaces at once.',
      next_steps: [
        {
          id: 'step-1',
          title: 'Derive variance of dot product of two random vectors',
          description: 'Assume q and k have i.i.d. components with mean 0 and variance 1. Prove that Var(q · k) = d_k, explaining why division by √d_k is necessary.',
          priority: 'high'
        },
        {
          id: 'step-2',
          title: 'Trace tensor shape transformations in Multi-Head Attention',
          description: 'Map the shapes from input sequence tensor [Batch, SeqLen, 512] through projection matrices W_Q, W_K, W_V into [Batch, 8, SeqLen, 64].',
          priority: 'medium'
        },
        {
          id: 'step-3',
          title: 'Review causal masking vs bidirectional attention',
          description: 'Note why decoder-only models (like Gemma) mask future token positions with -∞ before softmax.',
          priority: 'low'
        }
      ],
      uncertainties: [
        'The note at the bottom margin referencing "RoPE (Rotary Position Embeddings)" is cut off before detailing formula specifics.'
      ],
      follow_up_question: 'Would you like 3 practice quiz questions testing your understanding of Transformer attention dimensionality?',
      model_used: 'gemma-4-26b-a4b-it',
      mode: 'understand_notes',
      timestamp: '2026-10-23T11:08:00.000Z',
      isDemoSample: true
    }
  }
];
