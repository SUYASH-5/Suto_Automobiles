import React, { useState, useEffect } from 'react';
import './styles/Dashboard.css';
import axios from 'axios';
import Navbar from '../Components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('details');
    const [userData, setUserData] = useState(null);
    const [userCars, setUserCars] = useState([]);
    const [reviewsAdded, setReviewsAdded] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dealerStatus, setDealerStatus] = useState('none');
    const [dealerFormData, setDealerFormData] = useState({
        address: '',
        document: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = localStorage.getItem('token');

                const response = await axios.get(`http://localhost:8080/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        email: user.email
                    }

                });
                setUserData(response.data);
                const dealerResponse = await axios.get(`http://localhost:8080/dashboard/dealer-status`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        email: user.email
                    }
                });
                setDealerStatus(dealerResponse.data.dealerStatus || 'none');
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.clear();
                    navigate('/login');
                } else {
                    console.error('Error fetching user data:', error);
                    setError('Failed to fetch user data');
                }
            }
        };

        const fetchUserCars = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await axios.get(`http://localhost:8080/dashboard/cars`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        email: user.email
                    }
                });

                const { usedCars, newCars, auctionCars } = response.data;
                const allCars = [
                    ...usedCars,
                    ...newCars,
                    ...auctionCars
                ];

                setUserCars(allCars);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.clear();
                    navigate('/login');
                } else {
                    console.error('Error fetching user cars:', error);
                }
            }
        };

        const fetchUserReviews = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await axios.get(`http://localhost:8080/dashboard/user-reviews`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        email: user.email
                    }
                });
                setReviewsAdded(response.data);
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.clear();
                    navigate('/login');
                } else {
                    console.error('Error fetching user reviews:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchUserCars();
        fetchUserReviews();
    }, [navigate]);

    const handleDeleteAccount = async (id) => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/dashboard/user/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                localStorage.clear();
                navigate('/');
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    const handleDeleteCar = async (collection, id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/dashboard/deletecar/${collection}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    email: userData.email
                }
            });
            navigate('/dashboard');
            setUserCars(prevCars => prevCars.filter(car => car._id !== id));
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    const handleEditReview = (id) => {
        navigate(`/dashboard/editreview/${id}`);
    };

    const handleDeleteReview = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/dashboard/deletereview/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/dashboard');
            setReviewsAdded(prevReviews => prevReviews.filter(review => review._id !== id));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleDealerCertification = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('address', dealerFormData.address);
        formData.append('document', dealerFormData.document);
        formData.append('userId', userData._id);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/dashboard/dealer-certification',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    params: {
                        email: userData.email
                    }
                }
            );
            setDealerStatus('verified');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting dealer certification:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <button onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <div className="details-content">
                        <h2>User Details</h2>
                        {userData && (
                            <>
                                <div className="user-info">
                                    <p><strong>Name:</strong> {userData.username}</p>
                                    <p><strong>Email:</strong> {userData.email}</p>
                                    <p><strong>Phone:</strong> {userData.phone}</p>
                                    <div className="action-buttons">
                                        <button className="edit-btn" onClick={() => navigate('/dashboard/update')}>
                                            Edit Profile
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteAccount(userData._id)}>
                                            Delete Account
                                        </button>
                                    </div>
                                </div>

                                {userData && dealerStatus && (
                                    <div className="dealer-certification">
                                        <h3>Dealer Certification</h3>
                                        {dealerStatus === 'verified' ? (
                                            <div className="verified-dealer">
                                                <p className="success">✓ Verified Dealer</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleDealerCertification} className="dealer-form">
                                                <div className="form-group">
                                                    <label>Business Address:</label>
                                                    <textarea
                                                        required
                                                        value={dealerFormData.address}
                                                        onChange={(e) => setDealerFormData({
                                                            ...dealerFormData,
                                                            address: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Business License/Document:</label>
                                                    <input
                                                        type="file"
                                                        required
                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                        onChange={(e) => setDealerFormData({
                                                            ...dealerFormData,
                                                            document: e.target.files[0]
                                                        })}
                                                    />
                                                </div>
                                                <button type="submit" className="submit-btn">
                                                    Submit for Verification
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );

            case 'cars':
                return (
                    <div className="cars-content">
                        <h2>Your Cars</h2>
                        <div className="cars-grid">
                            {userCars.map(car => (
                                <div key={car._id} className="car-card">
                                    <img src={`http://localhost:8080/uploads/${car.image}`} alt={car.make} />
                                    <h3>{car.make} {car.model}</h3>
                                    <p>Price: ${car.price}</p>
                                    <div className="car-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => {
                                                // Determine the collection based on the car properties
                                                let collection = 'usedcars';
                                                if (car.engine && car.transmission) {
                                                    collection = 'newcars';
                                                } else if (car.minimumBid) {
                                                    collection = 'auction';
                                                }
                                                navigate(`/dashboard/editcar/${collection}/${car._id}`);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => {
                                            // Determine the collec tion based on the car properties
                                            let collection = 'usedcars';
                                            if (car.engine && car.transmission) {
                                                collection = 'newcars';
                                            } else if (car.minimumBid) {
                                                collection = 'auction';
                                            }
                                            handleDeleteCar(collection, car._id);
                                            // navigate(`/dashboard/deletecar/${collection}/${car._id}`);
                                        }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'reviews':
                return (
                    <div className="reviews-content">
                        <h2>Reviews Added</h2>
                        <div className="reviews-grid">
                            {reviewsAdded.map(review => (
                                <div key={review._id} className="review-card">
                                    <div className="car-image">
                                        <img
                                            src={`http://localhost:8080/uploads/${review.image}`}
                                            alt={review.carName}
                                        />
                                    </div>
                                    <div className="review-details">
                                        <h3>{review.carName}</h3>
                                        <div className="rating">
                                            Rating: {review.rating.toFixed(1)} ★
                                        </div>
                                        <p className="comment">{review.comment}</p>
                                        <span className="date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="action-buttons">
                                            <button className="edit-btn" onClick={() => {
                                                handleEditReview(review._id);
                                            }}>Edit</button>
                                            <button className="delete-btn" onClick={() => {
                                                handleDeleteReview(review._id);
                                            }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            <Navbar />
            <div className="dashboard">
                <div className="sidebar">
                    <div
                        className={`sidebar-item ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        User Details
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'cars' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cars')}
                    >
                        Your Cars
                    </div>
                    <div
                        className={`sidebar-item ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews Added
                    </div>
                </div>
                <div className="content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 