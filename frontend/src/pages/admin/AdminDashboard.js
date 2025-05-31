import React, { useEffect, useState } from 'react';
import '../../styles/AdminDashboard.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {Link,  useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, examiners: 0 });
  const navigate=useNavigate();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://ete-project.onrender.com/admin/user-stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          console.error(data.message || 'Failed to fetch stats');
        }
      } catch (err) {
        console.error('Network error');
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: ['Students', 'Examiners'],
    datasets: [
      {
        data: [stats.students, stats.examiners],
        backgroundColor: ['#4CAF50', '#FF9800'],
        hoverBackgroundColor: ['#45a049', '#fb8c00'],
      },
    ],
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li onClick={() => navigate("/admin/manage-users")}>Manage Users</li>
          {/* <li onClick={() => navigate("/admin/settings")}>Settings</li> */}
          <li onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</li>
        </ul>
      </aside>

      <main className="admin-main-content">
        <h1>User Statistics</h1>
        <div className="admin-stats">
          <div className="admin-stat-box">
            <h3>Students</h3>
            <p>{stats.students}</p>
          </div>
          <div className="admin-stat-box">
            <h3>Examiners</h3>
            <p>{stats.examiners}</p>
          </div>
        </div>

        <div className="admin-graph-wrapper">
          <Pie data={chartData} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;