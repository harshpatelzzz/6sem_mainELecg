import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Live from "./pages/Live";
import Architecture from "./pages/Architecture";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/live" element={<Live />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
