import React from 'react';
import { ArrowUpRight, Github, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onOpenWorkspace: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenWorkspace }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#17151F] text-white">
      {/* Section E: Final Call To Action */}
      <div className="border-b border-white/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="text-xs font-semibold tracking-wider text-[#D7F36B] uppercase">
            GET STARTED NOW
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto text-balance">
            Make the next step obvious.
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Stop guessing what error logs, cryptic dialogs, or lecture diagrams mean. Analyze an image with Gemma 4 in seconds.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenWorkspace}
              className="px-8 py-4 text-base font-bold text-[#17151F] bg-[#D7F36B] hover:bg-[#c6e655] rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-2"
            >
              <span>Try ClarityLens</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Attribution */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#6742F5] flex items-center justify-center text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <path d="M11 8v6"/>
                  <path d="M8 11h6"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">ClarityLens</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Multimodal visual intelligence powered by Gemma 4 (<code className="text-[#D7F36B] font-mono">gemma-4-26b-a4b-it</code>). Turn what you see into what you should do next.
            </p>
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span>Built for</span>
              <span className="text-white font-medium">Hacktoberfest Hack Day x Oracle Kolkata</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Navigation
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('capabilities')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Capabilities &amp; Modes
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('gemma-model')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Gemma 4 Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('workspace')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Interactive Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & External Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Model &amp; Open Source
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Gemma on Google Gen AI Docs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://ai.google.dev/gemma/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Google Gemma Terms of Use</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Google AI Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal & Licensing Separation */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <span>ClarityLens application code is licensed under the </span>
            <span className="text-white font-medium">MIT License</span>
            <span>. Model weights and access are subject to the </span>
            <a
              href="https://ai.google.dev/gemma/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D7F36B] hover:underline"
            >
              Gemma Terms of Use
            </a>
            <span>.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[#FF8066] fill-[#FF8066]" />
            <span>for Hacktoberfest Hack Day x Oracle Kolkata</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
