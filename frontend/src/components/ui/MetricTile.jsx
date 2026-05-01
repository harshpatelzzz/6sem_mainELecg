import GlassCard from "./GlassCard";
import AnimatedNumber from "./AnimatedNumber";

export default function MetricTile({ label, value, icon: Icon }) {
  return (
    <GlassCard className="flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
        {Icon && <Icon size={16} />}
        <span className="text-mono text-sm uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-bold text-[var(--text-primary)]">
        <AnimatedNumber value={value} decimals={1} />
      </div>
    </GlassCard>
  );
}
