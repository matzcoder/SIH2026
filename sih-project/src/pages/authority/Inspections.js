import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Eye,
  Plus,
  X,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  FileCheck,
  Search,
} from "lucide-react";
import "./Inspections.css";

function Inspections() {
  const [searchParams] = useSearchParams();
  const isEvidenceView = searchParams.get("view") === "evidence";
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ product: "", inspector: "", date: "" });
  const [inspections, setInspections] = useState([
    {
      id: "INS001",
      product: "ABC Biscuits (400g)",
      category: "Bakery & Confectionery",
      inspector: "Ramesh Sharma",
      date: "12 Aug 2026",
      score: "95%",
      status: "Completed",
      evidenceImage: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80",
      checks: [
        { label: "MRP Declaration (Rule 6.1)", status: "Pass", detail: "Rs 45.00 clearly visible, inclusive of all taxes" },
        { label: "Veg / Non-Veg Statutory Logo", status: "Pass", detail: "Green square & circle symbol verified (8mm)" },
        { label: "Net Quantity Declaration", status: "Pass", detail: "400 g printed in prescribed font height" },
        { label: "Manufacturer Address", status: "Pass", detail: "Full postal address & contact info present" },
        { label: "Consumer Care Details", status: "Pass", detail: "Toll-free number & email active" },
      ],
      notes: "Packaged commodity is in full compliance with Legal Metrology Rules 2011. No violations observed.",
    },
    {
      id: "INS002",
      product: "XYZ Refined Edible Oil (1L)",
      category: "Edible Oils",
      inspector: "Priya Nair",
      date: "14 Aug 2026",
      score: "78%",
      status: "Under Review",
      evidenceImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80",
      checks: [
        { label: "MRP Declaration (Rule 6.1)", status: "Pass", detail: "Rs 180.00 declared" },
        { label: "Veg / Non-Veg Statutory Logo", status: "Warning", detail: "Logo contrast is borderline with packaging background" },
        { label: "Net Quantity Declaration", status: "Pass", detail: "1 L declared with equivalent weight" },
        { label: "Manufacturer Address", status: "Warning", detail: "Pin code missing in registered address" },
        { label: "Consumer Care Details", status: "Pass", detail: "Helpline available" },
      ],
      notes: "Minor labeling discrepancies detected. Notice sent to manufacturer for contrast correction on dietary logo.",
    },
    {
      id: "INS003",
      product: "Fresh Dairy Milk (500ml)",
      category: "Dairy Products",
      inspector: "Karthik Verma",
      date: "15 Aug 2026",
      score: "62%",
      status: "Violation Found",
      evidenceImage: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80",
      checks: [
        { label: "MRP Declaration (Rule 6.1)", status: "Fail", detail: "Dual pricing sticker detected over original print" },
        { label: "Veg / Non-Veg Statutory Logo", status: "Pass", detail: "Standard green emblem present" },
        { label: "Net Quantity Declaration", status: "Pass", detail: "500 ml printed clearly" },
        { label: "Manufacturer Address", status: "Pass", detail: "Dairy plant address verified" },
        { label: "Consumer Care Details", status: "Fail", detail: "Helpline phone number missing digits" },
      ],
      notes: "Severe violation: Overwriting MRP violates Section 18 of Legal Metrology Act. Show cause notice initiated.",
    },
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedInspection(null);
        setShowForm(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const evidenceRecords = inspections.filter((inspection) => inspection.status !== "Completed");
  const baseList = isEvidenceView ? evidenceRecords : inspections;

  const visibleInspections = baseList.filter((item) => {
    return `${item.id} ${item.product} ${item.inspector} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const createInspection = (event) => {
    event.preventDefault();
    if (!formData.product || !formData.inspector || !formData.date) return;
    const inspection = {
      id: `INS${String(inspections.length + 1).padStart(3, "0")}`,
      ...formData,
      category: "General Packaged Commodity",
      score: "Pending",
      status: "Scheduled",
      checks: [
        { label: "MRP Declaration", status: "Pending", detail: "Awaiting inspection scan" },
        { label: "Veg / Non-Veg Logo", status: "Pending", detail: "Awaiting inspection scan" },
        { label: "Net Quantity", status: "Pending", detail: "Awaiting inspection scan" },
      ],
      notes: "Scheduled field inspection assigned to officer.",
    };
    setInspections((current) => [inspection, ...current]);
    setSelectedInspection(inspection);
    setFormData({ product: "", inspector: "", date: "" });
    setShowForm(false);
  };

  return (
    <div className="inspections-page">
      {/* Header */}
      <div className="inspection-header">
        <div>
          <h2>{isEvidenceView ? "Inspection Evidence & Violations" : "Inspection Management"}</h2>
          <p>
            {isEvidenceView
              ? "Review captured visual evidence and non-compliance records from field officers."
              : "Monitor verified inspections, compliance scores, and schedule field audits."}
          </p>
        </div>

        <button
          type="button"
          className="new-inspection-btn"
          onClick={() => setShowForm((current) => !current)}
        >
          <Plus size={18} />
          <span>{showForm ? "Close Form" : "New Inspection"}</span>
        </button>
      </div>

      {/* New Inspection Form */}
      {showForm && (
        <form className="inspection-form-card" onSubmit={createInspection}>
          <h3>Schedule Field Inspection</h3>
          <div className="form-fields-row">
            <div className="field-group">
              <label>Product Name & Size</label>
              <input
                placeholder="e.g. Premium Basmati Rice (5kg)"
                value={formData.product}
                onChange={(event) =>
                  setFormData({ ...formData, product: event.target.value })
                }
                required
              />
            </div>
            <div className="field-group">
              <label>Assigned Inspector</label>
              <input
                placeholder="Inspector Name"
                value={formData.inspector}
                onChange={(event) =>
                  setFormData({ ...formData, inspector: event.target.value })
                }
                required
              />
            </div>
            <div className="field-group">
              <label>Inspection Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(event) =>
                  setFormData({ ...formData, date: event.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="form-actions-row">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="new-inspection-btn">
              Create & Assign Inspection
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="inspection-search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by ID, product, inspector, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Card */}
      <div className="inspection-table-card">
        <div className="table-responsive-wrapper">
          <table>
            <thead>
              <tr>
                {isEvidenceView ? (
                  <>
                    <th>Evidence ID</th>
                    <th>Product</th>
                    <th>Inspector</th>
                    <th>Date Captured</th>
                    <th>Evidence Status</th>
                    <th className="actions-header">Action</th>
                  </>
                ) : (
                  <>
                    <th>Inspection ID</th>
                    <th>Product</th>
                    <th>Inspector</th>
                    <th>Date</th>
                    <th>Compliance Score</th>
                    <th>Status</th>
                    <th className="actions-header">Action</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {visibleInspections.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    No inspection records found.
                  </td>
                </tr>
              ) : (
                visibleInspections.map((item) => (
                  <tr key={item.id} className="inspection-row">
                    <td>
                      <span className="id-badge">
                        {isEvidenceView
                          ? `EVD-${item.id.replace("INS", "")}`
                          : item.id}
                      </span>
                    </td>
                    <td>
                      <div className="product-title">{item.product}</div>
                      {item.category && (
                        <div className="product-category">{item.category}</div>
                      )}
                    </td>
                    <td>
                      <div className="inspector-info">
                        <User size={14} />
                        <span>{item.inspector}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        <span>{item.date}</span>
                      </div>
                    </td>
                    {!isEvidenceView && (
                      <td>
                        <span
                          className={`score-badge ${
                            item.score.includes("%") && parseInt(item.score) >= 80
                              ? "score-high"
                              : item.score.includes("%") && parseInt(item.score) >= 70
                              ? "score-med"
                              : "score-low"
                          }`}
                        >
                          {item.score}
                        </span>
                      </td>
                    )}

                    <td>
                      <span
                        className={`status-pill status-${item.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {isEvidenceView ? "Evidence Available" : item.status}
                      </span>
                    </td>

                    <td className="actions-cell">
                      <button
                        type="button"
                        className="inspection-view-btn"
                        onClick={() => setSelectedInspection(item)}
                        title="View Full Inspection Details"
                      >
                        <Eye size={15} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTION DETAILS MODAL */}
      {selectedInspection && (
        <div
          className="inspection-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInspection(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="inspection-modal-dialog">
            <div className="inspection-modal-header">
              <div className="header-left">
                <span className="id-badge">{selectedInspection.id}</span>
                <h3>{selectedInspection.product}</h3>
                <div className="modal-meta-row">
                  <span>Inspector: {selectedInspection.inspector}</span>
                  <span>•</span>
                  <span>Date: {selectedInspection.date}</span>
                  <span>•</span>
                  <span
                    className={`status-pill status-${selectedInspection.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {selectedInspection.status}
                  </span>
                </div>
              </div>

              <div className="header-actions">
                <button
                  type="button"
                  className="modal-icon-btn"
                  onClick={() => window.print()}
                  title="Print"
                >
                  <Printer size={18} />
                </button>
                <button
                  type="button"
                  className="modal-icon-btn close"
                  onClick={() => setSelectedInspection(null)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="inspection-modal-body">
              {/* Compliance Score Bar */}
              <div className="score-summary-card">
                <div className="score-num-box">
                  <span className="score-label">Compliance Score</span>
                  <span className="score-value">{selectedInspection.score}</span>
                </div>
                <div className="score-summary-text">
                  <strong>
                    {selectedInspection.score.includes("%") &&
                    parseInt(selectedInspection.score) >= 80
                      ? "Compliant with Legal Metrology Standards"
                      : "Statutory Infractions Detected"}
                  </strong>
                  <p>{selectedInspection.notes}</p>
                </div>
              </div>

              {/* Checklist Parameters */}
              <div className="details-section">
                <h4>
                  <FileCheck size={18} /> Statutory Declaration Verification
                </h4>
                <div className="checklist-table-wrapper">
                  <table className="checklist-table">
                    <thead>
                      <tr>
                        <th>Rule / Declaration</th>
                        <th>Status</th>
                        <th>Observation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedInspection.checks || []).map((check, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{check.label}</strong>
                          </td>
                          <td>
                            <span
                              className={`check-status-tag ${check.status.toLowerCase()}`}
                            >
                              {check.status === "Pass" && <CheckCircle2 size={13} />}
                              {check.status === "Warning" && <AlertTriangle size={13} />}
                              {check.status === "Fail" && <AlertTriangle size={13} />}
                              {check.status}
                            </span>
                          </td>
                          <td className="check-detail">{check.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Officer Notes & Signature */}
              <div className="inspector-sign-block">
                <div className="sign-info">
                  <span className="sign-label">Certified Field Inspector</span>
                  <strong>{selectedInspection.inspector}</strong>
                  <span>Enforcement Badge ID: LM-OFF-2026</span>
                </div>
                <div className="sign-stamp">
                  <ShieldCheck size={24} />
                  <span>OFFICIALLY RECORDED</span>
                </div>
              </div>
            </div>

            <div className="inspection-modal-footer">
              <button
                type="button"
                className="modal-secondary-btn"
                onClick={() => setSelectedInspection(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="modal-primary-btn"
                onClick={() => {
                  alert(
                    `Inspection record ${selectedInspection.id} verified & archived.`
                  );
                  setSelectedInspection(null);
                }}
              >
                <CheckCircle2 size={16} />
                <span>Confirm & Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inspections;