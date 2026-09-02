import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Search,
  Eye,
  ShieldCheck,
  Package,
  ScanLine,
  Filter,
  Check,
  Copy,
  ChevronRight,
  Building2,
} from "lucide-react";
import VegNonVegBadge from "../../components/common/VegNonVegBadge";
import "./Assignments.css";

function Assignments() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All Assignments");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const assignments = [
    {
      id: "INS-1029",
      product: "Britannia Good Day Biscuits 200g",
      category: "Packaged Food & Confectionery",
      storeName: "City MegaMart, T. Nagar",
      location: "Chennai",
      zone: "TN South Zone",
      assignedDate: "22 Aug 2026",
      deadline: "25 Aug 2026",
      daysRemaining: 3,
      priority: "High",
      status: "Pending",
      batchNumber: "BAT-2026-089A",
      complianceRule: "Legal Metrology Act (Sec 18) - MRP & Net Qty",
      dietaryType: "VEG",
    },
    {
      id: "INS-1030",
      product: "Chicken Masala Instant Noodles 70g",
      category: "Packaged Food – Non-Veg Variant",
      storeName: "Reliance Smart Point, RS Puram",
      location: "Coimbatore",
      zone: "West District",
      assignedDate: "21 Aug 2026",
      deadline: "26 Aug 2026",
      daysRemaining: 4,
      priority: "Medium",
      status: "In Progress",
      batchNumber: "NMS-7734-X",
      complianceRule: "FSSAI 2.2.2 + PCR Rule 6 – Veg/Non-Veg Logo & MRP",
      dietaryType: "NON_VEG",
    },
    {
      id: "INS-1031",
      product: "Amul Taaza Homogenised Milk 500ml",
      category: "Dairy & Perishables",
      storeName: "Aavin Milk Depot, Simmakkal",
      location: "Madurai",
      zone: "Central Hub",
      assignedDate: "20 Aug 2026",
      deadline: "24 Aug 2026",
      daysRemaining: 2,
      priority: "High",
      status: "Pending",
      batchNumber: "MK-504-2026",
      complianceRule: "Standard Weights & Measures Act - Expiry & Density",
      dietaryType: "VEG",
    },
    {
      id: "INS-1032",
      product: "Surf Excel Washing Powder 500g",
      category: "Household – Non-Food Commodity",
      storeName: "Sri Murugan Wholesalers",
      location: "Salem",
      zone: "East Market",
      assignedDate: "19 Aug 2026",
      deadline: "23 Aug 2026",
      daysRemaining: 0,
      priority: "Low",
      status: "Completed",
      batchNumber: "HH-8812-B",
      complianceRule: "Legal Metrology Verification - Net Weight & MRP",
      dietaryType: "NON_FOOD",
    },
  ];

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesStatus =
      filter === "All Assignments" || assignment.status === filter;
    const matchesPriority =
      priorityFilter === "All" || assignment.priority === priorityFilter;
    const matchesSearch =
      assignment.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const counts = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "Pending").length,
    inProgress: assignments.filter((a) => a.status === "In Progress").length,
    completed: assignments.filter((a) => a.status === "Completed").length,
  };

  return (
    <div className="assignments-page">
      {/* Header Banner */}
      <div className="assignments-header">
        <div className="header-title-section">
          <div className="badge-wrapper">
            <span className="live-indicator-chip">
              <span className="pulsing-dot"></span>
              Live Inspector Field Hub
            </span>
          </div>
          <h1>My Inspection Assignments</h1>
          <p>
            Track, prioritize, and conduct field inspections assigned by the Legal Metrology Department.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="quick-scan-btn"
            onClick={() => navigate("/inspector/scan-product")}
          >
            <ScanLine size={18} />
            <span>Scan Product / QR</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards (Interactive Filters) */}
      <div className="assignment-stats">
        <div
          className={`assignment-stat ${filter === "All Assignments" ? "active-stat" : ""}`}
          onClick={() => setFilter("All Assignments")}
        >
          <div className="stat-icon-wrapper total-icon">
            <Package size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Assigned</span>
            <strong className="stat-value">{counts.total.toString().padStart(2, "0")}</strong>
          </div>
          <span className="stat-subtext">All active targets</span>
        </div>

        <div
          className={`assignment-stat ${filter === "Pending" ? "active-stat" : ""}`}
          onClick={() => setFilter("Pending")}
        >
          <div className="stat-icon-wrapper pending-icon">
            <AlertCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Action</span>
            <strong className="stat-value">{counts.pending.toString().padStart(2, "0")}</strong>
          </div>
          <span className="stat-subtext text-amber">Needs immediate scan</span>
        </div>

        <div
          className={`assignment-stat ${filter === "In Progress" ? "active-stat" : ""}`}
          onClick={() => setFilter("In Progress")}
        >
          <div className="stat-icon-wrapper in-progress-icon">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <strong className="stat-value">{counts.inProgress.toString().padStart(2, "0")}</strong>
          </div>
          <span className="stat-subtext text-blue">Evidence gathering</span>
        </div>

        <div
          className={`assignment-stat ${filter === "Completed" ? "active-stat" : ""}`}
          onClick={() => setFilter("Completed")}
        >
          <div className="stat-icon-wrapper completed-icon">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <strong className="stat-value">{counts.completed.toString().padStart(2, "0")}</strong>
          </div>
          <span className="stat-subtext text-green">Verified & submitted</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="assignments-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Product Name, ID, Store or Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              ×
            </button>
          )}
        </div>

        <div className="toolbar-controls">
          <div className="filter-group">
            <Filter size={15} className="filter-icon" />
            <select
              className="assignment-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All Assignments">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <AlertTriangle size={15} className="filter-icon" />
            <select
              className="assignment-filter"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Cards List */}
      <div className="assignment-list">
        {filteredAssignments.length === 0 ? (
          <div className="empty-assignments-state">
            <div className="empty-icon-circle">
              <Search size={32} />
            </div>
            <h3>No matching assignments found</h3>
            <p>Try adjusting your search criteria or clear status filters.</p>
            <button
              className="reset-filter-btn"
              onClick={() => {
                setFilter("All Assignments");
                setPriorityFilter("All");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              className={`assignment-card priority-border-${assignment.priority.toLowerCase()}`}
              key={assignment.id}
            >
              {/* Card Top Header */}
              <div className="assignment-card-top">
                <div className="card-identity-wrapper">
                  <div className={`product-avatar-squircle avatar-${assignment.priority.toLowerCase()}`}>
                    <Package size={24} />
                  </div>

                  <div className="product-identity-info">
                    <div className="id-and-category-row">
                      <button
                        className="assignment-id-chip"
                        onClick={(e) => handleCopyId(assignment.id, e)}
                        title="Click to copy ID"
                      >
                        <span className="hash-symbol">#</span>
                        <strong>{assignment.id}</strong>
                        {copiedId === assignment.id ? (
                          <Check size={13} className="copy-icon copied" />
                        ) : (
                          <Copy size={13} className="copy-icon" />
                        )}
                      </button>
                      <span className="category-pill">{assignment.category}</span>
                    </div>

                    <h3 className="product-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {assignment.dietaryType && (
                        <VegNonVegBadge type={assignment.dietaryType} size="sm" showLabel={false} />
                      )}
                      {assignment.product}
                    </h3>
                    <div className="store-location-sub">
                      <Building2 size={13} />
                      <span>{assignment.storeName}</span>
                    </div>
                  </div>
                </div>

                <div className="card-badge-cluster">
                  <span className={`priority-badge priority-${assignment.priority.toLowerCase()}`}>
                    <span className="pulse-dot"></span>
                    {assignment.priority} Priority
                  </span>

                  {assignment.dietaryType && (
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      <VegNonVegBadge type={assignment.dietaryType} size="sm" showLabel={true} />
                    </span>
                  )}

                  {assignment.status !== "Completed" && (
                    <span className={`urgency-pill ${assignment.daysRemaining <= 2 ? "urgent" : ""}`}>
                      <Clock size={12} />
                      {assignment.daysRemaining === 0
                        ? "Due Today"
                        : `${assignment.daysRemaining} days left`}
                    </span>
                  )}
                </div>
              </div>

              {/* 4-Tile Modern Info Grid */}
              <div className="assignment-details-grid">
                {/* Location Tile */}
                <div className="info-tile location-tile">
                  <div className="tile-icon-box">
                    <MapPin size={17} />
                  </div>
                  <div className="tile-content">
                    <span className="tile-label">LOCATION</span>
                    <strong className="tile-value">{assignment.location}</strong>
                    <span className="tile-subtext">{assignment.zone}</span>
                  </div>
                </div>

                {/* Assigned Date Tile */}
                <div className="info-tile assigned-tile">
                  <div className="tile-icon-box">
                    <Calendar size={17} />
                  </div>
                  <div className="tile-content">
                    <span className="tile-label">ASSIGNED DATE</span>
                    <strong className="tile-value">{assignment.assignedDate}</strong>
                    <span className="tile-subtext">Dispatched from HQ</span>
                  </div>
                </div>

                {/* Deadline Tile */}
                <div className="info-tile deadline-tile">
                  <div className="tile-icon-box">
                    <Clock size={17} />
                  </div>
                  <div className="tile-content">
                    <span className="tile-label">DEADLINE</span>
                    <strong className="tile-value">{assignment.deadline}</strong>
                    <span className="tile-subtext">SLA Target</span>
                  </div>
                </div>

                {/* Status Tile */}
                <div className="info-tile status-tile">
                  <div className="tile-icon-box">
                    {assignment.status === "Completed" ? (
                      <CheckCircle2 size={17} />
                    ) : assignment.status === "In Progress" ? (
                      <Clock size={17} />
                    ) : (
                      <AlertCircle size={17} />
                    )}
                  </div>
                  <div className="tile-content">
                    <span className="tile-label">STATUS</span>
                    <div>
                      <span
                        className={`status-chip chip-${assignment.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <span className="status-chip-dot"></span>
                        {assignment.status}
                      </span>
                    </div>
                    <span className="tile-subtext">
                      {assignment.status === "Completed"
                        ? "Audit Logged"
                        : assignment.status === "In Progress"
                        ? "In Review"
                        : "Awaiting Action"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compliance Standard Banner */}
              <div className="compliance-sub-bar">
                <div className="compliance-tag-left">
                  <ShieldCheck size={14} className="shield-icon" />
                  <span className="rule-text">{assignment.complianceRule}</span>
                </div>
                <div className="batch-tag-right">
                  <span>Batch:</span>
                  <code>{assignment.batchNumber}</code>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="assignment-actions">
                <div className="action-meta-left">
                  <span className="action-hint">
                    Official inspection task under Legal Metrology Dept
                  </span>
                </div>

                <div className="action-buttons-group">
                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(`/inspector/inspection-details/${assignment.id}`)
                    }
                  >
                    <Eye size={16} />
                    <span>View Details</span>
                  </button>

                  {assignment.status !== "Completed" ? (
                    <button
                      className="start-btn"
                      onClick={() =>
                        navigate(
                          assignment.status === "Pending"
                            ? "/inspector/scan-product"
                            : `/inspector/inspection-details/${assignment.id}`
                        )
                      }
                    >
                      <ScanLine size={16} />
                      <span>
                        {assignment.status === "Pending"
                          ? "Start Inspection"
                          : "Continue Inspection"}
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  ) : (
                    <button
                      className="completed-report-btn"
                      onClick={() =>
                        navigate(`/inspector/inspection-details/${assignment.id}`)
                      }
                    >
                      <CheckCircle2 size={16} />
                      <span>View Report</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Assignments;