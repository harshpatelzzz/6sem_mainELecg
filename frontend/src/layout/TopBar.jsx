import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

export default function TopBar({ toggleSidebar }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-[60px] fixed top-0 right-0 left-0 z-20 flex items-center justify-between px-4 bg-navy-800/80 backdrop-blur border-b border-[var(--border)]">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-glass rounded text-[var(--text-primary)] transition-colors">
          <Menu size={20} />
        </button>
        <div className="text-display font-bold text-xl tracking-wider text-[var(--text-primary)]">
          ECG<span className="text-[var(--cyan)]">·</span>INTEL
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-bio animate-pulse shadow-[0_0_8px_var(--bio)]"></span>
        <span className="text-xs text-bio tracking-widest font-mono">MODEL ACTIVE</span>
      </div>

      <div className="text-mono text-sm text-[var(--text-secondary)] w-24 text-right">
        {time.toLocaleTimeString([], { hour12: false })}
      </div>
    </header>
  );
}
