import React from "react";
import { useNavigate } from "react-router-dom";
import VegNonVegBadge from "../../components/common/VegNonVegBadge";
import "./Reports.css";

const RULE_DEFINITIONS = {
  mrp: {
    label: "Maximum Retail Price",
    obsPass: "Clearly declared",
    obsFail: "Missing or unreadable",
    title: "MRP Declaration",
    description: "The printed MRP on the package wrapper was missing, unreadable, or incorrect.",
    ruleRef: "LMR-RULE-001",
  },
  quantity: {
    label: "Net Quantity",
    obsPass: "Declared with standard units",
    obsFail: "Missing or non-SI units",
    title: "Net Quantity Declaration",
    description: "Net quantity was missing or not declared using mandatory standard units.",
    ruleRef: "LMR-RULE-002",
  },
  manufacturer: {
    label: "Manufacturer Details",
    obsPass: "Details available",
    obsFail: "Missing name/address",
    title: "Manufacturer / Packer Details",
    description: "Complete name and postal address of manufacturer/packer was not declared.",
    ruleRef: "LMR-RULE-003",
  },
  packingDate: {
    label: "Packing Date",
    obsPass: "Visible & readable",
    obsFail: "Not clearly visible",
    title: "Packing Date Declaration",
    description: "The manufacturing / packing date was not clearly visible on the package.",
    ruleRef: "PACK-DATE-001",
  },
  consumerCare: {
    label: "Consumer Care Details",
    obsPass: "Available",
    obsFail: "Missing contact info",
    title: "Consumer Care Contact",
    description: "Consumer helpline contact details (phone/email) were not available.",
    ruleRef: "LMR-RULE-004",
  },
  countryOrigin: {
    label: "Country of Origin",
    obsPass: "Declared",
    obsFail: "Missing declaration",
    title: "Country of Origin",
    description: "Country of origin declaration was missing from the retail package.",
    ruleRef: "LMR-RULE-005",
  },
  fssaiLogo: {
    label: "FSSAI Graphic Logo",
    obsPass: "FSSAI graphic logo detected",
    obsFail: "FSSAI logo absent",
    title: "FSSAI Graphic Logo Presence",
    description: "FSSAI graphic logo visual symbol mark was not detected on packaging.",
    ruleRef: "FSSAI-RULE-001",
  },
  vegNonVegLogo: {
    label: "Veg / Non-Veg Statutory Logo",
    obsPass: "FSSAI statutory emblem present",
    obsFail: "Statutory emblem absent / incorrect",
    title: "Veg / Non-Veg Statutory Logo",
    description: "Mandatory FSSAI Green Dot (Veg) or Brown Triangle (Non-Veg) was missing from the Principal Display Panel.",
    ruleRef: "FSSAI-2.2.2 / LM-RULE-006",
  },
};

