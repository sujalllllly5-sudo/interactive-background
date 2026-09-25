/* [SECTION:HERO] Landing headline, positioning copy, and primary actions. */

import type { CSSProperties } from "react";
import { AnimatedText } from "../components/AnimatedText";
import { GlassButton } from "../components/GlassButton";
import { SectionLabel } from "../components/SectionLabel";

type HeroSectionProps = {
  scrollY: number;
};

function parallax(scrollY: number, factor: number): CSSProperties {
  return { transform: `translateY(${scrollY * factor * -0.1}px)` };
}

export function HeroSection({ scrollY }: HeroSectionProps) {
  return (
    <section className="landing-block" aria-labelledby="landing-title">
      <div className="landing-content">
        <SectionLabel>
          Independent creative developer <span>{"///"}</span> 2026
        </SectionLabel>
        <AnimatedText text="SUJAL" className="landing-word" id="landing-title" />
        <p className="landing-subtitle reveal" style={parallax(scrollY, 0.3)}>
          Digital experiences with a pulse.
        </p>
        <p className="hero-copy reveal" style={{ ...parallax(scrollY, 0.2), transitionDelay: "0.15s" }}>
          I design and build immersive interfaces where thoughtful interaction, expressive visuals, and
          dependable engineering meet.
        </p>
        <div className="landing-actions reveal" style={{ transitionDelay: "0.3s" }}>
          <GlassButton href="#work">Explore the work</GlassButton>
          <a href="#about" className="text-link">
            Want more? Scroll down <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div className="hero-note" aria-hidden="true">
        <span className="hero-note-line" />
        <span>
          Move through
          <br />
          the field
        </span>
      </div>
    </section>
  );
}
