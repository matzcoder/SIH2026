import "./Navbar.css";

function ShieldIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <a href="/" className="navbar-brand">
          <div className="brand-icon">
            <ShieldIcon />
          </div>

          <div className="brand-text">
            <strong>ComplyAI</strong>
            <span>Compliance Platform</span>
          </div>
        </a>

        <div className="navbar-links">
          <a href="/" className="navbar-link active">
            Dashboard
          </a>

          <a href="/compliance" className="navbar-link">
            Compliance
          </a>

          <a href="/evidence" className="navbar-link">
            Evidence
          </a>

          <a href="/reports" className="navbar-link">
            Reports
          </a>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="notification-button"
            aria-label="Notifications"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>

            <span className="notification-dot" />
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;