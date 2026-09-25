/* [SECTION:CONTACT] Contact invitation, email action, and site footer. */

import { GlassButton } from "../components/GlassButton";
import { SectionLabel } from "../components/SectionLabel";

export function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner reveal">
        <div className="contact-deco" aria-hidden="true">
          <span className="deco-ring deco-ring-1" />
          <span className="deco-ring deco-ring-2" />
          <span className="deco-ring deco-ring-3" />
        </div>
        <SectionLabel>04 / Let&apos;s connect</SectionLabel>
        <h2 className="display-title">
          Have a feeling
          <br />
          we should talk?
        </h2>
        <p className="hero-copy">
          Got a project in mind, a generous question, or an interesting problem? Send a note and
          let&apos;s make something memorable — looking forward to working with you.
        </p>
        <b className="dont-be-shy">dont be shy</b>
        <GlassButton href="mailto:sujalllllly5@gmail.com">Get in touch</GlassButton>
      </div>
      <footer className="site-footer">
        <span>SUJAL / obsessed with my own potential</span>
        <span>Built with hands + curiosity + various technologies</span>
      </footer>
    </section>
  );
}
