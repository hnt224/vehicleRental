import React, { useState } from 'react';
import ApiService from '../../service/ApiService';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();  // Hook to programmatically navigate between routes

    // State to store form data (name, email, password, phoneNumber)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    // State to store any error or success messages
    const [errorMessage, setErrorMessage] = useState('');   // Error message state
    const [successMessage, setSuccessMessage] = useState('');  // Success message state

    // Handle form input changes and update the respective state values
    const handleInputChange = (e) => {
        const { name, value } = e.target;  // Destructure the name and value from the event target
        setFormData({ ...formData, [name]: value });  // Update the formData state dynamically
    };

    // Validate the form to ensure all fields are filled
    const validateForm = () => {
        const { name, email, password, phoneNumber } = formData;
        if (!name || !email || !password || !phoneNumber) {
            return false;  // Return false if any of the fields are empty
        }
        return true;  // Return true if all fields are filled
    };

    // Handle form submission for user registration
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent the default form submission behavior

        // Validate form before making the API request
        if (!validateForm()) {
            setErrorMessage('Please fill all the fields.');  // Show an error if validation fails
            setTimeout(() => setErrorMessage(''), 5000);  // Clear the error message after 5 seconds
            return;
        }

        try {
            // Call the register method from ApiService to register the user
            const response = await ApiService.registerUser(formData);

            // If the registration is successful
            if (response.statusCode === 200) {
                // Clear the form fields after successful registration
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                setSuccessMessage('User registered successfully');  // Show success message
                setTimeout(() => {
                    setSuccessMessage('');  // Clear success message after 3 seconds
                    navigate('/login');  // Redirect the user to the login page
                }, 3000);
            }
        } catch (error) {
            // Handle any errors during registration, displaying the error message
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(''), 5000);  // Clear error message after 5 seconds
        }
    };

    return (
        <div className="auth-container">
            {/* Display error message if there's an error */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            {/* Display success message if registration is successful */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}  // Handle input change for 'name'
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}  // Handle input change for 'email'
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}  // Handle input change for 'phoneNumber'
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}  // Handle input change for 'password'
                        required
                    />
                </div>
                <button type="submit">Register</button>  {/* Form submit button */}
            </form>

            {/* Link to navigate to the login page */}
            <p className="register-link">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}

export default RegisterPage;
