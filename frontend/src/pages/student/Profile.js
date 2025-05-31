import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";

const Profile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStudent, setEditedStudent] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/student/profile`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setStudent(data);
                    setEditedStudent(data); // Set the data to the edit state as well
                } else {
                    setError(data.message || "Failed to fetch profile.");
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("An error occurred while fetching profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle input change for profile editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedStudent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit the edited profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/student/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(editedStudent),
            });

            const data = await response.json();
            if (response.ok) {
                setStudent(editedStudent); // Update profile with new data
                setIsEditing(false); // Exit edit mode
            } else {
                setError(data.message || "Failed to update profile.");
            }
        } catch (err) {
            console.error("Profile update error:", err);
            setError("An error occurred while updating profile.");
        }
    };

    return (
        <div className="student-profile">
            <div className="sidebar">
                <ul>
                    <li onClick={() => navigate("/")}>Home</li>
                    <li onClick={() => navigate("/student/dashboard")}>Dashboard</li>
                    <li onClick={() => navigate("/exams")}>Attempted Exams</li>
                    <li onClick={() => navigate("/profile")}>Profile</li>
                    <li onClick={() => navigate("/report")}>Report</li>
                    <li onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}>Logout</li>
                </ul>
            </div>

            <div className="profile-content">
                <h1>Student Profile</h1>

                {loading && <p>Loading profile...</p>}
                {error && <p className="error">{error}</p>}

                {student && (
                    <div className="profile-card">
                        {isEditing ? (
                            <form onSubmit={handleSubmit}>
                                <p>
                                    <label><strong>Name:</strong></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedStudent.name}
                                        onChange={handleInputChange}
                                    />
                                </p>
                                <p>
                                    <label><strong>Email:</strong></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editedStudent.email}
                                        onChange={handleInputChange}
                                    />
                                </p>
                                <p>
                                    <label><strong>Enrollment No:</strong></label>
                                    <input
                                        type="text"
                                        name="enrollmentNo"
                                        value={editedStudent.enrollmentNo}
                                        onChange={handleInputChange}
                                    />
                                </p>
                                <p>
                                    <label><strong>Department:</strong></label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={editedStudent.department}
                                        onChange={handleInputChange}
                                    />
                                </p>
                                <p>
                                    <label><strong>Year:</strong></label>
                                    <input
                                        type="text"
                                        name="year"
                                        value={editedStudent.year}
                                        onChange={handleInputChange}
                                    />
                                </p>
                                <button type="submit">Save Changes</button>
                            </form>
                        ) : (
                            <>
                                <p><strong>Name:</strong> {student.name}</p>
                                <p><strong>Email:</strong> {student.email}</p>
                                <p><strong>Enrollment No:</strong> {student.enrollmentNo}</p>
                                <p><strong>Department:</strong> {student.department}</p>
                                <p><strong>Year:</strong> {student.year}</p>
                                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
