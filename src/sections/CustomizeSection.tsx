import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlowSlider from "@/components/ui-custom/GlowSlider";
import ColorSwatch from "@/components/ui-custom/ColorSwatch";
import DecodeText from "@/components/ui-custom/DecodeText";
import { useStore } from "@/store/useStore";
import { useAudio } from "@/hooks/useAudio";

gsap.registerPlugin(ScrollTrigger);

export default function CustomizeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick } = useAudio();
  const panelRef = useRef<HTMLDivElement>(null);

  const colorTheme = useStore((s) => s.colorTheme);
  const glowIntensity = useStore((s) => s.glowIntensity);
  const particleCount = useStore((s) => s.particleCount);
  const setColorTheme = useStore((s) => s.setColorTheme);
  const setGlowIntensity = useStore((s) => s.setGlowIntensity);
  const setParticleCount = useStore((s) => s.setParticleCount);
  const triggerPulse = useStore((s) => s.triggerPulse);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="customize"
      ref={sectionRef}
      className="relative z-10 min-h-screen py-[120px] px-[5vw] flex items-center"
    >
      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div ref={textRef} className="opacity-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50 mb-3">
            03 — Personalizar
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            <DecodeText text="Deixe do Seu Jeito" />
          </h2>
          <p className="text-base text-white/75 leading-relaxed max-w-md">
            Ajuste a aparência do Anel Nexus em tempo real. Cada mudança é
            refletida instantaneamente no modelo 3D.
          </p>
        </div>

        {/* Right: Control Panel */}
        <div
          ref={panelRef}
          className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8 max-w-[380px] justify-self-center lg:justify-self-end opacity-0"
        >
          <div className="flex flex-col gap-8">
            <ColorSwatch
              selected={colorTheme}
              onChange={setColorTheme}
            />

            <GlowSlider
              label="Intensidade do Brilho"
              value={glowIntensity}
              min={0}
              max={2}
              step={0.1}
              onChange={setGlowIntensity}
              displayValue={glowIntensity.toFixed(1)}
            />

            <GlowSlider
              label="Qtd. Partículas"
              value={particleCount}
              min={0}
              max={150}
              step={10}
              onChange={setParticleCount}
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                onMouseEnter={playHover}
                onClick={() => {
                  playClick();
                  setColorTheme("default");
                  setGlowIntensity(1.0);
                  setParticleCount(50);
                }}
                className="flex-1 bg-transparent border border-white/20 text-white/70 px-5 py-2.5 rounded-md
                  text-[13px] font-medium hover:border-white/40 hover:text-white transition-all duration-300"
              >
                Restaurar Padrões
              </button>
              <button
                onMouseEnter={playHover}
                onClick={() => {
                  playClick();
                  triggerPulse();
                }}
                className="flex-1 bg-violet-500/20 border border-violet-500/40 text-violet-400 px-5 py-2.5 rounded-md
                  text-[13px] font-medium hover:bg-violet-500/30 transition-all duration-300"
              >
                Efeito Pulsar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
