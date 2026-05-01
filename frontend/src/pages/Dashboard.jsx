import { useState } from "react";
import { motion } from "framer-motion";
import ECGWaveformCanvas from "../components/ecg/ECGWaveformCanvas";
import ECGUploadZone from "../components/ecg/ECGUploadZone";
import GlassCard from "../components/ui/GlassCard";
import SectionHeader from "../components/ui/SectionHeader";
import RiskGauge from "../components/risk/RiskGauge";
import RiskTrajectoryChart from "../components/risk/RiskTrajectoryChart";
import RiskLevelBadge from "../components/risk/RiskLevelBadge";
import AlertBanner from "../components/risk/AlertBanner";
import UncertaintyPanel from "../components/uncertainty/UncertaintyPanel";
import AttentionHeatmap from "../components/model/AttentionHeatmap";
import ConfidenceRadar from "../components/model/ConfidenceRadar";
import ArchitecturePipeline from "../components/model/ArchitecturePipeline";
import ModuleCard from "../components/model/ModuleCard";
import AnomalyIndicator from "../components/model/AnomalyIndicator";
import DeviationIndicator from "../components/model/DeviationIndicator";
import { usePatientStore } from "../store/patientStore";
import PatientSelector from "../components/patient/PatientSelector";
import PersonalizationBanner from "../components/patient/PersonalizationBanner";
import { useEffect } from "react";
import { analyzeECG } from "../api/ecg";

import { useApp } from "../state/AppContext";

