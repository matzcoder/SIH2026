import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InspectionDetails.css";

function InspectionDetails() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState({
    mrp: true,
    quantity: true,
    manufacturer: true,
    packingDate: false,
    consumerCare: true,
    countryOrigin: true,
  });
  const [observation, setObservation] = useState("");
  const [saved, setSaved] = useState(false);

  const toggleCheck = (key) => {
    setChecks({
      ...checks,
      [key]: !checks[key],
    });
  };

  const saveInspection = () => {
    localStorage.setItem(
      "inspectionReview",
      JSON.stringify({ inspectionId: "INS-1029", checks, observation, score })
    );
    setSaved(true);
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.values(checks).length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  return (
    <div className="inspection-details-page">

      {/* HEADER */}

      <div className="inspection-details-header">

        <div>
          <div className="inspection-breadcrumb">
            Inspector / Inspection / INS-1029
          </div>

          <h1>Inspection Details</h1>

          <p>
            Verify package declarations and determine compliance.
          </p>
        </div>

        <div className="inspection-id-box">
          <span>Inspection ID</span>
          <strong>INS-1029</strong>
        </div>

      </div>

      {/* PRODUCT INFORMATION */}

      <div className="details-card">

        <div className="details-card-title">
          <div>
            <h2>Product Information</h2>
            <p>Details captured during product inspection.</p>
          </div>

          <span className="inspection-status">
            In Progress
          </span>
        </div>

        <div className="product-details-grid">

          <div>
            <span>Product Name</span>
            <strong>ABC Biscuits</strong>
          </div>

          <div>
            <span>Brand</span>
            <strong>ABC Foods</strong>
          </div>

          <div>
            <span>Category</span>
            <strong>Packaged Food</strong>
          </div>

          <div>
            <span>Batch Number</span>
            <strong>ABX2026-08</strong>
          </div>

          <div>
            <span>MRP</span>
            <strong>₹50.00</strong>
          </div>

          <div>
            <span>Net Quantity</span>
            <strong>100 g</strong>
          </div>

          <div>
            <span>Manufacturer</span>
            <strong>ABC Foods Pvt Ltd</strong>
          </div>

          <div>
            <span>Inspection Location</span>
            <strong>Chennai</strong>
          </div>

        </div>

      </div>

      {/* COMPLIANCE CHECK */}

      <div className="details-layout">

        <div className="details-card compliance-card">

          <div className="details-card-title">

            <div>
              <h2>Compliance Checklist</h2>

              <p>
                Verify each mandatory declaration according to the applicable rules.
              </p>
            </div>

            <span className="rule-badge">
              6 Rules
            </span>

          </div>

          <div className="compliance-list">

            {/* MRP */}

            <div className="compliance-item">

              <div className="compliance-icon">
                ₹
              </div>

              <div className="compliance-info">

                <strong>Maximum Retail Price (MRP)</strong>

                <span>
                  MRP must be clearly declared on the package.
                </span>

              </div>

              <button
                className={`check-button ${
                  checks.mrp ? "passed" : "failed"
                }`}
                onClick={() => toggleCheck("mrp")}
              >
                {checks.mrp ? "Pass" : "Fail"}
              </button>

            </div>

            {/* QUANTITY */}

            <div className="compliance-item">

              <div className="compliance-icon">
                Q
              </div>

              <div className="compliance-info">

                <strong>Net Quantity</strong>

                <span>
                  Net quantity must be displayed using the required unit.
                </span>

              </div>

              <button
                className={`check-button ${
                  checks.quantity ? "passed" : "failed"
                }`}
                onClick={() => toggleCheck("quantity")}
              >
                {checks.quantity ? "Pass" : "Fail"}
              </button>

            </div>

            {/* MANUFACTURER */}

            <div className="compliance-item">

              <div className="compliance-icon">
                M
              </div>

              <div className="compliance-info">

                <strong>Manufacturer / Packer Details</strong>

                <span>
                  Name and address of manufacturer or packer must be declared.
                </span>

              </div>

              <button
                className={`check-button ${
                  checks.manufacturer ? "passed" : "failed"
                }`}
                onClick={() => toggleCheck("manufacturer")}
              >
                {checks.manufacturer ? "Pass" : "Fail"}
              </button>

            </div>

            {/* DATE */}

            <div className="compliance-item">

              <div className="compliance-icon">
                D
              </div>

              <div className="compliance-info">

                <strong>Date of Manufacturing / Packing</strong>

                <span>
                  Required date information must be visible and readable.
                </span>

              </div>

              <button
                className={`check-button ${
                  checks.packingDate ? "passed" : "failed"
                }`}
                onClick={() => toggleCheck("packingDate")}
              >
                {checks.packingDate ? "Pass" : "Fail"}
              </button>

            </div>

            {/* CONSUMER CARE */}

            <div className="compliance-item">

              <div className="compliance-icon">
                C
              </div>

              <div className="compliance-info">

                <strong>Consumer Care Details</strong>

                <span>
                  Consumer care contact information must be available.
                </span>

              </div>

              <button
                className={`check-button ${
                  checks.consumerCare ? "passed" : "failed"
                }`}
                onClick={() => toggleCheck("consumerCare")}
              >
                {checks.consumerCare ? "Pass" : "Fail"}
              </button>

            </div>

            {/* COUNTRY */}

            <div className="compliance-item">

              <div className="compliance-icon">
                C
              </div>

              <div className="compliance-info">

                <strong>Country of Origin</strong>

                <span>
                  Country of origin declaration must be present where applicable.
                </span>

              </div>

              <button
                className={`check-button ${
                  checks.countryOrigin ? "passed" : "failed"
                }`}
                onClick={() => toggleCheck("countryOrigin")}
              >
                {checks.countryOrigin ? "Pass" : "Fail"}
              </button>

            </div>

          </div>

        </div>

        {/* SCORE */}

        <div className="details-card score-card">

          <h2>Compliance Score</h2>

          <p>
            Based on the completed rule checks.
          </p>

          <div className="score-circle">

            <div>
              <strong>{score}%</strong>
              <span>Compliance</span>
            </div>

          </div>

          <div className="score-summary">

            <div>
              <span>Rules Passed</span>
              <strong>{passedChecks}</strong>
            </div>

            <div>
              <span>Rules Failed</span>
              <strong>{totalChecks - passedChecks}</strong>
            </div>

          </div>

          <div className="score-result">

            {score === 100 ? (
              <>
                <strong>Fully Compliant</strong>
                <span>
                  All applicable checks have passed.
                </span>
              </>
            ) : (
              <>
                <strong>Non-Compliant Items Found</strong>
                <span>
                  Review failed checks before submitting the report.
                </span>
              </>
            )}

          </div>

        </div>

      </div>

      {/* VIOLATIONS */}

      <div className="details-card">

        <div className="details-card-title">

          <div>
            <h2>Violations Detected</h2>

            <p>
              Record issues found during the physical inspection.
            </p>
          </div>

          <span className="violation-count">
            {totalChecks - passedChecks} Violation(s)
          </span>

        </div>

        {totalChecks - passedChecks > 0 ? (

          <div className="violation-box">

            <div className="violation-icon">
              !
            </div>

            <div>
              <strong>
                Date of Manufacturing / Packing
              </strong>

              <p>
                Required date information was not clearly visible
                on the package.
              </p>

              <span>
                Rule Reference: PACK-DATE-001
              </span>
            </div>

          </div>

        ) : (

          <div className="no-violation">
            No violations detected.
          </div>

        )}

      </div>

      {/* INSPECTOR OBSERVATION */}

      <div className="details-card">

        <div className="details-card-title">

          <div>
            <h2>Inspector Observation</h2>

            <p>
              Add your final observation before submitting the inspection.
            </p>
          </div>

        </div>

        <textarea
          className="inspection-observation"
          placeholder="Enter your final inspection observations..."
          value={observation}
          onChange={(event) => {
            setObservation(event.target.value);
            setSaved(false);
          }}
        />

      </div>

      {/* ACTIONS */}

      <div className="inspection-actions">

        <button className="back-btn" onClick={() => navigate("/inspector/evidence")}>
          Back to Evidence
        </button>

        <button className="save-details-btn" onClick={saveInspection}>
          {saved ? "Inspection Saved" : "Save Inspection"}
        </button>

        <button className="submit-report-btn" onClick={() => {
          saveInspection();
          navigate("/inspector/reports");
        }}>
          Submit Inspection Report
        </button>

      </div>

    </div>
  );
}

export default InspectionDetails;