import "./ComplianceBadge.css";

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ComplianceBadge({ status }) {
  let label;
  let className;
  let Icon;

  if (status === "compliant") {
    label = "Compliant";
    className = "compliant";
    Icon = CheckIcon;
  } else if (status === "violation") {
    label = "Violation Detected";
    className = "violation";
    Icon = XIcon;
  } else {
    label = "Needs Review";
    className = "review";
    Icon = AlertIcon;
  }

  return (
    <div
      className={`compliance-badge ${className}`}
      role="status"
      aria-label={label}
    >
      <span className="compliance-badge-icon">
        <Icon />
      </span>

      <span className="compliance-badge-label">
        {label}
      </span>
    </div>
  );
}

export default ComplianceBadge;