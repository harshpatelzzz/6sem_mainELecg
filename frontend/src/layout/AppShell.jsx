import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col text-[var(--text-primary)] overflow-hidden ecg-grid">
      <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 pt-[60px]">
        <Sidebar isOpen={sidebarOpen} />
        
        <main
          className={`flex-1 transition-all duration-300 h-[calc(100vh-60px)] overflow-y-auto p-6 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="h-full w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
