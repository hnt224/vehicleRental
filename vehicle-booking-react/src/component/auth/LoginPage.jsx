import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";

function LoginPage() {
    // State to manage user input for email and password, and to store any error messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // State to display error messages
    const navigate = useNavigate();  // Hook to programmatically navigate between routes
    const location = useLocation();  // Hook to access current location/state

    // Determine the page to redirect to after login; defaults to '/home' if not specified
    const from = location.state?.from?.pathname || '/home';

    // Handle form submission for logging in the user
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent the default form submission behavior

        // Check if both email and password are filled
        if (!email || !password) {
            setError('Please fill in all fields.');  // Show error if fields are missing
            setTimeout(() => setError(''), 5000);  // Clear the error after 5 seconds
            return;
        }

        try {
            // Call the API service to log in the user
            const response = await ApiService.loginUser({ email, password });
            
            // If login is successful, store the token and role in local storage
            if (response.statusCode === 200) {
                localStorage.setItem('token', response.token);  // Store token
                localStorage.setItem('role', response.role);    // Store user role
                navigate(from, { replace: true });  // Redirect to the 'from' page or '/home'
            }
        } catch (error) {
            // Handle any errors returned by the API, showing an appropriate message
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);  // Clear the error message after 5 seconds
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>

            {/* Display error message if present */}
            {error && <p className="error-message">{error}</p>}

            {/* Login form */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  // Update email state on input change
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}  // Update password state on input change
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            {/* Link to the registration page if the user doesn't have an account */}
            <p className="register-link">
                Don't have an account? <a href="/register">Register</a>
            </p>
        </div>
    );
}

export default LoginPage;
