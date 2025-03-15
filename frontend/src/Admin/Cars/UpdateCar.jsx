import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getCars, updateCar } from "../../service/carServices";
import './CarForm.css';

const UpdateCar = () => {
    const { name } = useParams();
    const[loading, setLoading]=useState(true);
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
        locations: [{ latitude: "", longitude: "", quantity: "", placeName: "" }],
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const cars = await getCars();
                const car = cars.find((car) => car.name === name);
                if (car) {
                    setCarData({
                        ...car,
                        colors: car.colors.map((color) => ({
                            color: color.color,
                            price: color.price,
                            images: color.images.join(", "), // Convert images array to comma-separated string
                        })),
                    });
                } else {
                    setError("Car not found");
                }
            } catch (err) {
                setError(err.message || "Failed to load car details");
            }
        };

        fetchCarData();
    }, [name]);
    useEffect(() => {
        // Simulate API call or delay
        setTimeout(() => {
            setLoading(false);
        }, 2000);
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

    const handleAddLocation = () => {
        setCarData((prevData) => ({
            ...prevData,
            locations: [...prevData.locations, { latitude: "", longitude: "", quantity: "", placeName: "" }],
        }));
    };    

    const handleLocationChange = (e, index) => {
        const { name, value } = e.target;
        const updatedLocations = [...carData.locations];
        updatedLocations[index][name] = value;
        setCarData({ ...carData, locations: updatedLocations });
    };

    const handleRemoveLocation = (index) => {
        const updatedLocations = [...carData.locations];
        updatedLocations.splice(index, 1);
        setCarData({ ...carData, locations: updatedLocations });
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
                    price: parseFloat(color.price),  // Ensure price is a number
                    images: color.images.split(",").map((img) => img.trim()),  // Ensure images are an array of strings
                })),
                locations: carData.locations.map((location) => ({
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                    quantity: parseInt(location.quantity, 10),
                    placeName: location.placeName.trim()
                }))
            };
    
            const result = await updateCar(name, preparedData);
            setMessage(result.message || "Car details updated successfully!");
            toast.success("Car details updated successfully!");
            navigate("/admin/cars");
        } catch (err) {
            setError(err.message || "Failed to update car details");
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
            <h1>Update Car Information</h1>
            <form className="car-form" onSubmit={(e) => handleSubmit(e, carData)}>
                <div className="from-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={carData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Variant:</label>
                    <input type="text" name="variant" value={carData.variant} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Colors:</label>
                    {carData.colors.map((color, index) => (
                        <div key={index} className="color-group">
                            <input type="text" name="color" placeholder="Color" value={color.color} onChange={(e) => handleColorChange(e, index)} required />
                            <input type="number" name="price" placeholder="Price" value={color.price} onChange={(e) => handleColorChange(e, index)} required />
                            <input type="text" name="images" placeholder="Images (comma-separated)" value={color.images} onChange={(e) => handleColorChange(e, index)} required />
                            <button type="button" onClick={() => handleRemoveColor(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddColor}>Add Another Color</button>
                </div>

                <div className="form-group">
                    <label>Offers:</label>
                    <input type="text" name="offers" value={carData.offers} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Model Number:</label>
                    <input type="text" name="model_no" value={carData.model_no} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea name="description" value={carData.description} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Date (YYYY-MM-DD):</label>
                    <input type="date" name="date" value={carData.date} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Year:</label>
                    <input type="number" name="year" value={carData.year} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Mileage:</label>
                    <input type="text" name="mileage" value={carData.mileage} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Locations:</label>
                    {carData.locations.map((location, index) => (
                        <div key={index} className="location-group">
                            <input type="text" name="placeName" placeholder="Place Name" value={location.placeName} onChange={(e) => handleLocationChange(e, index)} required />
                            <input type="number" name="latitude" placeholder="Latitude" value={location.latitude} onChange={(e) => handleLocationChange(e, index)} required />
                            <input type="number" name="longitude" placeholder="Longitude" value={location.longitude} onChange={(e) => handleLocationChange(e, index)} required />
                            <input type="number" name="quantity" placeholder="Quantity" value={location.quantity} onChange={(e) => handleLocationChange(e, index)} required />
                            <button type="button" onClick={() => handleRemoveLocation(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddLocation}>Add Location</button>
                </div>

                <button type="submit" className="submit-btn">Update Car</button>
            </form>
        </div>
    );
};

export default UpdateCar;
