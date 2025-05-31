import React, { useEffect, useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import "../../styles/TeacherReport.css";

const TeacherReport = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(`https://ete-project.onrender.com/api/teacher/reports`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Failed to fetch reports");
                setReports(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="teacher-report-container">
            <h1>Student Submission Reports</h1>

            {loading && <p>Loading reports...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Test Name</th>
                            <th>Score</th>
                            <th>Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, idx) => (
                            <tr key={idx}>
                                <td>{report.studentName}</td>
                                <td>{report.studentEmail}</td>
                                <td>{report.testName}</td>
                                <td>{report.score}</td>
                                <td>{new Date(report.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="back-button-container">
                <button className="back-button" onClick={() => navigate("/examiner/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default TeacherReport;
