import React from 'react';
import { Monitor, Bug, ListTodo, BookOpen, ArrowRight } from 'lucide-react';
import { AnalysisMode } from '../types/clarity';

interface ModesSectionProps {
  onSelectMode: (mode: AnalysisMode, sampleId?: string) => void;
}

export const ModesSection: React.FC<ModesSectionProps> = ({ onSelectMode }) => {
  const modes = [
    {
      id: 'explain_screen' as AnalysisMode,
      sampleId: 'sample-screen',
      title: 'Explain this screen',
      icon: Monitor,
      eyebrow: 'INTERFACE & NOTICE PARSING',
      tagline: 'Understand unfamiliar apps, cloud consoles, or confusing modals.',
      description: 'Break down complex screens, identify hidden risk toggles, clarify terminology, and determine the safest path forward before clicking.',
      samplePreview: 'Cloud IAM Policy Modal · Wildcard privileges detection',
      accentColor: 'text-[#6742F5]',
      bgBadge: 'bg-[#F0ECFF]',
    },
    {
      id: 'fix_error' as AnalysisMode,
      sampleId: 'sample-error',
      title: 'Fix this error',
      icon: Bug,
      eyebrow: 'SOFTWARE & TERMINAL DIAGNOSTICS',
      tagline: 'Beginner-friendly error explanations and safe troubleshooting commands.',
      description: 'Quote the exact error lines, pinpoint the underlying conflict without guessing, and get ordered diagnostic steps to safely recover.',
      samplePreview: 'Terminal ERESOLVE crash · React 19 peer conflict',
      accentColor: 'text-[#FF8066]',
      bgBadge: 'bg-[#FFF1EE]',
    },
    {
      id: 'extract_tasks' as AnalysisMode,
      sampleId: 'sample-brief',
      title: 'Turn this into tasks',
      icon: ListTodo,
      eyebrow: 'REQUIREMENTS & ACTION EXTRACTION',
      tagline: 'Read an assignment brief, email, or announcement into concrete action items.',
      description: 'Extract hard submission deadlines, mandatory deliverables, and scoring criteria into a prioritized checklist with clear urgencies.',
      samplePreview: 'Hackathon Challenge Brief · Scoring criteria & deadlines',
      accentColor: 'text-[#3921A8]',
      bgBadge: 'bg-[#F0ECFF]',
    },
    {
      id: 'understand_notes' as AnalysisMode,
      sampleId: 'sample-notes',
      title: 'Understand these notes',
      icon: BookOpen,
      eyebrow: 'STUDY SLIDES & WHITEBOARDS',
      tagline: 'Explain photographed handwriting, diagrams, and mathematical formulas.',
      description: 'Synthesize formulas, diagrammatic flows, and conceptual foundations. Formulate an active recall review checklist for exams or meetings.',
      samplePreview: 'CS 224N Lecture Notes · Scaled dot-product attention math',
      accentColor: 'text-[#059669]',
      bgBadge: 'bg-[#ECFDF5]',
    },
  ];

  return (
    <section id="capabilities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold tracking-wider text-[#6742F5] uppercase mb-2">
            INTELLIGENCE MODES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151F] tracking-tight">
            One image. A clearer way forward.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#706D7A]">
            Tailored visual comprehension designed for real everyday problem spaces. Click any mode to test it with a curated sample scenario.
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                className="group relative bg-[#F7F6FA] hover:bg-white border border-[#17151F]/10 hover:border-[#6742F5]/30 rounded-2xl p-7 transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#17151F]/10 flex items-center justify-center shadow-xs">
                      <Icon className={`w-6 h-6 ${mode.accentColor}`} />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide text-[#706D7A] uppercase">
                      {mode.eyebrow}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#17151F] group-hover:text-[#6742F5] transition-colors">
                    {mode.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#17151F]/80">
                    {mode.tagline}
                  </p>
                  <p className="mt-3 text-sm text-[#706D7A] leading-relaxed">
                    {mode.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#17151F]/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#706D7A] truncate max-w-[240px]">
                    <span className="font-semibold text-[#17151F]">Sample: </span>
                    <span>{mode.samplePreview}</span>
                  </div>

                  <button
                    onClick={() => onSelectMode(mode.id, mode.sampleId)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6742F5] hover:text-[#3921A8] group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Try in workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
