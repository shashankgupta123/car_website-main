import React from "react";
import { useLocation, Link } from "react-router-dom";
import '../CSS/Search.css'; 

const Search = () => {
  const location = useLocation();
  const { response } = location.state || {}; 

  if (!response || !Array.isArray(response.cars)) {
    return <div className="no-results">No valid results found.</div>;
  }

  return (
    <div className="search-results">
      <h2 className="results-title">Search Results</h2>
      <div className="cars-list">
        {response.cars.length === 0 ? (
          <p className="no-results">No results found.</p>
        ) : (
          <ul className="car-items">
            {response.cars.map((car, index) => (
              <li key={index} className="car-item">
                <div className="car-details">
                  <h3 className="car-name">{car.name}</h3>
                  <p><strong>Description:</strong> {car.description}</p>
                  <p><strong>Variant:</strong> {car.variant}</p>
                  <p><strong>Model No:</strong> {car.model_no}</p>
                  <p><strong>Available Colors:</strong></p>
                  <ul className="car-colors">
                    {car.colors.map((color, colorIndex) => (
                      <li key={colorIndex} className="car-color-item">
                        <span
                          className="color-swatch"
                          style={{
                            backgroundColor: color.color,
                          }}
                        ></span>
                        <span className="color-info">
                          {color.color} - ₹{color.price.toLocaleString()}
                        </span>
                        <div className="color-images">
                          <strong>Images:</strong>
                          <div className="car-images">
                            {color.images.map((image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={image}
                                alt={`${car.name} - ${color.color} ${imgIndex + 1}`}
                                className="car-detail-image"
                              />
                            ))}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Link to={`/cars/details/${car.name}`} className="view-details-btn">
                    View More Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
