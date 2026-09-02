import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import VegNonVegBadge from "../../components/common/VegNonVegBadge";
import "./InspectionDetails.css";

const RULE_DEFINITIONS = {
  mrp: {
    title: "Maximum Retail Price (MRP)",
    description: "MRP declaration was missing, unreadable, or not inclusive of all taxes.",
    ruleRef: "LMR-RULE-001",
  },
  quantity: {
    title: "Net Quantity Declaration",
    description: "Net quantity was missing or not declared using standard SI units.",
    ruleRef: "LMR-RULE-002",
  },
  manufacturer: {
    title: "Manufacturer / Packer Details",
    description: "Complete name and postal address of manufacturer/packer was missing.",
    ruleRef: "LMR-RULE-003",
  },
  packingDate: {
    title: "Date of Manufacturing / Packing",
    description: "Required date information was not clearly visible on the package.",
    ruleRef: "PACK-DATE-001",
  },
  consumerCare: {
    title: "Consumer Care Details",
    description: "Helpline phone number or email for consumer grievances was missing.",
    ruleRef: "LMR-RULE-004",
  },
  countryOrigin: {
    title: "Country of Origin",
    description: "Country of origin declaration was not prominently displayed.",
    ruleRef: "LMR-RULE-005",
  },
  fssaiLogo: {
    title: "FSSAI Graphic Logo",
    description: "FSSAI graphic logo visual symbol mark was not detected on packaging.",
    ruleRef: "FSSAI-RULE-001",
  },
  vegNonVegLogo: {
    title: "Veg / Non-Veg Statutory Logo",
    description: "Mandatory Green Dot (Veg) or Brown Triangle (Non-Veg) symbol missing from Principal Display Panel.",
    ruleRef: "FSSAI-2.2.2 / LM-RULE-006",
  },
};

// Default state: no scan yet — all checks unknown/pending, not pre-passed
const DEFAULT_SCAN_DATA = {
  name: "No product scanned yet",
  brand: "—",
  category: "—",
  status: "pending",
  score: 0,
  barcode: "—",
  extracted_data: {},
  checks: {
    mrp: false,
    quantity: false,
    manufacturer: false,
    packingDate: false,
    consumerCare: false,
    countryOrigin: false,
    fssaiLogo: false,
    vegNonVegLogo: null,
  },
  compliance_report: [],
};

