import React, { useState, useEffect } from 'react'; // Import React and hooks for state and side effects
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams to get URL parameters and useNavigate for navigation
import ApiService from '../../service/ApiService'; // Import ApiService to make API requests

// Define the EditBookingPage component
const EditBookingPage = () => {
    const navigate = useNavigate(); // useNavigate hook for navigating programmatically
    const { bookingCode } = useParams(); // useParams hook to get the booking code from the URL
    const [bookingDetails, setBookingDetails] = useState(null); // State variable for storing the booking details
    const [error, setError] = useState(null); // State variable for handling errors
    const [success, setSuccessMessage] = useState(null); // State variable for success messages

    // useEffect to fetch booking details when the component mounts or when bookingCode changes
    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                // Fetch booking details by booking confirmation code
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking); // Store booking details in state
            } catch (error) {
                setError(error.message); // Set error message if there's an issue
            }
        };

        fetchBookingDetails(); // Fetch booking details on component load
    }, [bookingCode]); // Dependency array: effect runs when bookingCode changes

    // Function to handle booking cancellation
    const achieveBooking = async (bookingId) => {
        // Confirm action before proceeding with cancellation
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return; // Exit if the user cancels
        }

        try {
            // Call API to cancel the booking
            const response = await ApiService.cancelBooking(bookingId);
            if (response.statusCode === 200) {
                setSuccessMessage("The booking was successfully cancelled"); // Display success message

                // Redirect to manage bookings after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings'); // Navigate to the booking management page
                }, 3000);
            }
        } catch (error) {
            // Handle any errors from the API and display an error message
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000); // Clear the error after 5 seconds
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Booking Detail</h2>
            {/* Display error message if there is one */}
            {error && <p className='error-message'>{error}</p>}
            {/* Display success message if the booking is successfully cancelled */}
            {success && <p className='success-message'>{success}</p>}
            
            {/* Display booking details if they have been fetched successfully */}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Booking Details</h3>
                    {/* Show details of the booking */}
                    <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Check-in Date: {bookingDetails.checkInDate}</p>
                    <p>Check-out Date: {bookingDetails.checkOutDate}</p>
                    <p>Num Of Passengers: {bookingDetails.numOfPassengers}</p>
                    <p>Num Of Miles: {bookingDetails.numOfMiles}</p>

                    <br />
                    <hr />
                    <br />
                    {/* Display user details who made the booking */}
                    <h3>User Who Made the Booking</h3>
                    <div>
                        <p>Name: {bookingDetails.user.name}</p>
                        <p>Email: {bookingDetails.user.email}</p>
                        <p>Phone Number: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />
                    {/* Display vehicle details associated with the booking */}
                    <h3>Vehicle Details</h3>
                    <div>
                        <p>Vehicle Type: {bookingDetails.vehicle.vehicleType}</p>
                        <p>Vehicle Price: ${bookingDetails.vehicle.vehiclePrice}</p>
                        <p>Vehicle Description: {bookingDetails.vehicle.vehicleDescription}</p>
                        <img src={bookingDetails.vehicle.vehiclePhotoUrl} alt="Vehicle" />
                    </div>

                    {/* Button to cancel the booking */}
                    <button
                        className="achieve-booking"
                        onClick={() => achieveBooking(bookingDetails.id)}>Cancel Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage; // Export the component for use in other parts of the application
