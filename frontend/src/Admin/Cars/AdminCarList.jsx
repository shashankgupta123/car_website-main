import React, { useEffect, useState } from 'react';
import { getCars, deleteCar } from '../../service/carServices'; 
import { Link } from 'react-router-dom';
import '../../CSS/AdminCarList.css';

const AdminCarList = () => {
    const [cars, setCars] = useState([]); 
    const [selectedColor, setSelectedColor] = useState({});  // Keep track of the selected color for each car

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const carData = await getCars(); 
                console.log("Fetched Car Data:", carData); 
                setCars(carData || []); 
            } catch (error) {
                console.error("Error fetching cars:", error);
            }
        };
        fetchCars();
    }, []);

    const handleDelete = async (name) => {
        try {
            const result = await deleteCar(name); 
            if (result.success) {
                setCars(cars.filter((car) => car.name !== name)); 
                alert("Car deleted successfully");
            } else {
                alert("Failed to delete the car");
            }
        } catch (error) {
            console.error("Error deleting car:", error);
            alert("Error deleting the car");
        }
    };

    const handleColorChange = (carId, color) => {
        setSelectedColor({
            ...selectedColor,
            [carId]: color
        });
    };

    return (
        <div>
            <h1>Cars</h1>
            <Link to="/cars/add" className="add-new-car-btn">Add New Car</Link>
            <div className="car-grid">
                {cars.length > 0 ? (
                    cars.map((car) => {
                        const selectedColorData = selectedColor[car._id] || car.colors[0];
                        return (
                            <div key={car._id} className="car-card">
                                <div className="car-header">
                                    <h2>{car.name}</h2>
                                    <p><strong>Price:</strong> ₹{selectedColorData.price.toLocaleString()}</p>
                                </div>
                                <div className="car-images">
                                    {selectedColorData.images.map((image, index) => (
                                        <img key={index} src={image} alt={car.name} />
                                    ))}
                                </div>
                                <div className="car-details">
                                    <p><strong>Model:</strong> {car.model_no}</p>
                                    <p><strong>Variant:</strong> {car.variant}</p>
                                    <p><strong>Year:</strong> {car.year}</p>
                                    <p><strong>Mileage:</strong> {car.mileage}</p>
                                    <p><strong>Colors:</strong>
                                        <select 
                                            onChange={(e) => handleColorChange(car._id, car.colors.find(c => c.color === e.target.value))}
                                            value={selectedColor[car._id]?.color || car.colors[0].color}
                                        >
                                            {car.colors.map((color) => (
                                                <option key={color.color} value={color.color}>
                                                    {color.color}
                                                </option>
                                            ))}
                                        </select>
                                    </p>
                                    <p><strong>Description:</strong> {car.description}</p>
                                    <p><strong>Offers:</strong> {car.offers}</p>
                                    <p><strong>Available Date:</strong> {new Date(car.date).toLocaleDateString()}</p>
                                    <p><strong>Locations:</strong></p>
                                    <ul>
                                        {car.locations.map((loc, index) => (
                                            <li key={index}>
                                                {loc.placeName} (Lat: {loc.latitude}, Lng: {loc.longitude}, Qty: {loc.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="car-actions">
                                    <Link to={`/cars/update/${car.name}`}>Edit</Link>
                                    <button onClick={() => handleDelete(car.name)}>Delete</button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No cars available.</p>
                )}
            </div>
        </div>
    );
};

export default AdminCarList;
