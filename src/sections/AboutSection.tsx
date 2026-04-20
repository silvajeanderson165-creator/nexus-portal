import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DecodeText from "@/components/ui-custom/DecodeText";
import { useAudio } from "@/hooks/useAudio";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const { playHover, playClick } = useAudio();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        [p1Ref.current, p2Ref.current],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCta = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 min-h-[60vh] py-[120px] px-[5vw] flex items-center justify-center"
    >
      <div className="max-w-[700px] text-center">
        <div ref={titleRef} className="mb-10 opacity-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50 mb-3">
            04 — Sobre
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
            <DecodeText text="A Descoberta" />
          </h2>
        </div>

        <p
          ref={p1Ref}
          className="text-base md:text-lg text-white/75 leading-[1.8] mb-6 opacity-0"
        >
          O Anel Nexus foi descoberto em 2024 durante um levantamento do espaço profundo do 
          sistema Kepler-442b. O artefato parece existir simultaneamente em
          múltiplas dimensões, mudando constantemente seus padrões de superfície.
          Cientistas não conseguiram determinar sua idade, composição ou
          propósito. O que sabemos é que ele responde à interação humana —
          mudando de cor, intensidade e comportamento com base em como
          interagimos com ele.
        </p>

        <p
          ref={p2Ref}
          className="text-base md:text-lg text-white/75 leading-[1.8] mb-10 opacity-0"
        >
          Esta réplica digital permite que exploradores da Terra vivenciem as
          propriedades misteriosas do artefato em primeira mão. Cada interação é
          única. O anel se recorda.
        </p>

        <button
          ref={ctaRef}
          onMouseEnter={playHover}
          onClick={() => {
            playClick();
            handleCta();
          }}
          className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-md
            text-sm font-medium hover:bg-white/[0.15] hover:border-white/40
            hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all duration-300 opacity-0"
        >
          Inicie Sua Jornada
        </button>
      </div>
    </section>
  );
}
