import React, { useState } from 'react';
import './Signup.css'; // Import the CSS file for styling

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null); // State to hold error messages

    const handleSignup = async (e) => {
        e.preventDefault();
        
        // Hash the password in a real application
        const hashedPassword = password; // For demonstration, using plain password

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password: hashedPassword }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Throw an error if the response is not OK
            }

            const data = await response.json();
            // Check for success message or other conditions in response data
            if (data.success) { // Assuming your backend returns { success: true } on successful signup
                setIsSubmitted(true);
                setError(null); // Clear any previous errors
            } else {
                setError(data.message || 'Signup failed.'); // Handle signup failure
            }
        } catch (error) {
            setError(error.message); // Set error message on catch
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSignup}>
                {!isSubmitted ? (
                    <>
                        <h1>Sign Up</h1>
                        {error && <p className="error-message">{error}</p>} {/* Display error messages */}
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