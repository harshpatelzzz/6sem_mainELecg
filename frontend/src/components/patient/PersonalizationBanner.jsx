import { ShieldAlert, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function PersonalizationBanner({ baselineRisk = 0, currentRisk = 0 }) {
  const delta = currentRisk - baselineRisk;
  const isElevated = delta > 0.05;
  const isLower = delta < -0.05;

  let deltaColorClass = "text-[var(--text-secondary)]";
  let Icon = Activity;

  if (isElevated) {
    deltaColorClass = "text-[var(--amber)]";
    Icon = ShieldAlert;
  } else if (isLower) {
    deltaColorClass = "text-[var(--bio)]";
    Icon = ShieldCheck;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass px-4 py-2 flex items-center gap-4 rounded-lg border border-[var(--border)]"
    >
      <div className="flex items-center gap-2 border-r border-[var(--border)] pr-4">
        <div className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse shadow-[0_0_8px_var(--cyan)]" />
        <span className="text-mono text-[10px] font-bold tracking-widest text-[var(--cyan)] uppercase">Personalized Model Active</span>
      </div>
      
      <div className="flex items-center gap-4 text-mono text-xs">
        <div className="flex flex-col">
          <span className="text-[var(--text-secondary)] opacity-60 uppercase tracking-wider text-[8px]">Baseline</span>
          <span className="text-[var(--text-primary)] font-bold">{baselineRisk.toFixed(2)}</span>
        </div>
        <span className="text-[var(--text-secondary)]">→</span>
        <div className="flex flex-col">
          <span className="text-[var(--text-secondary)] opacity-60 uppercase tracking-wider text-[8px]">Current</span>
          <span className="text-[var(--text-primary)] font-bold">{currentRisk.toFixed(2)}</span>
        </div>
        
        <div className={`flex items-center gap-1 font-bold ${deltaColorClass} ml-2 bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded border border-[var(--border)]`}>
          <Icon size={12} />
          {delta > 0 ? '+' : ''}{delta.toFixed(2)}
        </div>
      </div>
    </motion.div>
  );
}
