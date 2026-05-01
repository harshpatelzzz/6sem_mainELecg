import { useState } from "react";
import { usePatientStore } from "../../store/patientStore";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function AddPatientModal({ onClose }) {
  const addPatient = usePatientStore(state => state.addPatient);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && age) {
      addPatient({ name, age: parseInt(age, 10) });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-6 rounded-xl border border-[var(--border)] w-full max-w-md bg-[var(--bg-surface)] relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <X size={18} />
        </button>
        <h2 className="text-display text-xl font-medium text-[var(--text-primary)] mb-6">New Patient Record</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)] transition-colors"
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <label className="block text-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Age</label>
            <input 
              type="number" 
              required
              min="0"
              max="120"
              value={age}
              onChange={e => setAge(e.target.value)}
              className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)] transition-colors"
              placeholder="e.g. 45"
            />
          </div>
          <button 
            type="submit"
            className="mt-4 bg-gradient-to-r from-[var(--cyan)] to-[var(--bio)] text-[var(--bg-primary)] font-bold py-2 rounded shadow-[0_0_15px_rgba(0,212,255,0.4)] hover:shadow-[0_0_20px_rgba(0,255,157,0.6)] transition-all"
          >
            Create Record
          </button>
        </form>
      </motion.div>
    </div>
  );
}
