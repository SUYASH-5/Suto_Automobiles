import { useState, useEffect } from 'react';
import './styles/auction.css';
import Navbar from "../Components/Navbar/Navbar.jsx"
import Footer from '../Components/Footer/Footer.jsx'
import { useNavigate } from 'react-router-dom';

// import placeholderImage from '../assets/placeholder-car.jpg';

export default function Auction() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch('http://localhost:8080/auction/cars');
                if (!response.ok) {
                    throw new Error('Failed to fetch auctions');
                }
                const data = await response.json();

                // Get current user from localStorage
                const currentUser = JSON.parse(localStorage.getItem('user'))?.username;

                // Filter out auctions where seller matches current user    
                const filteredAuctions = data.auctionlist.filter(auction => auction.sellerName !== currentUser);
                setAuctions(filteredAuctions);

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch auctions. Please try again later.');
                setLoading(false);
                console.error('Error fetching auctions:', err);
            }
        };

        fetchAuctions();
    }, []);

    const placeBid = async (auctionId, bidAmount) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to place a bid');
            return;
        }
        else if (bidAmount <= auctions.currentBid) {
            alert('Bid amount must be greater than the current bid');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/auction/bid/${auctionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bidAmount })
            });
            navigate('/');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place bid');
            }

            const updatedAuction = await response.json();
            // Update the local state with the new bid
            setAuctions(auctions.map(auction =>
                auction._id === auctionId ? updatedAuction.auction : auction
            ));
        } catch (error) {
            alert(error.message || 'Error placing bid');
        }
    };

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
            <div className="auction">
                <div className="auction__container">
                    <div className="auction__header">
                        <h2>Car Auctions</h2>
                        <p>Bid on your dream car today!</p>
                    </div>

                    <div className="auction__grid">
                        {auctions.length === 0 ? (
                            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem' }}>
                                No active auctions available at the moment.
                            </div>
                        ) : (
                            auctions.map((auction) => (
                                <div key={auction._id} className="auction-card">
                                    <div className="auction-card__image">
                                        <img
                                            src={`http://localhost:8080/uploads/${auction.image}`}
                                            alt={`${auction.make} ${auction.model}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = placeholderImage;
                                            }}
                                        />
                                    </div>

                                    <div className="auction-card__content">
                                        <h3 className="auction-card__title">
                                            {auction.make} {auction.model}
                                        </h3>

                                        <div className="auction-card__details">
                                            <span className="year">Year: {auction.year}</span>
                                            <span className="miles">Miles: {auction.miles?.toLocaleString()}</span>
                                            <span className="current-bid">
                                                Current Bid: ${auction.currentBid?.toLocaleString()}
                                            </span>
                                            <span className="seller">Seller: {auction.sellerName}</span>
                                            <span className="condition">Condition: {auction.condition}</span>
                                            <span className="type">Type: {auction.type}</span>
                                        </div>
                                        <div className="auction-card__buttons">
                                            <button className="view-btn" onClick={() => {
                                                let collection = 'auction';
                                                navigate(`/${collection}/car/${auction._id}`)
                                            }}>View Details</button>
                                            <button
                                                className="bid-btn"
                                                onClick={() => {
                                                    const amount = prompt('Enter bid amount:');
                                                    if (amount && !isNaN(amount)) {
                                                        placeBid(auction._id, Number(amount));
                                                    }
                                                }}
                                            >
                                                Place a Bid
                                            </button>
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