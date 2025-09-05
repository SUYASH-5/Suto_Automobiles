import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/sellNewCarForm.css';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

export default function SellNewCarForm() {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        price: '',
        engine: '',
        transmission: '',
        image: null,
        sellerName: '',
        type: '',
        condition: 'New'  // Default value since it's a new car
    });
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        formDataToSend.append('email', user.email);
        formDataToSend.append('username', user.username);

        try {
            const response = await fetch('http://localhost:8080/newcars/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend,
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.clear();
                navigate('/login');
                return;
            }

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="body">
            <Navbar />
            {submitted ? (
                <div>
                    <div className="confirmation" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2rem', color: 'green' }}>
                        New car registered successfully!
                    </div>
                    <div style={{ fontSize: '1rem', marginTop: '1rem' }}>
                        Redirecting to home page in 3 seconds...
                    </div>
                </div>
            ) : (
                <div className="sellNewCarForm">
                    <div className="form-container">
                        <h2>Sell Your New Car</h2>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="form-group">
                                <label htmlFor="image">Car Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleChange}
                                    accept="image/*"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type">Vehicle Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Van">Van</option>
                                    <option value="Coupe">Coupe</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="make">Make</label>
                                <input
                                    type="text"
                                    id="make"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="model">Model</label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="year">Year</label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="engine">Engine</label>
                                <input
                                    type="text"
                                    id="engine"
                                    name="engine"
                                    value={formData.engine}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="transmission">Transmission</label>
                                <select
                                    id="transmission"
                                    name="transmission"
                                    value={formData.transmission}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Transmission</option>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                    <option value="CVT">CVT</option>
                                </select>
                            </div>

                            <button type="submit">Register Car</button>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
} 