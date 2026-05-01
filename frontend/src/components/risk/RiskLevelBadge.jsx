export default function RiskLevelBadge({ value = 0 }) {
  const normalizedValue = Math.min(Math.max(value, 0), 1);
  
  let colorClass = "bg-[var(--bio)] text-[var(--bio)]";
  let label = "LOW";

  if (normalizedValue >= 0.75) {
    colorClass = "bg-[var(--alert)] text-[var(--alert)]";
    label = "CRITICAL";
  } else if (normalizedValue >= 0.5) {
    colorClass = "bg-[var(--amber)] text-[var(--amber)]";
    label = "HIGH";
  } else if (normalizedValue >= 0.25) {
    colorClass = "bg-[var(--cyan)] text-[var(--cyan)]";
    label = "MODERATE";
  }

  return (
    <span className={`px-3 py-1 rounded text-mono text-xs font-bold tracking-widest bg-opacity-10 border border-current ${colorClass}`}>
      {label}
    </span>
  );
}
