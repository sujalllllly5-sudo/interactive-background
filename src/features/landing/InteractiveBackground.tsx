/* [COMPOSER:LANDING] Wires the landing sections, interactions, and decorative overlays. */

"use client";

import { useState } from "react";
import { DotGridCanvas } from "./background/DotGridCanvas";
import { use3DTilt } from "./hooks/use3DTilt";
import { useCustomCursor } from "./hooks/useCustomCursor";
import { useLoadingScreen } from "./hooks/useLoadingScreen";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { useScrollState } from "./hooks/useScrollState";
import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { HeroSection } from "./sections/HeroSection";
import { LoadingOverlay } from "./sections/LoadingOverlay";
import { RoadmapSection } from "./sections/RoadmapSection";
import { SiteNavigation } from "./sections/SiteNavigation";
import { WorkSection } from "./sections/WorkSection";

export default function InteractiveBackground() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoading = useLoadingScreen();
  const { scrollProgress, isScrolled, activeSection, scrollY } = useScrollState();

  useScrollReveal();
  use3DTilt();
  useCustomCursor();

  return (
    <main id="top" className="site-shell">
      <LoadingOverlay isLoading={isLoading} />
      <div className="custom-cursor" aria-hidden="true" />
      <div className="mouse-glow" aria-hidden="true" />
      <DotGridCanvas />
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
      <SiteNavigation
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        activeSection={activeSection}
        onMenuToggle={() => setIsMenuOpen((open) => !open)}
        onMenuClose={() => setIsMenuOpen(false)}
      />
      <HeroSection scrollY={scrollY} />
      <AboutSection scrollY={scrollY} />
      <RoadmapSection />
      <WorkSection scrollY={scrollY} />
      <ContactSection />
    </main>
  );
}
