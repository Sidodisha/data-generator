import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ReportForm() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [limit, setLimit] = useState("");
  const [message, setMessage] = useState("");

  const handleGenerateReport = async () => {
    if (!selectedDate || !limit) {
      setMessage("Please select a date and enter a limit.");
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // yyyy-MM-dd

      const response = await axios.post("http://localhost:8080/api/v1/reports/generate", {
        businessDate: formattedDate,
        limit: parseInt(limit, 10),
      });

      setMessage(`Report generated successfully: ${response.data.reportName}`);

      // If backend provides file download URL
      if (response.data.fileUrl) {
        window.open(response.data.fileUrl, "_blank");
      }
    } catch (error) {
      setMessage("Failed to generate report. Try again.");
    }
  };

  return (
    <div style={{ margin: "50px", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Generate Report</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Date: </label><br />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Limit: </label><br />
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="Enter row limit"
        />
      </div>

      <button onClick={handleGenerateReport} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Generate Excel
      </button>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}

export default ReportForm;
