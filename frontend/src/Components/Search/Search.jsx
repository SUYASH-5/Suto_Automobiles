import React, { useState, useEffect } from 'react';
import './Search.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    make: '',
    year: '',
    model: '',
    price: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      // Only include non-empty fields in the search params
      const searchQuery = {};
      if (searchParams.make) searchQuery.make = searchParams.make;
      if (searchParams.model) searchQuery.model = searchParams.model;
      if (searchParams.year) searchQuery.year = searchParams.year;
      if (searchParams.price) searchQuery.price = searchParams.price;

      // Fetch from all three collections
      const [newCarsRes, usedCarsRes, auctionRes] = await Promise.all([
        axios.get('http://localhost:8080/newcars/search', { params: searchQuery }),
        axios.get('http://localhost:8080/usedcars/search', { params: searchQuery }),
        axios.get('http://localhost:8080/auction/search', { params: searchQuery })
      ]);

      // Combine and format results
      const allResults = [
        ...newCarsRes.data.map(car => ({ ...car, collection: 'newcars' })),
        ...usedCarsRes.data.map(car => ({ ...car, collection: 'usedcars' })),
        ...auctionRes.data.map(car => ({ ...car, collection: 'auction' }))
      ];

      setSearchResults(allResults);
      setShowResults(true);
    } catch (err) {
      setError('Failed to fetch search results');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCarClick = (car) => {
    navigate(`/${car.collection}/car/${car._id}`);
  };

  return (
    <div className='search'>
      <div className='secContainer container'>
        <h3 className='title'>
          Which vehicle you are looking for?
        </h3>

        <div className='searchDiv grid'>
          <input
            type='text'
            name="make"
            placeholder='Make'
            value={searchParams.make}
            onChange={handleChange}
          />
          <input
            type='number'
            name="year"
            placeholder='Year'
            value={searchParams.year}
            onChange={handleChange}
          />
          <input
            type='text'
            name="model"
            placeholder='Model'
            value={searchParams.model}
            onChange={handleChange}
          />
          <input
            type='number'
            name="price"
            placeholder='Max Price'
            value={searchParams.price}
            onChange={handleChange}
          />
          <button
            className='btn primaryBtn flex'
            onClick={handleSearch}
            disabled={loading}
          >
            <AiOutlineSearch className='icon' />
            <span>
              {loading ? 'Searching...' : 'Search'}
            </span>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showResults && (
          <div className="searchResults">
            {searchResults.length === 0 ? (
              <p className="no-results">No cars found matching your criteria</p>
            ) : (
              <div className="results-grid">
                {searchResults.map((car) => (
                  <div
                    key={`${car.collection}-${car._id}`}
                    className="car-card"
                    onClick={() => handleCarClick(car)}
                  >
                    <img
                      src={`http://localhost:8080/uploads/${car.image}`}
                      alt={`${car.make} ${car.model}`}
                    />
                    <div className="car-info">
                      <h4>{car.make} {car.model}</h4>
                      <p className="year">Year: {car.year}</p>
                      <p className="price">
                        {car.collection === 'auction'
                          ? `Current Bid: $${car.currentBid}`
                          : `Price: $${car.price}`
                        }
                      </p>
                      <p className="type">{car.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;