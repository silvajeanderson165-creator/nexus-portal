import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InfoCard from "@/components/ui-custom/InfoCard";
import DecodeText from "@/components/ui-custom/DecodeText";

gsap.registerPlugin(ScrollTrigger);

export default function ExploreSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const bottomTipRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        leftCardRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        rightCardRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        bottomTipRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          delay: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="section-backdrop relative z-10 min-h-screen flex flex-col justify-center py-20 md:py-[12vh] px-5 md:px-[5vw]"
    >
      <div ref={titleRef} className="mb-10 md:mb-16 opacity-0">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/50 mb-3">
          01 — Explorar
        </p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          <DecodeText text="Cada Ângulo Conta uma História" />
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
        <div ref={leftCardRef} className="opacity-0">
          <InfoCard
            label="Velocidade de Rotação"
            value="1.0x"
            description="O anel gira em seu eixo Y, revelando diferentes padrões de superfície"
          />
        </div>
        <div ref={rightCardRef} className="opacity-0 md:mt-16">
          <InfoCard
            label="Nível do Zoom"
            value="100%"
            description="Role a página ou faça pinch-zoom para examinar os detalhes intrincados"
          />
        </div>
      </div>

      <p
        ref={bottomTipRef}
        className="text-center text-sm text-white/50 mt-12 md:mt-20 opacity-0 hidden md:block"
      >
        Use o mouse para orbitar o artefato
      </p>
    </section>
  );
}
