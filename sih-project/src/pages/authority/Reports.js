import React, { useState, useEffect } from "react";
import {
  Eye,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Printer,
  Calendar,
  ShieldCheck,
  Filter,
  Search,
  Plus,
  BarChart3,
  Award,
  Building2,
} from "lucide-react";
import "./Reports.css";

function Reports() {
  const [reports, setReports] = useState([
    {
      id: "RPT-001",
      title: "Monthly Legal Metrology Compliance Report",
      type: "Compliance",
      date: "20 Aug 2026",
      status: "Generated",
      period: "August 2026",
      author: "Legal Metrology Authority - Enforcement Wing",
      totalInspections: 248,
      complianceRate: "91.4%",
      violationsCount: 21,
      resolvedViolations: 18,
      rulesChecked: 8,
      topViolations: [
        { rule: "MRP Declaration (Rule 6.1)", count: 9, severity: "High", status: "Notice Issued" },
        { rule: "Veg / Non-Veg Statutory Logo", count: 7, severity: "High", status: "Penalty Imposed" },
        { rule: "Net Quantity Mismatch", count: 3, severity: "Medium", status: "Warning" },
        { rule: "Manufacturer Address Incomplete", count: 2, severity: "Medium", status: "Resolved" },
      ],
      summary:
        "Comprehensive statutory compliance audit covering 248 packaged goods across northern and central distribution zones. 91.4% of inspected items adhered to Legal Metrology (Packaged Commodities) Rules.",
      recommendations:
        "Deploy automated camera scanning at wholesale checkpoints and expedite amendment review for mandatory dual-language price declarations.",
    },
    {
      id: "RPT-002",
      title: "Statutory Packaging Violation & Penalty Report",
      type: "Violation",
      date: "18 Aug 2026",
      period: "Q2 2026",
      author: "Chief Enforcement Officer",
      status: "Generated",
      totalInspections: 195,
      complianceRate: "79.2%",
      violationsCount: 41,
      resolvedViolations: 29,
      rulesChecked: 6,
      topViolations: [
        { rule: "Absence of Veg / Non-Veg Logo", count: 18, severity: "High", status: "Penalty Imposed" },
        { rule: "Misleading Font Size on Net Qty", count: 14, severity: "High", status: "Notice Issued" },
        { rule: "Missing Consumer Care Helpline", count: 9, severity: "Medium", status: "Warning" },
      ],
      summary:
        "Special audit focused on high-risk FMCG packaged items. Identified repeated infractions in edible oil and confectionary packaging categories.",
      recommendations:
        "Issue show-cause notices to recurring non-compliant packaging vendors and conduct mandatory re-inspection within 14 days.",
    },
    {
      id: "RPT-003",
      title: "Product Inspection Field Summary",
      type: "Inspection",
      date: "15 Aug 2026",
      period: "1st - 15th Aug 2026",
      author: "Field Operations Division",
      status: "Generated",
      totalInspections: 312,
      complianceRate: "94.8%",
      violationsCount: 16,
      resolvedViolations: 15,
      rulesChecked: 7,
      topViolations: [
        { rule: "Obscured Expiry Date", count: 8, severity: "Medium", status: "Resolved" },
        { rule: "Dual Pricing Discrepancy", count: 5, severity: "High", status: "Notice Issued" },
        { rule: "Country of Origin Missing", count: 3, severity: "Medium", status: "Warning" },
      ],
      summary:
        "Field inspection reports aggregated from 12 certified inspectors in retail supermarkets and e-commerce distribution centers.",
      recommendations:
        "Incentivize top compliant manufacturers with Legal Metrology Green Seal certifications and streamline AI mobile scanner adoption.",
    },
    {
      id: "RPT-004",
      title: "Consumer Grievance & Public Complaint Audit",
      type: "Complaint",
      date: "12 Aug 2026",
      period: "July - August 2026",
      author: "Consumer Grievance Redressal Cell",
      status: "Generated",
      totalInspections: 84,
      complianceRate: "86.9%",
      violationsCount: 11,
      resolvedViolations: 11,
      rulesChecked: 5,
      topViolations: [
        { rule: "Overcharging above MRP", count: 6, severity: "High", status: "Penalty Imposed" },
        { rule: "Deceptive Packaging Volume", count: 3, severity: "Medium", status: "Resolved" },
        { rule: "Illegible Batch Numbers", count: 2, severity: "Low", status: "Resolved" },
      ],
      summary:
        "Direct public complaints received through the Legal Metrology Portal. 100% of reported high-priority complaints have been investigated on-site.",
      recommendations:
        "Enhance consumer portal grievance response SLA to under 48 hours with automated inspector assignment.",
    },
  ]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Reports");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newReportForm, setNewReportForm] = useState({
    title: "",
    type: "Compliance",
    period: "Current Month",
  });

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedReport(null);
        setShowGenerateModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const visibleReports = reports.filter((report) => {
    const matchesSearch = `${report.id} ${report.title} ${report.type} ${report.period || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch && (type === "All Reports" || report.type === type);
  });

  const generateReport = (e) => {
    if (e) e.preventDefault();
    const newId = `RPT-${String(reports.length + 1).padStart(3, "0")}`;
    const generatedReport = {
      id: newId,
      title: newReportForm.title.trim() || `Automated ${newReportForm.type} Audit Report`,
      type: newReportForm.type,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      status: "Generated",
      period: newReportForm.period || "August 2026",
      author: "Legal Metrology Authority - AI Compliance Engine",
      totalInspections: Math.floor(Math.random() * 150) + 100,
      complianceRate: `${(Math.random() * 15 + 83).toFixed(1)}%`,
      violationsCount: Math.floor(Math.random() * 20) + 5,
      resolvedViolations: Math.floor(Math.random() * 10) + 5,
      rulesChecked: 7,
      topViolations: [
        { rule: "MRP Declaration (Rule 6.1)", count: 5, severity: "High", status: "Notice Issued" },
        { rule: "Veg / Non-Veg Logo Compliance", count: 4, severity: "High", status: "Pending Review" },
        { rule: "Net Quantity Verification", count: 2, severity: "Medium", status: "Warning" },
      ],
      summary: `Automated ${newReportForm.type.toLowerCase()} report generated on ${new Date().toLocaleDateString()}. Data synchronized from connected mobile inspection terminals.`,
      recommendations: "Continue standard monitoring protocols and verify flagged packaging lines.",
    };

    setReports((current) => [generatedReport, ...current]);
    setShowGenerateModal(false);
    setNewReportForm({ title: "", type: "Compliance", period: "Current Month" });
    setSelectedReport(generatedReport);
  };

  const downloadReport = (report) => {
    const divider = "==========================================================================";
    const content = `${divider}
GOVERNMENT OF INDIA - LEGAL METROLOGY ENFORCEMENT PORTAL
OFFICIAL COMPLIANCE & INSPECTION REPORT
${divider}

REPORT IDENTIFIER : ${report.id}
REPORT TITLE      : ${report.title}
REPORT TYPE       : ${report.type.toUpperCase()}
AUDIT PERIOD      : ${report.period || "August 2026"}
GENERATED DATE    : ${report.date}
AUTHORITY UNIT    : ${report.author || "Legal Metrology Division"}
STATUS            : ${report.status.toUpperCase()}

${divider}
EXECUTIVE SUMMARY & KEY AUDIT METRICS
${divider}
- Total Packaged Goods Inspected : ${report.totalInspections || 248}
- Statutory Compliance Rate      : ${report.complianceRate || "91.4%"}
- Total Violations Flagged       : ${report.violationsCount || 21}
- Violations Resolved / Notices  : ${report.resolvedViolations || 18}
- Total Rules Verified           : ${report.rulesChecked || 8}

EXECUTIVE SUMMARY:
${report.summary || "All evaluated commodities were audited against mandatory Legal Metrology declarations."}

${divider}
TOP DETECTED STATUTORY INFRACTIONS
${divider}
${(report.topViolations || [])
  .map(
    (v, i) =>
      `${i + 1}. ${v.rule} | Detected: ${v.count} cases | Severity: ${v.severity} | Action: ${v.status}`
  )
  .join("\n")}

${divider}
AUTHORITY RECOMMENDATIONS & ENFORCEMENT DIRECTIVES
${divider}
${report.recommendations || "Enforce mandatory field verification and follow up on pending compliance notices."}

${divider}
AUTHENTICATION SEAL:
Digitally signed & verified by Legal Metrology Compliance Engine.
Ref ID: SEC-${report.id}-${Date.now().toString(36).toUpperCase()}
${divider}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.id}_${report.type}_Report.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h2>Legal Metrology Reports</h2>
          <p>
            Generate, view, and export official packaging compliance, violation, and audit reports.
          </p>
        </div>

        <button
          className="generate-btn"
          onClick={() => setShowGenerateModal(true)}
          aria-label="Generate new report"
        >
          <Plus size={18} />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="report-stats">
        <div className="report-stat-card">
          <div className="stat-card-icon compliance">
            <FileText size={22} />
          </div>
          <div className="stat-card-info">
            <h4>Total Reports</h4>
            <h2>{reports.length + 244}</h2>
            <span className="stat-subtext">Across all inspection sectors</span>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="stat-card-icon success">
            <ShieldCheck size={22} />
          </div>
          <div className="stat-card-info">
            <h4>Avg. Compliance Rate</h4>
            <h2>91.4%</h2>
            <span className="stat-subtext text-success">+2.3% this month</span>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="stat-card-icon warning">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-card-info">
            <h4>Violations Logged</h4>
            <h2>89</h2>
            <span className="stat-subtext">Action notices dispatched</span>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="stat-card-icon info">
            <BarChart3 size={22} />
          </div>
          <div className="stat-card-info">
            <h4>Commodities Audited</h4>
            <h2>1,420+</h2>
            <span className="stat-subtext">Packaged goods verified</span>
          </div>
        </div>
      </div>

      {/* Tools / Filters */}
      <div className="report-tools">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by report ID, title, or type..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-select-wrapper">
          <Filter size={18} className="filter-icon" />
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="All Reports">All Categories</option>
            <option value="Compliance">Compliance Reports</option>
            <option value="Violation">Violation Reports</option>
            <option value="Inspection">Inspection Summaries</option>
            <option value="Complaint">Consumer Grievances</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-table-card">
        <div className="table-responsive-wrapper">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Report Title</th>
                <th>Category</th>
                <th>Date Generated</th>
                <th>Audit Period</th>
                <th>Status</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    <FileText size={36} className="empty-icon" />
                    <p>No reports found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                visibleReports.map((report) => (
                  <tr key={report.id} className="report-table-row">
                    <td className="report-id-cell">
                      <span className="id-badge">{report.id}</span>
                    </td>

                    <td className="report-name-cell">
                      <div className="report-title-text">{report.title}</div>
                      <div className="report-author-text">{report.author || "Legal Metrology Wing"}</div>
                    </td>

                    <td>
                      <span
                        className={`type-badge type-${report.type.toLowerCase()}`}
                      >
                        {report.type}
                      </span>
                    </td>

                    <td className="report-date-cell">
                      <div className="date-wrapper">
                        <Calendar size={14} />
                        <span>{report.date}</span>
                      </div>
                    </td>

                    <td>{report.period || "August 2026"}</td>

                    <td>
                      <span className="generated-status">
                        <CheckCircle2 size={13} />
                        {report.status}
                      </span>
                    </td>

                    <td className="actions-cell">
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="view-btn"
                          onClick={() => setSelectedReport(report)}
                          title="View Full Report"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          className="download-btn"
                          onClick={() => downloadReport(report)}
                          title="Download Report File"
                        >
                          <Download size={15} />
                          <span>Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REPORT DETAILS MODAL */}
      {selectedReport && (
        <div
          className="report-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReport(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
        >
          <div className="report-modal-dialog">
            {/* Modal Header */}
            <div className="report-modal-header">
              <div className="header-left">
                <div className="report-id-tag">
                  <FileText size={16} />
                  <span>{selectedReport.id}</span>
                </div>
                <h3 id="report-modal-title">{selectedReport.title}</h3>
                <div className="modal-header-meta">
                  <span className={`type-badge type-${selectedReport.type.toLowerCase()}`}>
                    {selectedReport.type}
                  </span>
                  <span>•</span>
                  <span className="meta-item">
                    <Calendar size={14} /> {selectedReport.date}
                  </span>
                  <span>•</span>
                  <span className="meta-item">
                    <Building2 size={14} /> {selectedReport.author || "Legal Metrology Department"}
                  </span>
                </div>
              </div>

              <div className="header-right-actions">
                <button
                  type="button"
                  className="modal-icon-btn"
                  onClick={handlePrint}
                  title="Print Report"
                >
                  <Printer size={18} />
                </button>
                <button
                  type="button"
                  className="modal-icon-btn download"
                  onClick={() => downloadReport(selectedReport)}
                  title="Download Report"
                >
                  <Download size={18} />
                </button>
                <button
                  type="button"
                  className="modal-icon-btn close"
                  onClick={() => setSelectedReport(null)}
                  title="Close Dialog"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="report-modal-body printable-area">
              {/* Official Seal Banner */}
              <div className="official-banner">
                <div className="banner-badge">
                  <ShieldCheck size={20} />
                  <div>
                    <strong>GOVERNMENT LEGAL METROLOGY AUDIT RECORD</strong>
                    <p>Verified Statutory Declaration under Packaged Commodities Rules 2011</p>
                  </div>
                </div>
                <div className="banner-status-tag">
                  <CheckCircle2 size={16} /> Official Record
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="modal-metrics-grid">
                <div className="metric-box">
                  <span className="metric-label">Compliance Rate</span>
                  <span className="metric-val score">{selectedReport.complianceRate || "91.4%"}</span>
                  <span className="metric-footer text-success">Target: 90%+</span>
                </div>

                <div className="metric-box">
                  <span className="metric-label">Total Inspected</span>
                  <span className="metric-val">{selectedReport.totalInspections || 248}</span>
                  <span className="metric-footer">Packaged items</span>
                </div>

                <div className="metric-box">
                  <span className="metric-label">Violations Detected</span>
                  <span className="metric-val warning">{selectedReport.violationsCount || 21}</span>
                  <span className="metric-footer">Notices issued</span>
                </div>

                <div className="metric-box">
                  <span className="metric-label">Resolved / Actioned</span>
                  <span className="metric-val success">{selectedReport.resolvedViolations || 18}</span>
                  <span className="metric-footer">85.7% resolution</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="modal-section-card">
                <h4 className="section-title">
                  <FileText size={18} /> Executive Summary
                </h4>
                <p className="summary-paragraph">
                  {selectedReport.summary ||
                    "During the audit period, compliance inspectors evaluated retail packaged commodities across designated zones. AI-assisted computer vision and manual verifications were conducted to ensure strict adherence to price, weight, nutritional, and dietary declaration statutes."}
                </p>
              </div>

              {/* Top Violations & Rules Breakdown */}
              <div className="modal-section-card">
                <h4 className="section-title">
                  <AlertTriangle size={18} /> Rule Infraction & Breakdown Summary
                </h4>
                <div className="modal-table-wrapper">
                  <table className="modal-inner-table">
                    <thead>
                      <tr>
                        <th>Statutory Rule</th>
                        <th>Infractions Found</th>
                        <th>Severity</th>
                        <th>Enforcement Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedReport.topViolations || [
                        { rule: "MRP Declaration (Rule 6.1)", count: 9, severity: "High", status: "Notice Issued" },
                        { rule: "Veg / Non-Veg Statutory Logo", count: 7, severity: "High", status: "Penalty Imposed" },
                        { rule: "Net Quantity Mismatch", count: 3, severity: "Medium", status: "Warning" },
                        { rule: "Manufacturer Address Missing", count: 2, severity: "Medium", status: "Resolved" },
                      ]).map((item, idx) => (
                        <tr key={idx}>
                          <td className="rule-name-cell">
                            <strong>{item.rule}</strong>
                          </td>
                          <td>
                            <span className="count-badge">{item.count} items</span>
                          </td>
                          <td>
                            <span
                              className={`severity-tag ${item.severity.toLowerCase()}`}
                            >
                              {item.severity}
                            </span>
                          </td>
                          <td>
                            <span className="action-tag">{item.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendations & Action Plan */}
              <div className="modal-section-card">
                <h4 className="section-title">
                  <Award size={18} /> Authority Directives & Next Steps
                </h4>
                <p className="summary-paragraph">
                  {selectedReport.recommendations ||
                    "Mandate automatic AI image cross-verification at central warehouses and notify regional enforcement officers to conduct follow-up audits on repeat non-compliant brands."}
                </p>
              </div>

              {/* Digital Signature & Audit Footer */}
              <div className="report-digital-signature">
                <div className="sig-block">
                  <p className="sig-title">Authorized Signatory</p>
                  <p className="sig-name">{selectedReport.author || "Legal Metrology Authority"}</p>
                  <p className="sig-dept">Department of Consumer Affairs</p>
                </div>
                <div className="sig-stamp">
                  <ShieldCheck size={28} />
                  <div>
                    <span>DIGITALLY SIGNED</span>
                    <small>ID: {selectedReport.id}-AUTH-VERIFIED</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="report-modal-footer">
              <div className="footer-left-info">
                <span>Ref: {selectedReport.id}</span>
                <span>•</span>
                <span>Date: {selectedReport.date}</span>
              </div>

              <div className="footer-actions">
                <button
                  type="button"
                  className="modal-secondary-btn"
                  onClick={() => setSelectedReport(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="modal-primary-btn"
                  onClick={() => downloadReport(selectedReport)}
                >
                  <Download size={16} />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE NEW REPORT MODAL */}
      {showGenerateModal && (
        <div
          className="report-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGenerateModal(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="report-modal-dialog generate-dialog">
            <div className="report-modal-header">
              <div className="header-left">
                <h3>Generate New Compliance Report</h3>
                <p className="modal-subtitle">
                  Compile live inspection data, rule audits, and violation notices into a comprehensive report.
                </p>
              </div>
              <button
                type="button"
                className="modal-icon-btn close"
                onClick={() => setShowGenerateModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={generateReport} className="generate-form-body">
              <div className="form-group">
                <label>Report Title</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Packaging Compliance Summary"
                  value={newReportForm.title}
                  onChange={(e) =>
                    setNewReportForm({ ...newReportForm, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Report Category</label>
                  <select
                    value={newReportForm.type}
                    onChange={(e) =>
                      setNewReportForm({ ...newReportForm, type: e.target.value })
                    }
                  >
                    <option value="Compliance">Compliance Audit</option>
                    <option value="Violation">Statutory Violation</option>
                    <option value="Inspection">Field Inspection</option>
                    <option value="Complaint">Consumer Grievance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Audit Period</label>
                  <input
                    type="text"
                    placeholder="e.g. August 2026"
                    value={newReportForm.period}
                    onChange={(e) =>
                      setNewReportForm({ ...newReportForm, period: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="generate-modal-footer">
                <button
                  type="button"
                  className="modal-secondary-btn"
                  onClick={() => setShowGenerateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-primary-btn">
                  <Plus size={16} />
                  <span>Generate Report Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;