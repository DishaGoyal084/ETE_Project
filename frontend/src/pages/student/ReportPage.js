import React, { useEffect, useState } from "react";
import {Link,  useNavigate } from "react-router-dom";
import "../../styles/ReportPage.css";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`https://ete-project.onrender.com/student/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setReports(data);
        } else {
          setError(data.message || "Failed to load reports.");
        }
      } catch (err) {
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Helper function to convert reports to CSV format and trigger download
  const downloadCSV = () => {
    if (reports.length === 0) return;

    const headers = ["Student", "Exam", "Submitted At", "Score"];
    const rows = reports.map((r) => [
      `"${r.studentName}"`,
      `"${r.examTitle}"`,
      `"${new Date(r.submittedAt).toLocaleString()}"`,
      `"${r.score} / ${r.total}"`,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "test_reports.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="report-page">
      <h1>📋 Test Reports</h1>
      {loading && <p>Loading reports...</p>}
      {error && <p>{error}</p>}

      {reports.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Submitted At</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>{report.studentName}</td>
                  <td>{report.examTitle}</td>
                  <td>{new Date(report.submittedAt).toLocaleString()}</td>
                  <td>
                    {report.score} / {report.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={downloadCSV} className="download-btn">
            ⬇ Download CSV
          </button>
        </>
      )}

      <button onClick={() => navigate("/student/dashboard")} className="back-btn">
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default ReportPage;
