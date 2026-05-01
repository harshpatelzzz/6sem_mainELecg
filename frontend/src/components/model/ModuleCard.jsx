import { motion } from "framer-motion";

export default function ModuleCard({ title, description, value, children }) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.02 }}
      className="glass p-5 rounded-xl border border-[var(--border)] transition-all duration-300 hover:border-[var(--cyan)] hover:shadow-[0_4px_20px_rgba(0,212,255,0.15)] flex flex-col h-full bg-[var(--bg-surface)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-display text-xl font-medium tracking-wider text-[var(--text-primary)]">{title}</h3>
          {description && <p className="text-mono text-sm tracking-wider uppercase text-[var(--text-secondary)] opacity-60 mt-1">{description}</p>}
        </div>
        {value && <span className="text-mono font-bold text-[var(--text-primary)]">{value}</span>}
      </div>
      <div className="flex-1 flex flex-col justify-end relative">
        {children}
      </div>
    </motion.div>
  );
}
