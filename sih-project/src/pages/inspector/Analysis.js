import React from "react";
import { useNavigate } from "react-router-dom";
import "./Analysis.css";

function Analysis() {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Inspections",
      value: "128",
      subtitle: "This month",
    },
    {
      title: "Compliant Products",
      value: "104",
      subtitle: "81.2% compliance",
    },
    {
      title: "Violations Found",
      value: "24",
      subtitle: "18.8% violation rate",
    },
    {
      title: "Pending Inspections",
      value: "07",
      subtitle: "Requires action",
    },
  ];

  const monthlyData = [
    { month: "Mar", value: 62 },
    { month: "Apr", value: 71 },
    { month: "May", value: 68 },
    { month: "Jun", value: 82 },
    { month: "Jul", value: 76 },
    { month: "Aug", value: 91 },
  ];

  const violations = [
    {
      name: "Incorrect MRP",
      count: 9,
      percentage: 30,
    },
    {
      name: "Missing Veg / Non-Veg Logo",
      count: 7,
      percentage: 23,
    },
    {
      name: "Missing Net Quantity",
      count: 6,
      percentage: 20,
    },
    {
      name: "Manufacturer Details",
      count: 4,
      percentage: 14,
    },
    {
      name: "Consumer Care Details",
      count: 2,
      percentage: 7,
    },
    {
      name: "Other",
      count: 2,
      percentage: 6,
    },
  ];

  return (
    <div className="inspector-analysis">

      {/* Header */}

      <div className="analysis-header">
        <div>
          <h1>Inspection Analytics</h1>
          <p>
            Monitor your inspection performance and
            compliance results.
          </p>
        </div>

        <select className="period-select">
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Statistics */}

      <div className="analysis-stats">

        {stats.map((stat, index) => (
          <div className="analysis-card" key={index}>

            <div className="analysis-card-top">
              <span>{stat.title}</span>

              <span className="card-icon">
                {index === 0 && "▣"}
                {index === 1 && "✓"}
                {index === 2 && "!"}
                {index === 3 && "◷"}
              </span>
            </div>

            <h2>{stat.value}</h2>

            <p>{stat.subtitle}</p>

          </div>
        ))}

      </div>

      {/* Main Charts */}

      <div className="analysis-grid">

        {/* Compliance Trend */}

        <div className="analysis-panel">

          <div className="panel-header">
            <div>
              <h3>Compliance Trend</h3>
              <p>Monthly compliance percentage</p>
            </div>

            <span className="trend">
              ↑ 8.4%
            </span>
          </div>

          <div className="bar-chart">

            {monthlyData.map((item, index) => (
              <div className="bar-wrapper" key={index}>

                <div className="bar-value">
                  {item.value}%
                </div>

                <div
                  className="bar"
                  style={{
                    height: `${item.value * 2}px`,
                  }}
                ></div>

                <span>{item.month}</span>

              </div>
            ))}

          </div>

        </div>

        {/* Violation Analysis */}

        <div className="analysis-panel">

          <div className="panel-header">
            <div>
              <h3>Violation Analysis</h3>
              <p>Issues detected during inspections</p>
            </div>
          </div>

          <div className="violation-list">

            {violations.map((item, index) => (
              <div
                className="violation-item"
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => navigate("/inspector/inspection-details/INS-1029")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    navigate("/inspector/inspection-details/INS-1029");
                  }
                }}
              >

                <div className="violation-info">
                  <span>{item.name}</span>
                  <strong>{item.count}</strong>
                </div>

                <div className="progress-background">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  ></div>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Recent Performance */}

      <div className="analysis-panel performance-panel">

        <div className="panel-header">
          <div>
            <h3>Recent Inspection Performance</h3>
            <p>Your latest inspection results</p>
          </div>
        </div>

        <div className="performance-table">

          <div className="table-row table-heading">
            <span>Inspection ID</span>
            <span>Product</span>
            <span>Compliance</span>
            <span>Violations</span>
            <span>Status</span>
          </div>

          <div className="table-row">
            <span>INS-1028</span>
            <span>ABC Biscuits</span>
            <span>96%</span>
            <span>0</span>
            <span className="status compliant">
              Compliant
            </span>
          </div>

          <div className="table-row">
            <span>INS-1027</span>
            <span>XYZ Cooking Oil</span>
            <span>72%</span>
            <span>3</span>
            <span className="status violation">
              Violation
            </span>
          </div>

          <div className="table-row">
            <span>INS-1026</span>
            <span>Fresh Milk</span>
            <span>88%</span>
            <span>1</span>
            <span className="status review">
              Under Review
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Analysis;