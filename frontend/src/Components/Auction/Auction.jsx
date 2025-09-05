import React from 'react'
import './Auction.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs'
// import img from "../../../../backend/uploads/1727416866888.jpg"

const Auction = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auction/cars");
        if (response.data && response.data.auctionlist) {
          setAuctions(response.data.auctionlist.slice(0, 3));
        }
        console.log(auctions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='auction section'>
      <div className='secContainer container'>
        <div className='secHeading flex'>
          <h3 className='secTitle'>
            Active Auctions
          </h3>

          <div className='navBtns flex'>
            <BsArrowLeftShort className='icon leftIcon' />
            <BsArrowRightShort className='icon rightIcon' />
          </div>
        </div>

        <div className='carContainer grid'>
          {auctions && auctions.map(auction => (
            <div key={auction._id} className='singleCar grid singleCarActive'>
              <div className='imgDiv'>
                <img src={`http://localhost:8080/uploads/${auction.image}`} alt={`${auction.make} ${auction.model}`} />
              </div>
              <h5 className='carTitle'>
                {auction.make} {auction.model}
              </h5>
              <span className='miles'>
                {auction.miles} Miles
              </span>
              <span className='AWD'>
                {auction.type}
              </span>

              <div className='price_buyBtn flex'>
                <span className='price'>
                  ${auction.minimumBid?.toLocaleString()}
                </span>
                <span className="buyBtn">
                  Bid now
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auction;