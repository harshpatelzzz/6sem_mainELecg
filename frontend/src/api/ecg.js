const API_BASE = "http://localhost:8000";

export async function analyzeECG(file, patientId) {
  console.log("API CALL START", { file, patientId });
  const formData = new FormData();
  formData.append("patient_id", patientId);
  formData.append("ecg_file", file);

  const res = await fetch(`${API_BASE}/api/v1/analyze`, {
    method: "POST",
    body: formData,
  });

  console.log("STATUS:", res.status);
  const text = await res.text();
  console.log("RAW RESPONSE:", text);

  const json = JSON.parse(text);
  console.log("API RETURN:", json.data);
  console.log("FULL RESPONSE:", json);

  if (!res.ok) throw new Error(json?.message || "API failed");

  return json.data;
}

export async function getPatients() {
  const res = await fetch(`${API_BASE}/api/v1/patient/`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to fetch patients");
  return json.data;
}

export async function getPatientHistory(patientId) {
  const res = await fetch(`${API_BASE}/api/v1/patient/${patientId}/history`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to fetch history");
  return json.data;
}

export async function getReports(patientId) {
  const res = await fetch(`${API_BASE}/api/v1/patient/reports/${patientId}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to fetch report");
  return json.data;
}
