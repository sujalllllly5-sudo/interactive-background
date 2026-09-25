/* [SECTION:ABOUT] Positioning statement and principle cards. */

import type { CSSProperties } from "react";
import { principles } from "../content/site";
import { SectionLabel } from "../components/SectionLabel";

type AboutSectionProps = {
  scrollY: number;
};

export function AboutSection({ scrollY }: AboutSectionProps) {
  const headingStyle: CSSProperties = { transform: `translateY(${scrollY * -0.015}px)` };

  return (
    <section id="about" className="content-section about-section">
      <div className="reveal-left" style={headingStyle}>
        <SectionLabel>01 / Idealism</SectionLabel>
        <h2 className="section-title">
          CURIOSITY is the BASE of <span className="creation-word">CREATION.</span>
        </h2>
      </div>
      <div className="glass-panel reveal-right">
        <p className="large-copy">
          I specialize in fullstack development, interactive 3D and smooth user interfaces — design
          on the surface, a backbone that can hold anything underneath. Every project starts with a
          clear point of view, then earns its motion through clean code, careful details and nights
          of dedication.
        </p>
        <div className="principles-grid stagger-parent">
          {principles.map((principle, index) => (
            <div
              key={principle.label}
              className="principle-card flip-in"
              style={{ "--i": index } as CSSProperties}
            >
              <span className="principle-icon" aria-hidden="true">
                {principle.icon}
              </span>
              <p className="stat-value">{principle.value}</p>
              <p className="stat-label">{principle.label}</p>
              <div className="principle-shine" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
