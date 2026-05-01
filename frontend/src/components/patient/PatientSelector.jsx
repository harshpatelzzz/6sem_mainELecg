import { usePatientStore } from "../../store/patientStore";
import { Plus, User } from "lucide-react";
import { useState } from "react";
import AddPatientModal from "./AddPatientModal";

export default function PatientSelector() {
  const { patients, currentPatientId, selectPatient } = usePatientStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPatient = patients.find(p => p.id === currentPatientId);

  return (
    <div className="relative group">
      <button 
        className="flex items-center gap-3 glass px-4 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--cyan)] transition-colors min-w-[200px]"
      >
        <User size={18} className="text-[var(--cyan)]" />
        <div className="text-left flex-1">
          <div className="text-display text-sm font-medium text-[var(--text-primary)]">
            {currentPatient ? currentPatient.name : "Select Patient"}
          </div>
          <div className="text-mono text-[10px] text-[var(--text-secondary)] uppercase">
            {currentPatient ? `${currentPatient.age} yrs • ID:${currentPatient.id.slice(0,4)}` : "No active patient"}
          </div>
        </div>
      </button>

      {/* Dropdown Menu on Hover */}
      <div className="absolute top-full left-0 mt-2 w-64 glass rounded-lg border border-[var(--border)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden flex flex-col max-h-[300px]">
        <div className="p-2 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-primary)]">
          <span className="text-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider px-2">Patients</span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-1 hover:bg-glass rounded text-[var(--cyan)]"
          >
            <Plus size={14} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          {patients.length === 0 ? (
            <div className="p-4 text-center text-xs text-[var(--text-secondary)]">No patients found.</div>
          ) : (
            patients.map(p => (
              <button
                key={p.id}
                onClick={() => selectPatient(p.id)}
                className={`w-full text-left px-4 py-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors border-l-2 ${p.id === currentPatientId ? 'border-[var(--cyan)] bg-[rgba(0,212,255,0.05)]' : 'border-transparent'}`}
              >
                <div className="text-sm font-medium text-[var(--text-primary)]">{p.name}</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-mono text-[10px] text-[var(--text-secondary)]">{p.age} yrs</span>
                  <span className={`text-mono text-[9px] px-1.5 py-0.5 rounded ${p.baselineRisk > 0.4 ? 'bg-[rgba(255,68,68,0.2)] text-[var(--alert)]' : p.baselineRisk > 0.3 ? 'bg-[rgba(255,184,0,0.2)] text-[var(--amber)]' : 'bg-[rgba(0,255,157,0.2)] text-[var(--bio)]'}`}>
                    RSK: {p.baselineRisk.toFixed(2)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {isModalOpen && <AddPatientModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
