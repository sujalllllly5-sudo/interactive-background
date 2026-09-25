/* [BEHAVIOR:LOADER] Runs the timed intro animation and progress counter. */

import { useEffect, useState } from "react";

export function useLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const counter = document.querySelector<HTMLElement>(".loader-percent-num");
    let frameId: number | null = null;

    if (counter) {
      const start = performance.now();
      const duration = 2000;

      const updateCounter = (now: number) => {
        const progress = Math.min(100, Math.round(((now - start) / duration) * 100));
        counter.textContent = String(progress);
        if (progress < 100) frameId = window.requestAnimationFrame(updateCounter);
      };

      frameId = window.requestAnimationFrame(updateCounter);
    }

    const timer = window.setTimeout(() => setIsLoading(false), 2400);
    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.clearTimeout(timer);
    };
  }, []);

  return isLoading;
}
