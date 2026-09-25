/* [SECTION:ROADMAP] Scrollable process roadmap with accessible step controls. */

import { roadmapSteps } from "../content/site";
import { SectionLabel } from "../components/SectionLabel";
import { useRoadmapStack } from "../hooks/useRoadmapStack";

export function RoadmapSection() {
  const {
    roadmapRef,
    activeItem,
    transitionDirection,
    handleTouchStart,
    handleTouchMove,
    selectItem,
  } = useRoadmapStack();
  const progress = (activeItem / (roadmapSteps.length - 1)) * 100;

  return (
    <section id="space" className="card-stack-section" aria-label="Creative process roadmap">
      <div className="card-stack-heading reveal-left">
        <SectionLabel>02 / PHILOSOPHY</SectionLabel>
        <p>A PROCESS TO TURN IDEAS INTO REALITY.</p>
      </div>

      <div
        ref={roadmapRef}
        className={`roadmap-content reveal-right${
          transitionDirection === 1 ? " is-moving-down" : " is-moving-up"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        tabIndex={0}
        aria-label="Roadmap. Swipe or scroll to change steps."
      >
        <div className="roadmap-track" aria-hidden="true">
          <div className="roadmap-track-fill" style={{ height: `${progress}%` }} />
        </div>

        <div className="roadmap-dots" aria-label="Roadmap steps">
          {roadmapSteps.map((step, index) => (
            <button
              key={step.number}
              type="button"
              className={`roadmap-dot${index <= activeItem ? " is-active" : ""}${
                index === activeItem ? " is-current" : ""
              }`}
              onClick={() => selectItem(index)}
              aria-label={`Step ${index + 1}: ${step.title}`}
              aria-pressed={index === activeItem}
            >
              <span className="roadmap-dot-inner" />
              <span className="roadmap-dot-label">{step.title}</span>
            </button>
          ))}
        </div>

        <ol className="roadmap-list">
          {roadmapSteps.map((step, index) => (
            <li key={step.number} className={`roadmap-item${activeItem === index ? " is-active" : ""}`}>
              <span className="roadmap-item-number">{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
