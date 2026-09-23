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

/**
 * Compress an image file using Canvas API before upload.
 * Downscales to maxDim pixels on longest side and re-encodes as JPEG.
 * Returns a new File object with significantly reduced size.
 */
function compressImage(file, { maxDim = 1600, quality = 0.85 } = {}) {
  return new Promise((resolve) => {
    // Skip non-image or already small files
    if (!file.type.startsWith("image/") || file.size < 200 * 1024) {
      resolve(file);
      return;
    }

    const img = new window.Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Only downscale, never upscale
      if (Math.max(width, height) > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            // Use compressed version
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, ".jpg"),
              { type: "image/jpeg", lastModified: Date.now() }
            );
            resolve(compressedFile);
          } else {
            // Original was already smaller — keep it
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback to original on error
    };

    img.src = url;
  });
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
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFile = async (selectedFile) => {
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

    // Compress image client-side before upload
    setIsCompressing(true);
    let processedFile;
    try {
      processedFile = await compressImage(selectedFile);
    } catch {
      processedFile = selectedFile;
    }
    setIsCompressing(false);

    setFile(processedFile);

    const imageUrl = URL.createObjectURL(processedFile);
    setPreview(imageUrl);

    if (onUpload) {
      onUpload(processedFile);
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