import { useState, useEffect } from 'react';
import './styles/newcars.css';
import Navbar from "../Components/Navbar/Navbar.jsx"
import Footer from '../Components/Footer/Footer.jsx'
import { useNavigate } from 'react-router-dom';

export default function NewCars() {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:8080/newcars/cars');
                if (!response.ok) {
                    throw new Error('Failed to fetch cars');
                }
                const data = await response.json();

                // Get current user from localStorage
                const currentUser = JSON.parse(localStorage.getItem('user'))?.username;

                // Filter out cars where seller matches current user
                const filteredCars = data.carlist.filter(car => car.sellerName !== currentUser);
                setCars(filteredCars);

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch cars. Please try again later.');
                setLoading(false);
                console.error('Error fetching cars:', err);
            }
        };

        fetchCars();
    }, []);


    if (loading) return (
        <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            Loading...
        </div>
    );

    if (error) return (
        <div className="error" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
            {error}
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className="newCars">
                <div className="newCars__container">
                    <div className="newCars__header">
                        <h2>New Cars Available</h2>
                        <p>Discover our latest models</p>
                    </div>

                    <div className="newCars__grid">
                        {cars.length === 0 ? (
                            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem' }}>
                                No new cars available at the moment.
                            </div>
                        ) : (
                            cars.map((car) => (
                                <div key={car._id} className="car-card">
                                    <div className="car-card__image">
                                        <img
                                            src={`http://localhost:8080/uploads/${car.image}`}
                                            alt={`${car.make} ${car.model}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder-car.jpg';
                                            }}
                                        />
                                    </div>

                                    <div className="car-card__content">
                                        <h3 className="car-card__title">
                                            {car.make} {car.model}
                                        </h3>

                                        <div className="car-card__specs">
                                            <div className="spec-item">
                                                <span className="label">Year:</span>
                                                <span className="value">{car.year}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="label">Engine:</span>
                                                <span className="value">{car.engine}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="label">Transmission:</span>
                                                <span className="value">{car.transmission}</span>
                                            </div>
                                            <div className="spec-item">
                                                <span className="label">Type:</span>
                                                <span className="value">{car.type}</span>
                                            </div>
                                        </div>

                                        <div className="car-card__seller">
                                            <span className="seller">Seller: {car.sellerName}</span>
                                        </div>

                                        <div className="car-card__price">
                                            <span className="amount">${car.price?.toLocaleString()}</span>
                                        </div>

                                        <div className="car-card__actions">
                                            <button className="details-btn" onClick={() => {
                                                let collection = 'newcars';
                                                navigate(`/${collection}/car/${car._id}`)
                                            }}>View Details</button>
                                            <button className="test-drive-btn" onClick={() => {
                                                let collection = 'newcars';
                                                navigate(`/${collection}/testdrive/${car._id}`)
                                            }}  >Book Test Drive</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}