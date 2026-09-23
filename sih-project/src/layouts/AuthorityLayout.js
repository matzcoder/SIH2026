import React from "react";
import { Outlet } from "react-router-dom";
import "./AuthorityLayout.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function AuthorityLayout() {
  return (
    <div className="authority-layout">
      <Sidebar />
      <div className="authority-content-wrapper">
        <Topbar />
        <main className="authority-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AuthorityLayout;