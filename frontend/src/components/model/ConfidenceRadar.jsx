import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from "recharts";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-2 rounded border border-[var(--border)] backdrop-blur text-[10px] font-mono shadow-[0_0_15px_rgba(0,0,0,0.5)] z-50">
        <span className="text-[var(--text-secondary)] mr-2">{payload[0].payload.name}:</span>
        <span className="text-[var(--bio)] font-bold">{(payload[0].value * 100).toFixed(1)}%</span>
      </div>
    );
  }
  return null;
};

export default function ConfidenceRadar({ data = [] }) {
  const maxClass = data.reduce((max, obj) => obj.value > max.value ? obj : max, data[0]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: [1, 1.02, 1] }}
      transition={{ 
        opacity: { duration: 0.8, type: "spring" },
        scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
      }}
      className="relative w-full h-48 flex items-center justify-center pt-2 z-10"
    >
      <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(0,255,157,0.05)] pointer-events-none" />
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="var(--border)" opacity={0.3} />
          <PolarAngleAxis 
            dataKey="name" 
            tick={(props) => {
              const { x, y, payload } = props;
              const isMax = payload.value === maxClass?.name;
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill={isMax ? "var(--text-primary)" : "var(--text-secondary)"}
                  fontSize={isMax ? 11 : 9}
                  fontWeight={isMax ? "bold" : "normal"}
                  fontFamily="monospace"
                  opacity={isMax ? 1 : 0.6}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <Radar
            name="Confidence"
            dataKey="value"
            stroke="var(--bio)"
            fill="var(--bio)"
            fillOpacity={0.2}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none bg-[var(--bg-primary)] p-3 rounded-full border border-[var(--border)] shadow-[0_0_20px_rgba(0,255,157,0.15)]">
        <span className="text-display text-[10px] font-bold text-[var(--bio)] tracking-widest">{maxClass?.name}</span>
        <span className="text-mono font-bold text-[var(--text-primary)] text-xl mt-1">
          {((maxClass?.value || 0) * 100).toFixed(0)}%
        </span>
      </div>
    </motion.div>
  );
}
