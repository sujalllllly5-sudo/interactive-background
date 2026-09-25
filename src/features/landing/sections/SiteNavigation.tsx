/* [SECTION:NAVIGATION] Desktop navigation, mobile menu, and scroll progress. */

import { navigation } from "../content/site";
import { GlassButton } from "../components/GlassButton";

type SiteNavigationProps = {
  isScrolled: boolean;
  isMenuOpen: boolean;
  activeSection: string;
  onMenuToggle: () => void;
  onMenuClose: () => void;
};

export function SiteNavigation({
  isScrolled,
  isMenuOpen,
  activeSection,
  onMenuToggle,
  onMenuClose,
}: SiteNavigationProps) {
  return (
    <nav className={`site-nav${isScrolled ? " is-scrolled" : ""}`} aria-label="Main navigation">
      <a href="#top" className="brand-mark" aria-label="Back to top">
        <span className="brand-status" aria-hidden="true" />
        SUJAL <span className="brand-index">/ 01</span>
      </a>

      <div className="nav-links">
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={[
              "nav-link",
              item.label === "Selected work" ? "nav-link-featured" : "",
              activeSection === item.href.slice(1) ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={onMenuClose}
          >
            {item.label}
          </a>
        ))}
      </div>

      <GlassButton href="#contact" compact>
        Start a conversation
      </GlassButton>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        onClick={onMenuToggle}
      >
        <span>{isMenuOpen ? "Close" : "Menu"}</span>
        <span className="menu-icon" aria-hidden="true">
          <i />
          <i />
        </span>
      </button>

      <div id="mobile-navigation" className={`mobile-navigation${isMenuOpen ? " is-open" : ""}`}>
        {navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={onMenuClose}>
            <span>{item.label}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
