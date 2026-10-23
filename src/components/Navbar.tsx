import React, { useState } from 'react';
import { Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenWorkspace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWorkspace }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#17151F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single element lockup) */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#17151F] whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#6742F5] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <path d="M11 8v6"/>
              <path d="M8 11h6"/>
            </svg>
          </div>
          <span>ClarityLens</span>
        </a>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#706D7A]">
          <button
            onClick={() => scrollTo('how-it-works')}
            className="hover:text-[#17151F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo('capabilities')}
            className="hover:text-[#17151F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Capabilities
          </button>
          <button
            onClick={() => scrollTo('gemma-model')}
            className="hover:text-[#17151F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Gemma 4
          </button>
          <button
            onClick={() => scrollTo('sample-cases')}
            className="hover:text-[#17151F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sample Cases
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="hover:text-[#17151F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenWorkspace}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#6742F5] hover:bg-[#3921A8] active:scale-[0.98] transition-all rounded-xl shadow-sm whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Analyze an image</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#706D7A] hover:text-[#17151F] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#17151F]/10 bg-white px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => scrollTo('how-it-works')}
            className="block w-full text-left py-2 text-base font-medium text-[#706D7A] hover:text-[#17151F]"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo('capabilities')}
            className="block w-full text-left py-2 text-base font-medium text-[#706D7A] hover:text-[#17151F]"
          >
            Capabilities
          </button>
          <button
            onClick={() => scrollTo('gemma-model')}
            className="block w-full text-left py-2 text-base font-medium text-[#706D7A] hover:text-[#17151F]"
          >
            Gemma 4
          </button>
          <button
            onClick={() => scrollTo('sample-cases')}
            className="block w-full text-left py-2 text-base font-medium text-[#706D7A] hover:text-[#17151F]"
          >
            Sample Cases
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="block w-full text-left py-2 text-base font-medium text-[#706D7A] hover:text-[#17151F]"
          >
            FAQ
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWorkspace();
              }}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-[#6742F5] rounded-xl shadow-sm"
            >
              Analyze an image
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
