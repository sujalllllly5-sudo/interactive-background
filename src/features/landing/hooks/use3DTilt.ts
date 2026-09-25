/* [BEHAVIOR:TILT] Applies pointer-driven 3D rotation to interactive cards. */

import { useEffect } from "react";

const cardSelector = ".tilt-card, .project-panel, .principle-card";
const resetTransform =
  "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)";

export function use3DTilt() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(cardSelector);
    if (!cards.length) return;

    const handles: Array<{
      element: HTMLElement;
      move: (event: MouseEvent) => void;
      leave: () => void;
    }> = [];

    cards.forEach((card) => {
      const handleMove = (event: MouseEvent) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        const shineX = ((event.clientX - bounds.left) / bounds.width) * 100;
        const shineY = ((event.clientY - bounds.top) / bounds.height) * 100;

        card.style.setProperty("--shine-x", `${shineX}%`);
        card.style.setProperty("--shine-y", `${shineY}%`);
        card.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(12px) scale(1.02)`;
      };

      const handleLeave = () => {
        card.style.setProperty("--shine-x", "50%");
        card.style.setProperty("--shine-y", "50%");
        card.style.transform = resetTransform;
      };

      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseleave", handleLeave);
      handles.push({ element: card, move: handleMove, leave: handleLeave });
    });

    return () => {
      handles.forEach(({ element, move, leave }) => {
        element.removeEventListener("mousemove", move);
        element.removeEventListener("mouseleave", leave);
      });
    };
  }, []);
}
