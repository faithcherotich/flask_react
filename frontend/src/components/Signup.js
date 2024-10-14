import React, { useState } from 'react';
import './Signup.css'; // Import the CSS file for styling

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        // Hash the password in a real application
        const hashedPassword = password; // For demonstration, using plain password
// 
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: hashedPassword }),
        });

        const data = await response.json();
        if (data) {
            setIsSubmitted(true);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSignup}>
                {!isSubmitted ? (
                    <>
                        <h1>Sign Up</h1>
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
                    <p>Signup successful! Please check your email.</p>
                )}
            </form>
        </div>
    );
}

export default Signup;