function Reports() {
  const navigate = useNavigate();
  const [reportStatus, setReportStatus] = React.useState("Draft Report");
  const [actionMessage, setActionMessage] = React.useState("");

  const savedScan = React.useMemo(() => {
    try {
      const data = localStorage.getItem("lastScanResult");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const savedReview = React.useMemo(() => {
    try {
      const data = localStorage.getItem("inspectionReview");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const checks = React.useMemo(() => {
    if (savedReview?.checks) return savedReview.checks;
    if (savedScan?.checks) return savedScan.checks;
    if (savedScan && Array.isArray(savedScan.compliance_report) && savedScan.compliance_report.length > 0) {
      const ruleMap = {};
      savedScan.compliance_report.forEach((r) => { ruleMap[r.rule_id] = r.passed; });
      return {
        mrp: ruleMap["LMR_RULE_01"] ?? false,
        quantity: ruleMap["LMR_RULE_02"] ?? false,
        manufacturer: ruleMap["LMR_RULE_05"] ?? false,
        packingDate: ruleMap["LMR_RULE_06"] ?? false,
        consumerCare: ruleMap["LMR_RULE_04"] ?? false,
        countryOrigin: ruleMap["LMR_RULE_07"] ?? false,
        fssaiLogo: ruleMap["FSSAI_RULE_01"] ?? false,
        vegNonVegLogo: ruleMap["FSSAI_VEG_RULE_01"] ?? false,
      };
    }
    return {
      mrp: true,
      quantity: true,
      manufacturer: true,
      packingDate: true,
      consumerCare: true,
      countryOrigin: true,
      fssaiLogo: true,
      vegNonVegLogo: false,
    };
  }, [savedScan, savedReview]);

  const passedCount = Object.values(checks).filter(Boolean).length;
  const totalCount = Object.values(checks).length;
  const failedCount = totalCount - passedCount;
  const score = savedScan?.score !== undefined ? Math.round(savedScan.score) : Math.round((passedCount / totalCount) * 100);
  const failedRules = Object.keys(checks).filter((key) => !checks[key]);

  const report = {
    id: savedReview?.inspectionId || "INS-1029",
    product: savedScan?.name || savedScan?.extracted_data?.name || "Packaged Food Commodity",
    brand: savedScan?.brand || "Verified Brand",
    category: savedScan?.category || "Packaged Food",
    location: "Chennai",
    date: "25 Aug 2026",
    inspector: "Field Officer",
    score: score,
    passed: passedCount,
    failed: failedCount,
    evidence: 6,
  };

  const productDietaryType = React.useMemo(() => {
    const combined = `${report.product} ${report.brand} ${report.category}`.toLowerCase();
    const isExplicitNonVeg = /non[\s-_]?veg|chicken|meat|egg|fish|mutton|pork|prawn|seafood|beef/i.test(combined);
    const isFood = isExplicitNonVeg || /food|biscuit|oil|dairy|grain|snack|tea|beverage|noodle|grocery|edible|wheat/i.test(combined);

    if (isExplicitNonVeg) return "NON_VEG";
    if (!isFood) return "NON_FOOD";

    // If scan extracted an explicit logo or vegetarian flag
    if (savedScan?.extracted_data?.veg_non_veg_logo) {
      return savedScan.extracted_data.veg_non_veg_logo;
    }
    if (savedScan?.extracted_data?.is_vegetarian === false) return "NON_VEG";
    if (savedScan?.extracted_data?.is_vegetarian === true) return "VEG";

    // If statutory check passed
    if (checks.vegNonVegLogo === true) {
      return "VEG";
    }

    // If statutory emblem failed/absent
    if (checks.vegNonVegLogo === false) {
      return "UNKNOWN";
    }

    return "UNKNOWN";
  }, [report.product, report.brand, report.category, savedScan, checks.vegNonVegLogo]);

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
    `Decision: ${score === 100 ? "Fully Compliant" : "Corrective Action Required"}`,
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
              {score === 100 ? "Fully Compliant" : "Conditional Compliance"}
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
              <span>Dietary Classification</span>
              <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <VegNonVegBadge
                  type={productDietaryType}
                  size="sm"
                  showLabel={true}
                />
              </strong>
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

            <div>
              <span>Compliance Status</span>
              <strong style={{ color: score === 100 ? "#15803d" : "#b45309" }}>
                {score === 100 ? "Fully Compliant" : "Review / Action Required"}
              </strong>
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

            {Object.keys(RULE_DEFINITIONS).map((ruleKey) => {
              const rule = RULE_DEFINITIONS[ruleKey];
              const isPassed = checks[ruleKey];
              let dynamicPass = rule.obsPass;
              if (ruleKey === "quantity" && savedScan?.extracted_data?.net_weight) {
                dynamicPass = `${savedScan.extracted_data.net_weight} declared`;
              } else if (ruleKey === "mrp" && savedScan?.extracted_data?.mrp) {
                dynamicPass = `${savedScan.extracted_data.mrp} declared`;
              } else if (ruleKey === "countryOrigin" && savedScan?.extracted_data?.country_of_origin) {
                dynamicPass = `Declared (${savedScan.extracted_data.country_of_origin})`;
              }

              return (
                <div key={ruleKey} className="verification-row">
                  <span>{rule.label}</span>
                  <span>{isPassed ? dynamicPass : rule.obsFail}</span>
                  <b className={isPassed ? "pass" : "fail"}>{isPassed ? "PASS" : "FAIL"}</b>
                </div>
              );
            })}

          </div>

        </div>

        {/* VIOLATION */}

        <div className="report-section">

          <h3>3. Violations Detected</h3>

          {failedRules.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {failedRules.map((ruleKey) => {
                const rule = RULE_DEFINITIONS[ruleKey];
                return (
                  <div key={ruleKey} className="report-violation">
                    <div className="report-warning-icon">!</div>
                    <div>
                      <strong>{rule.title}</strong>
                      <p>{rule.description}</p>
                      <span>Rule Reference: {rule.ruleRef}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-violation-box" style={{ padding: "16px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#166534", fontWeight: 600 }}>
              No violations detected. Package fully complies with Legal Metrology statutory requirements.
            </div>
          )}

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
              {savedReview?.observation || (
                failedRules.length === 0
                  ? "The package was inspected against applicable packaged commodity requirements. All mandatory declarations were verified and found fully compliant with Legal Metrology statutory standards."
                  : `The package was inspected against applicable packaged commodity requirements. Mandatory declarations were reviewed. Corrective action is required for: ${failedRules.map((k) => RULE_DEFINITIONS[k]?.label || k).join(", ")}.`
              )}
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
              {score === 100 ? "Fully Compliant" : "Corrective Action Required"}
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