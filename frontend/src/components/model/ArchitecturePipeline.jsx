import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Box, Clock, User, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

const STAGES = [
  { id: "ecg", title: "ECG", icon: Activity, status: "completed" },
  { id: "pre", title: "PREPROCESS", icon: Cpu, status: "completed" },
  { id: "feat", title: "FEATURES", icon: Box, status: "completed" },
  { id: "temp", title: "TEMPORAL", icon: Clock, status: "active" },
  { id: "pers", title: "PERSONAL", icon: User, status: "pending" },
  { id: "dec", title: "DECISION", icon: CheckCircle, status: "pending" },
  { id: "risk", title: "RISK", icon: AlertTriangle, status: "pending" },
];

const FEEDBACK_TEXTS = [
  "Processing temporal features...",
  "Updating risk estimation...",
  "Extracting morphological markers...",
  "Analyzing spatial relationships..."
];

export default function ArchitecturePipeline() {
  const activeIndex = STAGES.findIndex(s => s.status === "active");
  const progressPercent = (activeIndex / (STAGES.length - 1)) * 100;
  const [feedbackIndex, setFeedbackIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedbackIndex(prev => (prev + 1) % FEEDBACK_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-center py-4 z-10">
      <div className="relative flex items-center justify-between overflow-x-auto overflow-y-hidden hide-scrollbar py-4 mb-2 px-2">
        {/* Background Line */}
        <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-[var(--border)] -translate-y-1/2 z-0" />

        {/* Moving Signal Dot */}
        <motion.div
          className="absolute top-1/2 w-2 h-2 rounded-full bg-[var(--cyan)] shadow-[0_0_15px_var(--cyan)] z-0 -translate-y-1/2"
          animate={{ left: ["5%", "95%", "5%"] }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        />

        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const isCompleted = stage.status === "completed";
          const isActive = stage.status === "active";
          
          let colorClass = "text-[var(--text-secondary)] opacity-40 border-[var(--border)] bg-[var(--bg-surface)]";
          let glowClass = "";

          if (isCompleted) {
            colorClass = "text-[var(--bio)] border-[var(--bio)] bg-[rgba(0,255,157,0.05)]";
            glowClass = "shadow-[0_0_8px_rgba(0,255,157,0.3)]";
          } else if (isActive) {
            colorClass = "text-[var(--cyan)] border-[var(--cyan)] bg-[rgba(0,212,255,0.1)]";
            glowClass = "shadow-[0_0_15px_rgba(0,212,255,0.6)]";
          }

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center flex-shrink-0 mx-2">
              <motion.div
                whileHover={{ scale: 1.15 }}
                animate={isActive ? { scale: [1, 1.1, 1], boxShadow: ["0 0 10px rgba(0,212,255,0.4)", "0 0 20px rgba(0,212,255,0.8)", "0 0 10px rgba(0,212,255,0.4)"] } : {}}
                transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                className={`w-10 h-10 flex items-center justify-center rounded-full border backdrop-blur transition-colors ${colorClass} ${glowClass}`}
              >
                <Icon size={16} />
              </motion.div>
              <span className={`mt-2 text-[9px] font-bold tracking-widest uppercase ${isActive || isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-50'}`}>
                {stage.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar & Feedback */}
      <div className="w-full flex flex-col mt-auto gap-2 px-4 relative z-10">
        <div className="flex justify-between items-center text-mono text-[9px] text-[var(--text-secondary)] tracking-widest uppercase overflow-hidden h-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={feedbackIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="block"
            >
              {FEEDBACK_TEXTS[feedbackIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="opacity-60">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-1 bg-[var(--bg-glass)] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--bio)] shadow-[0_0_8px_var(--cyan)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
