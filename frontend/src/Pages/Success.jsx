import React, { useEffect, useState } from 'react';

const Success = () => {
    const [sessionId, setSessionId] = useState(null);

    // Retrieve sessionId from URL query params when the component mounts
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('session_id');
        if (id) {
            setSessionId(id);
        } else {
            console.error('Session ID is missing');
        }
    }, []);

    const handleDownloadReceipt = async () => {
        if (!sessionId) {
            console.error("Session ID is missing");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/receipt/${sessionId}`, {
                method: 'GET',
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `receipt-${sessionId}.pdf`;
                link.click();
            } else {
                console.error('Failed to download receipt:', response.statusText);
            }
        } catch (error) {
            console.error('Error downloading receipt:', error);
        }
    };

    return (
        <div className="success-container">
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your order has been placed successfully.</p>
            <button onClick={handleDownloadReceipt} className="download-receipt-button">
                Download Receipt
            </button>
        </div>
    );
};

export default Success;
