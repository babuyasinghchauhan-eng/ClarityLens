import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Cpu,
  CheckCircle,
  ArrowRight,
  Shield,
  FileQuestion,
  Monitor,
  Bug,
  ListTodo,
  BookOpen
} from 'lucide-react';
import { AnalysisMode, AnalysisResult, InferenceStatus, SampleScenario } from '../types/clarity';
import { SAMPLE_SCENARIOS } from '../data/samples';
import { ResultView } from './ResultView';

interface WorkspaceProps {
  initialMode?: AnalysisMode;
  initialSampleId?: string | null;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  initialMode = 'explain_screen',
  initialSampleId = null,
}) => {
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>(initialMode);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/png');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [status, setStatus] = useState<InferenceStatus>('ready');
  const [statusMessage, setStatusMessage] = useState<string>('Gemma 4 ready for analysis');
  const [loadingPhase, setLoadingPhase] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const workspaceTopRef = useRef<HTMLDivElement>(null);

  // Load sample if initialSampleId is provided
  useEffect(() => {
    if (initialSampleId) {
      loadSample(initialSampleId);
    }
  }, [initialSampleId]);

  useEffect(() => {
    if (initialMode) {
      setSelectedMode(initialMode);
    }
  }, [initialMode]);

  const loadSample = (sampleId: string) => {
    const sample = SAMPLE_SCENARIOS.find((s) => s.id === sampleId);
    if (!sample) return;

    setImagePreview(sample.imageDataUrl);
    setImageMimeType('image/svg+xml');
    setImageFileName(`${sample.id}.svg`);
    setSelectedMode(sample.mode);
    setUserQuestion(sample.defaultQuestion);
    setActiveSampleId(sample.id);
    setResult(null);
    setApiError(null);
    setValidationError(null);
    setStatus('ready');
    setStatusMessage('Sample loaded. Ready to analyze with Gemma 4 or view demonstration.');
  };

  const handleFile = (file: File) => {
    setValidationError(null);
    setApiError(null);
    setActiveSampleId(null);

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Please upload a valid image file (PNG, JPEG, WebP, or SVG).');
      return;
    }

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Image size exceeds 15MB. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setImageMimeType(file.type);
      setImageFileName(file.name);
      setStatus('ready');
      setStatusMessage('Image uploaded. Ready to analyze with Gemma 4.');
    };
    reader.onerror = () => {
      setValidationError('Failed to read the selected file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFileName('');
    setResult(null);
    setApiError(null);
    setValidationError(null);
    setActiveSampleId(null);
    setStatus('ready');
    setStatusMessage('Gemma 4 ready for analysis');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetAll = () => {
    clearImage();
    setUserQuestion('');
    setSelectedMode('explain_screen');
  };

  // Run real analysis with Gemma 4
  const handleAnalyze = async () => {
    if (!imagePreview) {
      setValidationError('Please upload an image or select a sample first.');
      return;
    }

    setStatus('analyzing');
    setApiError(null);
    setLoadingPhase('Connecting to Gemma 4 multimodal model (gemma-4-26b-a4b-it)...');

    try {
      // Progress simulation for user feedback
      const timer1 = setTimeout(() => {
        setLoadingPhase('Processing image tokens & extracting visible elements...');
      }, 1000);

      const timer2 = setTimeout(() => {
        setLoadingPhase('Synthesizing structured explanation and next steps...');
      }, 2200);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imageMimeType,
          mode: selectedMode,
          userQuestion: userQuestion.trim(),
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image with Gemma 4.');
      }

      setResult({
        ...data.data,
        isDemoSample: false,
      });
      setStatus('complete');
      setStatusMessage('Analysis complete with Gemma 4.');
    } catch (err: any) {
      console.warn('Gemma 4 inference note:', err);
      setStatus('error');
      setApiError(err.message || 'An error occurred during Gemma 4 multimodal analysis.');
      setStatusMessage('Inference error. Your input and options have been preserved.');
    }
  };

  // Load pre-seeded demonstration if API key is not present or user requests instant demo
  const handleLoadDemoResult = () => {
    let sample = SAMPLE_SCENARIOS.find((s) => s.id === activeSampleId);
    if (!sample) {
      sample = SAMPLE_SCENARIOS.find((s) => s.mode === selectedMode) || SAMPLE_SCENARIOS[0];
    }

    setImagePreview(sample.imageDataUrl);
    setImageMimeType('image/svg+xml');
    setImageFileName(`${sample.id}.svg`);
    setSelectedMode(sample.mode);
    setResult({
      ...sample.demonstrationResult,
      isDemoSample: true,
    });
    setStatus('demo');
    setStatusMessage('Showing pre-seeded sample demonstration.');
    setApiError(null);
  };

  return (
    <section id="workspace" ref={workspaceTopRef} className="py-16 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Title & Intro */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6742F5] uppercase tracking-wide mb-1.5">
            <span>MULTIMODAL WORKSPACE</span>
            <span aria-hidden="true">·</span>
            <span>MODEL: GEMMA-4-26B-A4B-IT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151F] tracking-tight">
            See the problem. Find the next step.
          </h2>
          <p className="mt-2 text-base text-[#706D7A]">
            Upload any screenshot, error dialog, requirement brief, or photographed study notes. Gemma 4 will ground its response in the visible pixels.
          </p>
        </div>

        {/* Transparent Inference Status Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-[#F7F6FA] border border-[#17151F]/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  status === 'analyzing'
                    ? 'bg-[#6742F5] animate-ping'
                    : status === 'complete'
                    ? 'bg-emerald-500'
                    : status === 'error'
                    ? 'bg-[#FF8066]'
                    : status === 'demo'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <span className="font-semibold text-[#17151F]">
                {status === 'analyzing'
                  ? 'Analyzing image with Gemma 4...'
                  : status === 'complete'
                  ? 'Gemma 4 Analysis Complete'
                  : status === 'error'
                  ? 'API Status: Notice'
                  : status === 'demo'
                  ? 'Sample Demonstration View'
                  : 'Gemma 4 Ready'}
              </span>
            </div>
            <span aria-hidden="true" className="text-gray-300">|</span>
            <span className="text-[#706D7A] font-mono">gemma-4-26b-a4b-it</span>
          </div>

          <div className="flex items-center gap-2 text-[#706D7A]">
            <Shield className="w-3.5 h-3.5 text-[#6742F5]" />
            <span>Image is processed directly by the Gemma 4 vision encoder. No third-party OCR.</span>
          </div>
        </div>

        {/* API Error Callout with Recovery */}
        {apiError && (
          <div className="mb-8 p-5 rounded-2xl bg-[#FFF1EE] border border-[#FF8066]/30 text-xs text-[#17151F] space-y-3">
            <div className="flex items-start gap-2.5 font-semibold text-[#FF8066] text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <span>Gemma 4 API Request Notice:</span>
                <p className="font-normal text-xs text-[#17151F] mt-1 font-mono">
                  {apiError}
                </p>
              </div>
            </div>
            <p className="text-[#706D7A] pl-7">
              Your uploaded image and selected parameters have been preserved. You can retry the live call or preview the pre-seeded analysis demonstration to inspect the expected schema and workflow immediately.
            </p>
            <div className="pl-7 flex flex-wrap gap-3 pt-1">
              <button
                onClick={handleAnalyze}
                className="px-4 py-2 bg-[#6742F5] text-white font-semibold rounded-xl hover:bg-[#3921A8] transition-colors cursor-pointer"
              >
                Retry Live Gemma 4 Call
              </button>
              <button
                onClick={handleLoadDemoResult}
                className="px-4 py-2 bg-white text-[#17151F] font-semibold border border-[#17151F]/15 rounded-xl hover:bg-[#F7F6FA] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF8066]" />
                <span>View Sample Demonstration</span>
              </button>
            </div>
          </div>
        )}

        {/* Main 2-Column Grid: Controls & Preview / Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Upload & Configuration Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step 1: Upload or Choose Sample */}
            <div className="bg-white rounded-2xl border border-[#17151F]/10 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17151F] uppercase tracking-wide">
                  1. Image Input
                </span>
                {imagePreview && (
                  <button
                    onClick={clearImage}
                    className="text-xs text-[#FF8066] hover:underline font-semibold cursor-pointer"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Upload Dropzone */}
              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    isDragOver
                      ? 'border-[#6742F5] bg-[#F0ECFF]'
                      : 'border-[#17151F]/15 hover:border-[#6742F5]/60 hover:bg-[#F7F6FA]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F0ECFF] flex items-center justify-center text-[#6742F5]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#17151F]">
                      Click to upload or drag &amp; drop
                    </p>
                    <p className="text-xs text-[#706D7A] mt-1">
                      PNG, JPEG, WebP, SVG (up to 15MB)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Preview Container */
                <div className="relative rounded-xl border border-[#17151F]/10 overflow-hidden bg-[#F7F6FA]">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-full max-h-64 object-contain bg-neutral-900/5 p-2"
                  />
                  <div className="p-3 bg-white border-t border-[#17151F]/10 flex items-center justify-between text-xs text-[#706D7A]">
                    <span className="truncate max-w-[200px] font-medium text-[#17151F]">
                      {imageFileName || 'uploaded-artifact.png'}
                    </span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold text-[#6742F5] hover:text-[#3921A8] cursor-pointer"
                    >
                      Replace image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {validationError && (
                <p className="text-xs text-[#FF8066] font-medium">{validationError}</p>
              )}

              {/* Sample Scenarios Quick Select */}
              <div id="sample-cases" className="pt-2">
                <div className="text-xs font-semibold text-[#706D7A] mb-2.5">
                  Or test with a curated sample scenario:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_SCENARIOS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => loadSample(sample.id)}
                      className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                        activeSampleId === sample.id
                          ? 'border-[#6742F5] bg-[#F0ECFF] ring-1 ring-[#6742F5]'
                          : 'border-[#17151F]/10 bg-white hover:bg-[#F7F6FA] hover:border-[#17151F]/20'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-[#6742F5] truncate">
                        {sample.badge}
                      </div>
                      <div className="text-xs font-semibold text-[#17151F] truncate mt-0.5">
                        {sample.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Choose Mode */}
            <div className="bg-white rounded-2xl border border-[#17151F]/10 p-5 sm:p-6 shadow-xs space-y-4">
              <span className="text-xs font-bold text-[#17151F] uppercase tracking-wide">
                2. Select Analysis Mode
              </span>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'explain_screen' as AnalysisMode,
                    title: 'Explain this screen',
                    desc: 'Interface, notice, or unfamiliar UI dialog',
                    icon: Monitor,
                  },
                  {
                    id: 'fix_error' as AnalysisMode,
                    title: 'Fix this error',
                    desc: 'Software error, terminal crash, or stack trace',
                    icon: Bug,
                  },
                  {
                    id: 'extract_tasks' as AnalysisMode,
                    title: 'Turn this into tasks',
                    desc: 'Assignment brief, event announcement, or project requirement',
                    icon: ListTodo,
                  },
                  {
                    id: 'understand_notes' as AnalysisMode,
                    title: 'Understand these notes',
                    desc: 'Study slide, handwritten notes, or whiteboard diagram',
                    icon: BookOpen,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = selectedMode === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMode(m.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-[#F0ECFF] border-[#6742F5] shadow-xs'
                          : 'bg-white border-[#17151F]/10 hover:bg-[#F7F6FA]'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#6742F5] text-white' : 'bg-[#F7F6FA] text-[#706D7A]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#17151F]">{m.title}</div>
                        <div className="text-xs text-[#706D7A]">{m.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Optional Question */}
            <div className="bg-white rounded-2xl border border-[#17151F]/10 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17151F] uppercase tracking-wide">
                  3. Optional User Question
                </span>
                <span className="text-[11px] text-[#706D7A]">Optional</span>
              </div>
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Ask something specific, e.g. 'Why is npm install failing on React 19?' or leave empty for comprehensive grounding..."
                rows={3}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#17151F]/15 focus:outline-none focus:ring-2 focus:ring-[#6742F5] focus:border-transparent bg-[#F7F6FA]"
              />
            </div>

            {/* Primary Action Button */}
            <div className="space-y-2">
              <button
                onClick={handleAnalyze}
                disabled={!imagePreview || status === 'analyzing'}
                className={`w-full py-4 text-base font-bold text-white rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !imagePreview || status === 'analyzing'
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-[#6742F5] hover:bg-[#3921A8] active:scale-[0.99] hover:shadow-lg'
                }`}
              >
                {status === 'analyzing' ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing with Gemma 4...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5" />
                    <span>Analyze with Gemma 4</span>
                  </>
                )}
              </button>

              {status === 'analyzing' && (
                <p className="text-center text-xs text-[#6742F5] font-medium animate-pulse">
                  {loadingPhase}
                </p>
              )}
            </div>

          </div>

          {/* Right Column: Gemma 4 Analysis Result */}
          <div className="lg:col-span-7">
            {result ? (
              <ResultView
                result={result}
                onReset={resetAll}
                onAnalyzeAnother={clearImage}
              />
            ) : (
              /* Empty / Waiting State */
              <div className="bg-white rounded-3xl border border-[#17151F]/10 p-8 sm:p-12 text-center space-y-6 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-[#F0ECFF] mx-auto flex items-center justify-center text-[#6742F5]">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-[#17151F]">
                    Ready to turn what you see into what to do next
                  </h3>
                  <p className="text-sm text-[#706D7A] leading-relaxed">
                    Upload an image or pick one of the sample scenarios on the left, then click <strong>"Analyze with Gemma 4"</strong> to generate an image-grounded breakdown.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#17151F]/10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#706D7A]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#6742F5]" />
                    <span>Exact details extracted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#6742F5]" />
                    <span>Interactive task checklist</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#6742F5]" />
                    <span>Uncertainty boundaries</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => loadSample('sample-error')}
                    className="text-xs font-semibold text-[#6742F5] hover:text-[#3921A8] hover:underline cursor-pointer"
                  >
                    Click here to instantly try the React 19 Dependency Sample →
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
