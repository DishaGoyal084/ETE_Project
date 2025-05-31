import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student' 
    })

    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('auth-page');
        return () => {
            document.body.classList.remove('auth-page');
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, role } = signupInfo;
        if (!name || !email || !password || !role) {
            return handleError('All fields are required');
        }
        try {
            const response = await fetch(`https://ete-project.onrender.com/auth/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                handleSuccess(result.message);
                setTimeout(() => navigate('/login'), 1000);
            } else {
                handleError(result.message || 'Registration failed');
            }
        } catch (err) {
            handleError(err.message || 'Network error');
        }
    }

    return (
        <div className='container'>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        autoFocus
                        placeholder='Enter your name...'
                        value={signupInfo.name}
                    />
                </div>
                
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                    />
                </div>
                
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={signupInfo.password}
                    />
                </div>
                
                {/* Role Selection Dropdown */}
                <div>
                    <label htmlFor='role'>Role</label>
                    <select
                        name="role"
                        value={signupInfo.role}
                        onChange={handleChange}
                    >
                        <option value="student">Student</option>
                        <option value="examiner">Examiner</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type='submit'>Signup</button>
                <span>Already have an account?
                    <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Signup;