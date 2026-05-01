import { motion } from "framer-motion";
import { useApp } from "../state/AppContext";
import { useNavigate } from "react-router-dom";
import PatientCard from "../components/patient/PatientCard";
import PatientHistoryTimeline from "../components/patient/PatientHistoryTimeline";
import SectionHeader from "../components/ui/SectionHeader";
import GlassCard from "../components/ui/GlassCard";
import PersonalizationBanner from "../components/patient/PersonalizationBanner";
import { useEffect, useState } from "react";
import AddPatientModal from "../components/patient/AddPatientModal";

export default function Patients() {
  const { patients, selectedPatient, history, selectPatient, refreshPatients } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = async (id) => {
    await selectPatient(id);
    navigate("/");
  };

  const risk = history.length > 0 ? history[history.length - 1].risk_score : (selectedPatient ? 0 : 0);

  if (patients.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center min-h-[500px]">
        <p className="text-mono text-sm text-[var(--text-secondary)] opacity-60 mb-4 uppercase tracking-widest">No patients yet</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[var(--cyan)] to-[var(--bio)] text-[var(--bg-primary)] font-bold px-6 py-2 rounded shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"
        >
          Add Patient
        </button>
        {isModalOpen && <AddPatientModal onClose={() => setIsModalOpen(false)} />}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <div className="flex justify-between items-end mb-6">
        <SectionHeader title="Patient Management" subtitle="View and manage patient intelligence profiles" />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[rgba(0,212,255,0.1)] text-[var(--cyan)] border border-[var(--cyan)] font-bold px-4 py-2 rounded shadow-[0_0_15px_rgba(0,212,255,0.2)] text-xs uppercase tracking-wider mb-6"
        >
          + Add Patient
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlassCard title="Patient Roster" className="h-[600px] overflow-y-auto hide-scrollbar">
            <div className="flex flex-col gap-3 mt-4">
              {patients.map(p => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  key={p.patient_id}
                  onClick={() => handleSelect(p.patient_id)}
                  className={`text-left p-4 rounded-xl border transition-all ${p.patient_id === selectedPatient?.patient_id ? 'border-[var(--cyan)] bg-[rgba(0,212,255,0.05)] shadow-[0_0_15px_rgba(0,212,255,0.1)]' : 'border-[var(--border)] hover:border-[var(--cyan)] hover:bg-[rgba(255,255,255,0.02)] glass'}`}
                >
                  <div className="font-medium text-[var(--text-primary)]">{p.name}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-mono text-xs text-[var(--text-secondary)]">{p.patient_id}</div>
                    <div className={`text-mono text-[9px] px-1.5 py-0.5 rounded ${p.last_risk > 40 ? 'bg-[rgba(255,68,68,0.2)] text-[var(--alert)]' : p.last_risk > 20 ? 'bg-[rgba(255,184,0,0.2)] text-[var(--amber)]' : 'bg-[rgba(0,255,157,0.2)] text-[var(--bio)]'}`}>
                      RSK: {(p.last_risk / 100).toFixed(2)}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          {selectedPatient && (
            <div className="flex flex-col gap-6">
              <PatientCard patient={selectedPatient} />
              
              <div className="z-20 relative">
                <PersonalizationBanner baselineRisk={0.3} currentRisk={risk / 100} />
              </div>
              
              <GlassCard title="Risk History Timeline" className="flex-1">
                <div className="max-h-[400px] overflow-y-auto hide-scrollbar">
                  <PatientHistoryTimeline records={history.map(h => ({
                    id: h.timestamp,
                    timestamp: h.timestamp,
                    risk: h.risk_score / 100,
                    signalSummary: `Diagnosis: ${h.predicted_class}`,
                    uncertainty: h.uncertainty
                  }))} />
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && <AddPatientModal onClose={() => setIsModalOpen(false)} />}
    </motion.div>
  );
}
