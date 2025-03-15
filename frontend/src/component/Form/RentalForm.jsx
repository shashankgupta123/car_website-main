import React, { useState, useEffect } from "react";
import "./RentalForm.css";

const RentalForm = ({ car, onClose }) => {
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState("");
    const [paymentOption, setPaymentOption] = useState("full");
    const [formData, setFormData] = useState({
        pickupLocation: "",
        dropoffLocation: "",
        pickupDate: "",
        dropoffDate: "",
        fullName: "",
        phoneNumber: "",
        email: "",
        driversLicense: "",
        licenseExpiry: "",
        selectedColor: "", 
        price: car?.colors?.[0]?.price || 0,
        securityDeposit: 0,
        balance: 0,
    });

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) setUserId(storedUserId);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleColorSelect = (color) => {
        setFormData((prevState) => ({
            ...prevState,
            selectedColor: color,
        }));
    };

    const calculatePriceAndDeposits = () => {
        const pickupDate = new Date(formData.pickupDate);
        const dropoffDate = new Date(formData.dropoffDate);
        const timeDifference = dropoffDate - pickupDate;
        const numberOfDays = timeDifference / (1000 * 3600 * 24); 

        if (numberOfDays > 0) {
            const totalPrice = formData.price * numberOfDays;
            let securityDeposit = 0;
            let balance = 0;

            if (paymentOption === "40_60") {
                securityDeposit = totalPrice * 0.4;
                balance = totalPrice * 0.6;
            } else {
                securityDeposit = totalPrice;
                balance = 0;
            } 

            setFormData((prevState) => ({
                ...prevState,
                price: totalPrice,
                securityDeposit,
                balance,
            }));
        }
    };

    const buyNow = async () => {
        if (!userId) {
            setError('You need to be logged in to proceed with the purchase.');
            return;
        }

        if (!formData.selectedColor) {
            setError('Please select a car color.');
            return;
        }

        const selectedColorDetails = car.colors.find(color => color.color === formData.selectedColor);
        if (!selectedColorDetails) {
            setError('Please select a valid car color.');
            return;
        }

        const userDetails = {
            userId,
            carName: car.name,
            modelNo: car.model_no,
            variant: car.variant,
            mileage: car.mileage,
            description: car.description,
            selectedColor: {
                color: selectedColorDetails?.color,
                price: selectedColorDetails?.price,
                images: selectedColorDetails?.images,
            },
            offers: car.offers,
            securityDeposit: formData.securityDeposit, 
            balance: formData.balance, 
            pickupLocation: formData.pickupLocation,
            dropoffLocation: formData.dropoffLocation,
            pickupDate: formData.pickupDate,
            dropoffDate: formData.dropoffDate,
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            driversLicense: formData.driversLicense,
            licenseExpiry: formData.licenseExpiry,
        };

        try {
            const response = await fetch('http://localhost:5000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userDetails,
                    amount: formData.price,
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                setError('Error redirecting to payment gateway.');
            }
        } catch (err) {
            setError(`Error during payment process: ${err.message}`);
        }
    };

    const validatePickupDate = (date) => {
        const currentDate = new Date().toISOString().split("T")[0];
        return date >= currentDate;
    };

    const validateDropoffDate = (pickupDate, dropoffDate) => {
        if (!pickupDate || !dropoffDate) return true;

        const pickup = new Date(pickupDate);
        const dropoff = new Date(dropoffDate);
        const diffTime = dropoff - pickup;
        const maxDuration = 15 * 24 * 60 * 60 * 1000; 
        return diffTime <= maxDuration;
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = "";
        
        if (name === "pickupDate" && !validatePickupDate(value)) {
            errorMessage = "Pickup date cannot be in the past.";
        }
    
        if (name === "dropoffDate") {
            const pickupDate = new Date(formData.pickupDate);
            const dropoffDate = new Date(value);
            
            const minDropoffDate = new Date(pickupDate);
            minDropoffDate.setDate(minDropoffDate.getDate() + 1);
    
            if (dropoffDate < minDropoffDate) {
                errorMessage = "Drop-off date must be at least 1 day after pickup date.";
            } else if (!validateDropoffDate(formData.pickupDate, value)) {
                errorMessage = "Drop-off date must be within 15 days of the pickup date.";
            }
        }
    
        if (errorMessage) {
            setError(errorMessage);
            return;
        }
    
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    
        setError(""); 
    };
    
    useEffect(() => {
        if (formData.pickupDate && formData.dropoffDate) {
            calculatePriceAndDeposits();
        }
    }, [formData.pickupDate, formData.dropoffDate, paymentOption]);

    return (
        <div className="rental-modal-unique">
            <div className="rental-modal-content-unique">
                <span className="close-btn-unique" onClick={onClose}>&times;</span>
                <h2>Rent {car?.name}</h2>
                {error && <p className="error-message-unique">{error}</p>}
                <div className="scroll-container-unique">
                    <label>Pickup Location:</label>
                    <select name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required>
                        <option value="">Select Pickup Location</option>
                        {["Andheri", "Bandra", "Churchgate", "Dadar", "Mumbai Central", "CSMT", "Kurla", "Ghatkopar", "Thane", "Borivali"].map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
    
                    <label>Drop-off Location:</label>
                    <select name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} required>
                        <option value="">Select Drop-off Location</option>
                        {["Andheri", "Bandra", "Churchgate", "Dadar", "Mumbai Central", "CSMT", "Kurla", "Ghatkopar", "Thane", "Borivali"].map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
    
                    <label>Select Car Color:</label>
                    <div className="color-selector-unique">
                        {car.colors.map((color) => (
                            <div
                                key={color.color}
                                className={`color-swatch-unique ${formData.selectedColor === color.color ? 'selected' : ''}`}
                                style={{ backgroundColor: color.color }}
                                onClick={() => handleColorSelect(color.color)}
                            >
                                <span className="color-name-unique">{color.color}</span>
                            </div>
                        ))}
                    </div>
    
                    <label>Pickup Date:</label>
                    <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleDateChange} required />
    
                    <label>Drop-off Date:</label>
                    <input type="date" name="dropoffDate" value={formData.dropoffDate} onChange={handleDateChange} required />
    
                    <label>Full Name:</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
    
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
    
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
    
                    <label>License Name:</label>
                    <input type="text" name="driversLicense" value={formData.driversLicense} onChange={handleChange} required />
    
                    <label>License Expiry Date:</label>
                    <input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} required />
    
                    <label>Payment Option:</label>
                    <select value={paymentOption} onChange={(e) => setPaymentOption(e.target.value)}>
                        <option value="full">Full Payment</option>
                        <option value="40_60">40% Now, 60% Later</option>
                    </select>
    
                    <label>Car Price: Rs.{formData.price}</label>
                    <label>Security Deposit: Rs.{formData.securityDeposit}</label>
                    <label>Balance: Rs.{formData.balance}</label>
                </div>
    
                <button onClick={buyNow} className="buy-now-button-unique">Buy Now</button>
            </div>
        </div>
    );
    
};

export default RentalForm;
