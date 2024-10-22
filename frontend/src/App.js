import React, { useState } from 'react';
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
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* Always show the header */}
            <div className="app-container">
                <Routes>
                    <Route path='/' element={<Home />} /> {/* Home route */}
                    <Route path='/help' element={<Help />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} /> {/* Pass setIsLoggedIn */}
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route 
                        path='/dashboard' 
                        element={<PrivateRoute element={<Dashboard setIsLoggedIn={setIsLoggedIn} />} isLoggedIn={isLoggedIn} />} 
                    />
                    <Route 
                        path='/notes' 
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
