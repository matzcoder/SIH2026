import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Evidence.css";

function Evidence() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [checklist, setChecklist] = useState({
    mrp: false,
    quantity: false,
    manufacturer: false,
    packingDate: false,
    consumerCare: false,
    countryOrigin: false,
  });
  const [remarks, setRemarks] = useState("");
  const [saved, setSaved] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const newFiles = selectedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      size: (file.size / 1024).toFixed(1) + " KB",
      url: URL.createObjectURL(file),
    }));

    setFiles((previous) => [...previous, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const saveEvidence = () => {
    localStorage.setItem(
      "inspectionEvidence",
      JSON.stringify({
        inspectionId: "INS-1029",
        files: files.map(({ name, type, size }) => ({ name, type, size })),
        checklist,
        remarks,
      })
    );
    setSaved(true);
  };

  return (
    <div className="evidence-page">

      {/* Header */}

      <div className="evidence-header">

        <div>
          <div className="evidence-breadcrumb">
            Inspection / Evidence
          </div>

          <h1>Inspection Evidence</h1>

          <p>
            Upload and manage evidence collected during the inspection.
          </p>
        </div>

        <div className="inspection-reference">
          <span>Inspection ID</span>
          <strong>INS-1029</strong>
        </div>

      </div>

      {/* Inspection Information */}

      <div className="evidence-info">

        <div>
          <span>Product</span>
          <strong>ABC Biscuits</strong>
        </div>

        <div>
          <span>Location</span>
          <strong>Chennai</strong>
        </div>

        <div>
          <span>Inspection Date</span>
          <strong>25 Aug 2026</strong>
        </div>

        <div>
          <span>Inspector</span>
          <strong>Field Officer</strong>
        </div>

      </div>

      {/* Upload Section */}

      <div className="evidence-card">

        <div className="section-heading">
          <div>
            <h2>Upload Evidence</h2>

            <p>
              Add clear images of the package and its declarations.
            </p>
          </div>
        </div>

        <label className="upload-area">

          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />

          <div className="upload-icon">
            +
          </div>

          <h3>
            Upload Evidence
          </h3>

          <p>
            Click here to select images or PDF documents
          </p>

          <span>
            PNG, JPG, JPEG or PDF
          </span>

        </label>

      </div>

      {/* Uploaded Evidence */}

      <div className="evidence-card">

        <div className="section-heading">
          <div>
            <h2>Uploaded Evidence</h2>

            <p>
              {files.length} file(s) attached to this inspection.
            </p>
          </div>
        </div>

        {files.length === 0 ? (

          <div className="empty-evidence">
            <div className="empty-icon">
              □
            </div>

            <h3>No evidence uploaded</h3>

            <p>
              Upload product package images to continue the inspection.
            </p>
          </div>

        ) : (

          <div className="evidence-grid">

            {files.map((file, index) => (

              <div className="evidence-item" key={index}>

                <div className="evidence-preview">

                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt={file.name}
                    />
                  ) : (
                    <div className="pdf-preview">
                      PDF
                    </div>
                  )}

                </div>

                <div className="evidence-file-info">

                  <strong title={file.name}>
                    {file.name}
                  </strong>

                  <span>
                    {file.size}
                  </span>

                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFile(index)}
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Evidence Checklist */}

      <div className="evidence-card">

        <div className="section-heading">

          <div>
            <h2>Evidence Checklist</h2>

            <p>
              Make sure the required package information is captured.
            </p>
          </div>

        </div>

        <div className="checklist">

          <label>
            <input type="checkbox" checked={checklist.mrp} onChange={() => setChecklist({ ...checklist, mrp: !checklist.mrp })} />
            MRP / Price Declaration
          </label>

          <label>
            <input type="checkbox" checked={checklist.quantity} onChange={() => setChecklist({ ...checklist, quantity: !checklist.quantity })} />
            Net Quantity
          </label>

          <label>
            <input type="checkbox" checked={checklist.manufacturer} onChange={() => setChecklist({ ...checklist, manufacturer: !checklist.manufacturer })} />
            Manufacturer / Packer Details
          </label>

          <label>
            <input type="checkbox" checked={checklist.packingDate} onChange={() => setChecklist({ ...checklist, packingDate: !checklist.packingDate })} />
            Date of Manufacturing / Packing
          </label>

          <label>
            <input type="checkbox" checked={checklist.consumerCare} onChange={() => setChecklist({ ...checklist, consumerCare: !checklist.consumerCare })} />
            Consumer Care Details
          </label>

          <label>
            <input type="checkbox" checked={checklist.countryOrigin} onChange={() => setChecklist({ ...checklist, countryOrigin: !checklist.countryOrigin })} />
            Country of Origin
          </label>

        </div>

      </div>

      {/* Inspector Remarks */}

      <div className="evidence-card">

        <div className="section-heading">

          <div>
            <h2>Inspector Remarks</h2>

            <p>
              Add observations from the physical inspection.
            </p>
          </div>

        </div>

        <textarea
          className="remarks-box"
          placeholder="Enter your inspection observations..."
          value={remarks}
          onChange={(event) => {
            setRemarks(event.target.value);
            setSaved(false);
          }}
        />

      </div>

      {/* Actions */}

      <div className="evidence-actions">

        <button className="save-btn" onClick={saveEvidence}>
          {saved ? "Evidence Saved" : "Save Evidence"}
        </button>

        <button className="continue-btn" onClick={() => {
          saveEvidence();
          navigate("/inspector/inspection-details/INS-1029");
        }}>
          Continue to Inspection
        </button>

      </div>

    </div>
  );
}

export default Evidence;