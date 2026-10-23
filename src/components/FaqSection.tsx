import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Which exact model powers ClarityLens?',
      answer:
        'ClarityLens is powered by gemma-4-26b-a4b-it, Google\'s open-weights multimodal vision-language model. Model calls are handled server-side via the official @google/genai SDK, ensuring zero exposure of secrets while sending both image pixels and tailored mode prompts.',
    },
    {
      question: 'How does multimodal visual reasoning work without traditional OCR?',
      answer:
        'Traditional systems use a separate optical character recognition (OCR) engine and feed the resulting plain text into an LLM. Gemma 4 combines vision encoder layers and language weights into an integrated transformer backbone. It interprets visual layout, hierarchy, error colors, and typographic relationships natively as image tokens.',
    },
    {
      question: 'Are my uploaded images stored or logged?',
      answer:
        'No. ClarityLens does not persist your images in browser storage or database backends. The image is converted to a base64 payload in memory solely to process the current inference request with Gemma 4, and discarded thereafter.',
    },
    {
      question: 'What happens if an image has cut-off or illegible text?',
      answer:
        'Unlike models that hallucinate missing information to appear confident, ClarityLens prompts Gemma 4 with strict grounding directives. Any unreadable text, cut-off stack frames, or unconfirmed system details are placed into the "Things to verify" section accompanied by a helpful follow-up question.',
    },
    {
      question: 'Can I export or reuse the generated next steps?',
      answer:
        'Yes. You can copy the full structured text report, copy individual sections, or download a clean timestamped plain-text report (.txt). You can also interactively check off next steps as you complete them.',
    },
    {
      question: 'How does this project fulfill the Hack Day requirements?',
      answer:
        'Built for the Hacktoberfest Hack Day x Oracle Kolkata "Best Use of Gemma 4" challenge. It implements genuine multimodal image-to-action reasoning with gemma-4-26b-a4b-it, adheres to open-source licensing (MIT), distinguishes Gemma model terms, and provides full setup documentation.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white border-t border-[#17151F]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold tracking-wider text-[#6742F5] uppercase mb-2">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17151F] tracking-tight">
            Everything you need to know.
          </h2>
          <p className="mt-3 text-base text-[#706D7A]">
            Learn how Gemma 4 visual intelligence works under the hood.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-[#17151F]/10 rounded-2xl overflow-hidden transition-colors bg-[#F7F6FA]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-[#17151F] hover:text-[#6742F5] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div className="shrink-0 text-[#706D7A]">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#706D7A] leading-relaxed border-t border-[#17151F]/5 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
