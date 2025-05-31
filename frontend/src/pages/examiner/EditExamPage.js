import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Examiner.css"; 

const EditExamPage = () => {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        duration: '',
        questions: [],
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://ete-project.onrender.com/api/exams/${examId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch exam data");
                }

                const data = await response.json();
                setExam(data);
                setFormData({
                    title: data.title,
                    description: data.description,
                    date: new Date(data.date).toISOString().split('T')[0],
                    duration: data.duration,
                    questions: data.questions,
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchExam();
    }, [examId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`https://ete-project.onrender.com/api/exams/${examId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update exam");
            }

            alert("Exam updated successfully");
            navigate("/manage-exam");
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <p>Loading exam...</p>;
    }

    return (
        <div className="edit-exam">
            <h1>Edit Exam</h1>

            {error && <p className="error">{error}</p>}

            {exam && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Duration (minutes)</label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Questions</label>
                        {formData.questions.map((question, index) => (
                            <div key={index} className="question">
                                <label>Question {index + 1}</label>
                                <input
                                    type="text"
                                    name={`question-${index}`}
                                    value={question.text}
                                    onChange={(e) => {
                                        const updatedQuestions = [...formData.questions];
                                        updatedQuestions[index].text = e.target.value;
                                        setFormData({ ...formData, questions: updatedQuestions });
                                    }}
                                    required
                                />
                                <textarea
                                    name={`options-${index}`}
                                    value={question.options.join(", ")}
                                    onChange={(e) => {
                                        const updatedQuestions = [...formData.questions];
                                        updatedQuestions[index].options = e.target.value.split(",").map(opt => opt.trim());
                                        setFormData({ ...formData, questions: updatedQuestions });
                                    }}
                                    required
                                />
                                <input
                                    type="text"
                                    name={`correctAnswer-${index}`}
                                    value={question.correctAnswer}
                                    onChange={(e) => {
                                        const updatedQuestions = [...formData.questions];
                                        updatedQuestions[index].correctAnswer = e.target.value;
                                        setFormData({ ...formData, questions: updatedQuestions });
                                    }}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <button type="submit">Update Exam</button>
                </form>
            )}
        </div>
    );
};

export default EditExamPage;
