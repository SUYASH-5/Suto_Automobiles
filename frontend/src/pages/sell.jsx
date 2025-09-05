import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/sell.css';
import Navbar from "../Components/Navbar/Navbar.jsx"
import Footer from '../Components/Footer/Footer.jsx'
import newCar from '../Assets/newcar.jpg'
import usedCar from '../Assets/usedcar.jpg'
import auctionCar from '../Assets/auctioncar.jpg'

export default function Sell() {
    const navigate = useNavigate();
    const [dealerStatus, setdealerStatus] = useState(null);

    useEffect(() => {
        const checkDealerStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));
                if (!token || !user) return;

                const response = await axios.get(`http://localhost:8080/dashboard/dealer-status`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { email: user.email }
                });
                setdealerStatus(response.data.dealerStatus);
                console.log(dealerStatus);
            } catch (error) {
                console.error('Error checking dealer status:', error);
            }
        };

        checkDealerStatus();
    }, []);

    const handleCardClick = (path) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        if (path === '/sell/new' && dealerStatus !== 'verified') {
            alert('Only verified dealers can sell new cars. Please get certified as a dealer first.');
            navigate('/dashboard');
            return;
        }

        navigate(path);
    };

    return (
        <div>
            <Navbar />
            <div className="sell">
                <div className="sell__container">
                    <h2 className="sell__title">Sell Your Car</h2>
                    <div className="sell__grid">
                        <div className="sell-card"
                            style={{
                                backgroundImage: `url(${newCar})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: dealerStatus !== 'verified' ? 0.7 : 1,
                                cursor: dealerStatus !== 'verified' ? 'not-allowed' : 'pointer'
                            }}
                            onClick={() => handleCardClick('/sell/new')}
                        >
                            <h3>Sell New Car</h3>
                            <p>List your brand new car for sale.</p>
                            {dealerStatus !== 'verified' && (
                                <div className="dealer-only-badge">
                                    Verified Dealers Only
                                </div>
                            )}
                        </div>
                        <div className="sell-card" style={{ backgroundImage: `url(${usedCar})`, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={() => handleCardClick('/sell/used')}>
                            <h3>Sell Used Car</h3>
                            <p>List your pre-owned car for sale.</p>
                        </div>
                        <div className="sell-card" style={{ backgroundImage: `url(${auctionCar})`, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={() => handleCardClick('/sell/auction')}>
                            <h3>Auction Car</h3>
                            <p>Put your car up for auction.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
