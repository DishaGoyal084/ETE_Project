import React, { useState, useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import "../../styles/Examiner.css"; 

const NewExamsPage = () => {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {           
            const token = localStorage.getItem("token"); 
            const response = await fetch(`https://ete-project.onrender.com/Linkpi/exams`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(`Failed to fetch exams: ${response.status}`);
            const data = await response.json();
            setExams(data);
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    };

    const openExam = (examId) => {
        navigate(`/exam/${examId}`); // Navigate to the exam details page
    };

    return (
        <div className="exam-container">
            <aside className="sidebar">
                <h2>Exam Portal</h2>
                <ul>
                    <li><Link to="/new-exams" className="active">New Exams</Link></li>
                    <li><Link to="/create-exam">Create Exam</Link></li>
                    
                    <li><Link to="/manage-exam">Manage Exams</Link></li>
                    <li><Link to="/teacher/report">Student's Submissions</Link></li>
                    <li><Link to="/results">Results</Link></li>
                    <li><button onClick={() => navigate("/login")}>Logout</button></li>
                </ul>
            </aside>

            <main className="exam-list">
                <h2>New Exams</h2>
                {exams.length === 0 ? (
                    <p>No exams available.</p>
                ) : (
                    <div className="exam-grid">
                        {exams.map((exam) => (
                            <div className="exam-card" key={exam._id}>
                                <h3>{exam.title || exam.name}</h3>
                                <p>{new Date(exam.date).toDateString()}</p>
                                <button className="open-btn" onClick={() => openExam(exam._id)}>Open Exam</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default NewExamsPage;
