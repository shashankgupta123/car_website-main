import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SimliarCar = () => {
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchSimilarCars = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/recommendations/similar_cars`,
          {
            params: { email },
          }
        );
        console.log("Backend Response:", response);
        if (response.data && response.data.recommendations) {
          setSimilarCars(response.data.recommendations);
        } else {
          setError("No similar cars data available.");
        }
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarCars();
  }, [email]);

  if (loading) return <div>Loading similar cars...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="car-list-container">
      <h2>Similar Cars</h2>
      {similarCars && similarCars.length > 0 ? (
        <div className="car-grid">
          {similarCars.map((car, index) => (
            <div key={car.id || index} className="car-card">
              <div className="car-header">
                <h2>{car.name}</h2>
                <p className="car-price"><strong>Price: </strong>₹{car.price ? car.price.toLocaleString() : 'N/A'}</p>
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
                <p><strong>Variant:</strong> {car.variant}</p>
                <p><strong>Description:</strong> {car.description}</p>
                <p><strong>Similarity Score:</strong> {car.similarityScore}%</p>
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
        <div>No similar cars found.</div>
      )}
    </div>
  );
};

export default SimliarCar;
