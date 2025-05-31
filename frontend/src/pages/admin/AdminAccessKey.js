import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';
import '../../styles/AdminAccessKey.css'; // Import CSS here

const AdminAccessKey = () => {
  const [accessKey, setAccessKey] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('access-key-page');
    return () => {
      document.body.classList.remove('access-key-page');
    };
  }, []);

  const verifyAccessKey = async (e) => {
    e.preventDefault();
    if (!accessKey) return handleError("Access key is required");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/admin/verify-access-key', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accessKey })
      });

      const result = await response.json();
      if (response.ok) {
        handleSuccess("Access granted!");
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      } else {
        handleError(result.message || "Access denied");
      }
    } catch (err) {
      handleError("Network error");
    }
  };

  return (
    <div className="access-key-container">
      <h2>Admin Access Key Verification</h2>
      <form onSubmit={verifyAccessKey}>
        <label htmlFor="accessKey">Access Key</label>
        <input
          id="accessKey"
          type="password"
          placeholder="Enter Access Key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
        />
        <button type="submit">Verify</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminAccessKey;
