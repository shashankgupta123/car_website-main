import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MostVisitedCar = () => {
  const [mostVisitedCars, setMostVisitedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchMostVisitedCars = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/recommendations/most_visited`,
          {
            params: { email },
          }
        );
        console.log("Backend Response:", response);

        if (response.data && response.data.recommendations) {
          setMostVisitedCars(response.data.recommendations);
        } else {
          setError("No most visited cars data available.");
        }
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMostVisitedCars();
  }, [email]);

  if (loading) return <div>Loading most visited cars...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="car-list-container">
      <h2>Most Visited Cars</h2>
      {mostVisitedCars && mostVisitedCars.length > 0 ? (
        <div className="car-grid">
          {mostVisitedCars.map((car) => (
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
                <p><strong>Variant:</strong> {car.variant}</p>
                <p><strong>Description:</strong> {car.description}</p>
                <p><strong>Visit Count:</strong> {car.visitCount}</p>
                {/* Display Locations Here */}
                <p><strong>Available Locations:</strong> {car.locations?.length > 0 
                  ? car.locations.join(", ") 
                  : "No location data available"}
                </p>
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
        <div>No most visited cars found.</div>
      )}
    </div>
  );
};

export default MostVisitedCar;
