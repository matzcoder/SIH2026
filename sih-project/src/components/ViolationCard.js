import "./ViolationCard.css";

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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

function ViolationCard({
  violation,
  onView,
  onResolve,
}) {
  if (!violation) {
    return null;
  }

  const {
    title = "Compliance Violation",
    product = "Unknown Product",
    category = "General",
    description = "No description available.",
    severity = "medium",
    date = "Not available",
    status = "Open",
  } = violation;

  return (
    <div className="violation-card">
      <div className="violation-card-header">
        <div className={`violation-icon ${severity}`}>
          <AlertIcon />
        </div>

        <div className="violation-heading">
          <h3>{title}</h3>
          <span>{category}</span>
        </div>

        <span className={`severity-badge ${severity}`}>
          {severity}
        </span>
      </div>

      <div className="violation-product">
        <span>Product</span>
        <strong>{product}</strong>
      </div>

      <div className="violation-description">
        <p>{description}</p>
      </div>

      <div className="violation-meta">
        <div>
          <span>Detected</span>
          <strong>{date}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong className="violation-status">
            <i />
            {status}
          </strong>
        </div>
      </div>

      <div className="violation-actions">
        <button
          type="button"
          className="violation-view"
          onClick={() => onView?.(violation)}
        >
          View Details
        </button>

        {status.toLowerCase() === "open" && (
          <button
            type="button"
            className="violation-resolve"
            onClick={() => onResolve?.(violation)}
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
}

export default ViolationCard;