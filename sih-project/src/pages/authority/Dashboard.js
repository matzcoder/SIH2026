import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Rules",
      value: "124",
    },
    {
      title: "Active Inspections",
      value: "58",
    },
    {
      title: "Complaints",
      value: "342",
    },
    {
      title: "Compliance Rate",
      value: "91%",
    },
  ];

  return (
    <div className="dashboard-page">

      <h2 className="dashboard-title">
        Authority Dashboard
      </h2>

      {/* Stats Cards */}

      <div className="stats-grid">

        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <h4>{item.title}</h4>
            <h2>{item.value}</h2>
          </div>
        ))}

      </div>

      {/* Dashboard Sections */}

      <div className="dashboard-sections">

        {/* Recent Activities */}

        <div className="recent-activity">

          <h3>Recent Activities</h3>

          <ul>

            <li>
              New rule created for MRP Declaration.
            </li>

            <li>
              Complaint CMP-102 assigned to Inspector.
            </li>

            <li>
              Amendment approved for Net Quantity Rule.
            </li>

            <li>
              Monthly compliance report generated.
            </li>

          </ul>

        </div>


        {/* Quick Actions */}

        <div className="quick-actions">

          <h3>Quick Actions</h3>

          <button
            type="button"
            onClick={() => navigate("/authority/create-rule")}
          >
            Create Rule
          </button>


          <button
            type="button"
            onClick={() => navigate("/authority/complaints")}
          >
            View Complaints
          </button>


          <button
            type="button"
            onClick={() => navigate("/authority/reports")}
          >
            Generate Report
          </button>


          <button
            type="button"
            onClick={() => navigate("/authority/inspections")}
          >
            Manage Inspections
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;