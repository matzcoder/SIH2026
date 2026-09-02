import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RulesConfiguratorSandbox from "../../components/RulesConfiguratorSandbox";
import "./RulesDetails.css";

function RulesDetails() {
  const navigate = useNavigate();
  const { id = "RULE-001" } = useParams();
  const [isDisabled, setIsDisabled] = useState(false);
  const rule = {
    id,
    name: id === "RULE-001" ? "MRP Declaration Rule" : `Compliance Rule ${id}`,
    category: "Price Declaration",
    version: "v1.2",
    status: "Active",
    severity: "High",
    createdBy: "Legal Metrology Authority",
    lastUpdated: "20 Aug 2026",

    description:
      "Every retail packaged commodity must clearly declare the Maximum Retail Price inclusive of all applicable taxes.",

    conditions: [
      "MRP must be present",
      "MRP must be clearly visible",
      "Price must be in Indian Rupees",
      "MRP must be inclusive of all taxes",
    ],

    validationFields: [
      {
        field: "MRP",
        required: true,
        validation: "Text / Numeric",
      },
      {
        field: "Currency",
        required: true,
        validation: "INR",
      },
      {
        field: "Tax Declaration",
        required: true,
        validation: "Inclusive of all taxes",
      },
    ],
  };

  return (
    <div className="rule-details-page">

      {/* Header */}

      <div className="rule-header">

        <div>
          <div className="breadcrumb">
            Rules / Rule Details
          </div>

          <h2>{rule.name}</h2>

          <p>
            {rule.id} • {rule.version}
          </p>
        </div>

        <span className="active-badge">
          {rule.status}
        </span>

      </div>

      {/* Basic Information */}

      <div className="details-grid">

        <div className="detail-card">
          <h3>Rule Information</h3>

          <div className="detail-row">
            <span>Rule ID</span>
            <strong>{rule.id}</strong>
          </div>

          <div className="detail-row">
            <span>Category</span>
            <strong>{rule.category}</strong>
          </div>

          <div className="detail-row">
            <span>Version</span>
            <strong>{rule.version}</strong>
          </div>

          <div className="detail-row">
            <span>Severity</span>
            <span className="severity">
              {rule.severity}
            </span>
          </div>

          <div className="detail-row">
            <span>Last Updated</span>
            <strong>{rule.lastUpdated}</strong>
          </div>

        </div>

        {/* Description */}

        <div className="detail-card">
          <h3>Description</h3>

          <p className="description">
            {rule.description}
          </p>

          <div className="created-by">
            <span>Created By</span>
            <strong>{rule.createdBy}</strong>
          </div>
        </div>

      </div>

      {/* Conditions */}

      <div className="section-card">

        <h3>Compliance Conditions</h3>

        <div className="conditions-list">

          {rule.conditions.map((condition, index) => (
            <div
              className="condition"
              key={index}
            >
              <span className="condition-number">
                {index + 1}
              </span>

              <span>{condition}</span>
            </div>
          ))}

        </div>

      </div>

      {/* Validation Fields */}

      <div className="section-card">

        <h3>Validation Fields</h3>

        <table>

          <thead>
            <tr>
              <th>Field</th>
              <th>Required</th>
              <th>Validation</th>
            </tr>
          </thead>

          <tbody>

            {rule.validationFields.map(
              (field, index) => (
                <tr key={index}>

                  <td>
                    <strong>{field.field}</strong>
                  </td>

                  <td>
                    <span className="required">
                      Required
                    </span>
                  </td>

                  <td>{field.validation}</td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      <RulesConfiguratorSandbox rule={rule} />

      {/* Actions */}

      <div className="rule-actions">

        <button className="edit-btn" onClick={() => navigate("/authority/create-rule")}>
          Edit Rule
        </button>

        <button className="amend-btn" onClick={() => navigate(`/authority/amendments?rule=${rule.id}`)}>
          Create Amendment
        </button>

        <button className="disable-btn" onClick={() => setIsDisabled((current) => !current)}>
          {isDisabled ? "Enable Rule" : "Disable Rule"}
        </button>

      </div>

    </div>
  );
}

export default RulesDetails;
