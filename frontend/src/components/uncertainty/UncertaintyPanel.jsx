import AnimatedNumber from "../ui/AnimatedNumber";

export default function UncertaintyPanel({ value = 0 }) {
  const normalizedValue = Math.min(Math.max(value, 0), 1);
  const epistemic = normalizedValue * 0.6; // Mock split
  const aleatoric = normalizedValue * 0.4; // Mock split

  let label = "LOW";
  let colorClass = "text-bio";
  if (normalizedValue > 0.6) {
    label = "HIGH";
    colorClass = "text-amber";
  } else if (normalizedValue > 0.3) {
    label = "MEDIUM";
    colorClass = "text-cyan";
  }

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-end mb-2">
        <span className="text-mono text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Uncertainty</span>
        <div className="text-right">
          <span className="text-lg font-bold text-[var(--text-primary)]">
            <AnimatedNumber value={normalizedValue * 100} decimals={1} suffix="%" />
          </span>
          <span className={`text-mono text-[10px] ml-2 uppercase tracking-wider ${colorClass}`}>{label}</span>
        </div>
      </div>
      
      <div className="w-full h-2 bg-[var(--bg-glass)] rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-[var(--cyan)] transition-all duration-500" 
          style={{ width: `${epistemic * 100}%` }}
          title="Epistemic"
        />
        <div 
          className="h-full bg-[var(--amber)] transition-all duration-500" 
          style={{ width: `${aleatoric * 100}%` }}
          title="Aleatoric"
        />
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-mono text-[var(--text-secondary)] opacity-50 uppercase tracking-wider">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--cyan)]"></span> Epistemic</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--amber)]"></span> Aleatoric</span>
      </div>
    </div>
  );
}
