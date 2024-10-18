import React, { useState } from 'react'; // Ensure useState is imported
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import './App.css';
import Help from './components/Help';
import Footer from './components/Footer';
import Carousel from './components/Carousel';
import Notes from './components/Notes';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCarousel, setShowCarousel] = useState(true);

    return (
        <Router>
            {!isLoggedIn && <Header />} {/* Show header only if not logged in */}
            <div className="app-container">
                <Routes>
                    <Route path='/Help' element={<Help />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path='/dashboard' element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} /> {/* Pass setIsLoggedIn here */}
                    <Route path='/blog' element={<Notes isLoggedIn={isLoggedIn} />} />
                </Routes>
                {showCarousel && <Carousel />}
            </div>
            <Footer />
        </Router>
    );
};

export default App;