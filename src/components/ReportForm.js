import React, { useState, useRef } from "react";
import axios from "axios";

export default function ReportGenerator() {
  const [jsonFile, setJsonFile] = useState(null);
  const [jsonContent, setJsonContent] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setJsonFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedJson = JSON.parse(e.target.result);
        setJsonContent(parsedJson);
        console.log("Uploaded JSON:", parsedJson);
      } catch (error) {
        alert("Invalid JSON file. Please upload a valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setJsonFile(null);
    setJsonContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleGenerate = async () => {
    if (!jsonContent) {
      alert("Please upload a JSON file before generating report.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/reports/generate",
        jsonContent,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Check console for details.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5"
      }}
    >
      <div
        style={{
          padding: "30px",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Excel Report Generator</h2>

        {/* File Upload */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Upload JSON Input:
          </label>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </div>

        {/* JSON Preview */}
        {jsonContent && (
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
              maxHeight: "200px",
              overflow: "auto",
              textAlign: "left"
            }}
          >
            {JSON.stringify(jsonContent, null, 2)}
          </pre>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            onClick={handleGenerate}
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              flex: 1
            }}
          >
            Generate Report
          </button>

          <button
            onClick={handleClear}
            style={{
              padding: "10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              flex: 1
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
