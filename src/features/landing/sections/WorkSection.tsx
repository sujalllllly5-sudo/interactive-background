/* [SECTION:WORK] Selected project cards, preview media, and project metadata. */

import Image from "next/image";
import type { CSSProperties } from "react";
import { projects, type Project } from "../content/site";
import { SectionLabel } from "../components/SectionLabel";

type ProjectImageProps = {
  project: Project;
  index: number;
};

function ProjectImage({ project, index }: ProjectImageProps) {
  if (!project.image) return null;

  const preview = (
    <div className="project-image-wrap">
      <Image
        src={project.image}
        alt={project.imageAlt ?? project.title}
        className="project-image"
        width={600}
        height={338}
        loading={index === 0 ? "eager" : "lazy"}
      />
      {project.url ? (
        <div className="project-image-overlay">
          <span className="project-image-zoom">Visit portfolio ↗</span>
        </div>
      ) : null}
    </div>
  );

  if (!project.url) return <div className="project-image-preview">{preview}</div>;

  return (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-image-link">
      {preview}
    </a>
  );
}

type WorkSectionProps = {
  scrollY: number;
};

export function WorkSection({ scrollY }: WorkSectionProps) {
  const headingStyle: CSSProperties = { transform: `translateY(${scrollY * -0.01}px)` };

  return (
    <section id="work" className="content-section work-section">
      <div className="section-heading reveal">
        <div style={headingStyle}>
          <SectionLabel>03 / Selected work</SectionLabel>
          <h2 className="section-title">Made to be felt.</h2>
        </div>
        <p className="section-aside">
          Concept projects shaped by atmosphere, clarity and play — each one an exercise in making
          the web feel physical.
        </p>
      </div>

      <div className="project-grid stagger-parent">
        {projects.map((project, index) => (
          <article
            key={project.number}
            className={`project-panel project-panel-${index + 1} flip-in tilt-card`}
            style={{ "--i": index } as CSSProperties}
          >
            <div className="project-panel-shine" aria-hidden="true" />
            <div className="project-panel-glow" aria-hidden="true" />
            <div className="project-panel-inner">
              <div>
                <div className="project-panel-header">
                  <span className="project-index">
                    {project.number} / {project.type}
                  </span>
                  <span className="project-badge">Featured</span>
                </div>
                <h3>{project.title}</h3>
                <ProjectImage project={project} index={index} />
              </div>
              <div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((technology) => (
                    <span key={technology} className="badge">
                      {technology}
                    </span>
                  ))}
                </div>
                <a href="#contact" className="project-link">
                  Explore project <span className="project-link-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className="project-corner-accent" aria-hidden="true">
              <span className="project-corner-line project-corner-tl" />
              <span className="project-corner-line project-corner-br" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
