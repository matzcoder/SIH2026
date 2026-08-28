import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Rules.css";

function Rules() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");

  const defaultRules = [
    {
      id: "RULE-001",
      name: "MRP Declaration",
      category: "Price",
      version: "v1.2",
      severity: "High",
      status: "Active",
      updated: "20 Aug 2026",
    },
    {
      id: "RULE-002",
      name: "Net Quantity Declaration",
      category: "Quantity",
      version: "v2.1",
      severity: "High",
      status: "Active",
      updated: "18 Aug 2026",
    },
    {
      id: "RULE-003",
      name: "Manufacturer Details",
      category: "Manufacturer",
      version: "v1.3",
      severity: "Medium",
      status: "Active",
      updated: "15 Aug 2026",
    },
    {
      id: "RULE-004",
      name: "Consumer Care Details",
      category: "Consumer",
      version: "v1.0",
      severity: "Medium",
      status: "Draft",
      updated: "12 Aug 2026",
    },
    {
      id: "RULE-005",
      name: "Country of Origin",
      category: "Product",
      version: "v1.1",
      severity: "High",
      status: "Active",
      updated: "10 Aug 2026",
    },
  ];
  let storedRules = [];
  try {
    const parsedRules = JSON.parse(localStorage.getItem("authorityRules") || "[]");
    storedRules = Array.isArray(parsedRules) ? parsedRules : [];
  } catch {
    storedRules = [];
  }
  const categoryLabels = {
    MRP: "Price",
    Quantity: "Quantity",
    Manufacturer: "Manufacturer",
    Packaging: "Product",
  };
  const rules = [
    ...defaultRules,
    ...storedRules.map((rule) => ({
      ...rule,
      name: rule.name || rule.ruleName,
      category: categoryLabels[rule.category] || rule.category,
    })),
  ];

  return (
    <div className="rules-page">

      {/* Header */}

      <div className="rules-header">

        <div>
          <h2>Compliance Rules</h2>

          <p>
            Manage rules used by the compliance verification engine.
          </p>
        </div>

        <button
          className="create-rule-btn"
          onClick={() => navigate("/authority/create-rule")}
        >
          + Create Rule
        </button>

      </div>

      {/* Summary */}

      <div className="rules-summary">

        <div className="summary-card">
          <span>Total Rules</span>
          <strong>124</strong>
        </div>

        <div className="summary-card">
          <span>Active Rules</span>
          <strong>118</strong>
        </div>

        <div className="summary-card">
          <span>Draft Rules</span>
          <strong>6</strong>
        </div>

        <div className="summary-card">
          <span>Recent Amendments</span>
          <strong>12</strong>
        </div>

      </div>

      {/* Search / Filter */}

      <div className="rules-tools">

        <input
          type="text"
          placeholder="Search rules..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option>All Categories</option>
          <option>Price</option>
          <option>Quantity</option>
          <option>Manufacturer</option>
          <option>Consumer</option>
          <option>Product</option>
        </select>

        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All Status</option>
          <option>Active</option>
          <option>Draft</option>
        </select>

      </div>

      {/* Rules Table */}

      <div className="rules-table">

        <table>

          <thead>
            <tr>
              <th>Rule ID</th>
              <th>Rule Name</th>
              <th>Category</th>
              <th>Version</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {rules
              .filter((rule) => {
                const matchesSearch = `${rule.id} ${rule.name} ${rule.category}`
                  .toLowerCase()
                  .includes(search.toLowerCase());
                const matchesCategory = category === "All Categories" || rule.category === category;
                const matchesStatus = status === "All Status" || rule.status === status;
                return matchesSearch && matchesCategory && matchesStatus;
              })
              .map((rule) => (

              <tr key={rule.id}>

                <td>
                  <strong>{rule.id}</strong>
                </td>

                <td>{rule.name}</td>

                <td>
                  <span className="category-badge">
                    {rule.category}
                  </span>
                </td>

                <td>{rule.version}</td>

                <td>

                  <span
                    className={`severity-badge ${rule.severity.toLowerCase()}`}
                  >
                    {rule.severity}
                  </span>

                </td>

                <td>

                  <span
                    className={`status-badge ${rule.status.toLowerCase()}`}
                  >
                    {rule.status}
                  </span>

                </td>

                <td>{rule.updated}</td>

                <td>

                  <button
                    className="view-rule-btn"
                    onClick={() =>
                      navigate(`/authority/rules/${rule.id}`)
                    }
                  >
                    View
                  </button>

                </td>

              </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Rules;