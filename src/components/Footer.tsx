export default function Footer() {
  return (
    <footer className="relative z-10 bg-black/70 backdrop-blur-lg border-t border-white/[0.06] py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-white">
            NEXUS PORTAL
          </span>
          <span className="text-xs text-white/35">
            © 2025 Nexus Project
          </span>
        </div>
      </div>
    </footer>
  );
}
