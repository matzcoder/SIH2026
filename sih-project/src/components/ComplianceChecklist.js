import { useState } from "react";
import ComplianceBadge from "./ComplianceBadge";
import "./ComplianceChecklist.css";

const initialChecks = [
  {
    id: 1,
    title: "Privacy Policy",
    description: "Privacy policy is available and up to date.",
    status: "compliant",
  },
  {
    id: 2,
    title: "Data Protection",
    description: "User data is securely stored and protected.",
    status: "review",
  },
  {
    id: 3,
    title: "User Consent",
    description: "Required user consent is properly collected.",
    status: "compliant",
  },
  {
    id: 4,
    title: "Terms & Conditions",
    description: "Terms and conditions are clearly defined.",
    status: "violation",
  },
  {
    id: 5,
    title: "Access Control",
    description: "Only authorized users can access sensitive data.",
    status: "review",
  },
];

function ComplianceChecklist() {
  const [checks, setChecks] = useState(initialChecks);

  const handleStatusChange = (id) => {
    setChecks((currentChecks) =>
      currentChecks.map((check) => {
        if (check.id !== id) {
          return check;
        }

        const nextStatus = {
          compliant: "review",
          review: "violation",
          violation: "compliant",
        };

        return {
          ...check,
          status: nextStatus[check.status],
        };
      })
    );
  };

  const completedCount = checks.filter(
    (check) => check.status === "compliant"
  ).length;

  const progress = Math.round(
    (completedCount / checks.length) * 100
  );

  return (
    <section className="compliance-checklist">
      <div className="checklist-header">
        <div>
          <span className="checklist-eyebrow">
            COMPLIANCE
          </span>

          <h2>Compliance Checklist</h2>

          <p>
            Review each requirement and resolve any compliance issues.
          </p>
        </div>

        <div className="checklist-summary">
          <strong>
            {completedCount}/{checks.length}
          </strong>
          <span>Compliant</span>
        </div>
      </div>

      <div className="checklist-progress">
        <div className="progress-header">
          <span>Overall compliance</span>
          <strong>{progress}%</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="checklist-items">
        {checks.map((check) => (
          <div className="checklist-item" key={check.id}>
            <div className="checklist-number">
              {check.id}
            </div>

            <div className="checklist-content">
              <h3>{check.title}</h3>
              <p>{check.description}</p>
            </div>

            <div className="checklist-action">
              <ComplianceBadge status={check.status} />

              <button
                type="button"
                onClick={() => handleStatusChange(check.id)}
                className="status-button"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {progress === 100 && (
        <div className="checklist-complete">
          <span>✓</span>
          <div>
            <strong>All requirements are compliant</strong>
            <p>
              Your compliance checklist has been completed.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ComplianceChecklist;