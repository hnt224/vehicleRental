import React, { useState, useEffect } from 'react'; // Import necessary React hooks
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import ApiService from '../../service/ApiService'; // Import ApiService for API interactions

const ProfilePage = () => {
    const [user, setUser] = useState(null); // State to hold user profile data
    const [error, setError] = useState(null); // State to manage error messages
    const navigate = useNavigate(); // Hook to navigate programmatically between routes

    // useEffect to fetch the user profile when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Call the API to get the user's profile information
                const response = await ApiService.getUserProfile();
                // Fetch user bookings using the fetched user ID
                const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                setUser(userPlusBookings.user); // Update state with user data including bookings
            } catch (error) {
                // Set error message if the API call fails
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchUserProfile(); // Execute the function to fetch user profile and bookings
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    // Function to handle user logout
    const handleLogout = () => {
        ApiService.logout(); // Call the logout function from ApiService
        navigate('/home'); // Navigate to the home page after logout
    };

    // Function to navigate to the Edit Profile page
    const handleEditProfile = () => {
        navigate('/edit-profile'); // Navigate to the edit profile page
    };

    return (
        <div className="profile-page">
            {user && <h2>Welcome, {user.name}</h2>} {/* Display welcome message if user data is available */}
            <div className="profile-actions">
                <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button> {/* Button to edit profile */}
                <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Button to logout */}
            </div>
            {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
            {user && ( // Render user profile details if user data is available
                <div className="profile-details">
                    <h3>My Profile Details</h3>
                    <p><strong>Email:</strong> {user.email}</p> {/* Display user's email */}
                    <p><strong>Phone Number:</strong> {user.phoneNumber}</p> {/* Display user's phone number */}
                </div>
            )}
            <div className="bookings-section">
                <h3>My Booking History</h3>
                <div className="booking-list">
                    {user && user.bookings.length > 0 ? ( // Check if user has any bookings
                        user.bookings.map((booking) => ( // Map through each booking
                            <div key={booking.id} className="booking-item">
                                <p><strong>Booking Code:</strong> {booking.bookingConfirmationCode}</p> {/* Display booking confirmation code */}
                                <p><strong>Check-in Date:</strong> {booking.checkInDate}</p> {/* Display check-in date */}
                                <p><strong>Check-out Date:</strong> {booking.checkOutDate}</p> {/* Display check-out date */}
                                <p><strong>Total Passengers:</strong> {booking.totalNumOfPassengers}</p> {/* Display total number of passengers */}
                                <p><strong>Vehicle Type:</strong> {booking.vehicle.vehicleType}</p> {/* Display type of vehicle */}
                                <img src={booking.vehicle.vehiclePhotoUrl} alt="Vehicle" className="vehicle-photo" /> {/* Display vehicle photo */}
                            </div>
                        ))
                    ) : (
                        <p>No bookings found.</p> // Display message if no bookings exist
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; // Export the ProfilePage component for use in other parts of the application
