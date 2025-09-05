import React, { useState, useEffect } from 'react';
import './styles/auctionCarForm.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';

export default function AuctionCarForm() {
    const [formData, setFormData] = useState({
        image: null,
        make: '',
        model: '',
        year: '',
        miles: '',
        type: '',
        minimumBid: '',
        condition: '',
        auctionDuration: '',
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
            const response = await fetch('http://localhost:8080/auction/create', {
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
                        Car auction registered successfully!
                    </div>
                    <div style={{ fontSize: '1rem', marginTop: '1rem' }}>
                        Redirecting to home page in 3 seconds...
                    </div>
                </div>
            ) : (
                <div className="auctionCarForm">
                    <div className="form-container">
                        <h2>Auction Your Car</h2>
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
                                <label htmlFor="miles">Mileage</label>
                                <input
                                    type="number"
                                    id="miles"
                                    name="miles"
                                    value={formData.miles}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type">Vehicle Type</label>
                                <input
                                    type="text"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="minimumBid">Minimum Bid Amount</label>
                                <input
                                    type="number"
                                    id="minimumBid"
                                    name="minimumBid"
                                    value={formData.minimumBid}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="condition">Condition</label>
                                <select
                                    id="condition"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Condition</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Poor">Poor</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="auctionDuration">Auction Duration (days)</label>
                                <input
                                    type="number"
                                    id="auctionDuration"
                                    name="auctionDuration"
                                    value={formData.auctionDuration}
                                    onChange={handleChange}
                                    min="1"
                                    max="30"
                                    required
                                />
                            </div>

                            <button type="submit">Register Auction</button>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}