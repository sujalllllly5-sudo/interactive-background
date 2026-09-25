/* [UI:BUTTON] Shared navigation and call-to-action link. */

import type { ReactNode } from "react";

type GlassButtonProps = {
  children: ReactNode;
  href: string;
  compact?: boolean;
};

export function GlassButton({ children, href, compact = false }: GlassButtonProps) {
  return (
    <a className={`glass-button${compact ? " glass-button-small" : ""}`} href={href}>
      {children}
      <span className="btn-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
