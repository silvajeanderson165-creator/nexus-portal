interface InfoCardProps {
  label: string;
  value: string;
  description: string;
}

export default function InfoCard({ label, value, description }: InfoCardProps) {
  return (
    <div className="glass-panel rounded-lg p-5 w-full md:max-w-[260px]">
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/50 mb-1">
        {label}
      </p>
      <p className="font-mono text-2xl font-bold text-violet-400 mb-2">
        {value}
      </p>
      <p className="text-[13px] text-white/60 leading-relaxed">{description}</p>
    </div>
  );
}
