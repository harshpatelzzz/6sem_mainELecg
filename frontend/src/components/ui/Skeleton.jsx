export default function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-[var(--bg-glass)] rounded border border-[var(--border)] ${className}`}></div>
  );
}
