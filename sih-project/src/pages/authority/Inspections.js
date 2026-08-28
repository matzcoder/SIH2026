import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Inspections.css";

function Inspections() {
  const [searchParams] = useSearchParams();
  const isEvidenceView = searchParams.get("view") === "evidence";
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ product: "", inspector: "", date: "" });
  const [inspections, setInspections] = useState([
    {
      id: "INS001",
      product: "ABC Biscuits",
      inspector: "Ramesh",
      date: "12 Aug 2026",
      score: "95%",
      status: "Completed",
    },
    {
      id: "INS002",
      product: "XYZ Oil",
      inspector: "Priya",
      date: "14 Aug 2026",
      score: "78%",
      status: "Under Review",
    },
    {
      id: "INS003",
      product: "Fresh Milk",
      inspector: "Karthik",
      date: "15 Aug 2026",
      score: "62%",
      status: "Violation Found",
    },
  ]);
  const evidenceRecords = inspections.filter((inspection) => inspection.status !== "Completed");
  const visibleInspections = isEvidenceView ? evidenceRecords : inspections;

  const createInspection = (event) => {
    event.preventDefault();
    if (!formData.product || !formData.inspector || !formData.date) return;
    const inspection = {
      id: `INS${String(inspections.length + 1).padStart(3, "0")}`,
      ...formData,
      score: "-",
      status: "Scheduled",
    };
    setInspections((current) => [...current, inspection]);
    setSelectedInspection(inspection);
    setFormData({ product: "", inspector: "", date: "" });
    setShowForm(false);
  };

  return (
    <div className="inspections-page">

      <div className="inspection-header">
        <h2>{isEvidenceView ? "Inspection Evidence" : "Inspection Management"}</h2>

        <button
          className="new-inspection-btn"
          onClick={() => setShowForm((current) => !current)}
        >
          + New Inspection
        </button>
      </div>

      {showForm && (
        <form className="inspection-form" onSubmit={createInspection}>
          <input placeholder="Product name" value={formData.product} onChange={(event) => setFormData({ ...formData, product: event.target.value })} required />
          <input placeholder="Inspector name" value={formData.inspector} onChange={(event) => setFormData({ ...formData, inspector: event.target.value })} required />
          <input type="date" value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} required />
          <button type="submit" className="new-inspection-btn">Create Inspection</button>
        </form>
      )}

      <div className="inspection-table">

        <table>
          <thead>
            <tr>
              {isEvidenceView ? (
                <>
                  <th>Evidence ID</th>
                  <th>Product</th>
                  <th>Inspector</th>
                  <th>Captured</th>
                  <th>Evidence Status</th>
                  <th>Action</th>
                </>
              ) : (
                <>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Inspector</th>
                  <th>Date</th>
                  <th>Compliance Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {visibleInspections.map((item) => (
              <tr key={item.id}>
                <td>{isEvidenceView ? `EVD-${item.id.replace("INS", "")}` : item.id}</td>
                <td>{item.product}</td>
                <td>{item.inspector}</td>
                <td>{item.date}</td>
                {!isEvidenceView && <td>{item.score}</td>}

                <td>
                  <span
                    className={`status ${item.status
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {isEvidenceView ? "Evidence Available" : item.status}
                  </span>
                </td>

                <td>
                  <button className="view-btn" onClick={() => setSelectedInspection(item)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {selectedInspection && (
        <div className="inspection-table" role="region" aria-label="Inspection details">
          <h3>{selectedInspection.id} Details</h3>
          <p>
            {selectedInspection.product} | Inspector: {selectedInspection.inspector} | Status: {selectedInspection.status}
          </p>
          <button className="view-btn" onClick={() => setSelectedInspection(null)}>
            Close
          </button>
        </div>
      )}

    </div>
  );
}

export default Inspections;