import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            const response = await axios.post(
                `http://localhost:5000/api/purchase/checkout`, 
                { userDetails, amount: purchase.balance },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const { url } = response.data;
            if (url) {
                window.location.href = url;
            } else {
                alert('Payment session could not be created.');
            }
        } catch (error) {
            alert('Error initiating payment: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="purchase-page">
            <h1>All Purchase Details</h1>

            {purchases.length > 0 ? (
                purchases.map((purchase) => (
                    <div className="purchase-details" key={purchase._id}>
                        <h2>Purchase {purchase._id}</h2>
                        <p><strong>Car Name:</strong> {purchase.carName}</p>
                        <p><strong>Pickup Date:</strong> {new Date(purchase.pickupDate).toLocaleDateString()}</p>
                        <p><strong>Dropoff Date:</strong> {new Date(purchase.dropoffDate).toLocaleDateString()}</p>
                        <p><strong>Pickup Location:</strong> {purchase.pickupLocation}</p>
                        <p><strong>Dropoff Location:</strong> {purchase.dropoffLocation}</p>
                        <p><strong>Security Deposit:</strong> ₹{purchase.securityDeposit}</p>
                        <p><strong>Balance:</strong> ₹{purchase.balance}</p>
                        <p><strong>Status:</strong> {purchase.status}</p>

                        {purchase.balance > 0 && purchase.status === 'current' ? (
                            <div>
                                <h3>Pay the remaining balance:</h3>
                                <button onClick={() => handlePayment(purchase)}>
                                    Pay Balance and Generate Receipt
                                </button>       
                            </div>
                        ) : (
                            <p>Payment already made or no balance remaining.</p>
                        )}
                    </div>
                ))
            ) : (
                <p>No purchases found.</p>
            )}
        </div>
    );
};

export default UserPurchase;
