import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateRule.css";

function CreateRule() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ruleName: "",
    category: "",
    version: "",
    description: "",
    severity: "Medium",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let storedRules = [];
    try {
      const parsedRules = JSON.parse(localStorage.getItem("authorityRules") || "[]");
      storedRules = Array.isArray(parsedRules) ? parsedRules : [];
    } catch {
      storedRules = [];
    }
    localStorage.setItem(
      "authorityRules",
      JSON.stringify([
        ...storedRules,
        {
          ...formData,
          id: `RULE-${String(storedRules.length + 6).padStart(3, "0")}`,
          status: "Draft",
          updated: new Date().toLocaleDateString(),
        },
      ])
    );
    navigate("/authority/rules");
  };

  return (
    <div className="create-rule-page">
      <div className="form-card">
        <h2>Create New Rule</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Rule Name</label>

            <input
              type="text"
              name="ruleName"
              placeholder="Enter rule name"
              value={formData.ruleName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Category
              </option>

              <option value="MRP">
                MRP Declaration
              </option>

              <option value="Quantity">
                Net Quantity
              </option>

              <option value="Manufacturer">
                Manufacturer Details
              </option>

              <option value="Packaging">
                Packaging Information
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Version</label>

            <input
              type="text"
              name="version"
              placeholder="v1.0"
              value={formData.version}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Severity</label>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              placeholder="Enter rule description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
          >
            Create Rule
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateRule;