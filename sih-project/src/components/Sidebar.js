import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ComplianceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function EvidenceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m21 15-5-5L5 20" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  );
}

function Sidebar({ activeItem = "Dashboard", onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const role = location.pathname.split("/")[1] || "inspector";

  const routeLabels = [
    ["dashboard", "Dashboard"],
    ["rules", "Rules & Standards"],
    ["assignments", "Assignments"],
    ["scan-product", "Scan Product"],
    ["evidence", "Evidence Vault"],
    ["reports", "Reports & Audit"],
    ["analytics", "Analytics"],
    ["amendments", "Amendments"],
    ["complaints", "Complaints"],
    ["inspections", "Inspections"],
  ];

  const currentLabel = routeLabels.find(([segment]) =>
    location.pathname.includes(`/${segment}`)
  )?.[1];

  const menuPaths = {
    inspector: {
      "Dashboard": "/inspector/dashboard",
      "Scan Product": "/inspector/scan-product",
      "Assignments": "/inspector/assignments",
      "Evidence Vault": "/inspector/evidence",
      "Reports & Audit": "/inspector/reports",
      "Live Portal": "/inspector/portal",
    },
    authority: {
      "Dashboard": "/authority/dashboard",
      "Rules & Standards": "/authority/rules",
      "Inspections": "/authority/inspections",
      "Complaints": "/authority/complaints",
      "Amendments": "/authority/amendments",
      "Analytics": "/authority/analytics",
      "Reports & Audit": "/authority/reports",
      "Live Portal": "/authority/portal",
    },
  };

  const inspectorItems = [
    { label: "Dashboard", icon: DashboardIcon },
    { label: "Scan Product", icon: ScanIcon },
    { label: "Assignments", icon: ProductIcon },
    { label: "Evidence Vault", icon: EvidenceIcon },
    { label: "Reports & Audit", icon: ReportIcon },
  ];

  const authorityItems = [
    { label: "Dashboard", icon: DashboardIcon },
    { label: "Rules & Standards", icon: ComplianceIcon },
    { label: "Inspections", icon: ProductIcon },
    { label: "Complaints", icon: EvidenceIcon },
    { label: "Amendments", icon: ComplianceIcon },
    { label: "Analytics", icon: ReportIcon },
    { label: "Reports & Audit", icon: ReportIcon },
  ];

  const menuItems = role === "authority" ? authorityItems : inspectorItems;

  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = (currentLabel || activeItem) === item.label;

    return (
      <button
        key={item.label}
        type="button"
        className={`sidebar-item ${isActive ? "active" : ""}`}
        onClick={() => {
          const path = menuPaths[role]?.[item.label];
          if (path) {
            navigate(path);
          } else {
            onNavigate?.(item.label);
          }
        }}
      >
        <Icon />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-header">
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-icon">⚖️</div>
          <div className="sidebar-logo-text">
            <span className="logo-title">LM-Vision</span>
            <span className="logo-badge">PCR 2011</span>
          </div>
        </div>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-section-title">
          {role === "authority" ? "AUTHORITY CONTROLS" : "INSPECTION WORKFLOW"}
        </div>

        <div className="sidebar-items">
          {menuItems.map(renderItem)}
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-items">
          <button
            type="button"
            className="sidebar-item logout-item"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogoutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;