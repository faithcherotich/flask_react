import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Optional: Create a CSS file for styling

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <div className="dashboard-buttons">
                <Link to="/blog">
                    <button className="dashboard-button">My Notes</button>
                </Link>
                {/* Add more buttons or links as needed */}
            </div>
        </div>
    );
};

export default Dashboard;