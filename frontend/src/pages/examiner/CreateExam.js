import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Examiner.css";


const CreateExamPage = () => {
    const [examData, setExamData] = useState({
        title: "",
        date: "",
        duration: "",
        description: "",
        questions: []
    });

    console.log("Final Exam Data:", examData);
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        options: ["", "", "", ""], 
        correctAnswer: ""
    });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setExamData({ ...examData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (e) => {
        setNewQuestion({ ...newQuestion, text: e.target.value });
    };

    const handleOptionChange = (index, value) => {
        setNewQuestion(prev => {
            const updatedOptions = [...prev.options];
            updatedOptions[index] = value;
            return { ...prev, options: updatedOptions };
        });
    };    

    const handleCorrectAnswerChange = (e) => {
        setNewQuestion({ ...newQuestion, correctAnswer: e.target.value });
    };

    const addQuestion = () => {
        const trimmedOptions = newQuestion.options.map(opt => opt.trim());
        if (trimmedOptions.some(opt => opt === "")) {
            alert("Please fill all options.");
            return;
        }
    
        setExamData(prevData => ({
            ...prevData,
            questions: [...prevData.questions, { ...newQuestion, options: trimmedOptions }]
        }));
    
        setNewQuestion({ text: "", options: ["", "", "", ""], correctAnswer: "" });
    };
    
    const examiner = localStorage.getItem("examiner") || sessionStorage.getItem("examiner");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            setError("Authentication token is missing. Please log in.");
            setLoading(false);
            return;
        }

        const examPayload = {
            title: examData.title,
            description: examData.description,
            date: examData.date,
            duration: examData.duration,
            examiner,
            questions: examData.questions
        };

        console.log("Sending Exam Data:", examPayload);
        try {
            const response = await fetch(`https://ete-project.onrender.com/api/exams`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(examPayload),
            });
            const data = await response.json();
            console.log("Response from server:", data);
            if (!response.ok) {
                throw new Error("Failed to create exam");
            }

            setSuccess(true);
            navigate("/new-exams");
        } catch (error) {
            console.error("Error creating exam:", error);
            setError("Failed to create exam. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="exam-container">
            <aside className="exam-sidebar">
                <h2>Exam Portal</h2>
                <ul>
                    <li><a href="/create-exam" className="active">Create Exam</a></li>
                    <li><a href="/manage-exam">Manage Exams</a></li>
                    <li><a href="/results">Results</a></li>
                    <li><button onClick={() => navigate("/login")}>Logout</button></li>
                </ul>
            </aside>

            <main className="exam-main-content">
                <div className="exam-header">
                    <h1>Create Exam</h1>
                </div>

                {success && <div className="exam-success-message">Exam Created Successfully!</div>}
                {error && <div className="exam-error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="exam-form-group">
                        <label>Exam Name:</label>
                        <input type="text" name="title" value={examData.title} onChange={handleChange} required />
                    </div>

                    <div className="exam-form-group">
                        <label>Date:</label>
                        <input type="date" name="date" value={examData.date} onChange={handleChange} required />
                    </div>

                    <div className="exam-form-group">
                        <label>Duration (minutes):</label>
                        <input type="number" name="duration" value={examData.duration} onChange={handleChange} required />
                    </div>

                    <div className="exam-form-group">
                        <label>Description:</label>
                        <textarea name="description" value={examData.description} onChange={handleChange} rows="4" required />
                    </div>

                    {/* Add Questions Section */}
                    <div className="exam-questions-section">
                        <h2>Add Questions</h2>
                        <div className="exam-form-group">
                            <label>Question:</label>
                            <input type="text" value={newQuestion.text} onChange={handleQuestionChange} required />
                        </div>

                        {/* Options */}
                        {newQuestion.options.map((option, index) => (
                            <div key={index} className="exam-form-group">
                                <label>Option {index + 1}:</label>
                                <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} required />
                            </div>
                        ))}

                        {/* Correct Answer */}
                        <div className="exam-form-group">
                            <label>Correct Answer:</label>
                            <input type="text" value={newQuestion.correctAnswer} onChange={handleCorrectAnswerChange} required />
                        </div>

                        <button type="button" className="exam-btn-add" onClick={addQuestion}>Add Question</button>
                    </div>

                    {/* Display Added Questions */}
                    {examData.questions.length > 0 && (
                        <div className="exam-added-questions">
                            <h3>Questions Added</h3>
                            <ul>
                                {examData.questions.map((q, i) => (
                                    <li key={i}>
                                        <strong>{q.text}</strong>
                                        <ul>
                                            {q.options.map((opt, j) => (
                                                <li key={j}>{opt} {q.correctAnswer === opt && "✅"}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button type="submit" className="exam-btn">Create Exam</button>
                </form>
            </main>
        </div>
    );
};

export default CreateExamPage;