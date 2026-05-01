export default function StatusDot({ status = "ok" }) {
  const colorClass = {
    ok: "bg-[var(--bio)] shadow-[0_0_8px_var(--bio)]",
    warn: "bg-[var(--amber)] shadow-[0_0_8px_var(--amber)]",
    error: "bg-[var(--alert)] shadow-[0_0_8px_var(--alert)]",
  }[status] || "bg-[var(--text-secondary)]";

  return <span className={`inline-block w-2 h-2 rounded-full ${colorClass}`}></span>;
}
