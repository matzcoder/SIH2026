import React from "react";
import { useNavigate } from "react-router-dom";
import "./Reports.css";

function Reports() {
  const navigate = useNavigate();
  const [reportStatus, setReportStatus] = React.useState("Draft Report");
  const [actionMessage, setActionMessage] = React.useState("");
  const report = {
    id: "INS-1029",
    product: "ABC Biscuits",
    brand: "ABC Foods",
    category: "Packaged Food",
    location: "Chennai",
    date: "25 Aug 2026",
    inspector: "Field Officer",
    score: 83,
    passed: 5,
    failed: 1,
    evidence: 6,
  };

  const reportText = [
    "Official Inspection Report",
    `Report ID: REP-1029`,
    `Inspection ID: ${report.id}`,
    `Product: ${report.product} (${report.brand})`,
    `Location: ${report.location}`,
    `Date: ${report.date}`,
    `Inspector: ${report.inspector}`,
    `Compliance Score: ${report.score}%`,
    `Rules Passed: ${report.passed}`,
    `Violations: ${report.failed}`,
    "Decision: Corrective Action Required",
  ].join("\n");

  const saveDraft = () => {
    localStorage.setItem("inspectionReportDraft", JSON.stringify({ ...report, savedAt: new Date().toISOString() }));
    setReportStatus("Draft Saved");
    setActionMessage("Draft saved successfully.");
  };

  const downloadReport = () => {
    const url = URL.createObjectURL(new Blob([reportText], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.id}-inspection-report.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setActionMessage("Report download started.");
  };

  const submitReport = () => {
    localStorage.setItem("submittedInspectionReport", JSON.stringify({ ...report, submittedAt: new Date().toISOString() }));
    setReportStatus("Submitted");
    setActionMessage("Final inspection report submitted successfully.");
  };

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <div>
          <div className="reports-breadcrumb">
            Inspector / Reports / {report.id}
          </div>

          <h1>Inspection Report</h1>

          <p>
            Review the inspection findings before submitting the final report.
          </p>
        </div>

        <div className="report-id-box">
          <span>Report ID</span>
          <strong>REP-1029</strong>
        </div>

      </div>

      {/* REPORT STATUS */}

      <div className="report-status-bar">

        <div>
          <span>Inspection Status</span>
          <strong>Ready for Submission</strong>
        </div>

        <div className="report-status">
          {reportStatus}
        </div>

      </div>

      {/* SUMMARY */}

      <div className="report-summary">

        <div className="summary-card">
          <span>Compliance Score</span>
          <strong>{report.score}%</strong>
          <small>Overall compliance</small>
        </div>

        <div className="summary-card">
          <span>Rules Passed</span>
          <strong>{report.passed}</strong>
          <small>Requirements satisfied</small>
        </div>

        <div className="summary-card">
          <span>Violations</span>
          <strong className="violation-number">
            {report.failed}
          </strong>
          <small>Issues detected</small>
        </div>

        <div className="summary-card">
          <span>Evidence</span>
          <strong>{report.evidence}</strong>
          <small>Files attached</small>
        </div>

      </div>

      {/* REPORT DOCUMENT */}

      <div className="report-document">

        {/* DOCUMENT HEADER */}

        <div className="document-header">

          <div>
            <span className="document-label">
              OFFICIAL INSPECTION REPORT
            </span>

            <h2>
              Packaged Commodity Compliance Report
            </h2>

            <p>
              Inspection ID: {report.id}
            </p>
          </div>

          <div className="document-result">
            <span>Result</span>

            <strong>
              Conditional Compliance
            </strong>
          </div>

        </div>

        {/* PRODUCT DETAILS */}

        <div className="report-section">

          <h3>1. Product Information</h3>

          <div className="report-grid">

            <div>
              <span>Product Name</span>
              <strong>{report.product}</strong>
            </div>

            <div>
              <span>Brand</span>
              <strong>{report.brand}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>{report.category}</strong>
            </div>

            <div>
              <span>Inspection Location</span>
              <strong>{report.location}</strong>
            </div>

            <div>
              <span>Inspection Date</span>
              <strong>{report.date}</strong>
            </div>

            <div>
              <span>Inspector</span>
              <strong>{report.inspector}</strong>
            </div>

          </div>

        </div>

        {/* DECLARATIONS */}

        <div className="report-section">

          <h3>2. Package Declaration Verification</h3>

          <div className="verification-table">

            <div className="verification-row verification-heading">
              <span>Requirement</span>
              <span>Observation</span>
              <span>Result</span>
            </div>

            <div className="verification-row">
              <span>Maximum Retail Price</span>
              <span>Clearly declared</span>
              <b className="pass">PASS</b>
            </div>

            <div className="verification-row">
              <span>Net Quantity</span>
              <span>100 g declared</span>
              <b className="pass">PASS</b>
            </div>

            <div className="verification-row">
              <span>Manufacturer Details</span>
              <span>Details available</span>
              <b className="pass">PASS</b>
            </div>

            <div className="verification-row">
              <span>Packing Date</span>
              <span>Not clearly visible</span>
              <b className="fail">FAIL</b>
            </div>

            <div className="verification-row">
              <span>Consumer Care Details</span>
              <span>Available</span>
              <b className="pass">PASS</b>
            </div>

            <div className="verification-row">
              <span>Country of Origin</span>
              <span>Declared</span>
              <b className="pass">PASS</b>
            </div>

          </div>

        </div>

        {/* VIOLATION */}

        <div className="report-section">

          <h3>3. Violations Detected</h3>

          <div className="report-violation">

            <div className="report-warning-icon">
              !
            </div>

            <div>

              <strong>
                Packing Date Declaration
              </strong>

              <p>
                The manufacturing / packing date was not
                clearly visible on the package.
              </p>

              <span>
                Rule Reference: PACK-DATE-001
              </span>

            </div>

          </div>

        </div>

        {/* EVIDENCE */}

        <div className="report-section">

          <h3>4. Evidence Summary</h3>

          <div className="evidence-summary">

            <div className="evidence-stat">
              <strong>06</strong>
              <span>Evidence Files</span>
            </div>

            <div className="evidence-stat">
              <strong>05</strong>
              <span>Package Images</span>
            </div>

            <div className="evidence-stat">
              <strong>01</strong>
              <span>Document</span>
            </div>

          </div>

          <div className="evidence-note">
            Evidence collected during the physical inspection
            is attached to this report.
          </div>

        </div>

        {/* OBSERVATION */}

        <div className="report-section">

          <h3>5. Inspector Observation</h3>

          <div className="observation-box">

            <p>
              The package was inspected against the applicable
              packaged commodity requirements. Most mandatory
              declarations were present and readable. The packing
              date declaration requires corrective action.
            </p>

          </div>

        </div>

        {/* FINAL RESULT */}

        <div className="final-result">

          <div>

            <span>Final Compliance Score</span>

            <strong>
              {report.score}%
            </strong>

          </div>

          <div>

            <span>Inspection Decision</span>

            <strong>
              Corrective Action Required
            </strong>

          </div>

        </div>

        {/* SIGNATURE */}

        <div className="report-signature">

          <div>
            <span>Inspected By</span>
            <strong>{report.inspector}</strong>
          </div>

          <div>
            <span>Date</span>
            <strong>{report.date}</strong>
          </div>

        </div>

      </div>

      {/* ACTIONS */}

      <div className="report-actions">

        <button type="button" className="back-report-btn" onClick={() => navigate(`/inspector/inspection-details/${report.id}`)}>
          Back to Inspection
        </button>

        <button type="button" className="save-report-btn" onClick={saveDraft}>
          Save Draft
        </button>

        <button type="button" className="download-report-btn" onClick={downloadReport}>
          Download Report
        </button>

        <button type="button" className="submit-report-btn" onClick={submitReport} disabled={reportStatus === "Submitted"}>
          Submit Final Report
        </button>

      </div>

      {actionMessage && <p className="report-action-message" role="status">{actionMessage}</p>}

    </div>
  );
}

export default Reports;