import React, { useState, useEffect } from 'react';
import './Review.css';
import axios from 'axios';

//imported icons
import { BsArrowLeftShort } from 'react-icons/bs';
import { BsArrowRightShort } from 'react-icons/bs';
import { AiFillStar } from 'react-icons/ai';

import car1 from '../../Assets/image4.png';
import user1 from '../../Assets/download.jpeg';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch reviews from all collections and combine them
        const response = await axios.get('http://localhost:8080/reviews');
        const allReviews = response.data;


        // Sort by date and get last 3
        const sortedReviews = allReviews
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setReviews(sortedReviews);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch reviews');
        setLoading(false);
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='review section'>
      <div className="secContainer container">
        <div className="secHeading flex">
          <h3 className="secTitle">Recent Reviews</h3>
          <div className="navBtns flex">
            <BsArrowLeftShort className='icon leftIcon' />
            <BsArrowRightShort className='icon rightIcon' />
          </div>
        </div>
        <div className="reviewContainer grid">
          {reviews.map((review) => (
            <div key={review._id} className="singleReview grid">
              <div className="imgDiv">
                <img src={`http://localhost:8080/uploads/${review.image}`} alt="car image" />
              </div>
              <h5 className="reviewTitle">
                {review.carName}
              </h5>
              <span className="desc">
                {review.comment}
              </span>
              <div className="reviewerDiv flex">
                <div className="leftDiv flex">
                  <div className="reviewerImage">
                    <img src={user1} alt="reviewer image" />
                  </div>
                  <div className="aboutReviewer">
                    <span className="name">
                      {review.reviewerName}
                    </span>
                    <p>
                      Customer
                    </p>
                  </div>
                </div>
                <div className="rightDiv flex">
                  <AiFillStar className='icon' />
                  <blockquote>{review.rating.toFixed(1)}</blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;