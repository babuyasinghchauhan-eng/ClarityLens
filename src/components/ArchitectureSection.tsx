import React from 'react';
import { Eye, CheckCircle2, ShieldCheck, HelpCircle, Layers, Lock, Cpu, Globe } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="gemma-model" className="py-20 bg-[#F7F6FA] border-t border-[#17151F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section C: Built around what you actually need */}
        <div>
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-semibold tracking-wider text-[#6742F5] uppercase mb-2">
              OUTPUT PILLARS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151F] tracking-tight">
              Built around what you actually need.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#706D7A]">
              Every analysis is structured into five intentional dimensions designed to eliminate ambiguity and prevent costly missteps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-[#17151F]/10 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0ECFF] flex items-center justify-center text-[#6742F5]">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17151F]">1. What I See</h3>
              <p className="text-xs text-[#706D7A] leading-relaxed">
                Objective scene synthesis identifying visual context, active windows, document type, and primary subject matter.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#17151F]/10 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF1EE] flex items-center justify-center text-[#FF8066]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17151F]">2. Important Details</h3>
              <p className="text-xs text-[#706D7A] leading-relaxed">
                Verbatim extraction of error codes, package versions, warning banners, dates, and interface toggles present in pixels.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#17151F]/10 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0ECFF] flex items-center justify-center text-[#3921A8]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17151F]">3. What It Means</h3>
              <p className="text-xs text-[#706D7A] leading-relaxed">
                Deep analytical explanation tailored to the mode (security risks, dependency graphs, conceptual math, or deliverable scopes).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#17151F]/10 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17151F]">4. Your Next Steps</h3>
              <p className="text-xs text-[#706D7A] leading-relaxed">
                Ordered, checkable action items with high, medium, and low urgency tags so you know exactly which command to run first.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#17151F]/10 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#17151F]">5. Things to Verify</h3>
              <p className="text-xs text-[#706D7A] leading-relaxed">
                Honest recognition of cropped areas, ambiguous resolutions, or unconfirmed system states rather than misleading guesses.
              </p>
            </div>
          </div>
        </div>

        {/* Section D: The model behind the clarity */}
        <div className="bg-white rounded-3xl border border-[#17151F]/10 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6742F5] tracking-wide uppercase">
                <span>MODEL ARCHITECTURE &amp; TRANSPARENCY</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151F] tracking-tight">
                The model behind the clarity: <span className="text-[#6742F5]">Gemma 4</span>
              </h2>

              <p className="text-base text-[#706D7A] leading-relaxed">
                ClarityLens runs on <strong className="text-[#17151F] font-mono">gemma-4-26b-a4b-it</strong>, Google's advanced multimodal open-weights model. Unlike traditional pipelines that run separate optical character recognition (OCR) and text LLMs, Gemma 4 consumes image tokens and text instructions in a unified transformer backbone.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F7F6FA] border border-[#17151F]/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#17151F]">
                    <Cpu className="w-4 h-4 text-[#6742F5]" />
                    <span>Native Multimodal Weights</span>
                  </div>
                  <p className="text-xs text-[#706D7A]">
                    Trained directly on paired visual-text tokens to preserve spatial relationships, bounding contexts, and typographic hierarchy.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6FA] border border-[#17151F]/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#17151F]">
                    <Lock className="w-4 h-4 text-[#6742F5]" />
                    <span>Server-Side GenAI SDK</span>
                  </div>
                  <p className="text-xs text-[#706D7A]">
                    Executed securely via an Express backend endpoint using <code className="text-[#6742F5] font-mono">@google/genai</code>. Never exposes client keys.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6FA] border border-[#17151F]/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#17151F]">
                    <ShieldCheck className="w-4 h-4 text-[#6742F5]" />
                    <span>Strict Grounding Directives</span>
                  </div>
                  <p className="text-xs text-[#706D7A]">
                    Low-temperature sampling (0.2) and prompt guardrails force the model to decline unsupported claims and mark uncertainties.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6FA] border border-[#17151F]/5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#17151F]">
                    <Globe className="w-4 h-4 text-[#6742F5]" />
                    <span>Full Disclosure Notice</span>
                  </div>
                  <p className="text-xs text-[#706D7A]">
                    Images and prompts are sent to Google's Gen AI API endpoint for processing. Hosted inference does not run client-side offline.
                  </p>
                </div>
              </div>
            </div>

            {/* Model Spec Card */}
            <div className="lg:col-span-5 bg-[#17151F] text-white rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-[#D7F36B]">model_spec.json</span>
                <span className="text-[11px] text-gray-400">Oracle Kolkata Hack Day</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-gray-300">
                <div>
                  <span className="text-gray-400">MODEL_ID:</span>{' '}
                  <span className="text-[#FF8066] font-bold">"gemma-4-26b-a4b-it"</span>
                </div>
                <div>
                  <span className="text-gray-400">INPUT_MODALITIES:</span>{' '}
                  <span className="text-[#D7F36B]">["image/png", "image/jpeg", "image/webp", "text"]</span>
                </div>
                <div>
                  <span className="text-gray-400">OUTPUT_FORMAT:</span>{' '}
                  <span className="text-[#79C0FF]">application/json (Structured Schema)</span>
                </div>
                <div>
                  <span className="text-gray-400">TEMPERATURE:</span>{' '}
                  <span className="text-white">0.2 (Optimized for Groundedness)</span>
                </div>
                <div>
                  <span className="text-gray-400">BACKEND_SDK:</span>{' '}
                  <span className="text-white">@google/genai ^2.4.0</span>
                </div>
                <div>
                  <span className="text-gray-400">INFERENCE_ENV:</span>{' '}
                  <span className="text-white">Express API Proxy (server.ts)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400">
                Google Gemma is built from the same research and technology used to create Gemini models.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
