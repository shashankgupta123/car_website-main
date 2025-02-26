import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Admin.css'; 
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import HistogramChart from './Graph/Histogramchart';
import PieChart from './Graph/Piechart';
import RentalChart from './Graph/RentalChart';
import RentalChartStatus from './Graph/RentalChartStatus';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminPage = () => {
  const navigate = useNavigate(); 

  const salesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'], 
    datasets: [
      {
        label: 'Sales ($)',
        data: [3000, 5000, 7000, 8000, 9500, 11000], 
        borderColor: 'rgba(75, 192, 192, 1)', 
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  const activityData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'User Activity (hours)',
        data: [2, 5, 8, 3, 6, 7, 4],
        backgroundColor: 'rgba(255, 159, 64, 0.8)', 
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sales Over Time (in $)',
      },
    },
  };

  const activityOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'User Activity (in Hours)',
      },
    },
  };

  const handleLogout = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch("http://localhost:5000/api/users/adminlogout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), 
      });

      if (response.ok) {
        localStorage.clear();
        navigate('/login');
      } else {
        const data = await response.json();
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <>
    <div className="admin-page">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li><Link to="/admin/cars">Cars</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/contact">Contact</Link></li>
          <li><Link to="/admin/purchase">Payment List</Link></li>
          <li><Link to="/admin/reviews">Reviews</Link></li>
          
        </ul>
      </div>

      <div className="content">
        <h1>Welcome to the Admin Dashboard</h1>

        <HistogramChart/>
        <PieChart />
        <RentalChart/>
        <RentalChartStatus/>

      </div>
    </div>
    <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default AdminPage;