export default function Dashboard() {
  const { selectedPatient: currentPatient, analysis, loading, error, setAnalysis, history, selectPatient } = useApp();
  
  const [ecgData, setEcgData] = useState(null);
  const [currentPatientId, setCurrentPatientId] = useState("test1");
  const [lastFile, setLastFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    console.log("STEP 6: ecgData STATE", ecgData?.length);
  }, [ecgData]);

  useEffect(() => {
    if (currentPatient?.patient_id) {
      setCurrentPatientId(currentPatient.patient_id);
    }
  }, [currentPatient]);

  const handleUpload = async (file) => {
    console.log("STEP 2: HANDLE UPLOAD CALLED", file);

    try {
      console.log("DEBUG 1: before API");
      
      if (!analyzeECG) {
        throw new Error("analyzeECG is undefined");
      }

      const safePatientId = currentPatientId || "test1";
      console.log("STEP 3: CALLING API with patient:", safePatientId);
      
      const result = await analyzeECG(file, safePatientId);
      
      console.log("STEP 4: SUCCESS", result);

      const signal = result?.ecg_signal || [];
      console.log("STEP 5: SIGNAL LENGTH", signal.length);

      setEcgData([...signal]);
      console.log("STEP 6: STATE UPDATED");

      // Refresh global state from backend
      await selectPatient(safePatientId);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("UPLOAD FAILED: " + err.message);
      setUploadError(err?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Patient Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20 mb-2">
        <PatientSelector />
        {currentPatient && (
          <PersonalizationBanner 
            baselineRisk={currentPatient.baselineRisk} 
            currentRisk={analysis?.risk || 0} 
          />
        )}
      </div>

      <AlertBanner 
        message="Rapid risk increase detected" 
        level={analysis?.riskLevel || "LOW"} 
        alertActive={analysis?.alert || false} 
      />

      <SectionHeader title="Real-time ECG Analysis" subtitle="Upload patient data for immediate processing" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <GlassCard title="ECG Waveform" className="h-full flex flex-col">
            <ECGWaveformCanvas data={ecgData} key={ecgData?.length} />
          </GlassCard>
        </div>
        
        <div className="lg:col-span-1 h-full min-h-[300px]">
          <GlassCard title="Data Input" className="h-full flex flex-col">
            <div className="flex-1 mt-4">
              <ECGUploadZone onUpload={handleUpload} />
            </div>
          </GlassCard>
        </div>
      </div>

      {loading && (
        <div className="glass p-12 rounded-xl border border-[var(--cyan)] text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-[var(--cyan)] border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_15px_var(--cyan)]" />
          <div className="text-[var(--cyan)] font-mono text-xl animate-pulse tracking-[0.2em] uppercase">
            Processing ECG signal...
          </div>
        </div>
      )}

      {uploadError && (
        <div className="glass p-12 rounded-xl border border-[var(--alert)] text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="text-[var(--alert)] font-mono text-xl uppercase mb-6 tracking-wider font-bold">
            {uploadError}
          </div>
          {lastFile && (
            <button 
              onClick={() => handleUpload(lastFile)}
              className="px-8 py-3 bg-[var(--alert)] bg-opacity-20 hover:bg-opacity-30 border border-[var(--alert)] text-[var(--alert)] rounded-lg font-mono uppercase tracking-widest transition-all"
            >
              Retry Analysis
            </button>
          )}
        </div>
      )}

      {!analysis && !loading && !uploadError && (
        <div className="glass p-12 rounded-xl border border-[var(--border)] text-center">
          <div className="text-[var(--cyan)] font-mono text-xl uppercase tracking-widest opacity-60">
            Upload ECG to start
          </div>
        </div>
      )}

      {analysis && !loading && !error && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <GlassCard title="Current Risk Level" className="flex-1">
            <RiskGauge value={analysis?.risk || 0} />
          </GlassCard>
          
          <AnomalyIndicator score={analysis?.anomaly || 0} />
          <DeviationIndicator score={analysis?.deviation || 0} />
        </div>
        
        <div className="lg:col-span-2 flex">
          <GlassCard title="Risk Factors & Uncertainty" className="flex-1">
            <div className="flex flex-col justify-between h-full">
              <div className="mb-4">
                <RiskLevelBadge value={analysis?.riskLevel || "LOW"} />
              </div>
              <UncertaintyPanel value={analysis?.uncertainty || 0} />
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="w-full mb-6">
        <GlassCard title="Risk Trajectory">
          <RiskTrajectoryChart data={analysis?.trajectory || []} />
        </GlassCard>
      </div>

      <div className="flex justify-between items-end mb-6 relative z-10 mt-8">
        <div>
          <h2 className="text-display text-2xl font-medium tracking-wider text-[var(--text-secondary)]">Model Intelligence Explanations</h2>
          <p className="text-mono text-sm mt-1 tracking-wider uppercase text-[var(--text-secondary)] opacity-50">Neural network attention and classifications</p>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--bio)] animate-ping shadow-[0_0_10px_var(--bio)]"></span>
          <span className="text-mono text-[11px] text-[var(--bio)] uppercase tracking-widest font-bold">ANALYZING SIGNAL</span>
        </div>
      </div>
      
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Subtle background radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(0,212,255,0.04)] via-[rgba(0,255,157,0.02)] to-transparent rounded-full pointer-events-none blur-3xl z-0" />

        <div className="lg:col-span-1">
          <ModuleCard title="Temporal Attention" description="Network focus regions">
            <AttentionHeatmap weights={new Array(20).fill(0.1)} />
          </ModuleCard>
        </div>
        <div className="lg:col-span-1">
          <ModuleCard title="Class Confidence" description="Multi-class predictions">
            <ConfidenceRadar data={[
              { name: analysis?.prediction || "Unknown", value: analysis?.confidence || 0 },
              { name: "Other", value: Math.max(0, 1 - (analysis?.confidence || 0)) }
            ]} />
          </ModuleCard>
        </div>
        <div className="lg:col-span-1 md:col-span-2 lg:col-span-1">
          <ModuleCard title="Inference Pipeline" description="Current stage trace">
            <ArchitecturePipeline />
          </ModuleCard>
        </div>
      </div>
        </>
      )}

    </motion.div>
  );
}
