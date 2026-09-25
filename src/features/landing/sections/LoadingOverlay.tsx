/* [SECTION:LOADING] Cinematic intro overlay and progress indicator. */

import type { CSSProperties } from "react";

type LoadingOverlayProps = {
  isLoading: boolean;
};

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  return (
    <div className={`loading-screen${isLoading ? "" : " is-done"}`} aria-hidden={!isLoading}>
      <div className="loader-orbits">
        <div className="orbit orbit-1" />
        <div className="orbit orbit-2" />
        <div className="orbit orbit-3" />
      </div>

      <div className="loader-logo-wrap">
        <div className="loader-logo">
          {["S", "U", "J", "A", "L"].map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="loader-letter"
              style={{ "--i": index } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="loader-tagline">Creative Developer</p>
      </div>

      <div className="loader-progress">
        <span className="loader-percent">
          <span className="loader-percent-num">0</span>
          <span className="loader-percent-sign">%</span>
        </span>
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
      </div>

      <div className="loader-footer">
        <span className="loader-footer-item">SSR</span>
        <span className="loader-footer-dot" />
        <span className="loader-footer-item">WebGL</span>
        <span className="loader-footer-dot" />
        <span className="loader-footer-item">Next.js 16</span>
      </div>
    </div>
  );
}
