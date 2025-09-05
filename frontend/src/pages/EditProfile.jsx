import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/EditProfile.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        _id: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await axios.get(`http://localhost:8080/dashboard/update`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        email: user.email,
                    }
                });
                setFormData(prev => ({
                    ...prev,
                    username: response.data.username,
                    email: response.data.email,
                    phone: response.data.phone,
                    _id: response.data._id
                }));
            } catch (error) {
                setError('Failed to fetch user details');
            }
        };

        fetchUserDetails();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            [e.target.email]: e.target.value,
            [e.target.phone]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword || formData.currentPassword) {
            if (formData.newPassword !== formData.confirmNewPassword) {
                setError('New passwords do not match');
                return;
            }
            if (formData.newPassword.length < 6) {
                setError('New password must be at least 6 characters long');
                return;
            }
        }

        try {
            const token = localStorage.getItem('token');
            const updateData = {
                email: formData.email,
                username: formData.username,
                phone: formData.phone,
                id: formData._id,
                ...(formData.currentPassword && {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            };

            await axios.put(`http://localhost:8080/dashboard/update_user`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            // Update user in localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = {
                ...currentUser,
                email: formData.email,
                username: formData.username
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSuccess('Profile updated successfully');
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }));

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="div">
            <Navbar />
            <div className="edit-profile">
                <div className="content">

                    <div className="edit-profile__container">
                        <h2>Edit Profile</h2>

                        {error && (
                            <div className="alert alert--error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="alert alert--success">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Current Password (only if changing password)</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="button-group">
                                <button type="submit" className="btn btn--primary">
                                    Update Profile
                                </button>
                                <button
                                    type="button"
                                    className="btn btn--secondary"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditProfile;