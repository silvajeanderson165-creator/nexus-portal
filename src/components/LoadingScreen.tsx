import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useStore } from "@/store/useStore";

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const setIsLoading = useStore((s) => s.setIsLoading);
  const [progress, setProgress] = useState(0);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      angle: number;
      radius: number;
      speed: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 60 + Math.random() * 100,
        speed: 0.005 + Math.random() * 0.01,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }

    const animate = (time: number) => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw portal ring glow
      const gradient = ctx.createRadialGradient(cx, cy, 40, cx, cy, 160);
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.08)");
      gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.02)");
      gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle + time * 0.0003) * p.radius;
        const y = cy + Math.sin(p.angle + time * 0.0003) * p.radius * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
        ctx.fill();
      });

      // Draw central ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, 50, 30, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(139, 92, 246, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, 35, 20, time * 0.0002, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(167, 139, 250, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Progress animation
  useEffect(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        setProgress(Math.round(obj.val));
      },
      onComplete: () => {
        // Fade out loading screen
        const tl = gsap.timeline({
          onComplete: () => {
            setIsLoading(false);
          },
        });
        tl.to(textRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.in",
        });
        tl.to(
          progressRef.current,
          {
            opacity: 0,
            scale: 1.1,
            duration: 0.4,
            ease: "power2.in",
          },
          "-=0.3"
        );
        tl.to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.2"
        );
      },
    });
  }, [setIsLoading]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div ref={textRef} className="text-center">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mb-4"
          >
            Sincronizando Realidades
          </p>
          <h1
            className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight"
          >
            NEXUS PORTAL
          </h1>
        </div>
        <div ref={progressRef} className="flex flex-col items-center gap-3">
          <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-sm text-violet-400">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
