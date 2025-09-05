import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './styles/register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userData = { username, email, confirmPassword, phone };

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                // Handle successful registration (e.g., navigate to a different page or show a success message)
                navigate('/');
            } else {
                // Handle errors (e.g., show an error message)
                const errorData = await response.json();
                console.error('Error:', errorData);
                setError(errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred during registration. Please try again.');
        }
    };

    return (
        <div className="register">
            <div className="register__container">
                <div className="register__header">
                    <h2>Create your account</h2>
                </div>

                <form className="register__form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="register__error">
                            {error}
                        </div>
                    )}

                    <div className="form__group">
                        <label htmlFor="username">Name</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form__group">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form__group">
                        <label htmlFor="phone">Phone number</label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            required
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="form__group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form__group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="register__button">
                        Register
                    </button>
                </form>

                <div className="register__login-link">
                    <a href="/login">Already have an account? Sign in</a>
                </div>
            </div>
        </div>
    );
}

export default Register;