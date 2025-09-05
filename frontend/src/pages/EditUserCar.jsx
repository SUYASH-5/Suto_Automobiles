import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import './styles/EditProfile.css';

const EditUserCar = () => {
    const { collection, id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        price: '',
        mileage: '',
        condition: '',
        type: '',
        engine: '',
        transmission: '',
        minimumBid: '',
        auctionDuration: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/dashboard/editcar/${collection}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCar(response.data);
                setFormData(response.data);
            } catch (error) {
                setError('Failed to fetch car details');
                console.error('Error:', error);
            }
        };

        fetchCar();
    }, [collection, id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:8080/dashboard/cars/${collection}/update/${id}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setSuccess('Car updated successfully');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update car');
        }
    };

    const renderFields = () => {
        // Common fields for all car types
        const commonFields = (
            <>
                <div className="form-group">
                    <label>Make</label>
                    <input
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Model</label>
                    <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Year</label>
                    <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Condition</label>
                    <input
                        type="text"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    />
                </div>
            </>
        );

        // Collection-specific fields
        switch (collection) {
            case 'usedcars':
                return (
                    <>
                        {commonFields}
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mileage</label>
                            <input
                                type="number"
                                name="mileage"
                                value={formData.mileage}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );
            case 'newcars':
                return (
                    <>
                        {commonFields}
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Engine</label>
                            <input
                                type="text"
                                name="engine"
                                value={formData.engine}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Transmission</label>
                            <input
                                type="text"
                                name="transmission"
                                value={formData.transmission}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );
            case 'auction':
                return (
                    <>
                        {commonFields}
                        <div className="form-group">
                            <label>Minimum Bid</label>
                            <input
                                type="number"
                                name="minimumBid"
                                value={formData.minimumBid}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Auction Duration (days)</label>
                            <input
                                type="number"
                                name="auctionDuration"
                                value={formData.auctionDuration}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (!car) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="edit-profile">
                <div className="content">
                    <div className="edit-profile__container">
                        <h2>Edit Car Details</h2>
                        {error && <div className="alert alert--error">{error}</div>}
                        {success && <div className="alert alert--success">{success}</div>}
                        <form onSubmit={handleSubmit}>
                            {renderFields()}
                            <div className="button-group">
                                <button
                                    type="button"
                                    className="btn btn--secondary"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn--primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EditUserCar; 