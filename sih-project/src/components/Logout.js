import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    // Go back to login
    navigate("/login", { replace: true });
  };

  return (
    <button
      type="button"
      className="logout-button"
      onClick={handleLogout}
    >
      <LogOut size={17} />
      <span>Logout</span>
    </button>
  );
}

export default Logout;