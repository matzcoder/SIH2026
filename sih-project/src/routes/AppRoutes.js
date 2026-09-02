import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================
   AUTH
========================= */
import Login from "../pages/auth/Login";

/* =========================
   LAYOUTS
========================= */
import AuthorityLayout from "../layouts/AuthorityLayout";
import InspectorLayout from "../layouts/InspectorLayout";

/* =========================
   INSPECTOR
========================= */
import InspectorAnalysis from "../pages/inspector/Analysis";
import Assignments from "../pages/inspector/Assignments";
import InspectorDashboard from "../pages/inspector/Dashboard";
import Evidence from "../pages/inspector/Evidence";
import InspectorHistory from "../pages/inspector/History";
import InspectionDetails from "../pages/inspector/InspectionDetails";
import InspectorReports from "../pages/inspector/Reports";
import InspectorScanProduct from "../pages/inspector/ScanProduct";
import InspectorPortal from "../pages/InspectorPortal";

/* =========================
   AUTHORITY
========================= */
import Amendments from "../pages/authority/Amendments";
import AuthorityAnalytics from "../pages/authority/Analytics";
import Complaints from "../pages/authority/Complaints";
import CreateRule from "../pages/authority/CreateRule";
import AuthorityDashboard from "../pages/authority/Dashboard";
import AuthorityInspections from "../pages/authority/Inspections";
import AuthorityReports from "../pages/authority/Reports";
import RuleDetails from "../pages/authority/RulesDetails";
import Rules from "../pages/authority/Rules";
import AuthorityPortal from "../pages/AuthorityPortal";

function AppRoutes() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default AppRoutes;