import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type CtaParticleCanvasProps = {
  className?: string;
};

type Particle = {
  alpha: number;
  phase: number;
  radius: number;
  speed: number;
  x: number;
  y: number;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 999) * 10000;
  return value - Math.floor(value);
}

function createParticles(count: number, width: number, height: number) {
  return Array.from({ length: count }, (_, index): Particle => {
    const x = seededRandom(index + 1) * width;
    const y = seededRandom(index + 7) * height * 0.52;
    const radius = 0.7 + seededRandom(index + 13) * 0.9;
    const alpha = 0.28 + seededRandom(index + 19) * 0.32;
    const speed = 0.45 + seededRandom(index + 23) * 0.45;
    const phase = seededRandom(index + 29) * Math.PI * 2;

    return { alpha, phase, radius, speed, x, y };
  });
}

export function CtaParticleCanvas({ className }: CtaParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrameId = 0;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(170, rect.width, rect.height);
    };

    const draw = (time = 0) => {
      const rect = canvas.getBoundingClientRect();

      context.clearRect(0, 0, rect.width, rect.height);

      for (const particle of particles) {
        const driftX = mediaQuery.matches ? 0 : Math.sin(time * 0.00032 * particle.speed + particle.phase) * 4;
        const driftY = mediaQuery.matches ? 0 : Math.cos(time * 0.00028 * particle.speed + particle.phase) * 3;
        const fade = Math.max(0, 1 - particle.y / (rect.height * 0.65));

        context.globalAlpha = particle.alpha * fade;
        context.beginPath();
        context.arc(particle.x + driftX, particle.y + driftY, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "#172033";
        context.fill();
      }

      context.globalAlpha = 1;

      if (!mediaQuery.matches) {
        animationFrameId = window.requestAnimationFrame(draw);
      }
    };

    const handleResize = () => {
      resizeCanvas();
      draw();
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return <canvas aria-hidden="true" className={cn("cta-particle-canvas", className)} ref={canvasRef} />;
}
