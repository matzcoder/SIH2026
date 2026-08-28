import React from "react";
import { Outlet } from "react-router-dom";
import "./InspectorLayout.css";
import Sidebar from "../components/Sidebar";

function InspectorLayout() {
  return (
    <div className="inspector-layout">

      <Sidebar />

      <main className="inspector-main">
        <Outlet />
      </main>

    </div>
  );
}

export default InspectorLayout;