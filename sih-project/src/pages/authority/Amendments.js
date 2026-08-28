import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Amendments.css";

function Amendments() {
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.has("rule"));
  const [amendments, setAmendments] = useState([
    {
      id: "AMD-001",
      rule: "MRP Display Rule",
      oldVersion: "v1.0",
      newVersion: "v1.1",
      status: "Approved",
    },
    {
      id: "AMD-002",
      rule: "Net Quantity Declaration",
      oldVersion: "v2.0",
      newVersion: "v2.1",
      status: "Pending",
    },
    {
      id: "AMD-003",
      rule: "Manufacturer Address Rule",
      oldVersion: "v1.2",
      newVersion: "v1.3",
      status: "Approved",
    },
  ]);
  const [formData, setFormData] = useState({ rule: searchParams.get("rule") || "", oldVersion: "", newVersion: "", reason: "" });
  const [formError, setFormError] = useState("");

  const openAmendmentForm = () => {
    setShowForm(true);
    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.rule || !formData.oldVersion || !formData.newVersion || !formData.reason) {
      setFormError("Complete all amendment fields before submitting.");
      return;
    }
    setAmendments((current) => [{ id: `AMD-${String(current.length + 1).padStart(3, "0")}`, ...formData, status: "Pending" }, ...current]);
    setFormData({ rule: "", oldVersion: "", newVersion: "", reason: "" });
    setFormError("");
    setShowForm(false);
  };

  return (
    <div className="amendments-page">
      <div className="page-header">
        <h2>Rule Amendments</h2>

        <button type="button" className="add-btn" onClick={openAmendmentForm} aria-expanded={showForm}>
          + New Amendment
        </button>
      </div>

      {showForm && (
        <form className="amendment-form" onSubmit={handleSubmit}>
          <input placeholder="Rule ID or name" value={formData.rule} onChange={(event) => setFormData({ ...formData, rule: event.target.value })} required />
          <input placeholder="Current version" value={formData.oldVersion} onChange={(event) => setFormData({ ...formData, oldVersion: event.target.value })} required />
          <input placeholder="New version" value={formData.newVersion} onChange={(event) => setFormData({ ...formData, newVersion: event.target.value })} required />
          <input placeholder="Reason for amendment" value={formData.reason} onChange={(event) => setFormData({ ...formData, reason: event.target.value })} required />
          {formError && <p className="amendment-form-error" role="alert">{formError}</p>}
          <button type="submit" className="add-btn">Submit Amendment</button>
          <button type="button" className="cancel-amendment-btn" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Rule</th>
              <th>Old Version</th>
              <th>New Version</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {amendments.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.rule}</td>
                <td>{item.oldVersion}</td>
                <td>{item.newVersion}</td>

                <td>
                  <span
                    className={
                      item.status === "Approved"
                        ? "status approved"
                        : "status pending"
                    }
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Amendments;