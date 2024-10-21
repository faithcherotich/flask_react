import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Signup failed.');
            }

            const data = await response.json();
            if (data.success) {
                setIsSubmitted(true);
                setError(null);
            } else {
                setError(data.message || 'Signup failed.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSignup}>
                {!isSubmitted ? (
                    <>
                        <h1>Sign Up</h1>
                        {error && <p className="error-message">{error}</p>}
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign up</button>
                    </>
                ) : (
                    <div>
                        <p>Signup successful! Please check your email.</p>
                        <p>Now you can <Link to="/login">log in</Link>.</p>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Signup;