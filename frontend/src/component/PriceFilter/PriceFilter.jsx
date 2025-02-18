import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PriceFilter = () => {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState({
    minPrice: "",
    maxPrice: "",
  });
  const [filteredCars, setFilteredCars] = useState([]);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState(null);

  // Fetch user email from localStorage when the component mounts
  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email);
  }, []);

  // Handle input changes for price range
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Filter cars by price range
  const filterCarsByPrice = async (minPrice, maxPrice) => {
    try {
      const response = await fetch(`/api/cars/filter/price?minPrice=${minPrice}&maxPrice=${maxPrice}`);
      console.log(minPrice);
      console.log(maxPrice);
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Error fetching cars");
      }
    } catch (err) {
      throw new Error(err.message || "Failed to filter cars");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    // Ensure both minPrice and maxPrice are filled
    if (!priceRange.minPrice || !priceRange.maxPrice) {
      setError("Please provide both minimum and maximum prices.");
      return;
    }

    try {
      // Call service to filter cars by price
      const cars = await filterCarsByPrice(priceRange.minPrice, priceRange.maxPrice);
      setFilteredCars(cars); // Set filtered cars to state
      toast.success("Cars filtered successfully!");
    } catch (err) {
      setError("Failed to filter cars.");
    }
  };

  return (
    <div>
      <h1>Filter Cars by Price</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {/* Price Range Filter Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Min Price:</label>
          <input
            type="number"
            name="minPrice"
            value={priceRange.minPrice}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Max Price:</label>
          <input
            type="number"
            name="maxPrice"
            value={priceRange.maxPrice}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Filter Cars</button>
      </form>

      {/* Display filtered cars */}
      <div>
        {filteredCars.length > 0 && (
          <ul>
            {filteredCars.map((car) => (
              <li key={car.model_no}>
                <h3>{car.name}</h3>
                <p>Price: ${car.price}</p>
                <p>Variant: {car.variant}</p>
                <p>Model No: {car.model_no}</p>
              </li>
            ))}
          </ul>
        )}
        {filteredCars.length === 0 && !error && <p>No cars found for this price range.</p>}
      </div>
    </div>
  );
};

export default PriceFilter;
