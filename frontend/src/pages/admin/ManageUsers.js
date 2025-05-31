import React, { useEffect, useState } from 'react';
import '../../styles/ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://ete-project.onrender.com/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        alert(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const deleteUser = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter(user => user._id !== id));
        alert('User deleted');
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  return (
    <div className="manage-users-container">
      <h1>Manage Users</h1>

      <div className="filter-bar">
        <label>Filter by role: </label>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="student">Students</option>
          <option value="examiner">Examiners</option>
        </select>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="delete-button" onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
