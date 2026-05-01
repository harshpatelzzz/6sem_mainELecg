import { motion } from "framer-motion";
import * as d3 from "d3";
import { useState } from "react";

export default function AttentionHeatmap({ weights = [] }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!weights || weights.length === 0) return null;

  const maxWeight = Math.max(...weights);
  const maxIndex = weights.indexOf(maxWeight);

  // Map 0 -> navy, 0.5 -> cyan, 1.0 -> bio
  const colorScale = d3.scaleLinear()
    .domain([0, 0.5, 1])
    .range(["#0A0F1E", "#00D4FF", "#00FF9D"]);

  return (
    <div className="w-full flex flex-col justify-center h-full gap-2 pt-2 relative z-10">
      <div className="flex justify-between items-end mb-2">
        <span className="text-mono text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Temporal Attention</span>
        <span className="text-mono text-[10px] text-[var(--cyan)] uppercase tracking-wider animate-pulse">Scanning</span>
      </div>

      <div className="flex w-full h-16 gap-0 items-end relative overflow-hidden group rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.2)] border border-[var(--border)]">
        {/* Scanning Sweep */}
        <motion.div
          className="absolute top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-transparent via-[rgba(0,212,255,0.4)] to-transparent"
          animate={{ left: ["-20%", "120%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />

        {weights.map((w, i) => {
          const isMax = i === maxIndex;
          const height = Math.max(5, w * 100);
          const color = colorScale(w);
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className="flex-1 relative cursor-crosshair transition-all"
              style={{
                height: `${height}%`,
                backgroundColor: color,
                transformOrigin: "bottom",
                borderTop: isMax ? "2px solid var(--bio)" : "none",
                boxShadow: isMax ? "0 -4px 10px rgba(0,255,157,0.5)" : "none",
                zIndex: isMax ? 10 : 1
              }}
            >
              {isMax && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[var(--bio)] text-[8px] font-bold tracking-widest pointer-events-none drop-shadow-[0_0_5px_var(--bio)]">
                  MAX
                </div>
              )}
              {hoverIndex === i && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-[10px] font-mono px-2 py-1 rounded pointer-events-none z-20 shadow-lg backdrop-blur">
                  {w.toFixed(3)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex justify-between text-mono text-[9px] text-[var(--text-secondary)] opacity-50 tracking-wider mt-1">
        <span>T-START</span>
        <span>T-END</span>
      </div>
    </div>
  );
}
