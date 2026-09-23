import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Topbar.css";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAuthority = location.pathname.startsWith("/authority");
  const portalName = isAuthority ? "Regulatory Authority Portal" : "Field Inspector Portal";
  const userRoleDisplay = isAuthority ? "Senior Director" : "Field Officer";
  const userName = user?.name || (isAuthority ? "Dr. S. K. Raman" : "K. Venkatesh");
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-portal-badge">
          <span className="portal-indicator" />
          <span className="portal-title">{portalName}</span>
        </div>

        <div className="topbar-search">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search inspections, rules, batch numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="topbar-right">
        {/* Quick Portal Switcher */}
        <button
          type="button"
          onClick={() => navigate(isAuthority ? "/authority/portal" : "/inspector/portal")}
          className="portal-view-btn"
          title="Open Unified Live Portal"
        >
          <span className="btn-icon">⚡</span>
          <span>Live Portal</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="topbar-icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
          <span className="notification-badge" />
        </button>

        {/* User Profile Menu */}
        <div className="topbar-profile-container">
          <button
            type="button"
            className="topbar-profile-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className="profile-avatar-circle">{initials}</div>
            <div className="profile-details">
              <span className="profile-name">{userName}</span>
              <span className="profile-sub">{userRoleDisplay}</span>
            </div>
            <svg
              className={`chevron-icon ${dropdownOpen ? "open" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <strong>{userName}</strong>
                <span>{user?.email || (isAuthority ? "director@metrology.gov.in" : "inspector@metrology.gov.in")}</span>
              </div>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate(isAuthority ? "/authority/dashboard" : "/inspector/dashboard");
                }}
              >
                Dashboard
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate(isAuthority ? "/authority/reports" : "/inspector/reports");
                }}
              >
                Official Reports
              </button>
              <div className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
