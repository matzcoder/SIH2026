import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/auth/Login";
import AuthorityLayout from "../layouts/AuthorityLayout";
import InspectorLayout from "../layouts/InspectorLayout";

/* =========================
   LOADING FALLBACK
========================= */
function PageLoader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#FBF3EC",
      color: "#7A5C48",
      fontFamily: "'Inter', sans-serif",
      fontSize: "1rem",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40,
          border: "3px solid #E4CBB4",
          borderTopColor: "#C1502D",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px",
        }} />
        <p>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

/* =========================
   ERROR BOUNDARY
========================= */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Page Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#FBF3EC",
          fontFamily: "'Inter', sans-serif",
          padding: 40,
        }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <h2 style={{ color: "#A63A32", marginBottom: 12 }}>Something went wrong</h2>
            <p style={{ color: "#7A5C48", marginBottom: 20 }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                background: "#C1502D",
                color: "#FFF9F2",
                border: "none",
                padding: "10px 24px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "0.95rem",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


/* =========================
   LAZY-LOADED PAGES
========================= */

// Inspector pages
const InspectorAnalysis = React.lazy(() => import("../pages/inspector/Analysis"));
const Assignments = React.lazy(() => import("../pages/inspector/Assignments"));
const InspectorDashboard = React.lazy(() => import("../pages/inspector/Dashboard"));
const Evidence = React.lazy(() => import("../pages/inspector/Evidence"));
const InspectorHistory = React.lazy(() => import("../pages/inspector/History"));
const InspectionDetails = React.lazy(() => import("../pages/inspector/InspectionDetails"));
const InspectorReports = React.lazy(() => import("../pages/inspector/Reports"));
const InspectorScanProduct = React.lazy(() => import("../pages/inspector/ScanProduct"));
const InspectorPortal = React.lazy(() => import("../pages/InspectorPortal"));

// Authority pages
const Amendments = React.lazy(() => import("../pages/authority/Amendments"));
const AuthorityAnalytics = React.lazy(() => import("../pages/authority/Analytics"));
const Complaints = React.lazy(() => import("../pages/authority/Complaints"));
const CreateRule = React.lazy(() => import("../pages/authority/CreateRule"));
const AuthorityDashboard = React.lazy(() => import("../pages/authority/Dashboard"));
const AuthorityInspections = React.lazy(() => import("../pages/authority/Inspections"));
const AuthorityReports = React.lazy(() => import("../pages/authority/Reports"));
const RuleDetails = React.lazy(() => import("../pages/authority/RulesDetails"));
const Rules = React.lazy(() => import("../pages/authority/Rules"));
const AuthorityPortal = React.lazy(() => import("../pages/AuthorityPortal"));

function AppRoutes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* =========================
                FIRST PAGE
            ========================= */}
            <Route
              path="/"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />

            {/* =========================
                AUTH
            ========================= */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* =========================
                UNIFIED PORTALS
            ========================= */}
            <Route
              path="/inspector/portal"
              element={<InspectorPortal />}
            />
            <Route
              path="/authority/portal"
              element={<AuthorityPortal />}
            />

            {/* =========================
                INSPECTOR LAYOUT
            ========================= */}
            <Route
              path="/inspector"
              element={<InspectorLayout />}
            >
              <Route
                index
                element={
                  <Navigate
                    to="/inspector/dashboard"
                    replace
                  />
                }
              />
              <Route
                path="dashboard"
                element={<InspectorDashboard />}
              />
              <Route
                path="assignments"
                element={<Assignments />}
              />
              <Route
                path="analysis"
                element={<InspectorAnalysis />}
              />
              <Route
                path="inspection-details/:id"
                element={<InspectionDetails />}
              />
              <Route
                path="evidence"
                element={<Evidence />}
              />
              <Route
                path="history"
                element={<InspectorHistory />}
              />
              <Route
                path="reports"
                element={<InspectorReports />}
              />
              <Route
                path="scan-product"
                element={<InspectorScanProduct />}
              />
            </Route>

            {/* =========================
                AUTHORITY LAYOUT
            ========================= */}
            <Route
              path="/authority"
              element={<AuthorityLayout />}
            >
              <Route
                index
                element={
                  <Navigate
                    to="/authority/dashboard"
                    replace
                  />
                }
              />
              <Route
                path="dashboard"
                element={<AuthorityDashboard />}
              />
              <Route
                path="rules"
                element={<Rules />}
              />
              <Route
                path="rules/:id"
                element={<RuleDetails />}
              />
              <Route
                path="create-rule"
                element={<CreateRule />}
              />
              <Route
                path="amendments"
                element={<Amendments />}
              />
              <Route
                path="analytics"
                element={<AuthorityAnalytics />}
              />
              <Route
                path="complaints"
                element={<Complaints />}
              />
              <Route
                path="inspections"
                element={<AuthorityInspections />}
              />
              <Route
                path="reports"
                element={<AuthorityReports />}
              />
            </Route>

            {/* =========================
                404 FALLBACK
            ========================= */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default AppRoutes;