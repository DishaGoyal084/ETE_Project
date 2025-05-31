import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/Student.css"; // Add your custom CSS for styling

const ExamResult = () => {
    const { examId } = useParams(); // Get examId from URL params
    const [examResult, setExamResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate fetching exam result with a random score
        setTimeout(() => {
            const totalQuestions = 5;
            const randomScore = Math.floor(Math.random() * (totalQuestions + 1)); // Score between 0 and totalQuestions

            const sampleExamResult = {
                title: `Mock Exam - ${examId}`,
                score: randomScore,
                totalQuestions: totalQuestions
            };

            setExamResult(sampleExamResult);
            setLoading(false);
        }, 1000); // Simulating network delay
    }, [examId]);

    return (
        <div className="exam-result">
            <h1>Exam Results</h1>
            {loading && <p>Loading result...</p>}
            {error && <p>{error}</p>}

            {examResult && (
                <div>
                    <h2>{examResult.title}</h2>
                    <p>Your Score: {examResult.score} / {examResult.totalQuestions}</p>
                </div>
            )}
        </div>
    );
};

export default ExamResult;
