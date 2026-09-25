/* [BEHAVIOR:CURSOR] Tracks the pointer with a custom cursor and trailing glow. */

import { useEffect } from "react";

export function useCustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".custom-cursor");
    const glow = document.querySelector<HTMLElement>(".mouse-glow");
    if (!cursor || !glow) return;

    let cursorX = 0;
    let cursorY = 0;
    let glowX = 0;
    let glowY = 0;
    let glowFrameId: number | null = null;

    const handleMove = (event: MouseEvent) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    };

    const animateGlow = () => {
      glowX += (cursorX - glowX) * 0.06;
      glowY += (cursorY - glowY) * 0.06;
      glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
      glowFrameId = window.requestAnimationFrame(animateGlow);
    };

    const handleEnter = () => cursor.classList.add("is-hovering");
    const handleLeave = () => cursor.classList.remove("is-hovering");
    const interactives = document.querySelectorAll(
      "a, button, .project-panel, .principle-card, .glass-button"
    );

    interactives.forEach((element) => {
      element.addEventListener("mouseenter", handleEnter);
      element.addEventListener("mouseleave", handleLeave);
    });
    window.addEventListener("mousemove", handleMove);
    glowFrameId = window.requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (glowFrameId !== null) window.cancelAnimationFrame(glowFrameId);
      interactives.forEach((element) => {
        element.removeEventListener("mouseenter", handleEnter);
        element.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);
}
