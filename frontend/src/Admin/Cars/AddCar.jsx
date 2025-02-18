import React, { useState } from "react";
import { addCar } from "../../service/carServices";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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

    return (
        <div>
            <h1>Add a New Car</h1>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={carData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Variant:</label>
                    <input
                        type="text"
                        name="variant"
                        value={carData.variant}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Colors:</label>
                    {carData.colors.map((color, index) => (
                        <div key={index}>
                            <div>
                                <label>Color:</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={color.color}
                                    onChange={(e) => handleColorChange(e, index)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={color.price}
                                    onChange={(e) => handleColorChange(e, index)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Images (comma-separated URLs):</label>
                                <input
                                    type="text"
                                    name="images"
                                    value={color.images}
                                    onChange={(e) => handleColorChange(e, index)}
                                    required
                                />
                            </div>
                            <button type="button" onClick={() => handleRemoveColor(index)}>Remove Color</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddColor}>Add Another Color</button>
                </div>

                <div>
                    <label>Offers:</label>
                    <input
                        type="text"
                        name="offers"
                        value={carData.offers}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Model Number:</label>
                    <input
                        type="text"
                        name="model_no"
                        value={carData.model_no}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={carData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Date (YYYY-MM-DD):</label>
                    <input
                        type="date"
                        name="date"
                        value={carData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Year:</label>
                    <input
                        type="number"
                        name="year"
                        value={carData.year}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Mileage:</label>
                    <input
                        type="text"
                        name="mileage"
                        value={carData.mileage}
                        onChange={handleChange}
                    />
                    <label>Locations:</label>
                    {carData.locations.map((location, index) => (
                        <div key={index}>
                            <label>Latitude:</label>
                            <input type="number" value={location.latitude} onChange={(e) => handleLocationChange(index, "latitude", e.target.value)} required />
                            <label>Longitude:</label>
                            <input type="number" value={location.longitude} onChange={(e) => handleLocationChange(index, "longitude", e.target.value)} required />
                            <label>Quantity:</label>
                            <input type="number" value={location.quantity} onChange={(e) => handleLocationChange(index, "quantity", e.target.value)} required />
                            <label>Place Name:</label>
                            <input type="text" value={location.placeName} onChange={(e) => handleLocationChange(index, "placeName", e.target.value)} required />
                            <button type="button" onClick={() => removeLocation(index)}>Remove Location</button>
                        </div>
                    ))}
                    <button type="button" onClick={addLocation}>Add Location</button>
                </div>
                <button type="submit">Add Car</button>
            </form>
        </div>
    );
};

export default CarForm;
