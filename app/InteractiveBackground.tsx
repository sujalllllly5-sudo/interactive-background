"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/* ============================================================
   1. SITE DATA — edit copy here; markup stays untouched
   ============================================================ */
const navigation = [
  { label: "Home",           href: "#top" },
  { label: "About",          href: "#about" },
  { label: "Open space",     href: "#space" },
  { label: "Selected work",  href: "#work" },
  { label: "Contact",        href: "#contact" },
];

const principles = [
  { value: "2024", label: "Writing code since", icon: "</>" },
  { value: "04",   label: "Projects shipped",   icon: "◆" },
  { value: "∞",    label: "Curiosity left",     icon: "○" },
];

const projects = [
  {
    number: "01",
    type: "WebGL experience",
    title: "AETHERION",
    description:
      "Premium automotive concept — an immersive, cinematic front-end with real-time 3D interaction and high-end UI.",
    tech: ["WebGL", "Three.js", "GSAP"],
    image: "/portfolio-preview.png",
    imageAlt: "AETHERION — interactive background preview",
    url: "/portfolio",
  },
  {
    number: "02",
    type: "AI landing concept",
    title: "MEDUSA AI",
    description:
      "Dr. Stone–inspired scroll storytelling with a cinematic AI-core reveal and a strong visual identity.",
    tech: ["React", "Framer Motion", "WebGL"],
  },
];

const sectionIds = ["top", "about", "space", "work", "contact"] as const;


/* ============================================================
   2. UI PRIMITIVES
   ============================================================ */
