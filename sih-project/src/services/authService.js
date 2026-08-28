import API from "./api";

// ================================
// LOGIN
// ================================

export const loginUser = async (email, password) => {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  // Save token
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  // Save user details
  if (response.data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response.data;
};


// ================================
// REGISTER
// ================================

export const registerUser = async (userData) => {
  const response = await API.post(
    "/auth/register",
    userData
  );

  return response.data;
};


// ================================
// LOGOUT
// ================================

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};


// ================================
// GET CURRENT USER
// ================================

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    return null;
  }
};


// ================================
// CHECK LOGIN
// ================================

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};


// ================================
// GET TOKEN
// ================================

export const getToken = () => {
  return localStorage.getItem("token");
};