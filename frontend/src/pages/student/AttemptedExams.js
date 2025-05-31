import React, { useState, useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import "../../styles/AttemptedExams.css";

const AttemptedExams = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttemptedExams = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token is missing. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("https://ete-project.onrender.com/student/attemptedExams", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setExams(data);
                } else {
                    setError(data.message || "Failed to fetch attempted exams.");
                }
            } catch (err) {
                console.error("Error fetching exams:", err);
                setError("Failed to fetch attempted exams.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttemptedExams();
    }, []);

    return (
        <div className="attempted-exams">
            <div className="sidebar">
                <ul>
                    <li onClick={() => navigate("/")}>Home</li>
                    <li onClick={() => navigate("/student/dashboard")}>Dashboard</li>
                    <li onClick={() => navigate("/exams")}>Attempted Exams</li>
                    <li onClick={() => navigate("/profile")}>Profile</li>
                    <li onClick={() => navigate("/report")}>Report</li>
                    <li onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</li>
                </ul>
            </div>

            <div className="content">
                <h1>Attempted Exams</h1>

                {loading && <p>Loading exams...</p>}
                {error && <p>{error}</p>}

                {exams.length > 0 ? (
                    <div className="exam-cards">
                        {exams.map((exam, index) => (
                            <div key={index} className="exam-card">
                                <h2>{exam.examTitle}</h2>
                                <p>{exam.examDescription}</p>
                                <p>Submitted at: {new Date(exam.submittedAt).toLocaleString()}</p>
                                
                                
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No exams attempted yet.</p>
                )}
            </div>
        </div>
    );
};

export default AttemptedExams;
