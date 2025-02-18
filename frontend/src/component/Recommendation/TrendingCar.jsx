import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TrendingCar = () => {
  const [newTrends, setNewTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = localStorage.getItem("email");

  // Fetch the new trends
  useEffect(() => {
    const fetchNewTrends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/recommendations/new_trends`,
          {
            params: { email },
          }
        );
        console.log("Backend Response:", response);
        if (response.data && response.data.recommendations) {
          setNewTrends(response.data.recommendations);
        } else {
          setError("No trends data available.");
        }
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewTrends();
  }, [email]);

  if (loading) return <div>Loading new trends...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="car-list-container">
      <h2>New Car Trends</h2>
      {newTrends && newTrends.length > 0 ? (
        <div className="car-grid">
          {newTrends.map((car, index) => (
            <div key={index} className="car-card">
              <div className="car-header">
                <h2>{car.name}</h2>
                <p className="car-price"><strong>Price: </strong>₹{car.price ? car.price : 'N/A'}</p>
              </div>
              <div className="car-images">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={car.name}
                    className="car-top-image"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div className="car-details">
                <p><strong>Model:</strong> {car.model_no}</p>
                <p><strong>Offer:</strong> {car.offers}</p>
              </div>
              <div className="car-actions">
                <Link
                  to={`/cars/details/${car.name}`}
                  className="view-details-btn"
                >
                  View More Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No new trends found.</div>
      )}
    </div>
  );
};

export default TrendingCar;
