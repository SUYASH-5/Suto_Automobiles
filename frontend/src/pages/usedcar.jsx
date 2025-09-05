import { useState, useEffect } from 'react';
import './styles/usedcar.css';
import Navbar from "../Components/Navbar/Navbar.jsx"
import Footer from '../Components/Footer/Footer.jsx'
import { useNavigate } from 'react-router-dom';

export default function UsedCars() {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:8080/usedcars/cars');
                if (!response.ok) {
                    throw new Error('Failed to fetch cars');
                }
                const data = await response.json();
                setCars(data.carlist);
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
            <div className="usedCars">
                <div className="container">
                    <div className="title">
                        <h2>Available Used Cars</h2>
                        <p>Find your perfect pre-owned vehicle</p>
                    </div>

                    <div className="carsContainer">
                        {cars.length === 0 ? (
                            <div style={{ textAlign: 'center', width: '100%', padding: '2rem' }}>
                                No used cars available at the moment.
                            </div>
                        ) : (
                            cars.map((car) => (
                                <div key={car._id} className="carCard">
                                    <div className="carImage">
                                        <img
                                            src={`http://localhost:8080/uploads/${car.image}`}
                                            alt={`${car.make} ${car.model}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder-car.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="carInfo">
                                        <h3>{car.make} {car.model}</h3>
                                        <div className="details">
                                            <span className="year">{car.year}</span>
                                            <span className="mileage">{car.mileage?.toLocaleString()} km</span>
                                            <span className="type">{car.type}</span>
                                        </div>
                                        <div className="sellerInfo">
                                            <span className="seller">Seller: {car.sellerName}</span>
                                            <span className="condition">Condition: {car.condition}</span>
                                        </div>
                                        <div className="price">
                                            <span>${car.price?.toLocaleString()}</span>
                                        </div>
                                        <button className="viewDetails" onClick={() => {
                                            let collection = 'usedcars';
                                            navigate(`/${collection}/car/${car._id}`)
                                        }}  >Contact Seller</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    );
}