import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./RentalChartStatus.css"; // Import the scoped CSS file

Chart.register(...registerables);

const RentalChartStatus = () => {
    const [rentalData, setRentalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/purchase/car-status");
                setRentalData(response.data);
            } catch (err) {
                setError("Failed to fetch rental data. Please try again.");
                console.error("Error fetching rental data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (loading) return <p className="loading-message">Loading rental data...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const labels = rentalData.map(item => `Week ${item._id.week}, ${months[item._id.month - 1]}`);

    const currentRentals = rentalData.map(item =>
        item.currentRentals.reduce((sum, rental) => sum + rental.carCount, 0)
    );

    const pastRentals = rentalData.map(item =>
        item.pastRentals.reduce((sum, rental) => sum + rental.carCount, 0)
    );

    const chartData = {
        labels,
        datasets: [
            {
                label: "Current Rentals",
                data: currentRentals,
                backgroundColor: "rgba(0, 100, 0, 0.8)", // Light Green
                borderColor: "rgba(0, 50, 0, 1)", // Slightly Darker Green
                borderWidth: 1
            },
            {
                label: "Past Rentals",
                data: pastRentals,
                backgroundColor: "rgba(139, 0, 0, 0.8)", // Light Red (Pinkish)
                borderColor: "rgba(100, 0, 0, 1)", // Slightly Darker Red
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Car Rentals (Current vs Past) by Week & Month" }
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true }
        }
    };

    return (
        <div className="rental-status-container">
            <h2 className="rental-status-title">Car Rentals Analysis</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default RentalChartStatus;
