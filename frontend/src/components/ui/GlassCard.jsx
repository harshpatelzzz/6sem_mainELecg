import { motion } from "framer-motion";

export default function GlassCard({ title, subtitle, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass rounded-xl p-6 transition-all duration-300 hover:border-[var(--cyan)] hover:shadow-[0_0_15px_rgba(0,212,255,0.1)] ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-display text-xl font-medium tracking-wider text-[var(--text-secondary)]">{title}</h3>}
          {subtitle && <p className="text-mono text-sm tracking-wider uppercase text-[var(--text-secondary)] opacity-50">{subtitle}</p>}
        </div>
      )}
      <div className="text-[var(--text-primary)]">
        {children}
      </div>
    </motion.div>
  );
}
