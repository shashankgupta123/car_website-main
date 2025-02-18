import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './HistogramChart.css'; // Import the CSS file

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Function to generate random color
const getRandomColor = () => {
  const randomColor = () => Math.floor(Math.random() * 256);
  return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.6)`;
};

const HistogramChart = () => {
  const [chartData, setChartData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/purchase/weekly-income'); // Replace with your actual backend endpoint
        const data = response.data;
        const weeks = [];
        const prices = [];

        data.forEach(item => {
          const monthName = getMonthName(item._id.month); // Get month name
          const weekLabel = `${monthName} ${item._id.week} Week`; // Format week label
          weeks.push(weekLabel);
          const totalPrice = item.purchases.reduce((sum, purchase) => sum + purchase.price, 0);
          prices.push(totalPrice);
        });

        setChartData({
          labels: weeks,
          datasets: [
            {
              label: 'Total Income',
              data: prices, 
              backgroundColor: getRandomColor(), // Dynamic color for each bar
              borderColor: getRandomColor(),
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); 

    // Set interval to fetch data every 5 seconds (or adjust based on your needs)
    const intervalId = setInterval(fetchData, 5000);

    // Clean-up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); 

  if (isLoading) {
    return <div className="histogram-loading">Loading...</div>;
  }

  if (error) {
    return <div className="histogram-error">{error}</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Total Income by Week and Month',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Weeks',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Income',
        },
      },
    },
  };

  return (
    <div className="histogram-container">
      <h2 className="histogram-title">Total Income Histogram</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default HistogramChart;
