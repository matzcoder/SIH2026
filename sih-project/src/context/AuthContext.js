import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check saved login when app starts
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("complianceUser");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Unable to restore user session:", error);
      localStorage.removeItem("complianceUser");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password, role = "inspector") => {
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    // Demo authentication
    // Replace this with your API later
    const demoUser = {
      id: Date.now(),
      name:
        role === "authority"
          ? "Authority User"
          : "Inspector User",
      email,
      role,
    };

    localStorage.setItem(
      "complianceUser",
      JSON.stringify(demoUser)
    );

    setUser(demoUser);

    return {
      success: true,
      user: demoUser,
    };
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("complianceUser");
    setUser(null);
  };

  const setSession = (sessionUser) => {
    setUser(sessionUser);
  };

  // Update user
  const updateUser = (updates) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return null;
      }

      const updatedUser = {
        ...currentUser,
        ...updates,
      };

      localStorage.setItem(
        "complianceUser",
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  // Check role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check multiple roles
  const hasAnyRole = (roles) => {
    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),

    login,
    logout,
    setSession,
    updateUser,

    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}

export default AuthContext;