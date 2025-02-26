import React, { useEffect, useState } from 'react'; 
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import './PieChart.css'; // Import the scoped CSS file

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);

  // Define fixed pastel colors
  const pastelColors = [
    'rgba(173, 216, 230, 0.7)',  // Light Blue
    'rgba(144, 238, 144, 0.7)',  // Light Green
    'rgba(255, 255, 153, 0.7)',  // Light Yellow
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/purchase/total-income');
        const data = response.data;

        const labels = [];
        const values = [];
        const colors = [];
        let total = 0;

        data.forEach((item, index) => {
          labels.push(item._id.carName);
          const totalPrice = item.totalPurchases.reduce((sum, purchase) => sum + purchase.price, 0);
          values.push(totalPrice);
          colors.push(pastelColors[index % pastelColors.length]); // Cycle through light colors
          total += totalPrice;
        });

        setChartData({
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: colors,
            hoverOffset: 4,
          }],
        });

        setTotalIncome(total);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <div className="pie-loading">Loading...</div>;
  }

  if (error) {
    return <div className="pie-error">{error}</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const carName = tooltipItem.label;
            const totalIncome = tooltipItem.raw;
            return `${carName}: Rs.${totalIncome}`;
          },
        },
      },
    },
  };

  return (
    <div className="pie-container">
      <h2>Total Purchases by Car</h2>
      <Pie data={chartData} options={options} />
      <div className="pie-total-income">Total Income: Rs.{totalIncome}</div>
    </div>
  );
};

export default PieChart;
