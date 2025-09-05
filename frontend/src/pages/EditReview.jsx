import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import { Rating } from '@mui/material';
import './styles/EditReview.css';

const EditReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/dashboard/editreview/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReview(response.data);
                setRating(response.data.rating);
                setComment(response.data.comment);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch review');
                setLoading(false);
            }
        };

        fetchReview();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:8080/dashboard/updatereview/${id}`,
                {
                    rating,
                    comment
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setSuccess('Review updated successfully');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update review');
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
            <div className="edit-review">
                <div className="edit-review__container">
                    <h2>Edit Review</h2>
                    {error && <div className="alert alert--error">{error}</div>}
                    {success && <div className="alert alert--success">{success}</div>}

                    {review && (
                        <div className="review-content">
                            <div className="car-info">
                                <img
                                    src={`http://localhost:8080/uploads/${review.image}`}
                                    alt={review.carName}
                                />
                                <h3>{review.carName}</h3>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Rating</label>
                                    <Rating
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setRating(newValue);
                                        }}
                                        size="large"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Your Review</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                        placeholder="Write your review here..."
                                    />
                                </div>

                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="btn btn--secondary"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn--primary">
                                        Update Review
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

export default EditReview; 