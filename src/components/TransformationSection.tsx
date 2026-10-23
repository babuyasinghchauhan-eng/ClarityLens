import React, { useState } from 'react';
import { Eye, ShieldAlert, Cpu, CheckSquare2, ArrowRight } from 'lucide-react';

export const TransformationSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: '01',
      title: 'Visual Input Ingestion',
      subtitle: 'Raw confusing screenshot or photo',
      desc: 'You capture a terminal error, an ambiguous IAM security notice, a hackathon brief, or lecture slides. No manual transcriptions or prompt engineering needed.',
      highlight: 'Lossless Base64 input',
    },
    {
      num: '02',
      title: 'Gemma 4 Multimodal Parsing',
      subtitle: 'Native visual-linguistic comprehension',
      desc: 'Gemma 4 (gemma-4-26b-a4b-it) processes pixels and spatial layouts natively. It recognizes UI elements, status flags, and syntax trees directly in visual space.',
      highlight: '26B parameters vision backbone',
    },
    {
      num: '03',
      title: 'Image-Grounded Detail Extraction',
      subtitle: 'Verbatim quotes, zero fabrication',
      desc: 'The model extracts visible error codes, package names, deadlines, and button labels. It explicitly refuses to invent missing context or unseen stack frames.',
      highlight: 'Strict anti-hallucination bounds',
    },
    {
      num: '04',
      title: 'Actionable Next Steps & Checklists',
      subtitle: 'Prioritized, executable guidance',
      desc: 'ClarityLens transforms confusing noise into what you should actually do: categorized by High, Medium, or Low urgency, plus explicit things to verify.',
      highlight: 'Interactive, checkable output',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F7F6FA] border-y border-[#17151F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold tracking-wider text-[#6742F5] uppercase mb-2">
            TRANSFORMATION PIPELINE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151F] tracking-tight">
            From visual noise to clarity.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#706D7A]">
            Watch how a baffling visual artifact is grounded into structured explanations and concrete steps in under 4 seconds.
          </p>
        </div>

        {/* 4-Step Interactive Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx + 1;
            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx + 1)}
                className={`p-6 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-white border-[#6742F5] shadow-md ring-1 ring-[#6742F5]/20'
                    : 'bg-white/80 border-[#17151F]/10 hover:border-[#6742F5]/40 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-mono font-bold text-[#6742F5]">{step.num}</span>
                  <span className="text-xs font-medium text-[#706D7A]">{step.highlight}</span>
                </div>
                <h3 className="text-lg font-bold text-[#17151F] mb-1">{step.title}</h3>
                <p className="text-xs font-semibold text-[#6742F5] mb-2.5">{step.subtitle}</p>
                <p className="text-sm text-[#706D7A] leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Live Transformation Demo Card */}
        <div className="mt-12 bg-white rounded-2xl border border-[#17151F]/10 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Input Side */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#706D7A]">
                <span className="flex items-center gap-1.5 text-[#17151F]">
                  <Eye className="w-4 h-4 text-[#6742F5]" />
                  <span>Input: Software Crash Screenshot</span>
                </span>
                <span className="font-mono text-emerald-600">640 × 380px</span>
              </div>
              <div className="bg-[#0D1117] rounded-xl p-4 text-xs font-mono text-gray-200 border border-black/20 space-y-1.5 overflow-x-auto">
                <div className="text-gray-400"># Terminal output snippet:</div>
                <div className="text-red-400 font-semibold">npm ERR! code ERESOLVE</div>
                <div className="text-yellow-300">peer react@"^18.0.0" from @tanstack/react-query</div>
                <div className="text-white">Found: react@19.0.0 in root package.json</div>
                <div className="text-gray-500 text-[11px] pt-1">npm ERR! unable to resolve dependency tree</div>
              </div>
              <p className="text-xs text-[#706D7A]">
                Often an engineer spends 30 minutes Googling conflicting forum threads. ClarityLens extracts the root cause immediately.
              </p>
            </div>

            {/* Pipeline Center Arrow */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#F0ECFF] flex items-center justify-center text-[#6742F5] mb-2">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-[#17151F]">Gemma 4</span>
              <span className="text-[11px] text-[#706D7A]">Multimodal</span>
            </div>

            {/* Structured Output Side */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#706D7A]">
                <span className="flex items-center gap-1.5 text-[#17151F]">
                  <CheckSquare2 className="w-4 h-4 text-[#6742F5]" />
                  <span>Output: Structured Guidance</span>
                </span>
                <span className="text-[#6742F5] font-semibold">Ready in 2.8s</span>
              </div>
              <div className="bg-[#F7F6FA] rounded-xl p-4 border border-[#17151F]/10 space-y-2.5 text-xs">
                <div>
                  <span className="font-semibold text-[#17151F]">What I See: </span>
                  <span className="text-[#706D7A]">An npm ERESOLVE peer dependency clash between React 19 and TanStack Query.</span>
                </div>
                <div className="pt-2 border-t border-[#17151F]/10">
                  <div className="font-semibold text-[#17151F] mb-1">Your Next Steps:</div>
                  <ul className="space-y-1.5 text-[#706D7A]">
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-bold text-[#FF8066]">1. High:</span>
                      <span>Run <code className="text-[#3921A8] font-mono">npm i @tanstack/react-query --legacy-peer-deps</code></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-xs font-bold text-[#6742F5]">2. Med:</span>
                      <span>Verify TanStack v5.35+ release notes for official React 19 support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