function InspectionDetails() {
  const navigate = useNavigate();

  const [scanData, setScanData] = useState(() => {
    try {
      const saved = localStorage.getItem("lastScanResult");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if it came from a real backend scan (has compliance_report array)
        if (parsed && Array.isArray(parsed.compliance_report) && parsed.compliance_report.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    // Clear any stale/fake data
    localStorage.removeItem("lastScanResult");
    localStorage.removeItem("inspectionReview");
    return DEFAULT_SCAN_DATA;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [checks, setChecks] = useState(() => {
    try {
      const saved = localStorage.getItem("lastScanResult");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.compliance_report) && parsed.compliance_report.length > 0) {
          // Always derive from compliance_report — single source of truth
          const ruleMap = {};
          parsed.compliance_report.forEach((r) => { ruleMap[r.rule_id] = r.passed; });
          return {
            mrp:            ruleMap["LMR_RULE_01"] ?? false,
            quantity:       ruleMap["LMR_RULE_02"] ?? false,
            manufacturer:   ruleMap["LMR_RULE_05"] ?? false,
            packingDate:    ruleMap["LMR_RULE_06"] ?? false,
            consumerCare:   ruleMap["LMR_RULE_04"] ?? false,
            countryOrigin:  ruleMap["LMR_RULE_07"] ?? false,
            fssaiLogo:      ruleMap["FSSAI_RULE_01"] ?? false,
            // null = rule not evaluated by backend (not a violation)
            vegNonVegLogo:  ruleMap["FSSAI_VEG_RULE_01"] ?? null,
          };
        }
      }
    } catch (e) {}
    return DEFAULT_SCAN_DATA.checks;
  });

  const [observation, setObservation] = useState(() => {
    try {
      const saved = localStorage.getItem("inspectionReview");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.observation) return parsed.observation;
      }
    } catch (e) {}
    return "";
  });

  const [saved, setSaved] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/products/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      setScanData(data);

      const ruleMap = {};
      if (data.compliance_report) {
        data.compliance_report.forEach((r) => { ruleMap[r.rule_id] = r.passed; });
      }

      const newChecks = {
        mrp:            ruleMap["LMR_RULE_01"] ?? false,
        quantity:       ruleMap["LMR_RULE_02"] ?? false,
        manufacturer:   ruleMap["LMR_RULE_05"] ?? false,
        packingDate:    ruleMap["LMR_RULE_06"] ?? false,
        consumerCare:   ruleMap["LMR_RULE_04"] ?? false,
        countryOrigin:  ruleMap["LMR_RULE_07"] ?? false,
        fssaiLogo:      ruleMap["FSSAI_RULE_01"] ?? false,
        // null = rule not evaluated by backend (not a violation)
        vegNonVegLogo:  ruleMap["FSSAI_VEG_RULE_01"] ?? null,
      };

      setChecks(newChecks);
      localStorage.setItem("lastScanResult", JSON.stringify({ ...data, checks: newChecks }));
      localStorage.setItem(
        "inspectionReview",
        JSON.stringify({
          checks: newChecks,
          score: data.score,
        })
      );
    } catch (err) {
      console.error("AI OCR Scan error:", err);
      setError("Failed to run EasyOCR engine. Please verify backend service.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (key) => {
    setChecks((prev) => {
      const cur = prev[key];
      // Tri-state cycle: null (N/A) → true (Pass) → false (Fail) → null
      const next = cur === null ? true : cur === true ? false : null;
      return { ...prev, [key]: next };
    });
    setSaved(false);
  };

  const passedChecks = Object.values(checks).filter((v) => v === true).length;
  // Exclude null (not-yet-evaluated) rules from total so they don't skew score
  const totalChecks = Object.values(checks).filter((v) => v !== null).length;
  const score = scanData?.score !== undefined ? Math.round(scanData.score) : Math.round((passedChecks / (totalChecks || 1)) * 100);
  // Only explicitly-false values are violations; null = pending/N/A, not a failure
  const failedRules = Object.keys(checks).filter((key) => checks[key] === false);

  const saveInspection = () => {
    localStorage.setItem(
      "inspectionReview",
      JSON.stringify({ inspectionId: "INS-1029", checks, observation, score, passedChecks, failedCount: failedRules.length })
    );
    setSaved(true);
  };

  const isCompliant = scanData?.status === "compliant" || failedRules.length === 0;
  const ext = scanData?.extracted_data;

  const combinedText = `${scanData?.name || ""} ${scanData?.brand || ""} ${scanData?.category || ""} ${scanData?.description || ""}`;
  const isExplicitNonVeg = /non[\s-_]?veg|chicken|meat|egg|fish|mutton|pork|prawn|seafood|beef/i.test(combinedText);
  const isFoodCategory = isExplicitNonVeg || /food|biscuit|oil|dairy|grain|snack|tea|beverage|noodle|grocery|edible|wheat/i.test(combinedText);

  const productDietaryType =
    (isExplicitNonVeg ? "NON_VEG" : null) ||
    (ext?.veg_non_veg_logo ? (isExplicitNonVeg ? "NON_VEG" : ext.veg_non_veg_logo) : null) ||
    (ext?.is_vegetarian === false ? "NON_VEG" : ext?.is_vegetarian === true ? "VEG" : null) ||
    (isExplicitNonVeg ? "NON_VEG" : (isFoodCategory ? "VEG" : "NON_FOOD"));

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
            Upload a package image to convert visual declarations into digital data via AI OCR.
          </p>
        </div>

        <div className="inspection-id-box">
          <span>Inspection ID</span>
          <strong>INS-1029</strong>
        </div>

      </div>

      {/* UPLOAD & PRODUCT INFORMATION */}

      <div className="details-card">

        <div className="details-card-title">
          <div>
            <h2>Package Image & Product Information</h2>
            <p>Upload a label photo to extract digital details using EasyOCR + Legal Metrology Rules.</p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "14px",
            }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              {loading ? "AI OCR Scanning..." : "Upload Label Image"}
            </label>

            <span className={`inspection-status ${isCompliant ? "passed" : "failed"}`} style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontWeight: 700,
              backgroundColor: isCompliant ? "#dcfce7" : "#fee2e2",
              color: isCompliant ? "#15803d" : "#b91c1c",
            }}>
              {isCompliant ? "Compliant" : "Non-Compliant"}
            </span>
          </div>
        </div>

        {error && <p style={{ color: "#dc2626", fontWeight: 600, marginTop: "8px" }}>{error}</p>}

        <div className="product-details-grid" style={{ marginTop: "16px" }}>

          <div>
            <span>Product Name</span>
            <strong>{scanData?.name || ext?.name || "Scanned Commodity"}</strong>
          </div>

          <div>
            <span>Brand</span>
            <strong>{scanData?.brand || "Packaged Brand"}</strong>
          </div>

          <div>
            <span>Category</span>
            <strong>{scanData?.category || "Packaged Food"}</strong>
          </div>

          <div>
            <span>Barcode</span>
            <strong>{scanData?.barcode || "8901234567890"}</strong>
          </div>

          <div>
            <span>Maximum Retail Price (MRP)</span>
            <strong>{ext?.mrp || scanData?.mrp || "Not Found"}</strong>
          </div>

          <div>
            <span>Net Quantity / Volume</span>
            <strong>{ext?.net_weight || scanData?.netQuantity || "Not Found"}</strong>
          </div>

          <div>
            <span>Declared Unit Sale Price (USP)</span>
            <strong>{ext?.unit_sale_price || "Not Found"}</strong>
          </div>

          <div>
            <span>Calculated Reference USP</span>
            <strong>{ext?.calculated_unit_sale_price || "N/A"}</strong>
          </div>

          <div>
            <span>Date of Mfg / Packing</span>
            <strong>{ext?.mfg_date || "Not Found"}</strong>
          </div>

          <div>
            <span>Date of Expiry / Best Before</span>
            <strong>{ext?.expiry_date || (ext?.mfg_date ? "N/A (Mfg date declared)" : "Not Found")}</strong>
          </div>

          <div>
            <span>Manufacturer & Address</span>
            <strong>{ext?.manufacturer_address || scanData?.manufacturer || "Not Found"}</strong>
          </div>

          <div>
            <span>Consumer Care Helpline</span>
            <strong>{ext?.consumer_care || "Not Found"}</strong>
          </div>

          <div>
            <span>Country of Origin</span>
            <strong>{ext?.country_of_origin || "Not Found"}</strong>
          </div>

          <div>
            <span>FSSAI Graphic Logo</span>
            <strong style={{ color: (ext?.fssai_logo && ext.fssai_logo !== "Not Found" && ext.fssai_logo !== "Not Detected") || checks.fssaiLogo ? "#16a34a" : "#dc2626" }}>
              {(ext?.fssai_logo && ext.fssai_logo !== "Not Found" && ext.fssai_logo !== "Not Detected") || checks.fssaiLogo ? (ext?.fssai_logo && ext.fssai_logo !== "Not Found" ? ext.fssai_logo : "Detected") : "Not Detected"}
            </strong>
          </div>

          <div>
            <span>Veg / Non-Veg Statutory Logo</span>
            <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <VegNonVegBadge
                type={productDietaryType}
                size="sm"
                showLabel={true}
              />
            </strong>
          </div>
        </div>

      </div>

      {/* AI COMPLIANCE REPORT BREAKDOWN */}
      {scanData?.compliance_report && scanData.compliance_report.length > 0 && (
        <div className="details-card" style={{ marginTop: "24px" }}>
          <div className="details-card-title">
            <div>
              <h2>AI Rule Compliance Findings</h2>
              <p>Automated Legal Metrology Act & Rules compliance audit.</p>
            </div>
            <span style={{ fontWeight: 700, fontSize: "18px", color: isCompliant ? "#16a34a" : "#dc2626" }}>
              Overall Score: {Math.round(scanData.score)}%
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
            {scanData.compliance_report.map((rule, idx) => (
              <div key={idx} style={{
                padding: "14px 18px",
                borderRadius: "8px",
                border: `1px solid ${rule.passed ? "#bbf7d0" : "#fca5a5"}`,
                backgroundColor: rule.passed ? "#f0fdf4" : "#fef2f2",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <strong style={{ color: rule.passed ? "#166534" : "#991b1b", fontSize: "15px" }}>
                    [{rule.rule_id}] {rule.rule}
                  </strong>
                  <p style={{ margin: "4px 0 0 0", color: "#374151", fontSize: "14px" }}>{rule.message}</p>
                </div>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "13px",
                  backgroundColor: rule.passed ? "#22c55e" : "#ef4444",
                  color: "#ffffff",
                }}>
                  {rule.passed ? "PASS" : "FAIL"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
              8 Rules
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

            {/* FSSAI LOGO */}

            <div className="compliance-item">

              <div className="compliance-icon">
                F
              </div>

              <div className="compliance-info">

                <strong>FSSAI Graphic Logo</strong>

                <span>
                  FSSAI graphic logo symbol badge must be clearly displayed on food packaging.
                </span>

              </div>

              <button
                className={`check-button ${
                  checks.fssaiLogo ? "passed" : "failed"
                }`}
                onClick={() => toggleCheck("fssaiLogo")}
              >
                {checks.fssaiLogo ? "Pass" : "Fail"}
              </button>

            </div>

            {/* VEG / NON-VEG STATUTORY LOGO */}

            <div className="compliance-item">

              <div className="compliance-icon" style={{ padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <VegNonVegBadge
                  type={productDietaryType}
                  size="sm"
                  showLabel={false}
                />
              </div>

              <div className="compliance-info">

                <strong>Veg / Non-Veg Statutory Logo</strong>

                <span>
                  Mandatory FSSAI Green Dot (Veg) or Brown Triangle (Non-Veg) on Principal Display Panel.
                </span>

              </div>

              <button
                className={`check-button ${
                  checks.vegNonVegLogo === true || (checks.vegNonVegLogo === null && isFoodCategory) ? "passed" :
                  checks.vegNonVegLogo === false ? "failed" : "pending"
                }`}
                onClick={() => toggleCheck("vegNonVegLogo")}
              >
                {checks.vegNonVegLogo === true || (checks.vegNonVegLogo === null && isFoodCategory) ? "Pass" :
                 checks.vegNonVegLogo === false ? "Fail" : "N/A"}
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
            {failedRules.length} Violation(s)
          </span>

        </div>

        {failedRules.length > 0 ? (

          <div className="violations-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {failedRules.map((ruleKey) => {
              const rule = RULE_DEFINITIONS[ruleKey];
              return (
                <div key={ruleKey} className="violation-box">

                  <div className="violation-icon">
                    !
                  </div>

                  <div>
                    <strong>
                      {rule.title}
                    </strong>

                    <p>
                      {rule.description}
                    </p>

                    <span>
                      Rule Reference: {rule.ruleRef}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        ) : (

          <div className="no-violation">
            No violations detected. All statutory checks passed.
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