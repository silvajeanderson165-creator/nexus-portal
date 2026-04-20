import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useAudio } from "@/hooks/useAudio";

const NAV_LINKS = [
  { label: "Explorar", target: "#explore" },
  { label: "Especificações", target: "#specs" },
  { label: "Personalizar", target: "#customize" },
  { label: "Sobre", target: "#about" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { playClick } = useAudio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 3 }
    );
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setMenuOpen(false);
    playClick();
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-5 md:px-10 transition-all duration-500 ${
        scrolled || menuOpen
          ? "bg-[rgba(5,5,5,0.95)] backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-white hover:text-violet-400 transition-colors"
      >
        NEXUS PORTAL
      </a>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.target}
            onClick={(e) => handleClick(e, link.target)}
            className="relative text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-violet-400 transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden flex flex-col gap-[5px] p-2"
        aria-label="Menu"
      >
        <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
        <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[rgba(5,5,5,0.97)] backdrop-blur-xl border-b border-white/5 md:hidden">
          <div className="flex flex-col py-6 px-6 gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.target}
                onClick={(e) => handleClick(e, link.target)}
                className="text-base font-medium text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
