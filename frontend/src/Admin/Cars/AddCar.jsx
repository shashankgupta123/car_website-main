import React, { useState, useEffect } from "react";
import { addCar } from "../../service/carServices";
import { useNavigate } from "react-router-dom";
import './CarForm.css';

const CarForm = () => {
    const [carData, setCarData] = useState({
        name: "",
        variant: "",
        colors: [{ color: "", price: "", images: "" }],
        offers: "",
        model_no: "",
        description: "",
        date: "",
        year: "",
        mileage: "",
        locations: [],
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [key, index] = name.split("-");

        if (key === "colors") {
            const updatedColors = [...carData.colors];
            updatedColors[index][key] = value;
            setCarData((prevData) => ({
                ...prevData,
                colors: updatedColors,
            }));
        } else {
            setCarData((prevData) => ({
                ...prevData,
                [key]: value,
            }));
        }
    };

    const handleLocationChange = (index, field, value) => {
        const updatedLocations = [...carData.locations];
        updatedLocations[index][field] = value;
        setCarData((prevData) => ({
            ...prevData,
            locations: updatedLocations,
        }));
    };

    const addLocation = () => {
        setCarData((prevData) => ({
            ...prevData,
            locations: [...prevData.locations, { latitude: "", longitude: "", quantity: "", placeName: "" }],
        }));
    };

    const removeLocation = (index) => {
        const updatedLocations = carData.locations.filter((_, i) => i !== index);
        setCarData((prevData) => ({
            ...prevData,
            locations: updatedLocations,
        }));
    };

    const handleColorChange = (e, index) => {
        const { name, value } = e.target;
        const updatedColors = [...carData.colors];
        updatedColors[index][name] = value;
        setCarData({ ...carData, colors: updatedColors });
    };

    const handleAddColor = () => {
        setCarData((prevData) => ({
            ...prevData,
            colors: [...prevData.colors, { color: "", price: "", images: "" }],
        }));
    };

    const handleRemoveColor = (index) => {
        const updatedColors = [...carData.colors];
        updatedColors.splice(index, 1);
        setCarData({ ...carData, colors: updatedColors });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const preparedData = {
                ...carData,
                colors: carData.colors.map((color) => ({
                    color: color.color.trim(),
                    price: parseFloat(color.price.trim()),  // Ensure this is a number
                    images: color.images.split(",").map((img) => img.trim()),  // Ensure this is an array of strings
                })),
            };

            console.log("Prepared Data", preparedData);  // Check the prepared data before sending it

            const result = await addCar(preparedData);
            setMessage(result.message);

            // Reset form data
            setCarData({
                name: "",
                variant: "",
                colors: [{ color: "", price: "", images: "" }],
                offers: "",
                model_no: "",
                description: "",
                date: "",
                year: "",
                mileage: "",
                locations: [{ latitude: "", longitude: "", quantity: "", placeName: "" }],
            });

            // Navigate to /admin/cars after successful submission
            navigate("/admin/cars");
        } catch (err) {
            // Handle error messages and provide feedback to the user
            console.error("Error submitting form:", err);
            
            if (err.field && err.messageDetail) {
                // Specific field validation errors
                setError(`${err.field}: ${err.messageDetail}`);
            } else {
                // General error message
                setError(err.message || "An error occurred. Please try again.");
            }
        }
    };
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading Car Form...</p>
            </div>
        );
    }

    return (
        <div className="car-form-container car-form-unique">
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="car-form" onSubmit={handleSubmit}>
                <h1 className="form-title">Add a New Car</h1>

                <label>Name:</label>
                <input type="text" name="name" value={carData.name} onChange={handleChange} required />

                <label>Variant:</label>
                <input type="text" name="variant" value={carData.variant} onChange={handleChange} required />

                <label>Colors:</label>
                {carData.colors.map((color, index) => (
                    <div key={index}>
                        <input type="text" name="color" value={color.color} onChange={(e) => handleColorChange(index, "color", e.target.value)} required />
                        <input type="number" name="price" value={color.price} onChange={(e) => handleColorChange(index, "price", e.target.value)} required />
                        <input type="text" name="images" value={color.images} onChange={(e) => handleColorChange(index, "images", e.target.value)} required />
                        <button type="button" className="remove-btn" onClick={() => handleRemoveColor(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddColor}>Add Color</button>

                <label>Offers:</label>
                <input type="text" name="offers" value={carData.offers} onChange={handleChange} />

                <label>Model Number:</label>
                <input type="text" name="model_no" value={carData.model_no} onChange={handleChange} required />

                <label>Description:</label>
                <textarea name="description" value={carData.description} onChange={handleChange}></textarea>

                <label>Date:</label>
                <input type="date" name="date" value={carData.date} onChange={handleChange} required />

                <label>Year:</label>
                <input type="number" name="year" value={carData.year} onChange={handleChange} required />

                <label>Mileage:</label>
                <input type="text" name="mileage" value={carData.mileage} onChange={handleChange} />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CarForm;
