import React, { useEffect, useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import './Purchase.css'; 

const Purchase = () => {
    const [lendingPurchases, setLendingPurchases] = useState([]);
    const [pastLendingPurchases, setPastLendingPurchases] = useState([]);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/purchases'); 
                console.log('API Response:', response.data); 
                const lending = [];
                const pastLending = [];

                response.data.forEach(purchase => {
                    if (purchase.status === "current") {  
                        lending.push(purchase);
                    } else if (purchase.status === "past") {
                        pastLending.push(purchase);
                    }
                });

                setLendingPurchases(lending);
                setPastLendingPurchases(pastLending);
            } catch (error) {
                console.error('Error fetching purchases:', error);
            }
        };

        fetchPurchases();
    }, []);

    const sendReminderWhatsApp = (purchase) => {
        const phoneNumber = purchase.phoneNumber.replace(/[^\d]/g, ''); 
        const message = encodeURIComponent(`Dear ${purchase.fullName},\n\nThis is a reminder for your rental booking with us:\n\n  *Pickup Location:* ${purchase.pickupLocation}\n  *Pickup Date:* ${new Date(purchase.pickupDate).toLocaleDateString()}\n\n  *Dropoff Location:* ${purchase.dropoffLocation}\n  *Dropoff Date:* ${new Date(purchase.dropoffDate).toLocaleDateString()}\n\n  *Total Price:* INR ${purchase.price}\n  *Security Deposit:* INR ${purchase.securityDeposit}\n  *Outstanding Balance:* INR ${purchase.balance}\n\nTo ensure a smooth experience, kindly complete any pending payments before the due date. If you have already made the payment, please ignore this message.\n\nFor any queries, feel free to reach out.\n\nBest regards,\nWheels On Deals.`); // Truncated for brevity

        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(url, '_blank');  
    };

    const sendReminderEmail = (purchase) => {
        const templateParams = {
            user_name: purchase.fullName,
            pickup_location: purchase.pickupLocation,
            pickup_date: new Date(purchase.pickupDate).toLocaleDateString(),
            dropoff_location: purchase.dropoffLocation,
            dropoff_date: new Date(purchase.dropoffDate).toLocaleDateString(),
            price: purchase.price,
            security_deposit: purchase.securityDeposit,
            balance: purchase.balance,
            to_email: purchase.email,
        };

        emailjs.send('service_qyiy15i', 'template_m3ylngt', templateParams, 'rmHAjjK2tve-N_W04')
            .then((response) => {
                console.log('Email sent successfully', response);
            })
            .catch((error) => {
                console.error('Error sending email:', error);
            });
    };

    return (
        <div className="purchase-container">
            <h2>Purchase Details</h2>

            <div className="lending-section">
                <h3>Lending (Ongoing)</h3>
                {lendingPurchases.length === 0 ? (
                    <p>No ongoing purchases.</p>
                ) : (
                    <table className="purchase-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Pickup Location</th>
                                <th>Dropoff Location</th>
                                <th>Pickup Date</th>
                                <th>Dropoff Date</th>
                                <th>Price (INR)</th>
                                <th>Security Deposit</th>
                                <th>Balance</th>
                                <th>Contact Reminder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lendingPurchases.map((purchase) => (
                                <tr key={purchase._id}>
                                    <td>{purchase.fullName}</td>
                                    <td>{purchase.email}</td>
                                    <td>{purchase.phoneNumber}</td>
                                    <td>{purchase.pickupLocation}</td>
                                    <td>{purchase.dropoffLocation}</td>
                                    <td>{new Date(purchase.pickupDate).toLocaleDateString()}</td>
                                    <td>{new Date(purchase.dropoffDate).toLocaleDateString()}</td>
                                    <td>{purchase.price}</td>
                                    <td>{purchase.securityDeposit}</td>
                                    <td>{purchase.balance}</td>
                                    <td className="contact-links">
                                        <button onClick={() => sendReminderWhatsApp(purchase)} className="whatsapp-btn">
                                            📱 Send WhatsApp
                                        </button>
                                        <button onClick={() => sendReminderEmail(purchase)} className="reminder-btn">
                                            📩 Send Email
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="past-lending-section">
                <h3>Past Lending</h3>
                {pastLendingPurchases.length === 0 ? (
                    <p>No past purchases.</p>
                ) : (
                    <table className="purchase-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Pickup Location</th>
                                <th>Dropoff Location</th>
                                <th>Pickup Date</th>
                                <th>Dropoff Date</th>
                                <th>Price (INR)</th>
                                <th>Security Deposit</th>
                                <th>Balance</th>
                                <th>Contact Reminder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastLendingPurchases.map((purchase) => (
                                <tr key={purchase._id}>
                                    <td>{purchase.fullName}</td>
                                    <td>{purchase.email}</td>
                                    <td>{purchase.phoneNumber}</td>
                                    <td>{purchase.pickupLocation}</td>
                                    <td>{purchase.dropoffLocation}</td>
                                    <td>{new Date(purchase.pickupDate).toLocaleDateString()}</td>
                                    <td>{new Date(purchase.dropoffDate).toLocaleDateString()}</td>
                                    <td>{purchase.price}</td>
                                    <td>{purchase.securityDeposit}</td>
                                    <td>{purchase.balance}</td>
                                    <td className="contact-links">
                                        <button onClick={() => sendReminderWhatsApp(purchase)} className="whatsapp-btn">
                                            📱 Send WhatsApp
                                        </button>
                                        <button onClick={() => sendReminderEmail(purchase)} className="reminder-btn">
                                            📩 Send Email
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Purchase;
