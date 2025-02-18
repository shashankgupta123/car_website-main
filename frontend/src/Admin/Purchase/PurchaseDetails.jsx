import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
// import "../../CSS/PurchaseDetails.css";

const PurchaseDetails = () => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate(); // Hook to navigate to previous page
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurchase = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/purchase/${id}`);
                setPurchase(response.data);
                setLoading(false);
            } catch (err) {
                setError('Purchase not found with the provided ID.');
                setLoading(false);
            }
        };

        fetchPurchase();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Handle back button click
    const handleBack = () => {
        navigate(-1); // Navigates to the previous page
    };

    return (
        <div>
            <h1>Purchase Details</h1>
            <button onClick={handleBack} className="back-button">Back</button> {/* Back button */}
            {purchase && (
                <div>
                    <p><strong>Username:</strong> {purchase.user.username}</p>
                    <p><strong>Email:</strong> {purchase.user.email}</p>
                    <p><strong>Phone:</strong> {purchase.user.phone}</p>
                    <p><strong>Car Name:</strong> {purchase.carName}</p>
                    <p><strong>Model No:</strong> {purchase.modelNo}</p>
                    <p><strong>Variant:</strong> {purchase.variant}</p>
                    <p><strong>Purchase Date:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                    <p><strong>Selected Color:</strong> {purchase.selectedColor.color}</p>
                    <p><strong>Price:</strong> {purchase.selectedColor.price}</p>
                </div>
            )}
        </div>
    );
};

export default PurchaseDetails;
