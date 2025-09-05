import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/contactSeller.css';
import Navbar from "../Components/Navbar/Navbar.jsx";
import Footer from '../Components/Footer/Footer.jsx';
import { Rating } from '@mui/material';

export default function ContactSeller() {
    const { collection, id } = useParams();
    const navigate = useNavigate();
    const [carDetails, setCarDetails] = useState(null);
    const [sellerDetails, setSellerDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [similarCars, setSimilarCars] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // First fetch car details
                const carResponse = await axios.get(`http://localhost:8080/${collection}/car/${id}`);
                setCarDetails(carResponse.data);

                // Then fetch seller details using the userid from car details
                const sellerResponse = await axios.get(`http://localhost:8080/user/${carResponse.data.userid}`);
                setSellerDetails(sellerResponse.data);

                // Fetch reviews for this car
                const reviewsResponse = await axios.get(`http://localhost:8080/${collection}/reviews/${id}`);
                setReviews(reviewsResponse.data);

                // Fetch similar cars
                const similarResponse = await axios.get(`http://localhost:8080/${collection}/similar/${id}`);
                setSimilarCars(similarResponse.data);

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch details');
                setLoading(false);
                console.error('Error:', err);
            }
        };

        fetchDetails();
    }, [collection, id]);

    const handleContact = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        // Implement contact logic here - could open email client or chat
        window.location.href = `mailto:${sellerDetails.email}`;
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await axios.post(`http://localhost:8080/${collection}/review/${id}`, {
                rating,
                comment: review,
                reviewerName: user.username,
                reviewerEmail: user.email,
                carName: carDetails.make + ' ' + carDetails.model,
                image: carDetails.image
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh reviews
            const reviewsResponse = await axios.get(`http://localhost:8080/${collection}/reviews/${id}`);
            setReviews(reviewsResponse.data);

            // Reset form
            setReview('');
            setRating(0);
            setShowReviewForm(false);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="loader"></div>
            <p>Loading details...</p>
        </div>
    );

    if (error) return (
        <div className="error-message">
            <p>{error}</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="contact-seller-container">
                {carDetails && sellerDetails && (
                    <div className="car-details-wrapper">
                        <div className="car-image-section">
                            <img
                                src={`http://localhost:8080/uploads/${carDetails.image}`}
                                alt={`${carDetails.make} ${carDetails.model}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-car.jpg';
                                }}
                            />
                        </div>

                        <div className="details-section">
                            <div className="car-info-section">
                                <h2>{carDetails.make} {carDetails.model}</h2>
                                <div className="car-specs">
                                    <div className="spec-item">
                                        <span className="label">Year:</span>
                                        <span className="value">{carDetails.year}</span>
                                    </div>
                                    {carDetails.engine && (
                                        <div className="spec-item">
                                            <span className="label">Engine:</span>
                                            <span className="value">{carDetails.engine}</span>
                                        </div>
                                    )}
                                    {carDetails.transmission && (
                                        <div className="spec-item">
                                            <span className="label">Transmission:</span>
                                            <span className="value">{carDetails.transmission}</span>
                                        </div>
                                    )}
                                    {carDetails.mileage && (
                                        <div className="spec-item">
                                            <span className="label">Mileage:</span>
                                            <span className="value">{carDetails.mileage} km</span>
                                        </div>
                                    )}
                                    <div className="spec-item">
                                        <span className="label">Type:</span>
                                        <span className="value">{carDetails.type}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="label">Condition:</span>
                                        <span className="value">{carDetails.condition}</span>
                                    </div>
                                    <div className="spec-item price">
                                        <span className="label">Price:</span>
                                        <span className="value">${carDetails.price?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="seller-info-section">
                                <h3>Seller Information</h3>
                                <div className="seller-details">
                                    <p><strong>Name:</strong> {sellerDetails.username}</p>
                                    <p><strong>Email:</strong> {sellerDetails.email}</p>
                                    {sellerDetails.phone && (
                                        <p><strong>Phone:</strong> {sellerDetails.phone}</p>
                                    )}
                                </div>
                                <button
                                    className="contact-button"
                                    onClick={handleContact}
                                >
                                    Contact Seller
                                </button>
                            </div>

                            <div className="reviews-section">
                                <h3>Reviews</h3>
                                <div className="reviews-container">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="review-card">
                                            <div className="review-header">
                                                <span className="reviewer-name">{review.reviewerName}</span>
                                                <Rating value={review.rating} readOnly />
                                            </div>
                                            <p className="review-comment">{review.comment}</p>
                                            <span className="review-date">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="write-review-btn"
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                >
                                    Write a Review
                                </button>

                                {showReviewForm && (
                                    <form onSubmit={handleReviewSubmit} className="review-form">
                                        <div className="rating-input">
                                            <label>Rating:</label>
                                            <Rating
                                                value={rating}
                                                onChange={(event, newValue) => {
                                                    setRating(newValue);
                                                }}
                                            />
                                        </div>
                                        <div className="review-input">
                                            <label>Your Review:</label>
                                            <textarea
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                required
                                                placeholder="Write your review here..."
                                            />
                                        </div>
                                        <button type="submit" className="submit-review-btn">
                                            Submit Review
                                        </button>
                                    </form>
                                )}
                            </div>

                            <div className="similar-cars-section">
                                <h3>Similar Cars</h3>
                                <div className="similar-cars-grid">
                                    {similarCars.map((car) => (
                                        <div
                                            key={car._id}
                                            className="similar-car-card"
                                            onClick={() => navigate(`/${collection}/car/${car._id}`)}
                                        >
                                            <img
                                                src={`http://localhost:8080/uploads/${car.image}`}
                                                alt={`${car.make} ${car.model}`}
                                            />
                                            <div className="car-info">
                                                <h4>{car.make} {car.model}</h4>
                                                <p className="year">Year: {car.year}</p>
                                                <p className="type">{car.type}</p>
                                                <p className="price">
                                                    {car.collection === 'auction'
                                                        ? `Current Bid: $${car.currentBid?.toLocaleString()}`
                                                        : `Price: $${car.price?.toLocaleString()}`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}