import React, { useState, useEffect } from "react";
import {
  Eye,
  X,
  Printer,
  User,
  Calendar,
  ShieldAlert,
  Search,
  MessageSquare,
} from "lucide-react";
import "./Complaints.css";

function Complaints() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([
    {
      id: "CMP001",
      product: "ABC Biscuits (400g)",
      user: "Rahul Sharma",
      contact: "rahul.sharma@example.com",
      date: "10 Aug 2026",
      retailer: "Metro Supermarket, Sector 18",
      issue: "Incorrect MRP Display & Overcharging",
      category: "Pricing Infraction",
      description:
        "Purchased biscuits with printed MRP Rs 45. The retailer pasted a price sticker of Rs 55 and charged above statutory MRP. Attached invoice copy.",
      status: "Pending",
      priority: "High",
      assignedOfficer: "Ramesh Sharma (Field Inspector)",
    },
    {
      id: "CMP002",
      product: "XYZ Edible Oil (1L)",
      user: "Priya Nair",
      contact: "priya.nair@example.com",
      date: "14 Aug 2026",
      retailer: "Fresh Mart Traders",
      issue: "Missing Manufacturer Address & Pin Code",
      category: "Mandatory Declarations",
      description:
        "The edible oil pouch does not carry full manufacturing unit address or customer care helpline details required under Legal Metrology Rules.",
      status: "In Review",
      priority: "Medium",
      assignedOfficer: "Priya Nair (Legal Metrology Cell)",
    },
    {
      id: "CMP003",
      product: "Fresh Dairy Milk (500ml)",
      user: "Arun Kumar",
      contact: "arun.k@example.com",
      date: "18 Aug 2026",
      retailer: "Daily Needs Corner",
      issue: "Net Quantity Mismatch",
      category: "Measurement Discrepancy",
      description:
        "Batch sample measured 420ml against the declared net quantity of 500ml. Repeated discrepancy noticed in this batch.",
      status: "Resolved",
      priority: "High",
      assignedOfficer: "Karthik Verma (Verification Officer)",
    },
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedComplaint(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const visibleComplaints = complaints.filter((c) =>
    `${c.id} ${c.product} ${c.user} ${c.issue} ${c.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const updateComplaintStatus = (id, newStatus) => {
    setComplaints((curr) =>
      curr.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="complaints-page">
      <div className="page-header">
        <div>
          <h2>Consumer Grievances & Complaints</h2>
          <p>
            Track, investigate, and resolve statutory violation complaints submitted by consumers.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="complaints-search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search complaints by ID, product, user, or issue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="complaints-table-card">
        <div className="table-responsive-wrapper">
          <table>
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Product</th>
                <th>Complainant</th>
                <th>Reported Issue</th>
                <th>Date</th>
                <th>Status</th>
                <th className="actions-header">Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleComplaints.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    No complaints match your query.
                  </td>
                </tr>
              ) : (
                visibleComplaints.map((complaint) => (
                  <tr key={complaint.id} className="complaint-row">
                    <td>
                      <span className="id-badge">{complaint.id}</span>
                    </td>
                    <td>
                      <div className="product-title">{complaint.product}</div>
                      <div className="category-text">{complaint.category}</div>
                    </td>
                    <td>
                      <div className="user-info">
                        <User size={14} />
                        <span>{complaint.user}</span>
                      </div>
                    </td>
                    <td>
                      <span className="issue-text">{complaint.issue}</span>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        <span>{complaint.date}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-pill status-${complaint.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="complaint-view-btn"
                        onClick={() => setSelectedComplaint(complaint)}
                        title="View Full Complaint Details"
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

      {/* COMPLAINT DETAILS MODAL */}
      {selectedComplaint && (
        <div
          className="complaint-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedComplaint(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="complaint-modal-dialog">
            <div className="complaint-modal-header">
              <div className="header-left">
                <span className="id-badge">{selectedComplaint.id}</span>
                <h3>{selectedComplaint.issue}</h3>
                <div className="modal-meta-row">
                  <span>Product: {selectedComplaint.product}</span>
                  <span>•</span>
                  <span>Submitted: {selectedComplaint.date}</span>
                  <span>•</span>
                  <span
                    className={`status-pill status-${selectedComplaint.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {selectedComplaint.status}
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
                  onClick={() => setSelectedComplaint(null)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="complaint-modal-body">
              {/* Grievance Overview */}
              <div className="complaint-info-grid">
                <div className="info-item">
                  <span className="info-label">Complainant</span>
                  <strong>{selectedComplaint.user}</strong>
                  <span className="info-sub">{selectedComplaint.contact}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Retailer / Location</span>
                  <strong>{selectedComplaint.retailer}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">Violation Category</span>
                  <strong>{selectedComplaint.category}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">Assigned Officer</span>
                  <strong>{selectedComplaint.assignedOfficer}</strong>
                </div>
              </div>

              {/* Statement Description */}
              <div className="statement-box">
                <h4>
                  <MessageSquare size={16} /> Consumer Grievance Statement
                </h4>
                <p>{selectedComplaint.description}</p>
              </div>

              {/* Status Update Controls */}
              <div className="status-action-box">
                <span className="action-box-title">Update Enforcement Status:</span>
                <div className="status-buttons">
                  <button
                    type="button"
                    className={`status-opt-btn pending ${
                      selectedComplaint.status === "Pending" ? "active" : ""
                    }`}
                    onClick={() =>
                      updateComplaintStatus(selectedComplaint.id, "Pending")
                    }
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    className={`status-opt-btn in-review ${
                      selectedComplaint.status === "In Review" ? "active" : ""
                    }`}
                    onClick={() =>
                      updateComplaintStatus(selectedComplaint.id, "In Review")
                    }
                  >
                    In Review
                  </button>
                  <button
                    type="button"
                    className={`status-opt-btn resolved ${
                      selectedComplaint.status === "Resolved" ? "active" : ""
                    }`}
                    onClick={() =>
                      updateComplaintStatus(selectedComplaint.id, "Resolved")
                    }
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>

            <div className="complaint-modal-footer">
              <button
                type="button"
                className="modal-secondary-btn"
                onClick={() => setSelectedComplaint(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="modal-primary-btn"
                onClick={() => {
                  alert(
                    `Enforcement notice queued for complaint ${selectedComplaint.id}.`
                  );
                  setSelectedComplaint(null);
                }}
              >
                <ShieldAlert size={16} />
                <span>Issue Inspection Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Complaints;