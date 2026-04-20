import { type ColorTheme } from "@/store/useStore";

const SWATCHES: { theme: ColorTheme; style: string; label: string }[] = [
  {
    theme: "default",
    style: "conic-gradient(from 0deg, #60a5fa, #a78bfa, #22d3ee, #60a5fa)",
    label: "Iridescent",
  },
  { theme: "blue", style: "#3b82f6", label: "Cosmic Blue" },
  { theme: "purple", style: "#8b5cf6", label: "Nebula Purple" },
  { theme: "gold", style: "#f59e0b", label: "Solar Gold" },
  { theme: "red", style: "#ef4444", label: "Void Red" },
];

interface ColorSwatchProps {
  selected: ColorTheme;
  onChange: (theme: ColorTheme) => void;
}

export default function ColorSwatch({ selected, onChange }: ColorSwatchProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/50">
        Color Theme
      </span>
      <div className="flex items-center gap-3">
        {SWATCHES.map((swatch) => (
          <button
            key={swatch.theme}
            aria-label={swatch.label}
            onClick={() => onChange(swatch.theme)}
            className={`w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
              selected === swatch.theme
                ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.2)]"
                : "border-transparent"
            }`}
            style={{ background: swatch.style }}
          />
        ))}
      </div>
    </div>
  );
}
