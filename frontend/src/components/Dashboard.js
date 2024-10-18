import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Optional: Create a CSS file for styling

const Dashboard = ({ setIsLoggedIn }) => {
    const handleLogout = () => {
        // Clear user data from local storage
        localStorage.removeItem('userId');
        // Update the logged-in state
        setIsLoggedIn(false);
        // Optionally redirect to the login page
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <div className="dashboard-buttons">
                <Link to="/blog">
                    <button className="dashboard-button">My Notes</button>
                </Link>
                {/* Add more buttons or links as needed */}
                <button className="dashboard-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;