import "./EvidenceViewer.css";

function FileIcon({ type }) {
  if (type === "pdf") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
        <path d="M14 2v6h6" />
        <path d="M8 15h2" />
        <path d="M8 18h6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function EvidenceViewer({
  evidence,
  onClose,
}) {
  if (!evidence) {
    return null;
  }

  const {
    name,
    type = "image",
    url,
    uploadedBy = "Unknown",
    uploadedAt = "Not available",
    description = "No description provided.",
  } = evidence;

  const isImage =
    type === "image" ||
    type === "jpg" ||
    type === "jpeg" ||
    type === "png";

  const isPdf = type === "pdf";

  return (
    <div
      className="evidence-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="evidence-viewer"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Evidence Viewer"
      >
        <div className="evidence-header">
          <div className="evidence-title">
            <div className="evidence-file-icon">
              <FileIcon type={isPdf ? "pdf" : "image"} />
            </div>

            <div>
              <h2>{name}</h2>
              <span>Compliance Evidence</span>
            </div>
          </div>

          <button
            type="button"
            className="evidence-close"
            onClick={onClose}
            aria-label="Close evidence viewer"
          >
            ×
          </button>
        </div>

        <div className="evidence-preview">
          {isImage && url ? (
            <img
              src={url}
              alt={name}
              className="evidence-image"
            />
          ) : isPdf && url ? (
            <iframe
              src={url}
              title={name}
              className="evidence-pdf"
            />
          ) : (
            <div className="evidence-empty">
              <div className="evidence-empty-icon">📄</div>
              <h3>Preview unavailable</h3>
              <p>
                This evidence file cannot be previewed here.
              </p>
            </div>
          )}
        </div>

        <div className="evidence-details">
          <div className="evidence-detail">
            <span>Uploaded by</span>
            <strong>{uploadedBy}</strong>
          </div>

          <div className="evidence-detail">
            <span>Uploaded on</span>
            <strong>{uploadedAt}</strong>
          </div>
        </div>

        <div className="evidence-description">
          <span>Description</span>
          <p>{description}</p>
        </div>

        <div className="evidence-actions">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="evidence-open"
            >
              Open Evidence
            </a>
          )}

          <button
            type="button"
            className="evidence-close-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EvidenceViewer;