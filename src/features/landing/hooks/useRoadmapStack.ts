/* [BEHAVIOR:ROADMAP] Coordinates wheel, touch, and click transitions between steps. */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
  type TouchEvent,
} from "react";
import { roadmapSteps } from "../content/site";

type Direction = 1 | -1;

type RoadmapHandlers = {
  roadmapRef: RefObject<HTMLDivElement | null>;
  activeItem: number;
  transitionDirection: Direction;
  handleTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  handleTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
  selectItem: (index: number) => void;
};

const lastStepIndex = roadmapSteps.length - 1;

export function useRoadmapStack(): RoadmapHandlers {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<Direction>(1);
  const activeItemRef = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const wheelDistance = useRef(0);
  const wheelDirection = useRef<Direction>(1);
  const transitionLocked = useRef(false);
  const unlockTimer = useRef<number | null>(null);

  const isAtScrollBoundary = useCallback(
    (direction: Direction) =>
      (direction === -1 && activeItemRef.current === 0) ||
      (direction === 1 && activeItemRef.current === lastStepIndex),
    []
  );

  const moveToItem = useCallback((direction: Direction) => {
    setTransitionDirection(direction);
    setActiveItem((current) => {
      const next = Math.max(0, Math.min(lastStepIndex, current + direction));
      activeItemRef.current = next;
      return next;
    });
  }, []);

  const lockTransition = useCallback(() => {
    transitionLocked.current = true;
    if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => {
      transitionLocked.current = false;
    }, 650);
  }, []);

  const startRoadmapStep = useCallback(
    (direction: Direction) => {
      if (isAtScrollBoundary(direction) || transitionLocked.current) return;
      lockTransition();
      moveToItem(direction);
    },
    [isAtScrollBoundary, lockTransition, moveToItem]
  );

  const selectItem = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(lastStepIndex, index));
      if (next === activeItemRef.current || transitionLocked.current) return;
      setTransitionDirection(next > activeItemRef.current ? 1 : -1);
      setActiveItem(next);
      activeItemRef.current = next;
      lockTransition();
    },
    [lockTransition]
  );

  useEffect(() => {
    const roadmap = roadmapRef.current;
    if (!roadmap) return;

    const handleWheel = (event: WheelEvent) => {
      const direction: Direction = event.deltaY > 0 ? 1 : -1;
      if (Math.abs(event.deltaY) < 1 || isAtScrollBoundary(direction)) {
        wheelDistance.current = 0;
        return;
      }

      event.preventDefault();
      if (transitionLocked.current) return;
      if (wheelDirection.current !== direction) {
        wheelDirection.current = direction;
        wheelDistance.current = 0;
      }

      wheelDistance.current += Math.abs(event.deltaY);
      if (wheelDistance.current < 42) return;
      wheelDistance.current = 0;
      startRoadmapStep(direction);
    };

    roadmap.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      roadmap.removeEventListener("wheel", handleWheel);
      if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
    };
  }, [isAtScrollBoundary, startRoadmapStep]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const startY = touchStartY.current;
    const currentY = event.touches[0]?.clientY;
    if (startY === null || currentY === undefined) return;

    const distance = startY - currentY;
    if (Math.abs(distance) < 36) return;
    const direction: Direction = distance > 0 ? 1 : -1;
    if (isAtScrollBoundary(direction)) return;

    touchStartY.current = currentY;
    startRoadmapStep(direction);
  };

  return {
    roadmapRef,
    activeItem,
    transitionDirection,
    handleTouchStart,
    handleTouchMove,
    selectItem,
  };
}
