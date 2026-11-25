import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Eye,
  List,
  Cpu,
  CheckSquare,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Terminal,
  MessageSquare,
  Send,
  Loader2,
  FileText,
  FileCode,
  Filter,
  Maximize2
} from 'lucide-react';
import { AnalysisResult, NextStepItem, PriorityLevel, ChatMessage } from '../types/clarity';
import { formatMarkdownReport, formatPlainTextReport, triggerFileDownload } from '../utils/exportUtils';

interface ResultViewProps {
  result: AnalysisResult;
  imagePreview: string | null;
  onReset: () => void;
  onAnalyzeAnother: () => void;
  onViewImageZoom?: () => void;
  apiKey?: string;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  imagePreview,
  onReset,
  onAnalyzeAnother,
  onViewImageZoom,
  apiKey,
}) => {
  const [steps, setSteps] = useState<NextStepItem[]>(result.next_steps);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'all'>('all');
  
  // Follow-up chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'chat'>('breakdown');

  const toggleStep = (id: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => {
      setCopiedSection((current) => (current === sectionKey ? null : current));
    }, 2000);
  };

  const handleCopySnippet = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => {
      setCopiedSnippetId((current) => (current === id ? null : current));
    }, 2000);
  };

  // Export handlers
  const handleDownloadMarkdown = () => {
    const md = formatMarkdownReport(result, steps);
    triggerFileDownload(md, `claritylens-${result.mode}-${Date.now()}.md`, 'text/markdown;charset=utf-8');
  };

  const handleDownloadTxt = () => {
    const txt = formatPlainTextReport(result, steps);
    triggerFileDownload(txt, `claritylens-${result.mode}-${Date.now()}.txt`, 'text/plain;charset=utf-8');
  };

  const handleDownloadJson = () => {
    const data = {
      ...result,
      next_steps: steps,
      exportedAt: new Date().toISOString(),
    };
    triggerFileDownload(JSON.stringify(data, null, 2), `claritylens-${result.mode}-${Date.now()}.json`, 'application/json');
  };

  // Handle follow-up chat dispatch
  const handleSendFollowUp = async (questionToSend?: string) => {
    const query = (questionToSend || chatInput).trim();
    if (!query || isChatLoading) return;

    setChatError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-gemini-api-key': apiKey } : {}),
        },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mode: result.mode,
          message: query,
          analysisSummary: result.explanation,
          history: chatMessages.map((m) => ({ role: m.role, content: m.content })),
          requestedModel: result.model_used,
          apiKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get follow-up response.');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
        modelUsed: data.modelUsed,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setChatError(err.message || 'Error communicating with assistant.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;
  const filteredSteps = priorityFilter === 'all'
    ? steps
    : steps.filter((s) => s.priority === priorityFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Navigator */}
      <div className="bg-white rounded-2xl border border-[#17151F]/10 p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6742F5] uppercase tracking-wide">
            <span>MULTIMODAL SYNTHESIS COMPLETE</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#706D7A]">{result.model_used}</span>
            {result.latencyMs && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-mono">
                  {result.latencyMs}ms
                </span>
              </>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17151F] mt-1">
            Visual Grounding Breakdown
          </h2>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {result.isDemoSample && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFF1EE] text-[#FF8066] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sample Demonstration View</span>
              </div>
            )}
            {result.fallbackUsed && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                <span>Fast Model Fallback ({result.model_used})</span>
              </div>
            )}
          </div>
        </div>

        {/* Global Result Actions & Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab switch between Structured Breakdown and Follow-up Chat */}
          <div className="flex bg-[#F7F6FA] p-1 rounded-xl border border-[#17151F]/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'breakdown'
                  ? 'bg-white text-[#17151F] shadow-xs'
                  : 'text-[#706D7A] hover:text-[#17151F]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-white text-[#6742F5] shadow-xs'
                  : 'text-[#706D7A] hover:text-[#17151F]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Follow-up</span>
              {chatMessages.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#6742F5] text-white text-[10px] flex items-center justify-center font-bold">
                  {chatMessages.length}
                </span>
              )}
            </button>
          </div>

          {/* Export Dropdown / Actions */}
          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 text-xs font-semibold text-[#17151F] bg-[#F7F6FA] hover:bg-[#F0ECFF] hover:text-[#3921A8] border border-[#17151F]/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download formatted GitHub Markdown (.md)"
          >
            <FileCode className="w-3.5 h-3.5 text-[#6742F5]" />
            <span>Markdown</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 text-xs font-semibold text-[#17151F] bg-[#F7F6FA] hover:bg-[#F0ECFF] hover:text-[#3921A8] border border-[#17151F]/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download plain text report (.txt)"
          >
            <Download className="w-3.5 h-3.5 text-[#706D7A]" />
            <span>.TXT</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-3 py-1.5 text-xs font-semibold text-[#17151F] bg-[#F7F6FA] hover:bg-[#F0ECFF] hover:text-[#3921A8] border border-[#17151F]/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download raw structured JSON"
          >
            <FileCode className="w-3.5 h-3.5 text-[#706D7A]" />
            <span>JSON</span>
          </button>

          <button
            onClick={onReset}
            className="p-2 text-[#706D7A] hover:text-[#17151F] hover:bg-[#F7F6FA] border border-[#17151F]/10 rounded-xl transition-colors cursor-pointer"
            title="Reset workspace"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'breakdown' ? (
        <div className="space-y-6">
          {/* Section 1: What I See */}
          <div className="bg-white rounded-2xl border border-[#17151F]/10 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F0ECFF] flex items-center justify-center text-[#6742F5]">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#17151F]">1. What I See</h3>
              </div>
              <button
                onClick={() => handleCopy(result.image_summary, 'summary')}
                className="text-xs text-[#706D7A] hover:text-[#6742F5] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'summary' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm text-[#17151F] leading-relaxed pl-10">
              {result.image_summary}
            </p>
          </div>

          {/* Section 2: Important Details */}
          <div className="bg-white rounded-2xl border border-[#17151F]/10 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF1EE] flex items-center justify-center text-[#FF8066]">
                  <List className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#17151F]">2. The Important Details</h3>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    result.important_details.map((d) => `• ${d}`).join('\n'),
                    'details'
                  )
                }
                className="text-xs text-[#706D7A] hover:text-[#6742F5] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'details' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'details' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <ul className="pl-10 space-y-2 text-sm text-[#17151F]">
              {result.important_details.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6742F5] mt-2 shrink-0" />
                  <span className="leading-relaxed font-mono text-xs bg-[#F7F6FA] px-2 py-1 rounded border border-[#17151F]/5">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: What It Means */}
          <div className="bg-white rounded-2xl border border-[#17151F]/10 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F0ECFF] flex items-center justify-center text-[#3921A8]">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#17151F]">3. What It Means</h3>
              </div>
              <button
                onClick={() => handleCopy(result.explanation, 'explanation')}
                className="text-xs text-[#706D7A] hover:text-[#6742F5] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'explanation' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'explanation' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm text-[#17151F] leading-relaxed pl-10">
              {result.explanation}
            </p>
          </div>

          {/* Section 4: Your Next Steps (Interactive Checkable List with Filter & Progress) */}
          <div className="bg-white rounded-2xl border border-[#17151F]/10 p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17151F]">4. Your Next Steps</h3>
                  <div className="text-xs text-[#706D7A]">
                    {completedCount} of {steps.length} completed ({progressPct}%)
                  </div>
                </div>
              </div>

              {/* Priority Filters */}
              <div className="flex items-center gap-1.5 text-xs">
                <Filter className="w-3.5 h-3.5 text-[#706D7A]" />
                {(['all', 'high', 'medium', 'low'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setPriorityFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg uppercase tracking-wide font-semibold text-[10px] cursor-pointer transition-colors ${
                      priorityFilter === lvl
                        ? 'bg-[#6742F5] text-white shadow-xs'
                        : 'bg-[#F7F6FA] text-[#706D7A] hover:bg-[#F0ECFF]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#F7F6FA] h-2 rounded-full overflow-hidden border border-[#17151F]/5">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Steps List */}
            <div className="space-y-3 pt-1">
              {filteredSteps.map((step) => {
                const isHigh = step.priority === 'high';
                const isMed = step.priority === 'medium';
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all ${
                      step.completed
                        ? 'bg-[#F7F6FA] border-[#17151F]/5 opacity-65'
                        : 'bg-white border-[#17151F]/10 hover:border-[#6742F5]/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={!!step.completed}
                        onChange={() => toggleStep(step.id)}
                        className="w-4 h-4 mt-1 rounded border-[#706D7A] text-[#6742F5] focus:ring-[#6742F5] cursor-pointer shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className={`text-sm font-semibold cursor-pointer ${
                              step.completed ? 'line-through text-[#706D7A]' : 'text-[#17151F]'
                            }`}
                            onClick={() => toggleStep(step.id)}
                          >
                            {step.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              isHigh
                                ? 'bg-[#FFF1EE] text-[#FF8066]'
                                : isMed
                                ? 'bg-[#F0ECFF] text-[#6742F5]'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {step.priority}
                          </span>
                        </div>

                        <p className="text-xs text-[#706D7A] leading-relaxed">
                          {step.description}
                        </p>

                        {/* Optional Code / Command Snippet */}
                        {step.codeSnippet && (
                          <div className="mt-2 bg-[#0D1117] text-gray-200 rounded-lg p-2.5 text-xs font-mono flex items-center justify-between gap-3 border border-black/20">
                            <div className="flex items-center gap-2 overflow-x-auto">
                              <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-emerald-300 font-semibold">{step.codeSnippet}</span>
                            </div>
                            <button
                              onClick={() => handleCopySnippet(step.codeSnippet!, step.id)}
                              className="text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedSnippetId === step.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Things to Verify */}
          <div className="bg-white rounded-2xl border border-[#17151F]/10 p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center text-[#D97706]">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#17151F]">5. Things to Verify (Uncertainties)</h3>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    result.uncertainties.map((u) => `• ${u}`).join('\n'),
                    'uncertainties'
                  )
                }
                className="text-xs text-[#706D7A] hover:text-[#6742F5] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'uncertainties' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'uncertainties' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="pl-10 space-y-2">
              {result.uncertainties.length > 0 ? (
                <ul className="space-y-2 text-sm text-[#706D7A]">
                  {result.uncertainties.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#706D7A]">
                  No ambiguous or missing visual elements detected in the provided image.
                </p>
              )}
            </div>
          </div>

          {/* Proactive Follow-up question banner (Clickable) */}
          {result.follow_up_question && (
            <div className="bg-[#F0ECFF]/70 rounded-2xl border border-[#6742F5]/25 p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3 max-w-xl">
                <HelpCircle className="w-5 h-5 text-[#6742F5] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#3921A8] uppercase tracking-wide">
                    Suggested Next Question
                  </div>
                  <p className="text-sm text-[#17151F] font-medium mt-0.5">
                    "{result.follow_up_question}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  handleSendFollowUp(result.follow_up_question);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#6742F5] hover:bg-[#3921A8] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Ask this question</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Follow-up Conversation with Image */
        <div className="bg-white rounded-2xl border border-[#17151F]/10 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#17151F]/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F0ECFF] flex items-center justify-center text-[#6742F5]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17151F]">
                  Conversational Multimodal Assistant
                </h3>
                <p className="text-xs text-[#706D7A]">
                  Ask questions, request code, or explore alternative resolutions for this image.
                </p>
              </div>
            </div>

            {result.follow_up_question && chatMessages.length === 0 && (
              <button
                onClick={() => handleSendFollowUp(result.follow_up_question)}
                className="text-xs font-semibold text-[#6742F5] hover:underline cursor-pointer"
              >
                Suggested: "{result.follow_up_question}"
              </button>
            )}
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {chatMessages.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <HelpCircle className="w-10 h-10 text-[#706D7A]/40 mx-auto" />
                <p className="text-sm text-[#706D7A] max-w-md mx-auto">
                  No follow-up messages yet. You can ask anything about the analyzed image, request commands, or ask for clarification.
                </p>
                {result.follow_up_question && (
                  <button
                    onClick={() => handleSendFollowUp(result.follow_up_question)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0ECFF] text-[#6742F5] text-xs font-semibold hover:bg-[#6742F5] hover:text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Ask: "{result.follow_up_question}"</span>
                  </button>
                )}
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#6742F5] text-white'
                        : 'bg-[#F7F6FA] text-[#17151F] border border-[#17151F]/10'
                    }`}
                  >
                    <div className="font-semibold text-[10px] uppercase opacity-75 mb-1">
                      {msg.role === 'user' ? 'You' : `Assistant (${msg.modelUsed || result.model_used})`}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <span className="text-[10px] text-[#706D7A] mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-[#6742F5] font-semibold py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Assistant is consulting the image and generating response...</span>
              </div>
            )}

            {chatError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                {chatError}
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-2 border-t border-[#17151F]/10 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendFollowUp()}
              placeholder="Ask a question about this image or request specific commands..."
              className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-[#17151F]/15 focus:outline-none focus:ring-2 focus:ring-[#6742F5] bg-[#F7F6FA]"
            />
            <button
              onClick={() => handleSendFollowUp()}
              disabled={!chatInput.trim() || isChatLoading}
              className={`p-3 rounded-xl text-white font-semibold transition-all cursor-pointer flex items-center justify-center ${
                !chatInput.trim() || isChatLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#6742F5] hover:bg-[#3921A8]'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Workspace Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onAnalyzeAnother}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-[#6742F5] hover:bg-[#3921A8] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Analyze Another Image
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-[#706D7A] hover:text-[#17151F] cursor-pointer"
        >
          Clear Workspace
        </button>
      </div>
    </div>
  );
};
