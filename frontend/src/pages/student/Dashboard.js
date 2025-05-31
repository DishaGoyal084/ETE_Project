import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Student.css";  

const StudentDashboard = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            if (!token) {
                setError("Authentication token is missing. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/exams`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setExams(data);
                } else {
                    setError("Failed to fetch exams. Please try again later.");
                }
            } catch (err) {
                console.error("Error fetching exams:", err);
                setError("An error occurred while fetching exams. Please check your network connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const handleTakeTest = (examId) => {
        navigate(`/take-test/${examId}`);
    };

    return (
        <div className="student-dashboard-container-unique">
            {/* Sidebar */}
            <div className="student-sidebar-unique">
                <h2>Dashboard</h2>
                <ul>
                    <li onClick={() => navigate("/")}> Home</li>
                    <li onClick={() => navigate("/exams")}>Attempted Exams</li>
                    <li onClick={() => navigate("/profile")}> Profile</li>
                    <li onClick={() => navigate("/report")}> Report</li>
                    <li onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}> Logout</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="student-main-content-unique">
                <h1>Student Dashboard</h1>

                {loading && (
                    <div className="student-loading-unique">
                        <p>Loading exams...</p>
                    </div>
                )}
                {error && <p className="student-error-message-unique">{error}</p>}

                <div className="student-exam-list-unique">
                    {exams.length > 0 ? (
                        exams.map((exam) => (
                            <div key={exam._id} className="student-exam-item-unique">
                                <h3>{exam.title}</h3>
                                <p>{exam.description}</p>
                                <button className="student-dashboard-button-unique"
                                    onClick={() => handleTakeTest(exam._id)} 
                                    disabled={loading}
                                >
                                    Take Test
                                </button>
                            </div>
                        ))
                    ) : (
                        !loading && <p>No exams available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
