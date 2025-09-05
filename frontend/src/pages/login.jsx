import { useState } from 'react';
import './styles/login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/login', credentials);
            const { token, user, message } = response.data;

            // Store the token in local storage or a global state
            localStorage.setItem('token', token);
            // console.log(token);
            // Optionally store user information
            localStorage.setItem('user', JSON.stringify(user));

            setMessage(message);
            navigate('/');
            // Redirect or perform other actions after successful login
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                {message && <p className="login-message">{message}</p>}
                <p className="register-link">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </div>
        </div>
    );
}