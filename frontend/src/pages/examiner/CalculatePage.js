import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CalculatePage = () => {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [studentAnswers, setStudentAnswers] = useState([]);

    useEffect(() => {
        axios.get(`/api/exams/${examId}`)
            .then(response => {
                setExam(response.data);
            })
            .catch(error => {
                console.error('Error fetching exam:', error);
            });

        axios.get(`/api/submissions/${examId}`)
            .then(response => {
                setStudentAnswers(response.data);
            })
            .catch(error => {
                console.error('Error fetching submissions:', error);
            });
    }, [examId]);

    return (
        <div>
            {exam && (
                <div>
                    <h2>{exam.title}</h2>
                    <h3>Student Answers</h3>
                    {exam.questions.map((question, index) => (
                        <div key={index}>
                            <h4>{question.text}</h4>
                            <p>Your answer: {studentAnswers[index] ? studentAnswers[index].answer : "Not answered"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CalculatePage;
