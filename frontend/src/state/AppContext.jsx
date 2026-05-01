import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPatients, getPatientHistory } from '../api/ecg';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
        if (data.length > 0 && !selectedPatient) {
          // Check if there was a selection in localStorage (optional)
          const savedId = localStorage.getItem('selectedPatientId');
          const found = data.find(p => p.patient_id === savedId) || data[0];
          selectPatient(found.patient_id);
        }
      } catch (err) {
        console.error("Failed to load patients:", err);
      }
    };
    loadData();
  }, []);

  function mapClass(cls) {
    const map = { "0": "Normal", "1": "PAC", "2": "PVC", "3": "LBBB", "4": "RBBB" };
    return map[String(cls)] || "Unknown";
  }

  function normalize(raw) {
    if (!raw) return null;
    return {
      risk: Math.min(raw.risk_score || 0, 100) / 100,
      riskLevel: raw.risk_level || "LOW",
      prediction: mapClass(raw.predicted_class),
      confidence: raw.confidence || 0,
      uncertainty: raw.uncertainty || 0,
      anomaly: raw.anomaly_score || 0,
      deviation: raw.deviation_score || 0,
      alert: raw.alert || false,
      timestamp: raw.timestamp,
      trajectory: (raw.risk_trajectory || []).map(p => ({
        score: Math.min(p.score || 0, 100) / 100,
        timestamp: p.timestamp || ""
      }))
    };
  }

  const selectPatient = async (id) => {
    setLoading(true);
    try {
      const data = await getPatientHistory(id);
      const normalizedHistory = data.map(normalize);
      setHistory(normalizedHistory);
      
      const patient = patients.find(p => p.patient_id === id) || { patient_id: id };
      setSelectedPatient(patient);
      
      if (normalizedHistory.length > 0) {
        setAnalysis(normalizedHistory[normalizedHistory.length - 1]);
      } else {
        setAnalysis(null);
      }
      localStorage.setItem('selectedPatientId', id);
    } catch (err) {
      setError("Failed to load patient history");
    } finally {
      setLoading(false);
    }
  };

  const refreshPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {}
  };

  return (
    <AppContext.Provider value={{
      patients,
      selectedPatient,
      analysis,
      history,
      loading,
      error,
      setPatients,
      setSelectedPatient,
      setAnalysis,
      setHistory,
      selectPatient,
      refreshPatients
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
