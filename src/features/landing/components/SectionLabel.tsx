/* [UI:LABEL] Shared section eyebrow label. */

import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
