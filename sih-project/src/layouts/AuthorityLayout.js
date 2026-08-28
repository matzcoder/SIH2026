import React from "react";
import { Outlet } from "react-router-dom";
import "./AuthorityLayout.css";
import Sidebar from "../components/Sidebar";

function AuthorityLayout() {
  return (
    <div className="authority-layout">

      <Sidebar />

      <main className="authority-main">
        <Outlet />
      </main>

    </div>
  );
}

export default AuthorityLayout;