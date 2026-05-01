import { motion } from "framer-motion";
import { User, Clock, Activity, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PatientCard({ patient }) {
  const navigate = useNavigate();
  if (!patient) return null;

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="glass p-5 rounded-xl border border-[var(--border)] hover:border-[var(--cyan)] transition-colors flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(0,212,255,0.1)] border border-[var(--cyan)] flex items-center justify-center">
            <User className="text-[var(--cyan)]" size={20} />
          </div>
          <div>
            <h3 className="text-display text-lg font-medium text-[var(--text-primary)]">{patient.name}</h3>
            <p className="text-mono text-xs text-[var(--text-secondary)] opacity-60">ID: {patient.id.slice(0,8)}</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-4">
          <div className="text-right">
            <span className="text-display text-xl font-bold text-[var(--text-primary)]">{patient.age}</span>
            <span className="text-mono text-[10px] text-[var(--text-secondary)] uppercase block opacity-60">Years Old</span>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="p-2 bg-[rgba(0,212,255,0.1)] rounded text-[var(--cyan)] hover:bg-[rgba(0,212,255,0.2)] transition-colors border border-[var(--cyan)]"
            title="View in Dashboard"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-[var(--border)]" />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[var(--text-secondary)] opacity-60" />
          <span className="text-mono text-xs text-[var(--text-secondary)] uppercase">Baseline Risk</span>
        </div>
        <span className="text-mono font-bold text-[var(--bio)]">{patient.baselineRisk.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[var(--text-secondary)] opacity-60" />
          <span className="text-mono text-xs text-[var(--text-secondary)] uppercase">Last Updated</span>
        </div>
        <span className="text-mono text-xs text-[var(--text-secondary)]">{new Date(patient.lastUpdated).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}
