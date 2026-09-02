import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ComplianceProvider } from "./context/ComplianceContext";

function App() {
  return (
    <AuthProvider>
      <ComplianceProvider>
        <AppRoutes />
      </ComplianceProvider>
    </AuthProvider>
  );
}

export default App;