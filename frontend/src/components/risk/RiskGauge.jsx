import { motion } from "framer-motion";
import AnimatedNumber from "../ui/AnimatedNumber";

export default function RiskGauge({ value = 0 }) {
  const radius = 80;
  const stroke = 12;
  const normalizedValue = Math.min(Math.max(value, 0), 1);
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - normalizedValue * circumference;

  let label = "LOW";
  let mainColorClass = "text-bio";
  let glowColor = "rgba(0, 255, 157, 0.8)";

  if (normalizedValue >= 0.75) {
    label = "CRITICAL";
    mainColorClass = "text-alert";
    glowColor = "rgba(255, 68, 68, 0.8)";
  } else if (normalizedValue >= 0.5) {
    label = "HIGH";
    mainColorClass = "text-amber";
    glowColor = "rgba(255, 184, 0, 0.8)";
  } else if (normalizedValue >= 0.25) {
    label = "MODERATE";
    mainColorClass = "text-cyan";
    glowColor = "rgba(0, 212, 255, 0.8)";
  }

  const needleRotation = -90 + normalizedValue * 180;
  const ticks = [0, 25, 50, 75, 100];

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center relative w-full pt-4"
    >
      <svg width="220" height="130" viewBox="-10 -10 220 130" className="overflow-visible">
        <defs>
          <linearGradient id="highGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--cyan)" />
            <stop offset="50%" stopColor="var(--amber)" />
            <stop offset="100%" stopColor="var(--alert)" />
          </linearGradient>
          
          <linearGradient id="lowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="var(--bio)" />
          </linearGradient>
        </defs>

        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--bg-glass)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Ticks */}
        {ticks.map((tick) => {
          const angle = -180 + (tick / 100) * 180;
          const rad = (angle * Math.PI) / 180;
          const innerRadius = radius - 15;
          const outerRadius = radius - 20;
          const x1 = 100 + innerRadius * Math.cos(rad);
          const y1 = 100 + innerRadius * Math.sin(rad);
          const x2 = 100 + outerRadius * Math.cos(rad);
          const y2 = 100 + outerRadius * Math.sin(rad);
          
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--text-secondary)"
              strokeWidth="2"
              opacity="0.5"
            />
          );
        })}

        {/* Colored Arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={normalizedValue < 0.5 ? "url(#lowGradient)" : "url(#highGradient)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, type: "spring", bounce: 0 }}
          style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: needleRotation }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          style={{ originX: "100px", originY: "100px" }}
        >
          <path d="M 96 100 L 100 25 L 104 100 Z" fill="var(--text-primary)" />
          <circle cx="100" cy="100" r="8" fill="var(--text-primary)" />
        </motion.g>
      </svg>
      
      <div className="absolute bottom-[20px] flex flex-col items-center">
        <div className="text-3xl font-bold text-[var(--text-primary)]">
          <AnimatedNumber value={normalizedValue * 100} decimals={0} suffix="%" />
        </div>
        <span className={`text-mono text-xs font-semibold tracking-widest uppercase mt-1 ${mainColorClass}`}>
          {label}
        </span>
      </div>
      
      <div className="text-mono text-[10px] text-[var(--text-secondary)] opacity-50 tracking-wider uppercase mt-4 mb-2">
        LAST UPDATED: JUST NOW
      </div>
    </motion.div>
  );
}
