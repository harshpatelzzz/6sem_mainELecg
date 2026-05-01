import { useState } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function ECGUploadZone({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFile = (file) => {
    if (!file) return;
    console.log("STEP 1: FILE SELECTED (DRAG)", file);
    if (onUpload) onUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full h-full min-h-[200px] border-2 border-dashed rounded-xl transition-all duration-300 ${
        isDragging
          ? "border-[var(--cyan)] bg-[var(--bg-glass)] shadow-[0_0_15px_rgba(0,212,255,0.2)]"
          : "border-[var(--border)] hover:border-[var(--cyan)] glass"
      }`}
    >
      <input
        type="file"
        accept=".csv"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => {
          const file = e.target.files[0];
          console.log("STEP 1: FILE SELECTED", file);
          if (file && onUpload) {
            onUpload(file);
          }
        }}
      />
      
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-8 h-8 border-4 border-[var(--cyan)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-display font-semibold text-[var(--cyan)] tracking-widest">
            PROCESSING...
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center pointer-events-none"
        >
          <Upload size={32} className={`mb-4 transition-colors ${isDragging ? "text-[var(--cyan)]" : "text-[var(--text-secondary)]"}`} />
          <h3 className={`text-display font-semibold tracking-wider mb-2 transition-colors ${isDragging ? "text-[var(--cyan)]" : "text-[var(--text-primary)]"}`}>
            DROP ECG FILE
          </h3>
          <p className="text-mono text-sm text-[var(--text-secondary)]">CSV supported</p>
        </motion.div>
      )}
    </div>
  );
}
