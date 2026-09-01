import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./ScanProduct.css";

function ScanProduct() {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState("qr");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState(() => {
    try {
      const saved = localStorage.getItem("lastScanResult");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [manualProduct, setManualProduct] = useState({
    productName: "",
    brand: "",
    category: "Packaged Food",
    batchNumber: "",
    netQuantity: "",
    mrp: "",
    manufacturer: "",
  });

  const handleFileUpload = async (e) => {
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
      setScanResult(data);
      localStorage.setItem("lastScanResult", JSON.stringify(data));
      localStorage.setItem(
        "inspectionReview",
        JSON.stringify({
          checks: data.checks,
          score: data.score,
        })
      );
      setScanned(true);
    } catch (err) {
      console.error("AI Scan failed:", err);
      setError("Failed to run AI OCR scanner. Please check backend status.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScanned(false);
    setError("");
  };

  const updateManualProduct = (event) => {
    setManualProduct({
      ...manualProduct,
      [event.target.name]: event.target.value,
    });
  };

  const continueManualInspection = (event) => {
    event.preventDefault();
    if (!manualProduct.productName.trim() || !manualProduct.category) {
      return;
    }
    const simulatedScan = {
      name: manualProduct.productName,
      brand: manualProduct.brand || "Manual Brand",
      category: manualProduct.category,
      barcode: "MANUAL-" + Date.now().toString().slice(-6),
      score: 100.0,
      status: "compliant",
      extracted_data: {
        mrp: manualProduct.mrp,
        net_weight: manualProduct.netQuantity,
        manufacturer_address: manualProduct.manufacturer,
      },
      checks: {
        mrp: !!manualProduct.mrp,
        quantity: !!manualProduct.netQuantity,
        manufacturer: !!manualProduct.manufacturer,
        packingDate: true,
        consumerCare: true,
        countryOrigin: true,
      },
    };
    localStorage.setItem("lastScanResult", JSON.stringify(simulatedScan));
    localStorage.setItem("inspectionProduct", JSON.stringify(manualProduct));
    navigate("/inspector/evidence");
  };

  return (
    <div className="scan-product-page">

      {/* HEADER */}

      <div className="scan-header">
        <div>
          <div className="scan-breadcrumb">
            Inspector / Scan Product
          </div>

          <h1>Scan Product</h1>

          <p>
            Scan or upload packaged commodity images for live Legal Metrology AI OCR compliance checking.
          </p>
        </div>

        <div className="assignment-badge">
          Assignment #ASG-1029
        </div>
      </div>

      <div className="scan-layout">

        {/* LEFT - SCANNER */}

        <div className="scan-card">

          <div className="scan-card-header">
            <div>
              <h2>AI Package Scanner</h2>

              <p>
                Upload package label image or enter details manually.
              </p>
            </div>

            <div className="scanner-status">
              {loading ? "Processing AI OCR..." : "Ready"}
            </div>
          </div>

          {/* SCAN MODE */}

          <div className="scan-tabs">

            <button
              className={scanMode === "qr" ? "active" : ""}
              onClick={() => setScanMode("qr")}
            >
              AI Label Scanner
            </button>

            <button
              className={scanMode === "manual" ? "active" : ""}
              onClick={() => setScanMode("manual")}
            >
              Manual Entry
            </button>

          </div>

          {scanMode === "qr" ? (

            <div className="scanner-area">

              {!scanned ? (
                <>
                  <div className="scanner-frame" style={{ position: "relative", cursor: "pointer" }}>

                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>

                    <div className="scanner-line"></div>

                    <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", cursor: "pointer" }}>
                      <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                      <div className="scanner-placeholder" style={{ fontSize: "16px" }}>
                        {loading ? "AI OCR Analysing..." : "Click or Drag Image Here"}
                      </div>
                    </label>

                  </div>

                  <h3>Upload Package Label Image</h3>

                  <p>
                    Select an image file to trigger full Legal Metrology Rule compliance evaluation.
                  </p>

                  <label className="start-scan-btn" style={{ display: "inline-block", textAlign: "center", cursor: "pointer" }}>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                    {loading ? "Analyzing..." : "Choose Image for AI Scan"}
                  </label>

                  {error && <p style={{ color: "#dc2626", marginTop: "12px", fontWeight: 600 }}>{error}</p>}
                </>
              ) : (

                <div className="scan-success">

                  <div className="success-icon" style={{ backgroundColor: scanResult?.status === "compliant" ? "#22c55e" : "#ef4444" }}>
                    {scanResult?.status === "compliant" ? "✓" : "!"}
                  </div>

                  <h3>{scanResult?.status === "compliant" ? "Compliant Product Detected" : "Non-Compliant Product Detected"}</h3>

                  <p>
                    Score: <strong>{scanResult?.score}%</strong> | Status: <strong>{scanResult?.status?.toUpperCase()}</strong>
                  </p>

                  <div className="detected-code" style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div><span>Product Name:</span> <strong>{scanResult?.name}</strong></div>
                    <div><span>Brand:</span> <strong>{scanResult?.brand}</strong></div>
                    <div><span>MRP:</span> <strong>{scanResult?.extracted_data?.mrp || "Not Found"}</strong></div>
                    <div><span>Net Qty:</span> <strong>{scanResult?.extracted_data?.net_weight || "Not Found"}</strong></div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                    <button
                      className="rescan-btn"
                      onClick={handleReset}
                    >
                      Scan Another
                    </button>

                    <button
                      className="start-scan-btn"
                      onClick={() => navigate("/inspector/inspection-details/INS-1029")}
                    >
                      View Details
                    </button>
                  </div>

                </div>

              )}

            </div>

          ) : (

            /* MANUAL ENTRY */

            <form className="manual-form" onSubmit={continueManualInspection}>

              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                    name="productName"
                  placeholder="Enter product name"
                    value={manualProduct.productName}
                    onChange={updateManualProduct}
                    required
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="Brand name"
                    value={manualProduct.brand}
                    onChange={updateManualProduct}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>

                  <select name="category" value={manualProduct.category} onChange={updateManualProduct} required>
                    <option>Select category</option>
                    <option>Packaged Food</option>
                    <option>Dairy</option>
                    <option>Edible Oil</option>
                    <option>Beverages</option>
                    <option>Food Grains</option>
                    <option>Other</option>
                  </select>
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Batch Number</label>
                  <input
                    type="text"
                    name="batchNumber"
                    placeholder="Batch number"
                    value={manualProduct.batchNumber}
                    onChange={updateManualProduct}
                  />
                </div>

                <div className="form-group">
                  <label>Net Quantity</label>
                  <input
                    type="text"
                    name="netQuantity"
                    placeholder="Example: 100 g"
                    value={manualProduct.netQuantity}
                    onChange={updateManualProduct}
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>MRP</label>
                  <input
                    type="text"
                    name="mrp"
                    placeholder="₹ 0.00"
                    value={manualProduct.mrp}
                    onChange={updateManualProduct}
                  />
                </div>

                <div className="form-group">
                  <label>Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    placeholder="Manufacturer name"
                    value={manualProduct.manufacturer}
                    onChange={updateManualProduct}
                  />
                </div>

              </div>

              <button type="submit" className="manual-submit-btn">
                Continue Inspection
              </button>

            </form>

          )}

        </div>

        {/* RIGHT - INSTRUCTIONS */}

        <div className="scan-right">

          {/* ASSIGNMENT */}

          <div className="info-card">

            <div className="info-card-title">
              <h2>Current Assignment</h2>
            </div>

            <div className="assignment-details">

              <div>
                <span>Assignment ID</span>
                <strong>ASG-1029</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>Chennai</strong>
              </div>

              <div>
                <span>Commodity Type</span>
                <strong>Packaged Food</strong>
              </div>

              <div>
                <span>Priority</span>
                <strong className="priority-high">
                  High
                </strong>
              </div>

            </div>

          </div>

          {/* INSTRUCTIONS */}

          <div className="info-card">

            <div className="info-card-title">
              <h2>Inspection Steps</h2>
            </div>

            <div className="inspection-steps">

              <div className="step active-step">

                <div className="step-number">
                  1
                </div>

                <div>
                  <strong>Scan Product</strong>
                  <span>
                    Identify the packaged commodity.
                  </span>
                </div>

              </div>

              <div className="step">

                <div className="step-number">
                  2
                </div>

                <div>
                  <strong>Capture Evidence</strong>
                  <span>
                    Take package images and documents.
                  </span>
                </div>

              </div>

              <div className="step">

                <div className="step-number">
                  3
                </div>

                <div>
                  <strong>Verify Rules</strong>
                  <span>
                    Check applicable declarations.
                  </span>
                </div>

              </div>

              <div className="step">

                <div className="step-number">
                  4
                </div>

                <div>
                  <strong>Submit Report</strong>
                  <span>
                    Generate the inspection report.
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* TIP */}

          <div className="scan-tip">

            <div className="tip-icon">
              i
            </div>

            <div>
              <strong>Inspection Tip</strong>

              <p>
                Make sure the package is clearly visible
                and the barcode is not damaged before scanning.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* RECENT SCANS */}

      <div className="recent-scans-card">

        <div className="recent-header">

          <div>
            <h2>Recent Scans</h2>

            <p>
              Products recently scanned by you.
            </p>
          </div>

          <button className="view-history-btn">
            View History
          </button>

        </div>

        <div className="recent-table">

          <div className="recent-row recent-heading">
            <span>Product</span>
            <span>Code</span>
            <span>Category</span>
            <span>Time</span>
            <span>Status</span>
          </div>

          <div className="recent-row">

            <div className="recent-product">
              <strong>ABC Biscuits</strong>
              <small>ABC Foods</small>
            </div>

            <span>8901234567890</span>

            <span>Packaged Food</span>

            <span>11:42 AM</span>

            <span className="scan-complete">
              Completed
            </span>

          </div>

          <div className="recent-row">

            <div className="recent-product">
              <strong>Fresh Milk</strong>
              <small>Daily Dairy</small>
            </div>

            <span>8909876543210</span>

            <span>Dairy</span>

            <span>10:18 AM</span>

            <span className="scan-complete">
              Completed
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ScanProduct;