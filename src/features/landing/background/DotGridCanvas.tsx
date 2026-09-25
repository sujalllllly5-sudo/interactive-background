/* [WEBGL:RUNTIME] Owns the OGL renderer, uniforms, resize handling, and animation loop. */

"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { fragmentShader, vertexShader } from "./shaders";

export function DotGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const handleResize = () => renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", handleResize);

    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = event.clientX / window.innerWidth;
      mouse.targetY = 1 - event.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const geometry = new Triangle(renderer.gl);
    const program = new Program(renderer.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
      },
    });
    const mesh = new Mesh(renderer.gl, { geometry, program });
    const startTime = performance.now();
    let animationFrameId = 0;

    const update = (time: number) => {
      animationFrameId = window.requestAnimationFrame(update);
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      program.uniforms.uTime.value = (time - startTime) * 0.001;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      program.uniforms.uResolution.value = [canvas.width, canvas.height];
      renderer.render({ scene: mesh });
    };

    animationFrameId = window.requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-canvas" aria-hidden="true" />;
}
