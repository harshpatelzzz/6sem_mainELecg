import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function AlertBanner({ message, level, alertActive }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (alertActive) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [alertActive, message]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          className="w-full bg-gradient-to-r from-[rgba(255,68,68,0.15)] to-transparent border-l-4 border-[var(--alert)] p-4 mb-6 rounded-r-lg flex items-start justify-between overflow-hidden"
        >
          <div className="flex items-center gap-3 text-[var(--text-primary)]">
            <AlertTriangle className="text-[var(--alert)]" size={24} />
            <div>
              <h4 className="text-display font-bold text-[var(--alert)] tracking-wide">{level} ALERT</h4>
              <p className="text-sm mt-1">{message}</p>
            </div>
          </div>
          <button onClick={() => setIsVisible(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
