import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
        role:'student'
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
        setLoginInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password, role } = loginInfo;
        if (!email || !password ||!role) {
            return handleError('email, password and role are required')
        }
        try {
            const url = `http://localhost:8080/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error} = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('userRole',result.role);
                if (result.role === 'admin') {
                    setTimeout(() => {
                    navigate('/admin/access-key');
                    }, 1000);
                }else{
                    const redirectPath = result.role === 'examiner' 
                    ? '/examiner/dashboard' 
                    : '/student/dashboard';
            
                    setTimeout(() => {
                        navigate(redirectPath);
                    }, 1000);
                }
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                    <div>
                    <label htmlFor='role'>Role</label>
                    <select
                        name="role"
                        value={loginInfo.role}
                        onChange={handleChange}
                    >
                        <option value="student">Student</option>
                        <option value="examiner">Examiner</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                </div>
                <button type='submit'>Login</button>
                <span>Does't have an account ?
                    <Link to="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login;