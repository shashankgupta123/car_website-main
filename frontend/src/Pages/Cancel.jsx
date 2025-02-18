import React from 'react';
import { Link } from 'react-router-dom';
// import '../CSS/Cancel.css'; // Create this CSS file for styling

const Cancel = () => {
    return (
        <div className="cancel-container">
            <h1>Payment Cancelled</h1>
            <p>It seems you have cancelled the payment. If this was a mistake, you can try again.</p>
            <Link to="/" className="cancel-home-link">Return to Home</Link>
        </div>
    );
};

export default Cancel;
