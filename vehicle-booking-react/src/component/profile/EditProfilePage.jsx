import React, { useState, useEffect } from 'react'; // Import necessary React hooks
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import ApiService from '../../service/ApiService'; // Import ApiService for API interactions

const EditProfilePage = () => {
    const [user, setUser] = useState(null); // State to hold the user profile data
    const [error, setError] = useState(null); // State to manage error messages
    const navigate = useNavigate(); // Hook to navigate programmatically between routes

    // useEffect to fetch the user profile when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Call the API to get the user's profile information
                const response = await ApiService.getUserProfile();
                setUser(response.user); // Update state with the user data from the response
            } catch (error) {
                setError(error.message); // Set error message if the API call fails
            }
        };

        fetchUserProfile(); // Execute the function to fetch the user profile
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    // Function to handle the deletion of the user's profile
    const handleDeleteProfile = async () => {
        // Confirm with the user before proceeding to delete the account
        if (!window.confirm('Are you sure you want to delete your account?')) {
            return; // Exit if the user cancels the confirmation
        }
        try {
            // Call the API to delete the user by their ID
            await ApiService.deleteUser(user.id);
            navigate('/signup'); // Navigate to the signup page after successful deletion
        } catch (error) {
            setError(error.message); // Set error message if the deletion fails
        }
    };

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
            {user && ( // Render user details if user data is available
                <div className="profile-details">
                    <p><strong>Name:</strong> {user.name}</p> {/* Display user's name */}
                    <p><strong>Email:</strong> {user.email}</p> {/* Display user's email */}
                    <p><strong>Phone Number:</strong> {user.phoneNumber}</p> {/* Display user's phone number */}
                    <button className="delete-profile-button" onClick={handleDeleteProfile}>Delete Profile</button> {/* Button to delete profile */}
                </div>
            )}
        </div>
    );
};

export default EditProfilePage; // Export the EditProfilePage component for use in other parts of the application
