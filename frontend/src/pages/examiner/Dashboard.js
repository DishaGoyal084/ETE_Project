import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError } from "../../utils";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "../../styles/Examiner.css";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function ExaminerDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/exams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch exams");
        const data = await response.json();
        setExams(data);
      } catch (error) {
        handleError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const attendanceData = {
    labels: ["Not Attended", "Appeared"],
    datasets: [
      {
        label: "Students",
        data: [19, 5], 
        backgroundColor: ["#ffcc00", "#28a745"],
      },
    ],
  };

  const resultData = {
    labels: ["Pass", "Fail", "Not Attended"],
    datasets: [
      {
        label: "Results",
        data: [3, 2, 19], 
        backgroundColor: ["#28a745", "#dc3545", "#007bff"],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      
      <aside className="sidebar">
        <h2>Examiner Panel</h2>
        <ul>
         
          <li>
            <Link to="/create-exam">Create Exam</Link>
          </li>
          <li>
            <Link to="/manage-exam">Manage Exams</Link>
          </li>
          <li>
            <Link to="/teacher/report">Student's Submissions</Link>
          </li>
          <li>
            <Link to="/results">View Results</Link>
          </li>
          <li>
            <button 
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>

    
      <main className="main-content">
        <header className="examiner-header">
          <h1>Exam Analysis Dashboard</h1>
          <select className="exam-dropdown">
            <option>Select Exam</option>
            {exams.map((exam) => (
              <option key={exam._id}>{exam.title}</option>
            ))}
          </select>
        </header>

        
        <div className="dashboard-stats">
          <div className="stat-card green">
            <h3>24</h3>
            <p>Total Candidates</p>
          </div>
          <div className="stat-card red">
            <h3>20%</h3>
            <p>Attendance</p>
          </div>
          <div className="stat-card orange">
            <h3>5</h3>
            <p>Evaluation</p>
          </div>
          <div className="stat-card green">
            <h3>20</h3>
            <p>Max Marks</p>
          </div>
          <div className="stat-card orange">
            <h3>5</h3>
            <p>Passing Marks</p>
          </div>
          <div className="stat-card blue">
            <h3>11</h3>
            <p>Total Questions</p>
          </div>
        </div>

        
        <div className="charts-container">
          <div className="chart-box">
            <h3>Attendance</h3>
            <Bar data={attendanceData} />
          </div>
          <div className="chart-box">
            <h3>Results</h3>
            <Pie data={resultData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ExaminerDashboard;
