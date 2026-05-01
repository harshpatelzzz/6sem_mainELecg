export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-display text-2xl font-medium tracking-wider text-[var(--text-secondary)]">{title}</h2>
      {subtitle && <p className="text-mono text-sm mt-1 tracking-wider uppercase text-[var(--text-secondary)] opacity-50">{subtitle}</p>}
    </div>
  );
}
