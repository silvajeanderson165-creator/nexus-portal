import { useEffect, useRef } from "react";

const ASTRONAUT_SVG = `
<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Mochila propulsora -->
  <rect x="70" y="140" width="60" height="50" fill="#6b7280" rx="5"/>
  <circle cx="80" cy="160" r="8" fill="#ef4444" opacity="0.8">
    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite"/>
  </circle>
  <circle cx="120" cy="160" r="8" fill="#ef4444" opacity="0.8">
    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Corpo -->
  <ellipse cx="100" cy="150" rx="40" ry="50" fill="#e5e7eb"/>
  <rect x="75" y="120" width="50" height="60" fill="#e5e7eb" rx="10"/>
  
  <!-- Detalhes do traje -->
  <rect x="85" y="135" width="30" height="40" fill="#9ca3af" opacity="0.3" rx="5"/>
  <circle cx="100" cy="145" r="8" fill="#60a5fa" opacity="0.5"/>
  <line x1="90" y1="155" x2="110" y2="155" stroke="#6b7280" stroke-width="2"/>
  <line x1="90" y1="165" x2="110" y2="165" stroke="#6b7280" stroke-width="2"/>
  
  <!-- Braço Esquerdo -->
  <g>
    <ellipse cx="60" cy="140" rx="12" ry="30" fill="#e5e7eb" transform="rotate(-20 60 140)"/>
    <ellipse cx="45" cy="160" rx="10" ry="15" fill="#d1d5db" transform="rotate(-30 45 160)"/>
    <circle cx="40" cy="175" r="12" fill="#9ca3af"/>
    <circle cx="40" cy="175" r="8" fill="#6b7280"/>
  </g>
  
  <!-- Braço Direito -->
  <g>
    <ellipse cx="140" cy="140" rx="12" ry="30" fill="#e5e7eb" transform="rotate(20 140 140)"/>
    <ellipse cx="155" cy="160" rx="10" ry="15" fill="#d1d5db" transform="rotate(30 155 160)"/>
    <circle cx="160" cy="175" r="12" fill="#9ca3af"/>
    <circle cx="160" cy="175" r="8" fill="#6b7280"/>
  </g>
  
  <!-- Perna Esquerda -->
  <g>
    <rect x="75" y="180" width="18" height="50" fill="#e5e7eb" rx="9"/>
    <ellipse cx="84" cy="235" rx="12" ry="18" fill="#d1d5db"/>
    <ellipse cx="84" cy="240" rx="14" ry="12" fill="#1f2937"/>
  </g>
  
  <!-- Perna Direita -->
  <g>
    <rect x="107" y="180" width="18" height="50" fill="#e5e7eb" rx="9"/>
    <ellipse cx="116" cy="235" rx="12" ry="18" fill="#d1d5db"/>
    <ellipse cx="116" cy="240" rx="14" ry="12" fill="#1f2937"/>
  </g>
  
  <!-- Cabeça (capacete) -->
  <circle cx="100" cy="90" r="35" fill="#93c5fd" opacity="0.4"/>
  <circle cx="100" cy="90" r="32" fill="#dbeafe" opacity="0.6"/>
  
  <!-- Rosto -->
  <circle cx="100" cy="90" r="25" fill="#fef3c7"/>
  
  <!-- Olhos -->
  <circle cx="92" cy="88" r="4" fill="#1f2937"/>
  <circle cx="108" cy="88" r="4" fill="#1f2937"/>
  <circle cx="93" cy="87" r="1.5" fill="#fff"/>
  <circle cx="109" cy="87" r="1.5" fill="#fff"/>
  
  <!-- Boca -->
  <path d="M 95 98 Q 100 102 105 98" stroke="#1f2937" stroke-width="2" fill="none" stroke-linecap="round"/>
  
  <!-- Brilho do capacete -->
  <ellipse cx="85" cy="75" rx="12" ry="18" fill="#fff" opacity="0.4"/>
  <ellipse cx="90" cy="70" rx="6" ry="9" fill="#fff" opacity="0.6"/>
  
  <!-- Detalhes do capacete -->
  <circle cx="100" cy="90" r="35" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.3"/>
</svg>
`;

const NUM_ASTRONAUTS = 12;

export default function FloatingAstronauts() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < NUM_ASTRONAUTS; i++) {
      const el = document.createElement("div");
      el.className = "astronaut";
      el.innerHTML = ASTRONAUT_SVG;

      // Posição aleatória
      el.style.left = (Math.random() * 85 + 5) + "%";
      el.style.top = (Math.random() * 85 + 5) + "%";

      // Tamanho aleatório (40px a 80px)
      const size = Math.random() * 40 + 40;
      el.style.width = size + "px";
      el.style.height = (size * 1.5) + "px";

      // Duração e delay aleatórios
      el.style.animationDuration = (Math.random() * 10 + 12) + "s";
      el.style.animationDelay = Math.random() * 5 + "s";

      // Direção aleatória
      if (Math.random() > 0.5) {
        el.style.animationDirection = "reverse";
      }

      container.appendChild(el);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} id="astronauts-container" />;
}
