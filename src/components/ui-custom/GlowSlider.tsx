interface GlowSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  displayValue?: string;
}

export default function GlowSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: GlowSliderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/50">
          {label}
        </span>
        <span className="font-mono text-sm text-violet-400">
          {displayValue ?? value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/15 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)]
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-125
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.3)]
          [&::-moz-range-thumb]:cursor-pointer
        "
        style={{
          background: `linear-gradient(to right, #a78bfa 0%, #a78bfa ${
            ((value - min) / (max - min)) * 100
          }%, rgba(255,255,255,0.15) ${
            ((value - min) / (max - min)) * 100
          }%, rgba(255,255,255,0.15) 100%)`,
        }}
      />
    </div>
  );
}
