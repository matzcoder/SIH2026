import API from "./api";

// ========================================
// USER - CREATE COMPLAINT
// ========================================

export const createComplaint = async (complaintData) => {
  const response = await API.post(
    "/complaints",
    complaintData
  );

  return response.data;
};


// ========================================
// USER - GET MY COMPLAINTS
// ========================================

export const getMyComplaints = async () => {
  const response = await API.get(
    "/complaints/my"
  );

  return response.data;
};


// ========================================
// USER - GET SINGLE COMPLAINT
// ========================================

export const getComplaintById = async (id) => {
  const response = await API.get(
    `/complaints/${id}`
  );

  return response.data;
};


// ========================================
// USER - WITHDRAW COMPLAINT
// ========================================

export const withdrawComplaint = async (id) => {
  const response = await API.patch(
    `/complaints/${id}/withdraw`
  );

  return response.data;
};


// ========================================
// AUTHORITY - GET ALL COMPLAINTS
// ========================================

export const getAllComplaints = async () => {
  const response = await API.get(
    "/complaints"
  );

  return response.data;
};


// ========================================
// AUTHORITY - UPDATE COMPLAINT STATUS
// ========================================

export const updateComplaintStatus = async (
  id,
  status,
  remarks = ""
) => {
  const response = await API.patch(
    `/complaints/${id}/status`,
    {
      status,
      remarks,
    }
  );

  return response.data;
};


// ========================================
// AUTHORITY - ASSIGN COMPLAINT
// ========================================

export const assignComplaint = async (
  complaintId,
  inspectorId
) => {
  const response = await API.patch(
    `/complaints/${complaintId}/assign`,
    {
      inspectorId,
    }
  );

  return response.data;
};


// ========================================
// AUTHORITY - GET COMPLAINT STATISTICS
// ========================================

export const getComplaintStats = async () => {
  const response = await API.get(
    "/complaints/stats"
  );

  return response.data;
};