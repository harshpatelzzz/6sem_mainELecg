export default function LivePulse() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--bio)] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--bio)]"></span>
      </span>
      <span className="text-mono text-xs font-bold tracking-widest text-[var(--bio)]">LIVE</span>
    </div>
  );
}
