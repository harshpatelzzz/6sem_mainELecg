import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Activity, Network, FileText } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/patients", label: "Patients", icon: Users },
  { path: "/live", label: "Live", icon: Activity },
  { path: "/architecture", label: "Architecture", icon: Network },
  { path: "/reports", label: "Reports", icon: FileText },
];

export default function Sidebar({ isOpen }) {
  return (
    <aside
      className={`fixed left-0 top-[60px] bottom-0 z-10 bg-navy-800 border-r border-[var(--border)] transition-all duration-300 flex flex-col ${
        isOpen ? "w-60" : "w-20"
      }`}
    >
      <nav className="flex-1 py-4 flex flex-col gap-2 overflow-x-hidden">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center h-12 px-6 transition-all border-l-2 ${
                isActive
                  ? "border-[var(--cyan)] text-[var(--cyan)] bg-glass"
                  : "border-transparent text-[var(--text-secondary)] hover:glass hover:text-[var(--text-primary)]"
              }`
            }
          >
            <Icon size={20} className="min-w-[20px]" />
            <span
              className={`ml-4 whitespace-nowrap text-sm font-medium transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
