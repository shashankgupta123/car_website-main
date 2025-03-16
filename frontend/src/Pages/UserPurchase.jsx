import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/UserPurchase.css';

const UserPurchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchPurchaseDetails = async () => {
            if (!email) {
                setError('Email is missing');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/api/allpurchases/${email}`);
                setPurchases(response.data || []);
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPurchaseDetails();
    }, [email]);

    const updatePurchaseStatus = async (purchaseId) => {
        try {
            console.log("Calling updatePurchaseStatus for purchase:", purchaseId);
            const response = await axios.put(`http://localhost:5000/api/update-status/${purchaseId}`, {
                status: "past",
                securityDeposit: 0,
                balance: 0,
            });
    
            if (response.status === 200) {
                console.log("Purchase status updated successfully:", response.data);
                setPurchases((prevPurchases) =>
                    prevPurchases.map((purchase) =>
                        purchase._id === purchaseId
                            ? { ...purchase, status: "past", securityDeposit: 0, balance: 0 }
                            : purchase
                    )
                );
                alert("Purchase status updated successfully!");
            } else {
                console.error("Failed to update purchase status:", response);
                alert("Failed to update purchase status.");
            }
        } catch (error) {
            console.error("Error updating purchase status:", error.response?.data?.message || error.message);
            alert("Error updating purchase status: " + (error.response?.data?.message || "Unknown error"));
        }
    };
    

    const handlePayment = async (purchase) => {
        if (!purchase || purchase.balance <= 0) {
            alert("Invalid payment request.");
            return;
        }
    
        const userDetails = {
            _id: purchase._id, // Ensure _id is used instead of purchaseId
            userId: purchase.userId,
            carName: purchase.carName,
            modelNo: purchase.modelNo,
            variant: purchase.variant,
            mileage: purchase.mileage,
            description: purchase.description,
            selectedColor: purchase.selectedColor,
            offers: purchase.offers,
            securityDeposit: purchase.securityDeposit,
            balance: purchase.balance,
            pickupLocation: purchase.pickupLocation,
            dropoffLocation: purchase.dropoffLocation,
            pickupDate: purchase.pickupDate,
            dropoffDate: purchase.dropoffDate,
            fullName: purchase.fullName,
            phoneNumber: purchase.phoneNumber,
            email: purchase.email,
            driversLicense: purchase.driversLicense,
            licenseExpiry: purchase.licenseExpiry,
        };
    
        try {
            console.log("Initiating payment for purchase ID:", purchase._id);
            const response = await axios.post(
                `http://localhost:5000/api/payBalance`, 
                { userDetails, amount: purchase.balance },
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            const { url } = response.data;
            if (url) {
                setTimeout(() => {
                    console.log("Updating purchase status after payment:", purchase._id);
                    updatePurchaseStatus(purchase._id);
                }, 1500);
                console.log("Redirecting to payment URL:", url);
                window.location.href = url;
    
                // Wait for the user to complete payment, then update status
                 // Increased timeout to 15 seconds
            } else {
                alert('Payment session could not be created.');
            }
        } catch (error) {
            console.error("Error initiating payment:", error.response?.data?.message || error.message);
            alert('Error initiating payment: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };
    

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="user-purchase-page">
            <h1>All Purchase Details</h1>

            {purchases.length > 0 ? (
                <div className="purchase-list">
                    {purchases.map((purchase) => (
                        <div className="purchase-card" key={purchase._id}>
                            {/* <h2>Purchase ID: {purchase._id}</h2> */}
                            <h6><strong>Car Name:</strong> {purchase.carName}</h6>
                            <p><strong>Pickup Date:</strong> {new Date(purchase.pickupDate).toLocaleDateString()}</p>
                            <p><strong>Dropoff Date:</strong> {new Date(purchase.dropoffDate).toLocaleDateString()}</p>
                            <p><strong>Pickup Location:</strong> {purchase.pickupLocation}</p>
                            <p><strong>Dropoff Location:</strong> {purchase.dropoffLocation}</p>
                            <p><strong>Security Deposit:</strong> ₹{purchase.securityDeposit}</p>
                            <p><strong>Balance:</strong> ₹{purchase.balance}</p>
                            <p><strong>Status:</strong> {purchase.status}</p>

                            {purchase.balance > 0 && purchase.status === 'current' ? (
                                <div className="payment-section">
                                    <button className="pay-btn" onClick={() => handlePayment(purchase)}>
                                        Pay Balance & Generate Receipt
                                    </button>       
                                </div>
                            ) : (
                                <p className="paid-text">Payment already made or no balance remaining.</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-purchases">No purchases found.</p>
            )}
        </div>
    );
};

export default UserPurchase;
