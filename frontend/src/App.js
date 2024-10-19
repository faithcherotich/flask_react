import React, { useState } from 'react'; // Ensure useState is imported
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import Help from './components/Help';
import Footer from './components/Footer';
import Carousel from './components/Carousel';
import Notes from './components/Notes';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                    <Route 
                        path='/dashboard' 
                        element={<PrivateRoute element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} isLoggedIn={isLoggedIn} />} 
                    />
                    <Route 
                        path='/blog' 
                        element={<PrivateRoute element={<Notes isLoggedIn={isLoggedIn} />} isLoggedIn={isLoggedIn} />} 
                    />
                </Routes>
                <Carousel /> {/* Always display the carousel */}
            </div>
            <Footer />
        </Router>
    );
};

export default App;