import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_PATIENTS = [
  { id: "patient-john-doe", name: "John Doe", age: 45, baselineRisk: 0.32, lastUpdated: new Date().toISOString() },
  { id: "patient-aisha-khan", name: "Aisha Khan", age: 52, baselineRisk: 0.41, lastUpdated: new Date().toISOString() }
];

export const usePatientStore = create(
  persist(
    (set, get) => ({
      patients: [],
      currentPatientId: null,
      history: {},
      lastAnalysis: null,

      setLastAnalysis: (analysis) => set({ lastAnalysis: analysis }),

      initializeDefaults: () => {
        const { patients } = get();
        if (patients.length === 0) {
          set({
            patients: DEFAULT_PATIENTS,
            currentPatientId: DEFAULT_PATIENTS[0].id,
            history: {
              [DEFAULT_PATIENTS[0].id]: [],
              [DEFAULT_PATIENTS[1].id]: []
            }
          });
        }
      },

      addPatient: (patientData) => {
        const newPatient = {
          id: `patient-${patientData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
          name: patientData.name,
          age: patientData.age,
          baselineRisk: 0.35,
          lastUpdated: new Date().toISOString(),
        };
        set((state) => ({
          patients: [...state.patients, newPatient],
          currentPatientId: newPatient.id,
          history: { ...state.history, [newPatient.id]: [] },
        }));
      },

      selectPatient: (id) => set({ currentPatientId: id }),

      addRecord: (patientId, recordData) => {
        const record = {
          id: `record-${Date.now()}`,
          timestamp: new Date().toISOString(),
          risk: recordData.risk,
          signalSummary: recordData.signalSummary || "ECG Captured",
          uncertainty: recordData.uncertainty,
        };
        set((state) => ({
          history: {
            ...state.history,
            [patientId]: [...(state.history[patientId] || []), record],
          },
          patients: state.patients.map((p) =>
            p.id === patientId ? { ...p, lastUpdated: record.timestamp } : p
          ),
        }));
      },

      getHistory: (patientId) => {
        return get().history[patientId] || [];
      },
      
      getCurrentPatient: () => {
        const state = get();
        return state.patients.find((p) => p.id === state.currentPatientId) || null;
      }
    }),
    {
      name: 'patient-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.patients.length === 0) {
            state.initializeDefaults();
          } else if (!state.currentPatientId && state.patients.length > 0) {
            state.selectPatient(state.patients[0].id);
          }
        }
      }
    }
  )
);
