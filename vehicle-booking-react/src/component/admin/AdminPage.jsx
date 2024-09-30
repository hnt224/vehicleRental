import React, { useState, useEffect } from "react"; // Import React and hooks for state and lifecycle methods
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation between routes
import ApiService from '../../service/ApiService'; // Import ApiService to make API requests

// Define the AdminPage component
const AdminPage = () => {
    const [adminName, setAdminName] = useState(''); // State to store the admin's name
    const navigate = useNavigate(); // useNavigate hook to navigate to different routes programmatically

    // useEffect to fetch the admin's profile details when the component mounts
    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await ApiService.getUserProfile(); // Fetch the admin profile from the API
                setAdminName(response.user.name); // Update state with the admin's name
            } catch (error) {
                console.error('Error fetching admin details:', error.message); // Log any errors that occur
            }
        };

        fetchAdminName(); // Call the function to fetch the admin's name
    }, []); // Empty dependency array ensures the effect runs only once, on component mount

    return (
        <div className="admin-page">
            {/* Welcome message displaying the admin's name */}
            <h1 className="welcome-message">Welcome, {adminName}</h1>
            
            <div className="admin-actions">
                {/* Button to navigate to the Manage Vehicles page */}
                <button className="admin-button" onClick={() => navigate('/admin/manage-vehicles')}>
                    Manage Vehicles
                </button>
                {/* Button to navigate to the Manage Bookings page */}
                <button className="admin-button" onClick={() => navigate('/admin/manage-bookings')}>
                    Manage Bookings
                </button>
            </div>
        </div>
    );
}

export default AdminPage; // Export the AdminPage component
