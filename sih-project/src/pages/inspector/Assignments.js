import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Assignments.css";

function Assignments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All Assignments");
  const assignments = [
    {
      id: "INS-1029",
      product: "ABC Biscuits",
      location: "Chennai",
      assignedDate: "22 Aug 2026",
      deadline: "25 Aug 2026",
      priority: "High",
      status: "Pending",
    },
    {
      id: "INS-1030",
      product: "XYZ Cooking Oil",
      location: "Coimbatore",
      assignedDate: "21 Aug 2026",
      deadline: "26 Aug 2026",
      priority: "Medium",
      status: "In Progress",
    },
    {
      id: "INS-1031",
      product: "Fresh Milk",
      location: "Madurai",
      assignedDate: "20 Aug 2026",
      deadline: "24 Aug 2026",
      priority: "High",
      status: "Pending",
    },
    {
      id: "INS-1032",
      product: "Daily Rice",
      location: "Salem",
      assignedDate: "19 Aug 2026",
      deadline: "23 Aug 2026",
      priority: "Low",
      status: "Completed",
    },
  ];

  return (
    <div className="assignments-page">

      {/* Header */}

      <div className="assignments-header">
        <div>
          <h1>My Assignments</h1>
          <p>
            View and manage inspections assigned to you.
          </p>
        </div>

        <select className="assignment-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option>All Assignments</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Summary Cards */}

      <div className="assignment-stats">

        <div className="assignment-stat">
          <span>Total Assigned</span>
          <strong>24</strong>
        </div>

        <div className="assignment-stat">
          <span>Pending</span>
          <strong>07</strong>
        </div>

        <div className="assignment-stat">
          <span>In Progress</span>
          <strong>05</strong>
        </div>

        <div className="assignment-stat">
          <span>Completed</span>
          <strong>12</strong>
        </div>

      </div>

      {/* Assignment Cards */}

      <div className="assignment-list">

        {assignments
          .filter((assignment) => filter === "All Assignments" || assignment.status === filter)
          .map((assignment) => (

          <div
            className="assignment-card"
            key={assignment.id}
          >

            <div className="assignment-card-top">

              <div>
                <span className="assignment-id">
                  {assignment.id}
                </span>

                <h3>{assignment.product}</h3>
              </div>

              <span
                className={`priority ${assignment.priority.toLowerCase()}`}
              >
                {assignment.priority} Priority
              </span>

            </div>

            <div className="assignment-details">

              <div>
                <span>Location</span>
                <strong>{assignment.location}</strong>
              </div>

              <div>
                <span>Assigned Date</span>
                <strong>{assignment.assignedDate}</strong>
              </div>

              <div>
                <span>Deadline</span>
                <strong>{assignment.deadline}</strong>
              </div>

              <div>
                <span>Status</span>

                <strong>
                  <span
                    className={`assignment-status ${assignment.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {assignment.status}
                  </span>
                </strong>

              </div>

            </div>

            <div className="assignment-actions">

              <button className="details-btn" onClick={() => navigate(`/inspector/inspection-details/${assignment.id}`)}>
                View Details
              </button>

              {assignment.status !== "Completed" && (
                <button
                  className="start-btn"
                  onClick={() => navigate(
                    assignment.status === "Pending"
                      ? "/inspector/scan-product"
                      : `/inspector/inspection-details/${assignment.id}`
                  )}
                >
                  {assignment.status === "Pending"
                    ? "Start Inspection"
                    : "Continue Inspection"}
                </button>
              )}

            </div>

          </div>

          ))}

      </div>

    </div>
  );
}

export default Assignments;