import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/Student.css";

const TakeTest = () => {
    const { examId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [total, setTotal] = useState(null);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const maxTabSwitches = 2;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExam = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token is missing. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/student/exams/${examId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const text = await response.text();
                console.log('Raw Response:', text);

                try {
                    const data = JSON.parse(text);
                    if (response.ok) {
                        setExam(data);
                        setTimeLeft(data.duration * 60);
                    } else {
                        setError(data.message || "Failed to fetch the exam details.");
                    }
                } catch (err) {
                    console.error("Failed to parse JSON:", err);
                    setError("Failed to parse the response from the server.");
                }
            } catch (err) {
                console.error("Error fetching exam:", err);
                setError("Failed to fetch exam.");
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [examId]);

    useEffect(() => {
        if (timeLeft === null || submitted) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, submitted]);

    const handleSubmit = async () => {
        if (!exam || !exam.questions) {
            setError("Exam data is missing or incomplete.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authentication token is missing. Please log in.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/student/exams/${examId}/submit`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ answers }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Test submitted successfully");
                setSubmitted(true);
                setScore(data.score);
                setTotal(data.total);
            } else {
                setError(data.message || "Failed to submit the test.");
            }
        }
        catch (err) {
            console.error("Error submitting test:", err);
            setError("Failed to submit the test.");
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount(prev => {
                    const newCount = prev + 1;
                    alert(`Tab switched ${newCount} time(s).`);
                    if (newCount >= 3) {
                        alert("Too many tab switches! Auto-submitting your test.");
                        handleSubmit();
                    }
                    return newCount;
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [handleSubmit]);


    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answer,
        }));
    };



    return (
        <div className="take-test">
            <h1>Take Test</h1>
            {loading && <p>Loading exam...</p>}
            {error && <p>{error}</p>}

            {exam && (
                <div>
                    <h2>{exam.title}</h2>
                    <p>{exam.description}</p>

                    <div className="timer">
                        <strong>Time Left: </strong>
                        <span style={{ color: timeLeft < 60 ? "red" : "black" }}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    <div className="exam-questions">
                        {exam.questions.map((question, index) => (
                            <div key={index} className="question">
                                <p>{index + 1}. {question.text}</p>
                                <div>
                                    {question.options && question.options.length > 0 && (
                                        question.options.map((option, i) => (
                                            <label key={i}>
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value={option}
                                                    checked={answers[index] === option}
                                                    onChange={() => handleAnswerChange(index, option)}
                                                    disabled={submitted}
                                                />
                                                {option}
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleSubmit} disabled={submitted}>
                        {submitted ? "Test Submitted" : "Submit Test"}
                    </button>

                    {submitted && score !== null && (
                        <div className="after-submit">
                            <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
                                Back to Dashboard
                            </button>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default TakeTest;
