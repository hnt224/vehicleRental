import React, { useState } from 'react';
import ApiService from '../../service/ApiService'; // Service to handle API calls

const FindBookingPage = () => {
    // State variable to store the entered confirmation code
    const [confirmationCode, setConfirmationCode] = useState('');
    
    // State variable to store the booking details fetched from the API
    const [bookingDetails, setBookingDetails] = useState(null);
    
    // State variable to track any error messages
    const [error, setError] = useState(null);

    // Function to handle searching for booking details by confirmation code
    const handleSearch = async () => {
        // Check if the confirmation code is empty or just whitespace
        if (!confirmationCode.trim()) {
            setError("Please enter a booking confirmation code");  // Set error message
            setTimeout(() => setError(''), 5000);  // Clear error after 5 seconds
            return;
        }
        try {
            // Call the API service to fetch booking details using the confirmation code
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);  // Store the fetched booking details in state
            setError(null);  // Clear any previous errors if the API call is successful
        } catch (error) {
            // Handle errors by setting an error message
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);  // Clear the error message after 5 seconds
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Find Booking</h2>

            {/* Input field to enter the booking confirmation code */}
            <div className="search-container">
                <input
                    required
                    type="text"
                    placeholder="Enter your booking confirmation code"
                    value={confirmationCode}  // Bind input value to the confirmationCode state
                    onChange={(e) => setConfirmationCode(e.target.value)}  // Update confirmationCode on change
                />
                <button onClick={handleSearch}>Find</button>  {/* Button to trigger the search */}
            </div>

            {/* Display error message if there is one */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display booking details if available */}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Booking Details</h3>
                    <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>  {/* Display the confirmation code */}
                    <p>Check-in Date: {bookingDetails.checkInDate}</p>  {/* Display check-in date */}
                    <p>Check-out Date: {bookingDetails.checkOutDate}</p>  {/* Display check-out date */}
                    <p>Num Of Passengers: {bookingDetails.numOfPassengers}</p>  {/* Display the number of passengers */}
                    <p>Num Of Miles: {bookingDetails.numOfMiles}</p>  {/* Display the number of miles */}

                    <br />
                    <hr />
                    <br />

                    <h3>Booker Details</h3>
                    <div>
                        <p>Name: {bookingDetails.user.name}</p>  {/* Display the name of the user */}
                        <p>Email: {bookingDetails.user.email}</p>  {/* Display the email of the user */}
                        <p>Phone Number: {bookingDetails.user.phoneNumber}</p>  {/* Display the phone number of the user */}
                    </div>

                    <br />
                    <hr />
                    <br />

                    <h3>Vehicle Details</h3>
                    <div>
                        <p>Vehicle Type: {bookingDetails.vehicle.vehicleType}</p>  {/* Display the vehicle type */}
                        <img src={bookingDetails.vehicle.vehiclePhotoUrl} alt="Vehicle" />  {/* Display the vehicle photo */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindBookingPage;
