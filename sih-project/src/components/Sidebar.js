import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ComplianceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function EvidenceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m21 15-5-5L5 20" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

function Sidebar({
  activeItem = "Dashboard",
  onNavigate,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const role = location.pathname.split("/")[1] || "inspector";
  const routeLabels = [
    ["dashboard", "Dashboard"],
    ["rules", "Compliance"],
    ["assignments", "Products"],
    ["evidence", "Evidence"],
    ["reports", "Reports"],
    ["analytics", "Analytics"],
    ["amendments", "Amendments"],
  ];
  const currentLabel = routeLabels.find(([segment]) =>
    location.pathname.includes(`/${segment}`)
  )?.[1];
  const menuPaths = {
    inspector: {
      Dashboard: "/inspector/dashboard",
      Compliance: "/inspector/analysis",
      Products: "/inspector/assignments",
      Evidence: "/inspector/evidence",
      Reports: "/inspector/reports",
    },
    authority: {
      Dashboard: "/authority/dashboard",
      Compliance: "/authority/rules",
      Products: "/authority/inspections",
      Evidence: "/authority/inspections?view=evidence",
      Reports: "/authority/reports",
      Analytics: "/authority/analytics",
      Amendments: "/authority/amendments",
    },
  };
  const menuItems = [
    {
      label: "Dashboard",
      icon: DashboardIcon,
    },
    {
      label: "Compliance",
      icon: ComplianceIcon,
    },
    {
      label: "Products",
      icon: ProductIcon,
    },
    {
      label: "Evidence",
      icon: EvidenceIcon,
    },
    {
      label: "Reports",
      icon: ReportIcon,
    },
  ];

  const bottomItems = [
    {
      label: "Logout",
      icon: LogoutIcon,
    },
  ];

  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = (currentLabel || activeItem) === item.label;

    return (
      <button
        key={item.label}
        type="button"
        className={`sidebar-item ${
          isActive ? "active" : ""
        }`}
        onClick={() => {
          /* =========================
             LOGOUT
          ========================= */
          if (item.label === "Logout") {
            logout();
            navigate("/login", { replace: true });
            return;
          }

          /* =========================
             OTHER ITEMS
          ========================= */
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
      <div className="sidebar-menu">
        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <div className="sidebar-items">
          {menuItems.map(renderItem)}
          {role === "authority" && (
            <>
              {renderItem({ label: "Analytics", icon: ReportIcon })}
              {renderItem({ label: "Amendments", icon: ComplianceIcon })}
            </>
          )}
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-items">
          {bottomItems.map(renderItem)}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;