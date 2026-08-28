import API from "./api";

// ========================================
// INSPECTOR - GET ASSIGNED INSPECTIONS
// ========================================

export const getMyAssignments = async () => {
  const response = await API.get(
    "/inspections/my-assignments"
  );

  return response.data;
};


// ========================================
// GET ALL INSPECTIONS
// ========================================

export const getInspections = async (params = {}) => {
  const response = await API.get(
    "/inspections",
    {
      params,
    }
  );

  return response.data;
};


// ========================================
// GET SINGLE INSPECTION
// ========================================

export const getInspectionById = async (id) => {
  const response = await API.get(
    `/inspections/${id}`
  );

  return response.data;
};


// ========================================
// CREATE INSPECTION
// ========================================

export const createInspection = async (
  inspectionData
) => {
  const response = await API.post(
    "/inspections",
    inspectionData
  );

  return response.data;
};


// ========================================
// UPDATE INSPECTION
// ========================================

export const updateInspection = async (
  id,
  inspectionData
) => {
  const response = await API.put(
    `/inspections/${id}`,
    inspectionData
  );

  return response.data;
};


// ========================================
// UPDATE INSPECTION STATUS
// ========================================

export const updateInspectionStatus = async (
  id,
  status,
  remarks = ""
) => {
  const response = await API.patch(
    `/inspections/${id}/status`,
    {
      status,
      remarks,
    }
  );

  return response.data;
};


// ========================================
// UPLOAD EVIDENCE
// ========================================

export const uploadEvidence = async (
  inspectionId,
  file,
  evidenceType = "image",
  description = ""
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("evidenceType", evidenceType);
  formData.append("description", description);

  const response = await API.post(
    `/inspections/${inspectionId}/evidence`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// ========================================
// GET INSPECTION EVIDENCE
// ========================================

export const getInspectionEvidence = async (
  inspectionId
) => {
  const response = await API.get(
    `/inspections/${inspectionId}/evidence`
  );

  return response.data;
};


// ========================================
// SUBMIT INSPECTION
// ========================================

export const submitInspection = async (
  id,
  inspectionData
) => {
  const response = await API.post(
    `/inspections/${id}/submit`,
    inspectionData
  );

  return response.data;
};


// ========================================
// GET INSPECTION HISTORY
// ========================================

export const getInspectionHistory = async () => {
  const response = await API.get(
    "/inspections/history"
  );

  return response.data;
};


// ========================================
// GET INSPECTION ANALYTICS
// ========================================

export const getInspectionAnalytics = async () => {
  const response = await API.get(
    "/inspections/analytics"
  );

  return response.data;
};


// ========================================
// GENERATE INSPECTION REPORT
// ========================================

export const generateInspectionReport = async (
  inspectionId
) => {
  const response = await API.get(
    `/inspections/${inspectionId}/report`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};