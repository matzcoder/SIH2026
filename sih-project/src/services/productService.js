import API from "./api";

// ========================================
// SCAN PRODUCT
// ========================================

export const scanProduct = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await API.post(
    "/products/scan",
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
// GET PRODUCT DETAILS
// ========================================

export const getProductDetails = async (id) => {
  const response = await API.get(
    `/products/${id}`
  );

  return response.data;
};


// ========================================
// GET COMPLIANCE RESULT
// ========================================

export const getComplianceResult = async (id) => {
  const response = await API.get(
    `/products/${id}/compliance`
  );

  return response.data;
};


// ========================================
// GET USER SCAN HISTORY
// ========================================

export const getProductHistory = async () => {
  const response = await API.get(
    "/products/history"
  );

  return response.data;
};


// ========================================
// COMPARE PRODUCTS
// ========================================

export const compareProducts = async (
  productIds
) => {
  const response = await API.post(
    "/products/compare",
    {
      productIds,
    }
  );

  return response.data;
};


// ========================================
// SEARCH PRODUCTS
// ========================================

export const searchProducts = async (query) => {
  const response = await API.get(
    "/products/search",
    {
      params: {
        query,
      },
    }
  );

  return response.data;
};


// ========================================
// GET PRODUCT BY BARCODE
// ========================================

export const getProductByBarcode = async (
  barcode
) => {
  const response = await API.get(
    `/products/barcode/${barcode}`
  );

  return response.data;
};


// ========================================
// GET PRODUCT VIOLATIONS
// ========================================

export const getProductViolations = async (
  productId
) => {
  const response = await API.get(
    `/products/${productId}/violations`
  );

  return response.data;
};