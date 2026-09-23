import React from "react";
import { Outlet } from "react-router-dom";
import "./InspectorLayout.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function InspectorLayout() {
  return (
    <div className="inspector-layout">
      <Sidebar />
      <div className="inspector-content-wrapper">
        <Topbar />
        <main className="inspector-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default InspectorLayout;