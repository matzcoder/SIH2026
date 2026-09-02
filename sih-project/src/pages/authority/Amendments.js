import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Eye,
  Plus,
  X,
  Printer,
  CheckCircle2,
  FileDiff,
  Calendar,
  Search,
  ArrowRight,
} from "lucide-react";
import "./Amendments.css";

function Amendments() {
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.has("rule"));
  const [selectedAmendment, setSelectedAmendment] = useState(null);
  const [search, setSearch] = useState("");
  const [amendments, setAmendments] = useState([
    {
      id: "AMD-001",
      rule: "MRP Display Rule (Rule 6.1)",
      ruleId: "RULE-001",
      oldVersion: "v1.0",
      newVersion: "v1.1",
      status: "Approved",
      date: "15 Aug 2026",
      proposedBy: "Legal Metrology Technical Committee",
      reason:
        "Mandate inclusion of dual pricing declarations (unit sale price per gram/ml) in addition to gross retail price on all packaged commodities over 50g.",
      changes: [
        "Added requirement for unit sale price declaration.",
        "Specified font size minimums based on package volume.",
        "Prohibited obscuring original price stickers.",
      ],
    },
    {
      id: "AMD-002",
      rule: "Net Quantity Declaration",
      ruleId: "RULE-002",
      oldVersion: "v2.0",
      newVersion: "v2.1",
      status: "Pending",
      date: "22 Aug 2026",
      proposedBy: "Standard Weights & Measures Division",
      reason:
        "Standardize metric abbreviations ('g', 'kg', 'ml', 'L') across regional packaging and mandate maximum permissible error (MPE) tolerances.",
      changes: [
        "Strict standardization of unit symbols (disallowing uppercase 'G' or 'KG').",
        "Updated permissible variance table for liquid packaged goods.",
      ],
    },
    {
      id: "AMD-003",
      rule: "Manufacturer Address & Origin Rule",
      ruleId: "RULE-003",
      oldVersion: "v1.2",
      newVersion: "v1.3",
      status: "Approved",
      date: "01 Aug 2026",
      proposedBy: "Enforcement & Compliance Cell",
      reason:
        "Mandate complete postal PIN code, registered email ID, and statutory Country of Origin on front or back panel of all imported and domestic packages.",
      changes: [
        "PIN code made mandatory in manufacturing address block.",
        "Consumer grievance cell email must be verified active.",
      ],
    },
    {
      id: "AMD-004",
      rule: "Veg / Non-Veg Statutory Dietary Logo",
      ruleId: "RULE-006",
      oldVersion: "v1.0",
      newVersion: "v1.1",
      status: "Pending",
      date: "02 Sep 2026",
      proposedBy: "FSSAI & Metrology Harmonization Board",
      reason:
        "Update minimum diameter dimensions for brown cross/circle and green emblem based on total principal display panel surface area.",
      changes: [
        "Defined 8mm minimum diameter for packages exceeding 200cm² display area.",
        "High-contrast border mandated for dark background packages.",
      ],
    },
  ]);

  const [formData, setFormData] = useState({
    rule: searchParams.get("rule") || "",
    oldVersion: "",
    newVersion: "",
    reason: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedAmendment(null);
        setShowForm(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openAmendmentForm = () => {
    setShowForm(true);
    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !formData.rule ||
      !formData.oldVersion ||
      !formData.newVersion ||
      !formData.reason
    ) {
      setFormError("Complete all amendment fields before submitting.");
      return;
    }
    const newAmd = {
      id: `AMD-${String(amendments.length + 1).padStart(3, "0")}`,
      rule: formData.rule,
      ruleId: `RULE-${String(amendments.length + 1).padStart(3, "0")}`,
      oldVersion: formData.oldVersion,
      newVersion: formData.newVersion,
      reason: formData.reason,
      status: "Pending",
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      proposedBy: "Authorized Officer",
      changes: [formData.reason],
    };

    setAmendments((current) => [newAmd, ...current]);
    setFormData({ rule: "", oldVersion: "", newVersion: "", reason: "" });
    setFormError("");
    setShowForm(false);
    setSelectedAmendment(newAmd);
  };

  const updateStatus = (id, newStatus) => {
    setAmendments((curr) =>
      curr.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (selectedAmendment && selectedAmendment.id === id) {
      setSelectedAmendment((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const visibleAmendments = amendments.filter((a) =>
    `${a.id} ${a.rule} ${a.oldVersion} ${a.newVersion} ${a.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="amendments-page">
      <div className="page-header">
        <div>
          <h2>Rule Amendments & Revisions</h2>
          <p>
            Review statutory rule changes, approve pending amendments, and audit rule version history.
          </p>
        </div>

        <button
          type="button"
          className="add-btn"
          onClick={openAmendmentForm}
          aria-expanded={showForm}
        >
          <Plus size={18} />
          <span>New Amendment</span>
        </button>
      </div>

      {showForm && (
        <form className="amendment-form-card" onSubmit={handleSubmit}>
          <h3>Propose New Rule Amendment</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Rule ID or Name</label>
              <input
                placeholder="e.g. MRP Declaration Rule"
                value={formData.rule}
                onChange={(event) =>
                  setFormData({ ...formData, rule: event.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Current Version</label>
              <input
                placeholder="e.g. v1.0"
                value={formData.oldVersion}
                onChange={(event) =>
                  setFormData({ ...formData, oldVersion: event.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>New Proposed Version</label>
              <input
                placeholder="e.g. v1.1"
                value={formData.newVersion}
                onChange={(event) =>
                  setFormData({ ...formData, newVersion: event.target.value })
                }
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Reason for Amendment & Statutory Justification</label>
              <input
                placeholder="Describe statutory reason for amending this rule..."
                value={formData.reason}
                onChange={(event) =>
                  setFormData({ ...formData, reason: event.target.value })
                }
                required
              />
            </div>
          </div>
          {formError && (
            <p className="amendment-form-error" role="alert">
              {formError}
            </p>
          )}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-amendment-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="add-btn">
              Submit Amendment Proposal
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="amendments-search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search amendments by ID, rule name, or version..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Amendments Table */}
      <div className="amendments-table-card">
        <div className="table-responsive-wrapper">
          <table>
            <thead>
              <tr>
                <th>Amendment ID</th>
                <th>Target Rule</th>
                <th>Version Transition</th>
                <th>Proposed Date</th>
                <th>Status</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleAmendments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    No amendments found matching your criteria.
                  </td>
                </tr>
              ) : (
                visibleAmendments.map((item) => (
                  <tr key={item.id} className="amendment-row">
                    <td>
                      <span className="id-badge">{item.id}</span>
                    </td>
                    <td>
                      <div className="rule-title">{item.rule}</div>
                      {item.ruleId && (
                        <div className="rule-ref">{item.ruleId}</div>
                      )}
                    </td>
                    <td>
                      <div className="version-transition">
                        <span className="ver-tag old">{item.oldVersion}</span>
                        <ArrowRight size={14} className="arrow-icon" />
                        <span className="ver-tag new">{item.newVersion}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        <span>{item.date || "August 2026"}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status-pill status-${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="actions-cell">
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="view-btn"
                          onClick={() => setSelectedAmendment(item)}
                          title="View Full Amendment Details"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>

                        {item.status === "Pending" && (
                          <button
                            type="button"
                            className="approve-btn"
                            onClick={() => updateStatus(item.id, "Approved")}
                            title="Approve Amendment"
                          >
                            <CheckCircle2 size={15} />
                            <span>Approve</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AMENDMENT DETAILS MODAL */}
      {selectedAmendment && (
        <div
          className="amendment-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedAmendment(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="amendment-modal-dialog">
            <div className="amendment-modal-header">
              <div className="header-left">
                <span className="id-badge">{selectedAmendment.id}</span>
                <h3>{selectedAmendment.rule}</h3>
                <div className="modal-meta-row">
                  <span>Proposed By: {selectedAmendment.proposedBy || "Legal Metrology Board"}</span>
                  <span>•</span>
                  <span>Date: {selectedAmendment.date || "August 2026"}</span>
                  <span>•</span>
                  <span
                    className={`status-pill status-${selectedAmendment.status.toLowerCase()}`}
                  >
                    {selectedAmendment.status}
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
                  onClick={() => setSelectedAmendment(null)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="amendment-modal-body">
              {/* Version Diff Banner */}
              <div className="version-diff-card">
                <div className="diff-header">
                  <FileDiff size={18} />
                  <span>Rule Version Transition Summary</span>
                </div>
                <div className="diff-body">
                  <div className="diff-box from">
                    <span className="diff-label">Current / Deprecated Version</span>
                    <strong>{selectedAmendment.oldVersion}</strong>
                  </div>
                  <ArrowRight size={22} className="diff-arrow" />
                  <div className="diff-box to">
                    <span className="diff-label">Enacted / Proposed Version</span>
                    <strong>{selectedAmendment.newVersion}</strong>
                  </div>
                </div>
              </div>

              {/* Rationale & Purpose */}
              <div className="modal-section-card">
                <h4>Statutory Rationale & Objectives</h4>
                <p>{selectedAmendment.reason}</p>
              </div>

              {/* Specific Clause Changes */}
              {selectedAmendment.changes && selectedAmendment.changes.length > 0 && (
                <div className="modal-section-card">
                  <h4>Detailed Clause Modifications</h4>
                  <ul className="changes-list">
                    {selectedAmendment.changes.map((change, index) => (
                      <li key={index}>
                        <CheckCircle2 size={16} />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status Update Controls */}
              <div className="amendment-status-card">
                <span>Authority Review Action:</span>
                <div className="action-btns">
                  <button
                    type="button"
                    className={`status-opt-btn approve ${
                      selectedAmendment.status === "Approved" ? "active" : ""
                    }`}
                    onClick={() => updateStatus(selectedAmendment.id, "Approved")}
                  >
                    <CheckCircle2 size={15} />
                    <span>Approve Amendment</span>
                  </button>
                  <button
                    type="button"
                    className={`status-opt-btn reject ${
                      selectedAmendment.status === "Rejected" ? "active" : ""
                    }`}
                    onClick={() => updateStatus(selectedAmendment.id, "Rejected")}
                  >
                    <X size={15} />
                    <span>Reject / Request Revision</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="amendment-modal-footer">
              <button
                type="button"
                className="modal-secondary-btn"
                onClick={() => setSelectedAmendment(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Amendments;