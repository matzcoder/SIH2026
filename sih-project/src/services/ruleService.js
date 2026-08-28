import API from "./api";

// ========================================
// GET ALL RULES
// ========================================

export const getRules = async (params = {}) => {
  const response = await API.get("/rules", {
    params,
  });

  return response.data;
};


// ========================================
// GET ACTIVE RULES
// ========================================

export const getActiveRules = async () => {
  const response = await API.get("/rules/active");

  return response.data;
};


// ========================================
// GET SINGLE RULE
// ========================================

export const getRuleById = async (id) => {
  const response = await API.get(`/rules/${id}`);

  return response.data;
};


// ========================================
// CREATE NEW RULE
// ========================================

export const createRule = async (ruleData) => {
  const response = await API.post(
    "/rules",
    ruleData
  );

  return response.data;
};


// ========================================
// UPDATE RULE
// ========================================

export const updateRule = async (id, ruleData) => {
  const response = await API.put(
    `/rules/${id}`,
    ruleData
  );

  return response.data;
};


// ========================================
// ACTIVATE RULE
// ========================================

export const activateRule = async (id) => {
  const response = await API.patch(
    `/rules/${id}/activate`
  );

  return response.data;
};


// ========================================
// DEACTIVATE RULE
// ========================================

export const deactivateRule = async (id) => {
  const response = await API.patch(
    `/rules/${id}/deactivate`
  );

  return response.data;
};


// ========================================
// DELETE RULE
// ========================================

export const deleteRule = async (id) => {
  const response = await API.delete(
    `/rules/${id}`
  );

  return response.data;
};


// ========================================
// CREATE AMENDMENT
// ========================================

export const createAmendment = async (
  ruleId,
  amendmentData
) => {
  const response = await API.post(
    `/rules/${ruleId}/amendments`,
    amendmentData
  );

  return response.data;
};


// ========================================
// GET AMENDMENTS
// ========================================

export const getAmendments = async (ruleId) => {
  const response = await API.get(
    `/rules/${ruleId}/amendments`
  );

  return response.data;
};


// ========================================
// GET ALL AMENDMENTS
// ========================================

export const getAllAmendments = async () => {
  const response = await API.get(
    "/amendments"
  );

  return response.data;
};


// ========================================
// APPROVE AMENDMENT
// ========================================

export const approveAmendment = async (
  amendmentId
) => {
  const response = await API.patch(
    `/amendments/${amendmentId}/approve`
  );

  return response.data;
};


// ========================================
// REJECT AMENDMENT
// ========================================

export const rejectAmendment = async (
  amendmentId,
  reason = ""
) => {
  const response = await API.patch(
    `/amendments/${amendmentId}/reject`,
    {
      reason,
    }
  );

  return response.data;
};


// ========================================
// GET RULE CATEGORIES
// ========================================

export const getRuleCategories = async () => {
  const response = await API.get(
    "/rules/categories"
  );

  return response.data;
};


// ========================================
// SEARCH RULES
// ========================================

export const searchRules = async (query) => {
  const response = await API.get(
    "/rules/search",
    {
      params: {
        query,
      },
    }
  );

  return response.data;
};