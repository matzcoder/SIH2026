import "./StatCard.css";

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendType = "positive",
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">
          {icon}
        </div>

        {trend && (
          <span className={`stat-trend ${trendType}`}>
            {trendType === "positive" && "↑"}
            {trendType === "negative" && "↓"}
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-content">
        <span className="stat-card-title">
          {title}
        </span>

        <h2>{value}</h2>

        {description && (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
}

export default StatCard;