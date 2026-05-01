import { motion } from "framer-motion";
import { useApp } from "../state/AppContext";
import { useState, useEffect } from "react";
import { getReports } from "../api/ecg";
import GlassCard from "../components/ui/GlassCard";
import SectionHeader from "../components/ui/SectionHeader";
import RiskTrajectoryChart from "../components/risk/RiskTrajectoryChart";

export default function Reports() {
  const { selectedPatient } = useApp();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPatient) {
      setLoading(true);
      getReports(selectedPatient.patient_id)
        .then(setReport)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedPatient]);

  if (!selectedPatient) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--text-secondary)] uppercase tracking-[0.2em]">
        Please select a patient first
      </div>
    );
  }

  if (loading) {
    return <div className="text-cyan animate-pulse">Generating analytical report...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <SectionHeader title="Patient Analytics" subtitle={`Global intelligence report for ${selectedPatient.name}`} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard title="Average Risk">
          <div className="text-4xl font-bold text-[var(--bio)]">
            {report?.avg_risk ? (report.avg_risk / 100).toFixed(2) : "0.00"}
          </div>
        </GlassCard>
        <GlassCard title="Max Anomaly">
          <div className="text-4xl font-bold text-[var(--alert)]">
            {report?.max_anomaly ? report.max_anomaly.toFixed(2) : "0.00"}
          </div>
        </GlassCard>
        <GlassCard title="Primary Diagnosis">
          <div className="text-2xl font-bold text-[var(--cyan)] uppercase tracking-wider">
            {report?.most_common_class || "N/A"}
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Risk Trend">
        <div className="h-[400px]">
          <RiskTrajectoryChart data={report?.risk_trend?.map(t => ({
            score: t.score / 100,
            timestamp: t.timestamp
          })) || []} />
        </div>
      </GlassCard>
    </motion.div>
  );
}
