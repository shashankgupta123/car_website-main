import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./RentalChart.css"; // Import scoped CSS

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getRandomColor = () => {
  const randomColor = () => Math.floor(Math.random() * 256);
  return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.5)`;
};

const RentalChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/purchase/cars-lent-by-week");
      const data = response.data;

      if (data) {
        const weeks = data.map(item => `Week ${item._id.week}`);
        const allCarNames = [...new Set(data.flatMap(item => item.cars.map(car => car.carName)))];

        const datasets = allCarNames.map(carName => ({
          label: carName,
          data: data.map(item => {
            const car = item.cars.find(car => car.carName === carName);
            return car ? car.carCount : 0;
          }),
          backgroundColor: getRandomColor(),
          borderColor: getRandomColor(),
          borderWidth: 1,
        }));

        setChartData({
          labels: weeks,
          datasets: datasets,
        });
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div className="rental-chart-loading">Loading...</div>;
  if (error) return <div className="rental-chart-error">{error}</div>;

  return (
<div className="rental-chart-container">
    <h2 className="rental-chart-title">Car Rentals by Week</h2>
      <div className="rental-chart">
        {chartData && (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true },
              },
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Car Rentals by Week" },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RentalChart;
