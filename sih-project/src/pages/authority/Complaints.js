import { useState } from "react";
import "./Complaints.css";

function Complaints() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const complaints = [
    {
      id: "CMP001",
      product: "ABC Biscuits",
      user: "Rahul",
      issue: "Incorrect MRP Display",
      status: "Pending",
    },
    {
      id: "CMP002",
      product: "XYZ Oil",
      user: "Priya",
      issue: "Missing Manufacturer Address",
      status: "In Review",
    },
    {
      id: "CMP003",
      product: "Fresh Milk",
      user: "Arun",
      issue: "Net Quantity Mismatch",
      status: "Resolved",
    },
  ];

  return (
    <div className="complaints-page">

      <div className="page-header">
        <h2>User Complaints</h2>
      </div>

      <div className="complaints-table">

        <table>
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Product</th>
              <th>User</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.product}</td>
                <td>{complaint.user}</td>
                <td>{complaint.issue}</td>

                <td>
                  <span
                    className={`status ${complaint.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {complaint.status}
                  </span>
                </td>

                <td>
                  <button className="view-btn" onClick={() => setSelectedComplaint(complaint)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {selectedComplaint && (
        <div className="complaints-table" role="region" aria-label="Complaint details">
          <h3>{selectedComplaint.id} Details</h3>
          <p>
            {selectedComplaint.product}: {selectedComplaint.issue}. Submitted by {selectedComplaint.user}.
          </p>
          <button className="view-btn" onClick={() => setSelectedComplaint(null)}>
            Close
          </button>
        </div>
      )}

    </div>
  );
}

export default Complaints;