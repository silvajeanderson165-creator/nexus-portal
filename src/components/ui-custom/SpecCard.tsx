import { type ReactNode } from "react";

interface SpecCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function SpecCard({ icon, label, value }: SpecCardProps) {
  return (
    <div className="glass-panel rounded-lg p-7 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all duration-300 group">
      <div className="mb-4 text-violet-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/50 mb-2">
        {label}
      </p>
      <p className="font-display text-[28px] font-bold text-white">{value}</p>
    </div>
  );
}
