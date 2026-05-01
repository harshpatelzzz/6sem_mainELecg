import AnimatedNumber from "../ui/AnimatedNumber";
import { UserMinus, UserCheck } from "lucide-react";

export default function DeviationIndicator({ score = 0 }) {
  const isHigh = score > 0.3;
  const colorClass = isHigh ? "text-[var(--amber)]" : "text-[var(--cyan)]";
  const bgClass = isHigh ? "bg-[rgba(255,184,0,0.1)] border-[var(--amber)]" : "bg-[rgba(0,212,255,0.1)] border-[var(--cyan)]";
  const Icon = isHigh ? UserMinus : UserCheck;

  return (
    <div className={`w-full p-3 rounded border transition-colors ${bgClass} flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <Icon size={16} className={colorClass} />
        <span className="text-mono text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          Patient Deviation
        </span>
      </div>
      <span className={`text-mono font-bold text-sm ${colorClass}`}>
        <AnimatedNumber value={score * 100} decimals={1} suffix="%" />
      </span>
    </div>
  );
}
