import { motion } from "framer-motion";
import { useApp } from "../state/AppContext";
import { useState, useEffect } from "react";
import GlassCard from "../components/ui/GlassCard";
import SectionHeader from "../components/ui/SectionHeader";
import RiskGauge from "../components/risk/RiskGauge";
import ECGWaveformCanvas from "../components/ecg/ECGWaveformCanvas";

export default function Live() {
  const { analysis, selectedPatient } = useApp();
  const [liveRisk, setLiveRisk] = useState(0);

  useEffect(() => {
    if (analysis) {
      setLiveRisk(analysis.risk);
      const interval = setInterval(() => {
        // Subtle fluctuation for realism
        setLiveRisk(prev => Math.min(1, Math.max(0, prev + (Math.random() - 0.5) * 0.02)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [analysis]);

  if (!selectedPatient) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--text-secondary)] uppercase tracking-[0.2em]">
        Connect a sensor (Select a patient)
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <SectionHeader title="Live Telemetry" subtitle={`Streaming from ${selectedPatient.name}'s active lead`} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard title="Real-time Lead II">
            <div className="h-[300px]">
              <ECGWaveformCanvas signal={new Array(500).fill(0).map(() => Math.sin(Date.now() / 100))} />
            </div>
            <div className="flex justify-between mt-4 text-mono text-[10px] text-[var(--bio)]">
              <span>SYNC: LOCKED</span>
              <span>SAMPLING: 500Hz</span>
              <span>BUFFER: OK</span>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-1">
          <GlassCard title="Instant Risk">
            <div className="py-4">
              <RiskGauge value={liveRisk} />
            </div>
            <div className="text-center text-mono text-xs text-[var(--text-secondary)] opacity-50 uppercase tracking-widest">
              Processing local edge buffer
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
