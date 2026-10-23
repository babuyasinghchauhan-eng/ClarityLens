import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TransformationSection } from './components/TransformationSection';
import { ModesSection } from './components/ModesSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { Workspace } from './components/Workspace';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AnalysisMode } from './types/clarity';

export default function App() {
  const [activeMode, setActiveMode] = useState<AnalysisMode>('explain_screen');
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  const scrollToWorkspace = () => {
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectModeAndSample = (mode: AnalysisMode, sampleId?: string) => {
    setActiveMode(mode);
    if (sampleId) {
      setActiveSampleId(sampleId);
    }
    scrollToWorkspace();
  };

  const handleExploreSample = (sampleId: string) => {
    setActiveSampleId(sampleId);
    scrollToWorkspace();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17151F]">
      <Navbar onOpenWorkspace={scrollToWorkspace} />
      
      <main className="flex-1">
        <Hero
          onAnalyzeClick={scrollToWorkspace}
          onExploreSample={handleExploreSample}
        />

        {/* The Main Interactive Application Workspace */}
        <Workspace
          initialMode={activeMode}
          initialSampleId={activeSampleId}
        />

        {/* Section A: From visual noise to clarity */}
        <TransformationSection />

        {/* Section B: One image. A clearer way forward. */}
        <ModesSection onSelectMode={handleSelectModeAndSample} />

        {/* Section C & D: Built around what you actually need & Gemma 4 Architecture */}
        <ArchitectureSection />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      <Footer onOpenWorkspace={scrollToWorkspace} />
    </div>
  );
}
