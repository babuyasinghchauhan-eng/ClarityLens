import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Cpu,
  Shield,
  Monitor,
  Bug,
  ListTodo,
  BookOpen,
  Camera,
  History,
  Key,
  Maximize2,
  ClipboardPaste,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import {
  AnalysisMode,
  AnalysisResult,
  InferenceStatus,
  SampleScenario,
  AnalysisHistoryItem,
  AVAILABLE_MODELS
} from '../types/clarity';
import { SAMPLE_SCENARIOS } from '../data/samples';
import { ResultView } from './ResultView';
import { CameraModal } from './CameraModal';
import { HistoryDrawer } from './HistoryDrawer';
import { ApiKeyModal } from './ApiKeyModal';
import { ImageZoomModal } from './ImageZoomModal';

interface WorkspaceProps {
  initialMode?: AnalysisMode;
  initialSampleId?: string | null;
  onSelectSample?: (sampleId: string) => void;
  isStandaloneStudio?: boolean;
}

const STORAGE_KEY_HISTORY = 'claritylens_history_v1';
const STORAGE_KEY_API_KEY = 'claritylens_custom_api_key';

export const Workspace: React.FC<WorkspaceProps> = ({
  initialMode = 'explain_screen',
  initialSampleId = null,
  isStandaloneStudio = false,
}) => {
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>(initialMode);
  const [selectedModel, setSelectedModel] = useState<string>('gemma-4-26b-a4b-it');
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

  // Modals & Drawers state
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [hasServerEnvKey, setHasServerEnvKey] = useState<boolean>(true);
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const workspaceTopRef = useRef<HTMLDivElement>(null);

  // Initialize custom API key and saved history from localStorage
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem(STORAGE_KEY_API_KEY);
      if (storedKey) setCustomApiKey(storedKey);

      const storedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (storedHistory) {
        setHistoryItems(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.warn('LocalStorage access note:', e);
    }

    // Check server status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setHasServerEnvKey(!!data.hasApiKey);
      })
      .catch((err) => console.warn('Status check note:', err));
  }, []);

  // Save history helper
  const saveToHistory = (newResult: AnalysisResult, dataUrl: string, title: string) => {
    const item: AnalysisHistoryItem = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title,
      mode: newResult.mode,
      thumbnailDataUrl: dataUrl,
      result: newResult,
      chatMessages: [],
      userQuestion,
    };

    setHistoryItems((prev) => {
      const updated = [item, ...prev].slice(0, 20); // Keep last 20
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to persist history:', err);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
  };

  const handleSelectHistoryItem = (item: AnalysisHistoryItem) => {
    setImagePreview(item.thumbnailDataUrl);
    setImageFileName(`${item.id}.png`);
    setSelectedMode(item.mode);
    setResult(item.result);
    setUserQuestion(item.userQuestion || '');
    setStatus('complete');
    setStatusMessage('Restored analysis from history.');
    setApiError(null);
  };

  // Handle custom API key save
  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    try {
      if (key) {
        localStorage.setItem(STORAGE_KEY_API_KEY, key);
      } else {
        localStorage.removeItem(STORAGE_KEY_API_KEY);
      }
    } catch {}
  };

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
      setValidationError('Please upload a valid image file (PNG, JPEG, WebP, GIF, or SVG).');
      return;
    }

    // Validate size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setValidationError('Image size exceeds 20MB. Please choose a smaller file.');
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

  // Global Clipboard Paste Support (Ctrl+V anywhere in workspace)
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleFile(file);
          setStatusMessage('Pasted screenshot from clipboard!');
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

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

  // Run multimodal analysis
  const handleAnalyze = async () => {
    if (!imagePreview) {
      setValidationError('Please upload an image, take a photo, paste a screenshot, or select a sample first.');
      return;
    }

    setStatus('analyzing');
    setApiError(null);
    setLoadingPhase(`Connecting to ${selectedModel}...`);

    try {
      const timer1 = setTimeout(() => {
        setLoadingPhase('Processing image tokens & extracting visible elements...');
      }, 1000);

      const timer2 = setTimeout(() => {
        setLoadingPhase('Synthesizing structured explanation and actionable next steps...');
      }, 2200);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-gemini-api-key': customApiKey } : {}),
        },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imageMimeType,
          mode: selectedMode,
          userQuestion: userQuestion.trim(),
          requestedModel: selectedModel,
          apiKey: customApiKey,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image with multimodal model.');
      }

      const formattedResult: AnalysisResult = {
        ...data.data,
        isDemoSample: false,
      };

      setResult(formattedResult);
      setStatus('complete');
      setStatusMessage(`Analysis complete with ${formattedResult.model_used}.`);

      // Persist to history
      saveToHistory(
        formattedResult,
        imagePreview,
        imageFileName || `${selectedMode}-analysis`
      );
    } catch (err: any) {
      console.warn('Inference note:', err);
      setStatus('error');
      setApiError(err.message || 'An error occurred during multimodal visual analysis.');
      setStatusMessage('Inference notice. Your input and options have been preserved.');
    }
  };

  // Instant pre-seeded demonstration result
  const handleLoadDemoResult = () => {
    let sample = SAMPLE_SCENARIOS.find((s) => s.id === activeSampleId);
    if (!sample) {
      sample = SAMPLE_SCENARIOS.find((s) => s.mode === selectedMode) || SAMPLE_SCENARIOS[0];
    }

    setImagePreview(sample.imageDataUrl);
    setImageMimeType('image/svg+xml');
    setImageFileName(`${sample.id}.svg`);
    setSelectedMode(sample.mode);
    const demoResult: AnalysisResult = {
      ...sample.demonstrationResult,
      isDemoSample: true,
    };
    setResult(demoResult);
    setStatus('demo');
    setStatusMessage('Showing pre-seeded sample demonstration.');
    setApiError(null);

    // Save demo run to history as well
    saveToHistory(demoResult, sample.imageDataUrl, sample.title);
  };

  return (
    <section
      id="workspace"
      ref={workspaceTopRef}
      className={`bg-[#FFFFFF] ${isStandaloneStudio ? 'py-6 min-h-[calc(100vh-4.5rem)]' : 'py-16'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Title & Controls Bar */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6742F5] uppercase tracking-wide mb-1.5">
              <span>MULTIMODAL STUDIO</span>
              <span aria-hidden="true">·</span>
              <span>MODEL: {selectedModel.toUpperCase()}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151F] tracking-tight">
              See the problem. Find the next step.
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-[#706D7A] max-w-2xl">
              Upload any screenshot, terminal log, IAM modal, or lecture diagram. Paste with <kbd className="px-1.5 py-0.5 rounded bg-[#F7F6FA] border border-[#17151F]/15 font-mono text-xs text-[#17151F]">Ctrl+V</kbd> or snap with camera.
            </p>
          </div>

          {/* Quick Toolbar (History, Camera, API Key) */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="px-3 py-2 rounded-xl bg-[#F7F6FA] hover:bg-[#F0ECFF] hover:text-[#3921A8] border border-[#17151F]/10 font-semibold text-[#17151F] flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Capture from webcam/camera"
            >
              <Camera className="w-3.5 h-3.5 text-[#6742F5]" />
              <span>Camera</span>
            </button>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-3 py-2 rounded-xl bg-[#F7F6FA] hover:bg-[#F0ECFF] hover:text-[#3921A8] border border-[#17151F]/10 font-semibold text-[#17151F] flex items-center gap-1.5 cursor-pointer transition-colors"
              title="View previous analyses"
            >
              <History className="w-3.5 h-3.5 text-[#6742F5]" />
              <span>History</span>
              {historyItems.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#6742F5] text-white text-[10px] flex items-center justify-center font-bold">
                  {historyItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsApiKeyOpen(true)}
              className={`px-3 py-2 rounded-xl border font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                customApiKey || hasServerEnvKey
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title="Configure API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{customApiKey ? 'Custom Key' : hasServerEnvKey ? 'API Key Ready' : 'Set Key'}</span>
            </button>
          </div>
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
                  ? 'Analyzing image with multimodal model...'
                  : status === 'complete'
                  ? 'Analysis Complete'
                  : status === 'error'
                  ? 'API Notice'
                  : status === 'demo'
                  ? 'Sample Demonstration View'
                  : 'Gemma 4 Ready'}
              </span>
            </div>
            <span aria-hidden="true" className="text-gray-300">|</span>
            <span className="text-[#706D7A] font-mono">{selectedModel}</span>
          </div>

          <div className="flex items-center gap-3 text-[#706D7A]">
            <div className="flex items-center gap-1 text-[#6742F5] bg-[#F0ECFF] px-2 py-0.5 rounded text-[11px] font-semibold">
              <ClipboardPaste className="w-3 h-3" />
              <span>Ctrl+V Clipboard Paste Supported</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[#706D7A]">
              <Shield className="w-3.5 h-3.5 text-[#6742F5]" />
              <span>Direct Vision Encoder (Zero third-party OCR)</span>
            </div>
          </div>
        </div>

        {/* API Error Callout with Recovery */}
        {apiError && (
          <div className="mb-8 p-5 rounded-2xl bg-[#FFF1EE] border border-[#FF8066]/30 text-xs text-[#17151F] space-y-3">
            <div className="flex items-start gap-2.5 font-semibold text-[#FF8066] text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <span>Multimodal API Notice:</span>
                <p className="font-normal text-xs text-[#17151F] mt-1 font-mono">
                  {apiError}
                </p>
              </div>
            </div>
            <p className="text-[#706D7A] pl-7">
              Your image and parameters have been preserved. You can retry with a fallback model, provide your own Gemini API key, or inspect the pre-seeded demonstration immediately.
            </p>
            <div className="pl-7 flex flex-wrap gap-3 pt-1">
              <button
                onClick={handleAnalyze}
                className="px-4 py-2 bg-[#6742F5] text-white font-semibold rounded-xl hover:bg-[#3921A8] transition-colors cursor-pointer"
              >
                Retry Request
              </button>
              <button
                onClick={() => {
                  setSelectedModel('gemini-2.5-flash');
                  setTimeout(handleAnalyze, 100);
                }}
                className="px-4 py-2 bg-[#F0ECFF] text-[#6742F5] font-semibold rounded-xl hover:bg-[#6742F5] hover:text-white transition-colors cursor-pointer"
              >
                Retry with Gemini 2.5 Flash
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
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsZoomOpen(true)}
                      className="text-xs text-[#6742F5] hover:underline font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Zoom</span>
                    </button>
                    <button
                      onClick={clearImage}
                      className="text-xs text-[#FF8066] hover:underline font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
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
                      Click to upload, drag &amp; drop, or press Ctrl+V
                    </p>
                    <p className="text-xs text-[#706D7A] mt-1">
                      PNG, JPEG, WebP, GIF, SVG (up to 20MB)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Preview Container */
                <div className="relative rounded-xl border border-[#17151F]/10 overflow-hidden bg-[#F7F6FA] group">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    onClick={() => setIsZoomOpen(true)}
                    className="w-full max-h-64 object-contain bg-neutral-900/5 p-2 cursor-zoom-in"
                  />
                  <div className="p-3 bg-white border-t border-[#17151F]/10 flex items-center justify-between text-xs text-[#706D7A]">
                    <span className="truncate max-w-[180px] font-medium text-[#17151F]">
                      {imageFileName || 'uploaded-artifact.png'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-[#6742F5] hover:text-[#3921A8] cursor-pointer"
                      >
                        Replace
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
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

            {/* Step 2: Choose Mode & Model */}
            <div className="bg-white rounded-2xl border border-[#17151F]/10 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17151F] uppercase tracking-wide">
                  2. Select Analysis Mode
                </span>

                {/* Model dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#706D7A]">Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="p-1 rounded-lg border border-[#17151F]/15 bg-[#F7F6FA] font-mono text-[11px] text-[#17151F] focus:outline-none focus:ring-1 focus:ring-[#6742F5]"
                  >
                    {AVAILABLE_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                    desc: 'Assignment brief, requirements, or event',
                    icon: ListTodo,
                  },
                  {
                    id: 'understand_notes' as AnalysisMode,
                    title: 'Understand these notes',
                    desc: 'Study slide, handwritten notes, or diagram',
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
                    <span>Analyzing with {selectedModel}...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5" />
                    <span>Analyze with {selectedModel === 'gemma-4-26b-a4b-it' ? 'Gemma 4' : selectedModel}</span>
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

          {/* Right Column: Analysis Result or Empty State */}
          <div className="lg:col-span-7">
            {result ? (
              <ResultView
                result={result}
                imagePreview={imagePreview}
                onReset={resetAll}
                onAnalyzeAnother={clearImage}
                onViewImageZoom={() => setIsZoomOpen(true)}
                apiKey={customApiKey}
              />
            ) : (
              /* Empty / Waiting State */
              <div className="bg-white rounded-3xl border border-[#17151F]/10 p-8 sm:p-12 text-center space-y-6 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-[#F0ECFF] mx-auto flex items-center justify-center text-[#6742F5]">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-[#17151F]">
                    Ready to turn visual confusion into clear action
                  </h3>
                  <p className="text-sm text-[#706D7A] leading-relaxed">
                    Upload an image, snap a camera photo, or test one of the sample scenarios on the left, then click <strong>"Analyze"</strong> to generate a grounded breakdown.
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
                    Click here to instantly try the React 19 Dependency Conflict Sample →
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Auxiliary Modals & Drawers */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl, mime) => {
          setImagePreview(dataUrl);
          setImageMimeType(mime);
          setImageFileName(`camera-capture-${Date.now()}.jpg`);
          setStatus('ready');
          setStatusMessage('Photo captured. Ready to analyze.');
        }}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyItems}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        currentKey={customApiKey}
        onSaveKey={handleSaveApiKey}
        hasEnvKey={hasServerEnvKey}
      />

      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        imageUrl={imagePreview}
        fileName={imageFileName}
      />
    </section>
  );
};
