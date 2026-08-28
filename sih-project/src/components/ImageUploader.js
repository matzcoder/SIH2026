import { useRef, useState } from "react";
import "./ImageUploader.css";

function UploadIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function ImageUploader({
  onUpload,
  maxSizeMB = 5,
}) {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile) => {
    setError("");

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    const maxSize = maxSizeMB * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError(`Image size must be less than ${maxSizeMB}MB.`);
      return;
    }

    setFile(selectedFile);

    const imageUrl = URL.createObjectURL(selectedFile);
    setPreview(imageUrl);

    if (onUpload) {
      onUpload(selectedFile);
    }
  };

  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];

    handleFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    handleFile(droppedFile);
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (onUpload) {
      onUpload(null);
    }
  };

  return (
    <div className="image-uploader">
      <div className="image-uploader-header">
        <div>
          <h3>Upload Evidence</h3>
          <p>Add an image as compliance evidence.</p>
        </div>

        {file && (
          <span className="upload-success">
            ✓ Uploaded
          </span>
        )}
      </div>

      {!preview ? (
        <div
          className={`upload-area ${
            isDragging ? "dragging" : ""
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              inputRef.current?.click();
            }
          }}
        >
          <div className="upload-icon">
            <UploadIcon />
          </div>

          <h4>Drop your image here</h4>

          <p>
            or <span>browse files</span>
          </p>

          <small>
            PNG, JPG or JPEG • Max {maxSizeMB}MB
          </small>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleInputChange}
            hidden
          />
        </div>
      ) : (
        <div className="image-preview-container">
          <img
            src={preview}
            alt="Evidence preview"
            className="image-preview"
          />

          <div className="image-preview-footer">
            <div className="file-information">
              <strong>{file.name}</strong>

              <span>
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            <button
              type="button"
              className="remove-image"
              onClick={removeImage}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="upload-error">
          <span>!</span>
          {error}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;