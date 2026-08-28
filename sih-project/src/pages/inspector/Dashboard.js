import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Assigned Inspections",
      value: "24",
      subtitle: "This month",
      icon: "▣",
    },
    {
      title: "Completed",
      value: "17",
      subtitle: "70.8% completed",
      icon: "✓",
    },
    {
      title: "Pending",
      value: "07",
      subtitle: "Requires action",
      icon: "◷",
    },
    {
      title: "Violations Found",
      value: "12",
      subtitle: "This month",
      icon: "!",
    },
  ];

  const inspections = [
    {
      id: "INS-1029",
      product: "ABC Biscuits",
      location: "Chennai",
      date: "25 Aug 2026",
      status: "Pending",
    },
    {
      id: "INS-1028",
      product: "XYZ Cooking Oil",
      location: "Coimbatore",
      date: "24 Aug 2026",
      status: "In Progress",
    },
    {
      id: "INS-1027",
      product: "Fresh Milk",
      location: "Madurai",
      date: "23 Aug 2026",
      status: "Completed",
    },
    {
      id: "INS-1026",
      product: "Daily Rice",
      location: "Salem",
      date: "22 Aug 2026",
      status: "Completed",
    },
  ];

  return (
    <div className="inspector-dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <h1>Inspector Dashboard</h1>

          <p>
            Monitor your inspections and compliance activities.
          </p>
        </div>

        <div className="inspector-profile">
          <div className="profile-avatar">
            IN
          </div>

          <div>
            <strong>Inspector</strong>
            <span>Field Officer</span>
          </div>
        </div>

      </div>

      {/* Statistics */}

      <div className="dashboard-stats">

        {stats.map((stat, index) => (
          <div className="dashboard-stat-card" key={index}>

            <div className="stat-top">

              <span>{stat.title}</span>

              <div className="stat-icon">
                {stat.icon}
              </div>

            </div>

            <h2>{stat.value}</h2>

            <p>{stat.subtitle}</p>

          </div>
        ))}

      </div>

      {/* Main Content */}

      <div className="dashboard-content">

        {/* Today's Work */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h3>Today's Assignments</h3>

              <p>
                Inspections that require your attention.
              </p>
            </div>

            <button className="view-all-btn" onClick={() => navigate("/inspector/assignments")}>
              View All
            </button>

          </div>

          <div className="inspection-list">

            {inspections.slice(0, 3).map((inspection) => (

              <div
                className="inspection-item"
                key={inspection.id}
              >

                <div className="inspection-icon">
                  ▣
                </div>

                <div className="inspection-info">

                  <strong>
                    {inspection.product}
                  </strong>

                  <span>
                    {inspection.id} • {inspection.location}
                  </span>

                </div>

                <span
                  className={`dashboard-status ${inspection.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {inspection.status}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Quick Actions */}

        <div className="dashboard-panel quick-panel">

          <h3>Quick Actions</h3>

          <p>
            Start your inspection workflow.
          </p>

          <button className="quick-action primary" onClick={() => navigate("/inspector/scan-product")}>
            <span>▣</span>
            Scan Product
          </button>

          <button className="quick-action" onClick={() => navigate("/inspector/assignments")}>
            <span>✓</span>
            View Assignments
          </button>

          <button className="quick-action" onClick={() => navigate("/inspector/reports")}>
            <span>▤</span>
            View Reports
          </button>

        </div>

      </div>

      {/* Recent Inspections */}

      <div className="dashboard-panel recent-panel">

        <div className="panel-header">

          <div>
            <h3>Recent Inspections</h3>

            <p>
              Your latest inspection activities.
            </p>
          </div>

          <button className="view-all-btn" onClick={() => navigate("/inspector/history")}>
            View History
          </button>

        </div>

        <div className="recent-table">

          <div className="table-row table-heading">
            <span>Inspection ID</span>
            <span>Product</span>
            <span>Location</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          {inspections.map((inspection) => (

            <div className="table-row" key={inspection.id}>

              <span className="inspection-id">
                {inspection.id}
              </span>

              <span>{inspection.product}</span>

              <span>{inspection.location}</span>

              <span>{inspection.date}</span>

              <span>
                <span
                  className={`dashboard-status ${inspection.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {inspection.status}
                </span>
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;