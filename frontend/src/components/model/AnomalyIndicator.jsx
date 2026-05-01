import AnimatedNumber from "../ui/AnimatedNumber";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function AnomalyIndicator({ score = 0 }) {
  const isHigh = score > 0.5;
  const colorClass = isHigh ? "text-[var(--alert)]" : "text-[var(--bio)]";
  const bgClass = isHigh ? "bg-[rgba(255,68,68,0.1)] border-[var(--alert)]" : "bg-[rgba(0,255,157,0.1)] border-[var(--bio)]";
  const Icon = isHigh ? AlertTriangle : CheckCircle;

  return (
    <div className={`w-full p-3 rounded border transition-colors ${bgClass} flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <Icon size={16} className={colorClass} />
        <span className="text-mono text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          Anomaly Detection
        </span>
      </div>
      <span className={`text-mono font-bold text-sm ${colorClass}`}>
        <AnimatedNumber value={score * 100} decimals={1} suffix="%" />
      </span>
    </div>
  );
}
