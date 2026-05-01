import { motion } from "framer-motion";

export default function PatientHistoryTimeline({ records = [] }) {
  if (records.length === 0) {
    return <div className="text-mono text-sm text-[var(--text-secondary)] opacity-60 p-4">No history records found.</div>;
  }

  // Sort descending
  const sorted = [...records].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="relative pl-6 border-l border-[var(--border)] ml-4 my-4 flex flex-col gap-6">
      {sorted.map((record, i) => {
        const risk = record.risk;
        let color = "var(--bio)";
        if (risk >= 0.75) color = "var(--alert)";
        else if (risk >= 0.5) color = "var(--amber)";
        else if (risk >= 0.25) color = "var(--cyan)";

        return (
          <motion.div 
            key={record.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative group"
          >
            {/* Timeline dot */}
            <div 
              className="absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] z-10"
              style={{ backgroundColor: color }}
            />
            
            <div className="glass p-3 rounded border border-[var(--border)] group-hover:border-[var(--cyan)] transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="text-mono text-[10px] text-[var(--text-secondary)] opacity-60">
                  {new Date(record.timestamp).toLocaleString()}
                </span>
                <span className="text-mono text-xs font-bold" style={{ color }}>
                  Risk: {risk.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-[var(--text-primary)]">{record.signalSummary}</p>
              {record.uncertainty && (
                <div className="mt-2 text-mono text-[9px] text-[var(--text-secondary)] uppercase opacity-60">
                  Uncertainty: {(record.uncertainty * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
