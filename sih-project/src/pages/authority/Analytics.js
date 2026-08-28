import "./Analytics.css";

function Analytics() {
  const stats = [
    {
      title: "Total Inspections",
      value: "12,450",
    },
    {
      title: "Compliance Rate",
      value: "91%",
    },
    {
      title: "Violations Found",
      value: "1,120",
    },
    {
      title: "Complaints",
      value: "348",
    },
  ];

  return (
    <div className="analytics-page">

      <h2 className="page-title">
        Compliance Analytics
      </h2>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="analytics-section">

        <div className="chart-card">
          <h3>Compliance Trend</h3>

          <div className="fake-chart">
            <div className="bar" style={{ height: "60%" }}></div>
            <div className="bar" style={{ height: "75%" }}></div>
            <div className="bar" style={{ height: "85%" }}></div>
            <div className="bar" style={{ height: "95%" }}></div>
            <div className="bar" style={{ height: "80%" }}></div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Top Violations</h3>

          <ul className="violation-list">
            <li>Incorrect MRP Display</li>
            <li>Missing Manufacturer Address</li>
            <li>Wrong Net Quantity</li>
            <li>Missing Consumer Helpline</li>
            <li>Packaging Date Issues</li>
          </ul>
        </div>

      </div>

    </div>
  );
}

export default Analytics;