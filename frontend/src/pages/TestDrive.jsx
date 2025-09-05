import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import './styles/TestDrive.css';

const TestDrive = () => {
    const { collection, id } = useParams();
    const navigate = useNavigate();
    const [carDetails, setCarDetails] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/${collection}/testdrive/${id}`);
                setCarDetails(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch car details');
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [collection, id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/${collection}/testdrive/request/${id}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setSuccess('Test drive request submitted successfully!');
            setTimeout(() => {
                navigate(`/${collection}/car/${id}`);
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit test drive request');
        }
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="loader"></div>
            <p>Loading...</p>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="test-drive">
                <div className="test-drive__container">
                    <h2>Schedule Test Drive</h2>
                    {error && <div className="alert alert--error">{error}</div>}
                    {success && <div className="alert alert--success">{success}</div>}

                    {carDetails && (
                        <div className="content">
                            <div className="car-info">
                                <img
                                    src={`http://localhost:8080/uploads/${carDetails.image}`}
                                    alt={`${carDetails.make} ${carDetails.model}`}
                                />
                                <div className="car-details">
                                    <h3>{carDetails.make} {carDetails.model}</h3>
                                    <p className="year">Year: {carDetails.year}</p>
                                    <p className="price">Price: ${carDetails.price?.toLocaleString()}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="test-drive-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Preferred Date</label>
                                        <input
                                            type="date"
                                            name="preferredDate"
                                            value={formData.preferredDate}
                                            onChange={handleChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Preferred Time</label>
                                    <select
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a time</option>
                                        <option value="morning">Morning (9 AM - 12 PM)</option>
                                        <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                        <option value="evening">Evening (4 PM - 7 PM)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Additional Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Any specific requirements or questions..."
                                    />
                                </div>

                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="btn btn--secondary"
                                        onClick={() => navigate(`/${collection}/car/${id}`)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn--primary">
                                        Schedule Test Drive
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TestDrive; 