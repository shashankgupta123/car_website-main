import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./RentalChart.css"; // Import scoped CSS

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Fixed Lavender & Light Blue colors
const fixedColors = [
  "rgba(230, 230, 250, 0.8)", // Light Lavender
  "rgba(173, 216, 230, 0.8)", // Light Blue
  "rgba(221, 160, 221, 0.8)", // Plum
  "rgba(135, 206, 235, 0.8)", // Sky Blue
];

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

        const datasets = allCarNames.map((carName, index) => ({
          label: carName,
          data: data.map(item => {
            const car = item.cars.find(car => car.carName === carName);
            return car ? car.carCount : 0;
          }),
          backgroundColor: fixedColors[index % fixedColors.length], // Assign fixed colors
          borderColor: fixedColors[index % fixedColors.length],
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
  }, []); // Fetch data only once on mount

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
