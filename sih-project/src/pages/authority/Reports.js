import { useState } from "react";
import "./Reports.css";

function Reports() {
  const [reports, setReports] = useState([
    {
      id: "RPT-001",
      title: "Monthly Compliance Report",
      type: "Compliance",
      date: "20 Aug 2026",
      status: "Generated",
    },
    {
      id: "RPT-002",
      title: "Inspection Violation Report",
      type: "Violation",
      date: "18 Aug 2026",
      status: "Generated",
    },
    {
      id: "RPT-003",
      title: "Product Inspection Summary",
      type: "Inspection",
      date: "15 Aug 2026",
      status: "Generated",
    },
    {
      id: "RPT-004",
      title: "Consumer Complaint Report",
      type: "Complaint",
      date: "12 Aug 2026",
      status: "Generated",
    },
  ]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Reports");
  const [selectedReport, setSelectedReport] = useState(null);

  const visibleReports = reports.filter((report) => {
    const matchesSearch = `${report.id} ${report.title} ${report.type}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch && (type === "All Reports" || report.type === type);
  });

  const generateReport = () => {
    const report = {
      id: `RPT-${String(reports.length + 1).padStart(3, "0")}`,
      title: "New Compliance Report",
      type: "Compliance",
      date: new Date().toLocaleDateString(),
      status: "Generated",
    };
    setReports((current) => [report, ...current]);
    setSelectedReport(report);
  };

  const downloadReport = (report) => {
    const content = `${report.title}\n${report.id}\nType: ${report.type}\nDate: ${report.date}\nStatus: ${report.status}`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.id}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">

      <div className="reports-header">
        <div>
          <h2>Reports</h2>
          <p>
            View and manage compliance and inspection reports.
          </p>
        </div>

        <button className="generate-btn" onClick={generateReport}>
          + Generate Report
        </button>
      </div>

      {/* Summary Cards */}

      <div className="report-stats">

        <div className="report-stat-card">
          <h4>Total Reports</h4>
          <h2>248</h2>
        </div>

        <div className="report-stat-card">
          <h4>Compliance Reports</h4>
          <h2>124</h2>
        </div>

        <div className="report-stat-card">
          <h4>Violation Reports</h4>
          <h2>67</h2>
        </div>

        <div className="report-stat-card">
          <h4>Inspection Reports</h4>
          <h2>57</h2>
        </div>

      </div>

      {/* Search */}

      <div className="report-tools">

        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option>All Reports</option>
          <option>Compliance</option>
          <option>Violation</option>
          <option>Inspection</option>
          <option>Complaint</option>
        </select>

      </div>

      {/* Reports Table */}

      <div className="reports-table">

        <table>

          <thead>
            <tr>
              <th>Report ID</th>
              <th>Report Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {visibleReports.map((report) => (
              <tr key={report.id}>

                <td>{report.id}</td>

                <td className="report-name">
                  {report.title}
                </td>

                <td>{report.type}</td>

                <td>{report.date}</td>

                <td>
                  <span className="generated-status">
                    {report.status}
                  </span>
                </td>

                <td className="actions">

                  <button className="view-btn" onClick={() => setSelectedReport(report)}>
                    View
                  </button>

                  <button className="download-btn" onClick={() => downloadReport(report)}>
                    Download
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {selectedReport && (
        <div className="reports-table" role="region" aria-label="Report details">
          <h3>{selectedReport.title}</h3>
          <p>{selectedReport.id} | {selectedReport.type} | {selectedReport.date}</p>
          <button className="view-btn" onClick={() => setSelectedReport(null)}>
            Close
          </button>
        </div>
      )}

    </div>
  );
}

export default Reports;