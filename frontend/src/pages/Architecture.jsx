import { motion } from "framer-motion";
import { useApp } from "../state/AppContext";
import GlassCard from "../components/ui/GlassCard";
import SectionHeader from "../components/ui/SectionHeader";
import ConfidenceRadar from "../components/model/ConfidenceRadar";
import UncertaintyPanel from "../components/uncertainty/UncertaintyPanel";
import ArchitecturePipeline from "../components/model/ArchitecturePipeline";

export default function Architecture() {
  const { analysis } = useApp();

  if (!analysis) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--text-secondary)] uppercase tracking-[0.2em]">
        No active inference trace found
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <SectionHeader title="Neural Architecture" subtitle="Deep trace of inference pipeline and confidence metrics" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Confidence Profile">
          <div className="h-[300px]">
            <ConfidenceRadar data={[
              { name: analysis.prediction || "Normal", value: analysis.confidence || 0 },
              { name: "Uncertainty", value: analysis.uncertainty || 0 },
              { name: "Anomaly", value: analysis.anomaly || 0 }
            ]} />
          </div>
        </GlassCard>

        <GlassCard title="Bayesian Uncertainty">
          <div className="flex flex-col justify-center h-full">
            <UncertaintyPanel value={analysis.uncertainty || 0} />
            <p className="text-mono text-[10px] text-[var(--text-secondary)] mt-4 opacity-50 uppercase">
              Monte Carlo Dropout Variance Trace
            </p>
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Inference Pipeline Path">
        <div className="py-8">
          <ArchitecturePipeline activeStage={analysis.riskLevel === "CRITICAL" ? "ALERT" : "FUSION"} />
        </div>
      </GlassCard>
    </motion.div>
  );
}
