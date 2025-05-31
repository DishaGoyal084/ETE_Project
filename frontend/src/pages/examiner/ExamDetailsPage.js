// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../../styles/Examiner.css"; // Make sure this CSS file exists

// const ExamDetailsPage = () => {
//     const { _id } = useParams(); // Get exam ID from URL
//     const navigate = useNavigate();
//     const [exam, setExam] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         console.log("Fetching exam details for ID:", _id);

//         fetchExamDetails();
//     }, []);

//     const fetchExamDetails = async () => {
//         if (!_id) {
//             console.error("Error: Exam ID is undefined");
//             return;
//         }
//         try {
//             const token = localStorage.getItem("token");
//             const response = await fetch(`http://localhost:8080/api/exams/${_id}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch exam: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log("Fetched exam details:", data);
//             setExam(data);
//             setLoading(false);
//         } catch (error) {
//             setError(error.message);
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <p>Loading exam details...</p>;
//     }

//     if (error) {
//         return <p>Error: {error}</p>;
//     }

//     return (
//         <div className="exam-details-container">
//             <div className="exam-header">
//                 <h1>{exam.title}</h1>
//                 <p className="exam-description">{exam.description}</p>
//                 <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
//             </div>

//             <h2>Questions</h2>
//             <div className="question-list">
//                 {exam.questions.length === 0 ? (
//                     <p>No questions available.</p>
//                 ) : (
//                     exam.questions.map((question, index) => (
//                         <div key={index} className="question-card">
//                             <h3>Q{index + 1}: {question.questionText}</h3>
//                             <ul>
//                                 {question.options.map((option, i) => (
//                                     <li key={i}>{option}</li>
//                                 ))}
//                             </ul>
//                             <p className="correct-answer"><strong>Correct Answer:</strong> {question.correctAnswer}</p>
//                         </div>
//                     ))
//                 )}
//             </div>

//             <button className="back-btn" onClick={() => navigate("/new-exams")}>Back to Exams</button>
//         </div>
//     );
// };

// export default ExamDetailsPage;
