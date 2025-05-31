import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Examiner.css";

const ManageExamsPage = () => {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {           
            const token = localStorage.getItem("token"); 
            const response = await fetch(`https://ete-project.onrender.com/api/exams`, {
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

    const deleteExam = async (examId) => {
        try {
            const token = localStorage.getItem("token");
            console.log("Deleting exam with ID:", examId);
            const response = await fetch(`https://ete-project.onrender.com/api/exams/${examId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            console.log("Response:", response);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete exam: ${errorText}`);
            }
            setExams(exams.filter(exam => exam._id !== examId));
        } catch (error) {
            console.error("Error deleting exam:", error);
        }
    };

    const editExam = (examId) => {
        navigate(`/edit-exam/${examId}`);
    };

    return (
        <div className="exam-container">
            <aside className="sidebar">
                <h2>Exam Portal</h2>
                <ul>
                    <li><Link to="/create-exam">Create Exam</Link></li>
                    <li><Link to="/manage-exam" className="active">Manage Exams</Link></li>
                    <li><Link to="/teacher/report">Student's Submissions</Link></li>
                    <li><button onClick={() => navigate("/login")}>Logout</button></li>
                </ul>
            </aside>

            <main className="exam-list">
                <h2>Manage Exams</h2>
                {exams.length === 0 ? (
                    <p>No exams available.</p>
                ) : (
                    <div className="exam-grid">
                        {exams.map((exam) => (
                            <div className="exam-card" key={exam._id}>
                                <h3>{exam.title || exam.name}</h3>
                                <p>{new Date(exam.date).toDateString()}</p>
                                <button className="edit-btn" onClick={() => editExam(exam._id)}>Edit</button>
                                <button className="delete-btn" onClick={() => deleteExam(exam._id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageExamsPage;

