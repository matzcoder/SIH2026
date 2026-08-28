import "./LoadingScanner.css";

function LoadingScanner({
  title = "Scanning Evidence",
  message = "Analyzing your document for compliance issues...",
}) {
  return (
    <div className="loading-scanner" role="status" aria-live="polite">
      <div className="scanner-animation">
        <div className="scanner-document">
          <div className="document-line line-one" />
          <div className="document-line line-two" />
          <div className="document-line line-three" />
          <div className="document-line line-four" />
        </div>

        <div className="scanner-line" />
      </div>

      <div className="scanner-content">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="scanner-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default LoadingScanner;