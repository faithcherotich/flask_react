import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Header.css'; // Import CSS for styling

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Load dark mode setting from localStorage
        const savedMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedMode);
        document.body.classList.toggle('dark-mode', savedMode);
    }, []);

    const toggleDarkMode = () => {
        // Toggle dark mode and save to localStorage
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        document.body.classList.toggle('dark-mode', newMode);
    };

    return (
        <header className="header">
            <h1 className="header-title">Note-Taking App</h1>
            <nav>
                <ul className="nav-list">
                    <li><Link to="/home" className="nav-link">Home</Link></li>
                    <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
                    <li><Link to="/help" className="nav-link">Help</Link></li>
                    <li><Link to="/blog" className="nav-link">Notes</Link></li>
                    <li><Link to="/login" className="nav-link">Log In</Link></li>
                    <li><Link to="/signup" className="nav-link">Sign Up</Link></li>
                    <li>
                        <button onClick={toggleDarkMode} className="nav-link mode-toggle">
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
