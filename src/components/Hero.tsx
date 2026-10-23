import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, FileCode2, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onAnalyzeClick: () => void;
  onExploreSample: (sampleId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeClick, onExploreSample }) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-white">
      {/* Subtle editorial geometric accent lines */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-40">
        <svg width="100%" height="100%" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="450" cy="180" r="280" stroke="#F0ECFF" strokeWidth="1.5" />
          <circle cx="450" cy="180" r="180" stroke="#6742F5" strokeWidth="0.75" strokeDasharray="4 6" opacity="0.4" />
          <line x1="150" y1="360" x2="600" y2="360" stroke="#F0ECFF" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Strong Typography & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#6742F5] uppercase">
              <span>VISUAL INTELLIGENCE, MADE USEFUL</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#706D7A] font-normal normal-case">Oracle Kolkata Hack Day</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#17151F] leading-[1.08] text-balance">
              Confused by what you see? <span className="text-[#6742F5]">Start here.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#706D7A] leading-relaxed max-w-xl">
              Turn screenshots, error messages, notices, and study notes into clear explanations and practical next steps.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onAnalyzeClick}
                className="px-7 py-3.5 text-base font-semibold text-white bg-[#6742F5] hover:bg-[#3921A8] active:scale-[0.98] transition-all rounded-xl shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2.5"
              >
                <span>Analyze an image</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onExploreSample('sample-error')}
                className="px-6 py-3.5 text-base font-semibold text-[#17151F] bg-[#F7F6FA] hover:bg-[#F0ECFF] hover:text-[#3921A8] transition-all rounded-xl border border-[#17151F]/10 cursor-pointer flex items-center gap-2"
              >
                <span>Explore a sample</span>
                <ArrowUpRight className="w-4 h-4 text-[#706D7A]" />
              </button>
            </div>

            {/* Quiet unboxed metadata */}
            <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-[#706D7A]">
              <span className="font-semibold text-[#17151F]">Model:</span>
              <span className="font-mono text-[#6742F5]">gemma-4-26b-a4b-it</span>
              <span aria-hidden="true">·</span>
              <span>No proprietary proxies</span>
              <span aria-hidden="true">·</span>
              <span>Server-side GenAI SDK</span>
            </div>
          </div>

          {/* Right Column: Large Editorial Product Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl border border-[#17151F]/10 bg-[#F7F6FA] p-3 sm:p-5 shadow-lg shadow-[#17151F]/5">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#17151F]/10 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF8066]" />
                  <div className="w-3 h-3 rounded-full bg-[#D7F36B] border border-black/10" />
                  <div className="w-3 h-3 rounded-full bg-[#6742F5]/40" />
                  <span className="ml-2 text-xs font-mono text-[#706D7A]">claritylens.app / workspace</span>
                </div>
                <div className="text-xs text-[#706D7A] flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Gemma 4 active</span>
                </div>
              </div>

              {/* Processing Visual Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                {/* Left Mini Screenshot Preview */}
                <div className="sm:col-span-5 bg-[#0D1117] rounded-xl p-3 text-white space-y-2 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pb-1 border-b border-white/10">
                      <span>terminal.log</span>
                      <span className="text-[#FF8066]">npm ERR!</span>
                    </div>
                    <div className="font-mono text-[11px] leading-tight text-gray-300 pt-2 space-y-1">
                      <p className="text-emerald-400">➜ npm i @tanstack/react-query</p>
                      <p className="text-red-400 font-semibold">code ERESOLVE</p>
                      <p className="text-gray-400 text-[10px]">peer react@"^18.0.0" from @tanstack/react-query</p>
                      <p className="text-[#FF8066] text-[10px] font-semibold">Found: react@19.0.0</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Input image</span>
                    <span className="text-[#D7F36B]">100% Grounded</span>
                  </div>
                </div>

                {/* Right Result Card Preview */}
                <div className="sm:col-span-7 bg-white rounded-xl p-3.5 border border-[#17151F]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6742F5] uppercase tracking-wide">Analysis Result</span>
                    <span className="text-[11px] text-[#706D7A]">Mode: Fix this error</span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[#17151F] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FF8066]" />
                      <span>Peer dependency mismatch detected</span>
                    </p>
                    <p className="text-[12px] text-[#706D7A] leading-snug">
                      React 19 installed in project conflicts with TanStack Query's strict React 18 peer requirement.
                    </p>
                  </div>

                  {/* Action items preview */}
                  <div className="pt-1 space-y-1.5 border-t border-[#17151F]/5">
                    <div className="text-[11px] font-semibold text-[#17151F]">Prioritized Next Steps:</div>
                    <div className="flex items-start gap-2 text-[11px] text-[#17151F] bg-[#F7F6FA] p-1.5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6742F5] mt-0.5 shrink-0" />
                      <span>Run with <code className="text-[#3921A8] font-mono font-medium">--legacy-peer-deps</code></span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] text-[#17151F] bg-[#F7F6FA] p-1.5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6742F5] mt-0.5 shrink-0" />
                      <span>Check TanStack Query v5.35+ React 19 support</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Feature Tags */}
              <div className="mt-3.5 pt-3 border-t border-[#17151F]/10 flex flex-wrap items-center justify-between text-xs text-[#706D7A]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#17151F]">Workflow:</span>
                  <span>Upload</span>
                  <span>→</span>
                  <span>Select Mode</span>
                  <span>→</span>
                  <span className="font-semibold text-[#6742F5]">Gemma 4 Real Inference</span>
                </div>
                <button
                  onClick={() => onExploreSample('sample-error')}
                  className="text-xs font-semibold text-[#6742F5] hover:text-[#3921A8] cursor-pointer"
                >
                  Load this live demo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
