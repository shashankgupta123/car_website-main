import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LastSearch = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/recommendations/last_two_searches`,
          {
            params: { email },
          }
        );
        console.log("Backend Response:", response);

        if (response.data && response.data.recommendations) {
          setRecommendations(response.data.recommendations);
        } else {
          setError("No recommendations data available.");
        }
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [email]);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="car-list-container">
      <h2>Last Search Recommendations</h2>
      {recommendations && recommendations.length > 0 ? (
        <div className="car-grid">
          {recommendations.map((car) => (
            <div key={car.id} className="car-card">
              <div className="car-header">
                <h2>{car.name}</h2>
                <p className="car-price">
                  <strong>Price: </strong>₹{car.price ? car.price.toLocaleString() : 'N/A'}
                </p>
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
                <p><strong>Model No:</strong> {car.model_no}</p>
                <p><strong>Description:</strong> {car.description}</p>
                <p><strong>Offers:</strong> {car.offers}</p>
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
        <div>No recommendations found.</div>
      )}
    </div>
  );
};

export default LastSearch;
