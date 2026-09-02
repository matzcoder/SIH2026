import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VegNonVegBadge from "../../components/common/VegNonVegBadge";
import "./History.css";

function History() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const inspections = [
    {
      id: "INS-1027",
      product: "Amul Taaza Homogenised Milk 500ml",
      category: "Dairy",
      location: "Madurai",
      date: "23 Aug 2026",
      compliance: "88%",
      violations: 1,
      status: "Compliant",
      dietaryType: "VEG",
    },
    {
      id: "INS-1026",
      product: "Tata Salt Vacuum Evaporated 1kg",
      category: "Food Grains",
      location: "Salem",
      date: "22 Aug 2026",
      compliance: "96%",
      violations: 0,
      status: "Compliant",
      dietaryType: "VEG",
    },
    {
      id: "INS-1025",
      product: "Chicken Masala Instant Noodles 70g",
      category: "Packaged Food",
      location: "Coimbatore",
      date: "20 Aug 2026",
      compliance: "62%",
      violations: 3,
      status: "Violation",
      dietaryType: "NON_VEG",
    },
    {
      id: "INS-1024",
      product: "Tata Tea Gold 250g",
      category: "Beverages",
      location: "Chennai",
      date: "18 Aug 2026",
      compliance: "91%",
      violations: 0,
      status: "Compliant",
      dietaryType: "VEG",
    },
    {
      id: "INS-1023",
      product: "Surf Excel Washing Powder 500g",
      category: "Household",
      location: "Trichy",
      date: "16 Aug 2026",
      compliance: "74%",
      violations: 2,
      status: "Violation",
      dietaryType: "NON_FOOD",
    },
  ];

  const filteredInspections =
    filter === "All"
      ? inspections
      : inspections.filter(
          (item) => item.status === filter
        );

  const exportHistory = () => {
    const content = filteredInspections
      .map((inspection) => `${inspection.id},${inspection.product},${inspection.status},${inspection.compliance}`)
      .join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "inspection-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="history-page">

      {/* HEADER */}

      <div className="history-header">

        <div>
          <div className="history-breadcrumb">
            Inspector / History
          </div>

          <h1>Inspection History</h1>

          <p>
            View your previous inspections and compliance results.
          </p>
        </div>

        <select
          className="history-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Inspections</option>
          <option value="Compliant">Compliant</option>
          <option value="Violation">Violations</option>
        </select>

      </div>

      {/* SUMMARY */}

      <div className="history-stats">

        <div className="history-stat">
          <span>Total Inspections</span>
          <strong>128</strong>
          <small>All time</small>
        </div>

        <div className="history-stat">
          <span>Compliant</span>
          <strong>104</strong>
          <small>81.2% of inspections</small>
        </div>

        <div className="history-stat">
          <span>Violations</span>
          <strong>24</strong>
          <small>18.8% of inspections</small>
        </div>

        <div className="history-stat">
          <span>Average Compliance</span>
          <strong>87%</strong>
          <small>Overall score</small>
        </div>

      </div>

      {/* TABLE */}

      <div className="history-card">

        <div className="history-card-header">

          <div>
            <h2>Previous Inspections</h2>

            <p>
              Detailed record of completed inspections.
            </p>
          </div>

          <button className="export-btn" onClick={exportHistory}>
            Export History
          </button>

        </div>

        <div className="history-table-wrapper">

          <div className="history-table">

            <div className="history-row history-heading">
              <span>Inspection ID</span>
              <span>Product</span>
              <span>Location</span>
              <span>Date</span>
              <span>Compliance</span>
              <span>Violations</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {filteredInspections.map((inspection) => (

              <div
                className="history-row"
                key={inspection.id}
              >

                <span className="history-id">
                  {inspection.id}
                </span>

                <div className="product-column">
                  <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {inspection.dietaryType && (
                      <VegNonVegBadge type={inspection.dietaryType} size="sm" showLabel={false} />
                    )}
                    {inspection.product}
                  </strong>
                  <small>{inspection.category}</small>
                </div>

                <span>
                  {inspection.location}
                </span>

                <span>
                  {inspection.date}
                </span>

                <span
                  className={
                    Number.parseInt(inspection.compliance, 10) >= 80
                      ? "good-score"
                      : "low-score"
                  }
                >
                  {inspection.compliance}
                </span>

                <span>
                  {inspection.violations}
                </span>

                <span>
                  <span
                    className={`history-status ${
                      inspection.status === "Compliant"
                        ? "compliant"
                        : "violation"
                    }`}
                  >
                    {inspection.status}
                  </span>
                </span>

                <button className="view-btn" onClick={() => navigate(`/inspector/inspection-details/${inspection.id}`)}>
                  View
                </button>

              </div>

            ))}

          </div>

        </div>

        {filteredInspections.length === 0 && (
          <div className="history-empty">
            <h3>No inspections found</h3>
            <p>
              There are no inspections matching this filter.
            </p>
          </div>
        )}

      </div>

      {/* INSPECTION DETAILS */}

      <div className="history-bottom">

        <div className="history-card">

          <div className="history-card-header">
            <div>
              <h2>Latest Inspection</h2>
              <p>
                INS-1027 • Fresh Milk
              </p>
            </div>

            <span className="history-status compliant">
              Compliant
            </span>
          </div>

          <div className="latest-details">

            <div>
              <span>Compliance Score</span>
              <strong>88%</strong>
            </div>

            <div>
              <span>Violations</span>
              <strong>01</strong>
            </div>

            <div>
              <span>Evidence Files</span>
              <strong>06</strong>
            </div>

            <div>
              <span>Report</span>
              <button className="report-btn" onClick={() => navigate("/inspector/reports")}>
                View Report
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default History;