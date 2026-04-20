import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store/useStore";
import { useAudio } from "@/hooks/useAudio";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  const isLoading = useStore((s) => s.isLoading);
  const { playHover, playClick } = useAudio();

  useEffect(() => {
    if (isLoading) return; // Aguarda a tela de loading sair

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }
    )
      .fromTo(
        titleLine1Ref.current,
        { opacity: 0, y: 50, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
        { opacity: 1, y: 0, clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", duration: 1.2, ease: "expo.out" },
        "-=0.9"
      )
      .fromTo(
        titleLine2Ref.current,
        { opacity: 0, y: 50, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
        { opacity: 1, y: 0, clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", duration: 1.2, ease: "expo.out" },
        "-=1.0"
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.7"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: "expo.out" },
        "-=0.6"
      )
      .fromTo(
        hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5 },
        "+=0.2"
      );

    // Parallax Effect via ScrollTrigger
    gsap.to(containerRef.current, {
      y: 150,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

  }, [isLoading]);

  const handleExplore = () => {
    const el = document.querySelector("#explore");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative z-10 h-screen flex items-end pb-[15vh] pointer-events-none"
      style={{ paddingLeft: "5vw" }}
    >
      <div className="max-w-lg">
        <p
          ref={subtitleRef}
          className="font-mono text-xs uppercase tracking-[0.15em] text-white/60 mb-4 opacity-0"
        >
          Experiência 3D Interativa
        </p>
        <h1 className="font-display text-5xl md:text-[80px] font-bold text-white tracking-[-0.02em] leading-[1.1] mb-6">
          <span ref={titleLine1Ref} className="block opacity-0">
            Descubra o
          </span>
          <span ref={titleLine2Ref} className="block opacity-0">
            Anel Nexus
          </span>
        </h1>
        <p
          ref={descRef}
          className="text-base text-white/70 max-w-[400px] leading-relaxed mb-8 opacity-0"
        >
          Um artefato alienígena de origem desconhecida. Gire, personalize e 
          interaja com este objeto hiperdimensional.
        </p>
        <button
          ref={ctaRef}
          onMouseEnter={playHover}
          onClick={() => {
            playClick();
            handleExplore();
          }}
          className="pointer-events-auto bg-white/10 border border-white/20 text-white px-6 py-3 rounded-md
            text-sm font-medium hover:bg-white/[0.15] hover:border-white/40 transition-all duration-300 opacity-0"
        >
          Comece a Explorar
        </button>
      </div>

      <p
        ref={hintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/35 uppercase tracking-wider opacity-0"
      >
        Arraste para girar • Role para zoom
      </p>
    </section>
  );
}