function GlassButton({
  children,
  href,
  compact = false,
}: {
  children: React.ReactNode;
  href: string;
  compact?: boolean;
}) {
  return (
    <a
      className={`glass-button${compact ? " glass-button-small" : ""}`}
      href={href}
    >
      {children}
      <span className="btn-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/* Split text into individual letters for stagger animation */
function AnimatedText({
  text,
  className,
  id,
}: {
  text: string;
  className?: string;
  id?: string;
}) {
  return (
    <h1 id={id} className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="letter-reveal"
          style={{ ["--i" as string]: i, ["--total" as string]: text.length }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}


/* ============================================================
   3. SCROLL-REVEAL HOOK
   ============================================================ */
function useScrollReveal() {
  useEffect(() => {
    const selector =
      ".reveal, .reveal-scale, .reveal-left, .reveal-right, .flip-in, .reveal-up-3d";
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}


/* ============================================================
   4. 3D TILT HOOK — mouse-tracking tilt on cards
   ============================================================ */
function use3DTilt() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(
      ".tilt-card, .project-panel, .principle-card"
    );
    if (!cards.length) return;

    const handles: Array<{
      el: HTMLElement;
      move: (e: MouseEvent) => void;
      leave: () => void;
    }> = [];

    cards.forEach((card) => {
      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const shineX = ((e.clientX - rect.left) / rect.width) * 100;
        const shineY = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--shine-x", `${shineX}%`);
        card.style.setProperty("--shine-y", `${shineY}%`);
        card.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(12px) scale(1.02)`;
      };

      const handleLeave = () => {
        card.style.setProperty("--shine-x", "50%");
        card.style.setProperty("--shine-y", "50%");
        card.style.transform =
          "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)";
      };

      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseleave", handleLeave);
      handles.push({ el: card, move: handleMove, leave: handleLeave });
    });

    return () => {
      handles.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);
}


/* ============================================================
   5. CUSTOM CURSOR + GLOW ORB HOOK
   ============================================================ */
function useCustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".custom-cursor");
    const glow = document.querySelector<HTMLElement>(".mouse-glow");
    if (!cursor || !glow) return;

    let cursorX = 0,
      cursorY = 0;
    let glowX = 0,
      glowY = 0;

    const handleMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    };

    const animateGlow = () => {
      glowX += (cursorX - glowX) * 0.06;
      glowY += (cursorY - glowY) * 0.06;
      glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
      requestAnimationFrame(animateGlow);
    };

    /* Detect hover targets for cursor expansion */
    const handleEnter = () => cursor.classList.add("is-hovering");
    const handleLeave = () => cursor.classList.remove("is-hovering");

    const interactives = document.querySelectorAll(
      "a, button, .project-panel, .principle-card, .glass-button"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    window.addEventListener("mousemove", handleMove);
    const rafId = requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);
}


/* ============================================================
   6. SCROLL STATE HOOK — progress bar + active section + parallax
   ============================================================ */
function useScrollState() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (y / docHeight) * 100 : 0);
      setIsScrolled(y > 60);
      setScrollY(y);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: "-80px 0px -40% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return { scrollProgress, isScrolled, activeSection, scrollY };
}


/* ============================================================
   7. LOADING SCREEN HOOK — manages the intro sequence
   ============================================================ */
function useLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* Animate the percentage counter from 0 to 100 */
    const numEl = document.querySelector<HTMLElement>(".loader-percent-num");
    if (numEl) {
      let current = 0;
      const duration = 2000;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        current = Math.min(100, Math.round((elapsed / duration) * 100));
        numEl.textContent = String(current);
        if (current < 100) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    const timer = setTimeout(() => setIsLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return isLoading;
}


/* ============================================================
   8. ROADMAP STEPS
   ============================================================ */
function RoadmapStack() {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const activeItemRef = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const wheelDistance = useRef(0);
  const wheelDirection = useRef<1 | -1>(1);
  const transitionLocked = useRef(false);
  const unlockTimer = useRef<number | null>(null);

  const moveToItem = useCallback((direction: 1 | -1) => {
    setTransitionDirection(direction);
    setActiveItem((current) => {
      const next = Math.max(0, Math.min(3, current + direction));
      activeItemRef.current = next;
      return next;
    });
  }, []);

  const isAtScrollBoundary = useCallback(
    (direction: 1 | -1) =>
      (direction === -1 && activeItemRef.current === 0) ||
      (direction === 1 && activeItemRef.current === 3),
    []
  );

  const startRoadmapStep = useCallback(
    (direction: 1 | -1) => {
      if (isAtScrollBoundary(direction) || transitionLocked.current)
        return false;
      transitionLocked.current = true;
      moveToItem(direction);
      unlockTimer.current = window.setTimeout(() => {
        transitionLocked.current = false;
      }, 650);
      return true;
    },
    [isAtScrollBoundary, moveToItem]
  );

  useEffect(() => {
    const roadmap = roadmapRef.current;
    if (!roadmap) return;

    const handleWheel = (event: WheelEvent) => {
      const direction = event.deltaY > 0 ? 1 : -1;
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
      if (unlockTimer.current !== null)
        window.clearTimeout(unlockTimer.current);
    };
  }, [isAtScrollBoundary, startRoadmapStep]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const startY = touchStartY.current;
    const currentY = event.touches[0]?.clientY;
    if (startY === null || currentY === undefined) return;
    const distance = startY - currentY;
    if (Math.abs(distance) < 36) return;
    const direction = distance > 0 ? 1 : -1;
    if (isAtScrollBoundary(direction)) return;
    touchStartY.current = currentY;
    startRoadmapStep(direction);
  };

  const stepLabels = ["Find the feeling", "Build the rhythm", "Make it real", "Leave room to grow"];

  return (
    <section id="space" className="card-stack-section" aria-label="Creative process roadmap">
      <div className="card-stack-heading reveal-left">
        <SectionLabel>02 / PHILOSOPHY</SectionLabel>
        <p>A PROCESS TO TURN IDEAS INTO REALITY.</p>
      </div>
      <div
        ref={roadmapRef}
        className={`roadmap-content reveal-right${transitionDirection === 1 ? " is-moving-down" : " is-moving-up"}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        tabIndex={0}
        aria-label="Roadmap. Swipe or scroll to change steps."
      >
        {/* Animated progress line */}
        <div className="roadmap-track">
          <div
            className="roadmap-track-fill"
            style={{ height: `${(activeItem / 3) * 100}%` }}
          />
        </div>

        {/* Progress dots */}
        <div className="roadmap-dots">
          {stepLabels.map((_, i) => (
            <button
              key={i}
              className={`roadmap-dot${i <= activeItem ? " is-active" : ""}${i === activeItem ? " is-current" : ""}`}
              onClick={() => {
                const dir = i > activeItem ? 1 : -1;
                if (!transitionLocked.current) {
                  transitionLocked.current = true;
                  setTransitionDirection(dir as 1 | -1);
                  setActiveItem(i);
                  activeItemRef.current = i;
                  unlockTimer.current = window.setTimeout(() => {
                    transitionLocked.current = false;
                  }, 650);
                }
              }}
              aria-label={`Step ${i + 1}: ${stepLabels[i]}`}
            >
              <span className="roadmap-dot-inner" />
              <span className="roadmap-dot-label">{stepLabels[i]}</span>
            </button>
          ))}
        </div>

        {/* Step content */}
        <ol className="roadmap-list">
          <li className={`roadmap-item${activeItem === 0 ? " is-active" : ""}`}>
            <span className="roadmap-item-number">01</span>
            <div>
              <h3>Find the feeling</h3>
              <p>Start with the idea, mood, and purpose behind the work.</p>
            </div>
          </li>
          <li className={`roadmap-item${activeItem === 1 ? " is-active" : ""}`}>
            <span className="roadmap-item-number">02</span>
            <div>
              <h3>Build the rhythm</h3>
              <p>Shape the interaction until every movement feels intentional.</p>
            </div>
          </li>
          <li className={`roadmap-item${activeItem === 2 ? " is-active" : ""}`}>
            <span className="roadmap-item-number">03</span>
            <div>
              <h3>Make it real</h3>
              <p>Turn the atmosphere into a clear, dependable experience.</p>
            </div>
          </li>
          <li className={`roadmap-item${activeItem === 3 ? " is-active" : ""}`}>
            <span className="roadmap-item-number">04</span>
            <div>
              <h3>Leave room to grow</h3>
              <p>Build a foundation that stays useful long after launch.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}


/* ============================================================
   9. SHADERS — dot grid with mouse repulsion
   ============================================================ */
const vertexShader = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;
    vec2 mouseSt = uMouse;
    mouseSt.x *= uResolution.x / uResolution.y;

    vec3 bgColor = vec3(0.94, 0.925, 0.9);

    vec2 glowOrigin = vec2(-0.18, 0.94);
    vec2 glowVector = st - glowOrigin;
    float glowDistance = length(glowVector);
    float glow = exp(-glowDistance * 2.5) * 0.18;

    float direction = dot(normalize(glowVector), normalize(vec2(0.92, -0.38)));
    float softAccent = smoothstep(0.58, 0.95, direction) * smoothstep(1.3, 0.18, glowDistance) * 0.07;
    float ambientLight = glow + softAccent;

    float breath = sin(uTime * 0.5) * 0.05 + 0.95;

    float redMask = clamp(ambientLight * breath, 0.0, 0.14);
    vec3 silhouetteRed = vec3(0.68, 0.018, 0.028);
    vec3 finalColor = mix(bgColor, silhouetteRed, redMask);

    float gridScale = 42.0;
    vec2 gridCoord = vUv * gridScale;
    vec2 cellId = floor(gridCoord);
    vec2 cellCenter = (cellId + 0.5) / gridScale;
    cellCenter.x *= uResolution.x / uResolution.y;

    float distToMouse = distance(cellCenter, mouseSt);
    vec2 repulsionOffset = vec2(0.0);
    float radius = 0.25;
    if (distToMouse < radius) {
      float force = smoothstep(radius, 0.0, distToMouse);
      vec2 pushDir = normalize(cellCenter - mouseSt);
      repulsionOffset = pushDir * force * 0.08;
    }

    vec2 displacedUv = (vUv - repulsionOffset) * gridScale;
    vec2 gridUv = fract(displacedUv) - 0.5;
    float d = length(gridUv);
    float dotMask = smoothstep(0.065, 0.012, d);

    vec3 dotColor = vec3(0.34, 0.012, 0.022);
    finalColor = mix(finalColor, dotColor, dotMask * 0.62);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;


/* ============================================================
   10. PAGE — the full experience
   ============================================================ */
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoading = useLoadingScreen();
  const { scrollProgress, isScrolled, activeSection, scrollY } =
    useScrollState();
  useScrollReveal();
  use3DTilt();
  useCustomCursor();

  /* --- WebGL --- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    const gl = renderer.gl;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const handleResize = () =>
      renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", handleResize);

    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX / window.innerWidth;
      mouse.targetY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:       { value: 0 },
        uMouse:      { value: [0.5, 0.5] },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    let animationFrameId: number;
    const startTime = performance.now();

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      program.uniforms.uTime.value = (t - startTime) * 0.001;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      program.uniforms.uResolution.value = [canvas.width, canvas.height];
      renderer.render({ scene: mesh });
    };
    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  /* Parallax offset for sections */
  const p = (factor: number) => ({
    transform: `translateY(${scrollY * factor * -0.1}px)`,
  });

  return (
    <main id="top" className="site-shell">
      {/* ─────── LOADING SCREEN ─────── */}
      <div className={`loading-screen${isLoading ? "" : " is-done"}`}>
        {/* Orbiting rings */}
        <div className="loader-orbits" aria-hidden="true">
          <div className="orbit orbit-1" />
          <div className="orbit orbit-2" />
          <div className="orbit orbit-3" />
        </div>

        {/* Central logo */}
        <div className="loader-logo-wrap">
          <div className="loader-logo">
            <span className="loader-letter" style={{ ["--i" as string]: 0 }}>S</span>
            <span className="loader-letter" style={{ ["--i" as string]: 1 }}>U</span>
            <span className="loader-letter" style={{ ["--i" as string]: 2 }}>J</span>
            <span className="loader-letter" style={{ ["--i" as string]: 3 }}>A</span>
            <span className="loader-letter" style={{ ["--i" as string]: 4 }}>L</span>
          </div>
          <p className="loader-tagline">Creative Developer</p>
        </div>

        {/* Progress counter */}
        <div className="loader-progress">
          <span className="loader-percent">
            <span className="loader-percent-num">0</span>
            <span className="loader-percent-sign">%</span>
          </span>
          <div className="loader-bar">
            <div className="loader-bar-fill" />
          </div>
        </div>

        {/* Bottom corner info */}
        <div className="loader-footer">
          <span className="loader-footer-item">SSR</span>
          <span className="loader-footer-dot" />
          <span className="loader-footer-item">WebGL</span>
          <span className="loader-footer-dot" />
          <span className="loader-footer-item">Next.js 16</span>
        </div>
      </div>

      {/* ─────── CUSTOM CURSOR + GLOW ─────── */}
      <div className="custom-cursor" aria-hidden="true" />
      <div className="mouse-glow" aria-hidden="true" />

      {/* ─────── CANVAS ─────── */}
      <canvas ref={canvasRef} className="interactive-canvas" />

      {/* ─────── SCROLL PROGRESS ─────── */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />

      {/* ─────── NAVIGATION ─────── */}
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
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
        <GlassButton href="#contact" compact>Start a conversation</GlassButton>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((o) => !o)}
        >
          <span>{isMenuOpen ? "Close" : "Menu"}</span>
          <span className="menu-icon" aria-hidden="true"><i /><i /></span>
        </button>
        <div id="mobile-navigation" className={`mobile-navigation${isMenuOpen ? " is-open" : ""}`}>
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
              <span>{item.label}</span><span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </nav>


      {/* ───────── LANDING ───────── */}
      <section className="landing-block" aria-labelledby="landing-title">
        <div className="landing-content">
          <SectionLabel>
            Independent creative developer <span>{"///"}</span> 2026
          </SectionLabel>
          <AnimatedText text="SUJAL" className="landing-word" id="landing-title" />
          <p className="landing-subtitle reveal" style={p(0.3)}>
            Digital experiences with a pulse.
          </p>
          <p className="hero-copy reveal" style={{ ...p(0.2), transitionDelay: "0.15s" }}>
            I design and build immersive interfaces where thoughtful
            interaction, expressive visuals, and dependable engineering meet.
          </p>
          <div className="landing-actions reveal" style={{ transitionDelay: "0.3s" }}>
            <GlassButton href="#work">Explore the work</GlassButton>
            <a href="#about" className="text-link">
              Want more? Scroll down <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="hero-note" aria-hidden="true">
          <span className="hero-note-line" />
          <span>Move through<br />the field</span>
        </div>
      </section>


      {/* ───────── ABOUT ───────── */}
      <section id="about" className="content-section about-section">
        <div className="reveal-left" style={p(0.15)}>
          <SectionLabel>01 / Idealism</SectionLabel>
          <h2 className="section-title">
            CURIOSITY is the BASE of{" "}
            <span className="creation-word">CREATION.</span>
          </h2>
        </div>
        <div className="glass-panel reveal-right">
          <p className="large-copy">
            I specialize in fullstack development, interactive 3D and smooth
            user interfaces — design on the surface, a backbone that can hold
            anything underneath. Every project starts with a clear point of
            view, then earns its motion through clean code, careful details and
            nights of dedication.
          </p>
          <div className="principles-grid stagger-parent">
            {principles.map((principle, i) => (
              <div
                key={principle.label}
                className="principle-card flip-in"
                style={{ ["--i" as string]: i }}
              >
                <span className="principle-icon" aria-hidden="true">{principle.icon}</span>
                <p className="stat-value">{principle.value}</p>
                <p className="stat-label">{principle.label}</p>
                <div className="principle-shine" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ───────── ROADMAP ───────── */}
      <RoadmapStack />


      {/* ───────── WORK ───────── */}
      <section id="work" className="content-section work-section">
        <div className="section-heading reveal">
          <div style={p(0.1)}>
            <SectionLabel>03 / Selected work</SectionLabel>
            <h2 className="section-title">Made to be felt.</h2>
          </div>
          <p className="section-aside">
            Concept projects shaped by atmosphere, clarity and play — each one
            an exercise in making the web feel physical.
          </p>
        </div>
        <div className="project-grid stagger-parent">
          {projects.map((project, index) => (
            <article
              key={project.number}
              className={`project-panel project-panel-${index + 1} flip-in tilt-card`}
              style={{ ["--i" as string]: index }}
            >
              <div className="project-panel-shine" aria-hidden="true" />
              <div className="project-panel-glow" aria-hidden="true" />
              <div className="project-panel-inner">
                <div>
                  <div className="project-panel-header">
                    <span className="project-index">{project.number} / {project.type}</span>
                    <span className="project-badge">Featured</span>
                  </div>
                  <h3>{project.title}</h3>
                  {project.image && project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-image-link">
                      <div className="project-image-wrap">
                        <Image
                          src={project.image}
                          alt={project.imageAlt || project.title}
                          className="project-image"
                          width={600}
                          height={338}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                        <div className="project-image-overlay">
                          <span className="project-image-zoom">Visit portfolio ↗</span>
                        </div>
                      </div>
                    </a>
                  )}
                </div>
                <div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((t) => (
                      <span key={t} className="badge">{t}</span>
                    ))}
                  </div>
                  <a href="#contact" className="project-link">
                    Explore project <span className="project-link-arrow" aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
              {/* Corner accent */}
              <div className="project-corner-accent" aria-hidden="true">
                <span className="project-corner-line project-corner-tl" />
                <span className="project-corner-line project-corner-br" />
              </div>
            </article>
          ))}
        </div>
      </section>


      {/* ───────── CONTACT + FOOTER ───────── */}
      <section id="contact" className="contact-section">
        <div className="contact-inner reveal">
          <div className="contact-deco" aria-hidden="true">
            <span className="deco-ring deco-ring-1" />
            <span className="deco-ring deco-ring-2" />
            <span className="deco-ring deco-ring-3" />
          </div>
          <SectionLabel>04 / Let&apos;s connect</SectionLabel>
          <h2 className="display-title">
            Have a feeling
            <br />
            we should talk?
          </h2>
          <p className="hero-copy">
            Got a project in mind, a generous question, or an interesting
            problem? Send a note and let&apos;s make something memorable —
            looking forward to working with you.
          </p>
          <b className="dont-be-shy">dont be shy</b>
          <GlassButton href="mailto:sujalllllly5@gmail.com">
            Get in touch
          </GlassButton>
        </div>
        <footer className="site-footer">
          <span>SUJAL / obsessed with my own potential</span>
          <span>Built with hands + curiosity + various technologies</span>
        </footer>
      </section>
    </main>
  );
}
