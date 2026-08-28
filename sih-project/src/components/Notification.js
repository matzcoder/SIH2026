import "./Notification.css";

function SuccessIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function WarningIcon() {
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

function ErrorIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function InfoIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function CloseIcon() {
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
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function Notification({
  type = "info",
  title,
  message,
  onClose,
}) {
  const notificationTypes = {
    success: {
      icon: SuccessIcon,
      defaultTitle: "Success",
    },
    warning: {
      icon: WarningIcon,
      defaultTitle: "Warning",
    },
    error: {
      icon: ErrorIcon,
      defaultTitle: "Violation Detected",
    },
    info: {
      icon: InfoIcon,
      defaultTitle: "Information",
    },
  };

  const selectedType =
    notificationTypes[type] || notificationTypes.info;

  const Icon = selectedType.icon;

  return (
    <div
      className={`notification notification-${type}`}
      role="alert"
    >
      <div className="notification-icon">
        <Icon />
      </div>

      <div className="notification-content">
        <strong>
          {title || selectedType.defaultTitle}
        </strong>

        <p>{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          className="notification-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

export default Notification;