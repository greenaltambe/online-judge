import React from "react";

function FileUploadSection({ inputs, outputs, setFormData }) {
  return (
    <div className="form-group">
      <label>Submission Test Files</label>
      <p className="hint">
        Upload input and output files (e.g., `input_1.txt` and
        `output_1.txt`)
      </p>

      <div className="file-upload-row">
        <label htmlFor="inputs" className="file-label">
          Input Files
        </label>
        <input
          type="file"
          id="inputs"
          name="inputs"
          multiple
          accept=".txt"
          style={{ display: "none" }}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              inputs: Array.from(e.target.files),
            }))
          }
        />
        <label htmlFor="inputs" className="custom-file-button">
          Upload Input Files
        </label>
        {inputs?.length > 0 && (
          <ul className="file-list">
            {inputs.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="file-upload-row">
        <label htmlFor="outputs" className="file-label">
          Output Files
        </label>
        <input
          type="file"
          id="outputs"
          name="outputs"
          multiple
          accept=".txt"
          style={{ display: "none" }}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              outputs: Array.from(e.target.files),
            }))
          }
        />
        <label htmlFor="outputs" className="custom-file-button">
          Upload Output Files
        </label>
        {outputs?.length > 0 && (
          <ul className="file-list">
            {outputs.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FileUploadSection;
