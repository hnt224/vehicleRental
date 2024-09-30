import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService'; // Importing API service for API calls
import DatePicker from 'react-datepicker'; // Importing date picker component
// import 'react-datepicker/dist/react-datepicker.css'; // Uncomment to include date picker styles

const VehicleDetailsPage = () => {
  const navigate = useNavigate(); // Access the navigate function to change routes
  const { vehicleId } = useParams(); // Get vehicle ID from URL parameters
  const [vehicleDetails, setVehicleDetails] = useState(null); // State variable to hold vehicle details
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any errors
  const [checkInDate, setCheckInDate] = useState(null); // State variable for check-in date
  const [checkOutDate, setCheckOutDate] = useState(null); // State variable for check-out date
  const [numPassengers, setNumPassengers] = useState(1); // State variable for number of passengers
  const [numMiles, setNumMiles] = useState(0); // State variable for number of miles
  const [totalPrice, setTotalPrice] = useState(0); // State variable for total booking price
  const [showDatePicker, setShowDatePicker] = useState(false); // Control date picker visibility
  const [userId, setUserId] = useState(''); // State variable for user ID
  const [showMessage, setShowMessage] = useState(false); // Control message visibility for booking success
  const [confirmationCode, setConfirmationCode] = useState(''); // State variable for booking confirmation code
  const [errorMessage, setErrorMessage] = useState(''); // State variable for error message

  // Fetch vehicle details and user profile on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state to true
        const response = await ApiService.getVehicleById(vehicleId); // Fetch vehicle details
        setVehicleDetails(response.vehicle); // Set vehicle details in state
        const userProfile = await ApiService.getUserProfile(); // Fetch user profile
        setUserId(userProfile.user.id); // Set user ID in state
      } catch (error) {
        setError(error.response?.data?.message || error.message); // Set error message if API call fails
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    };
    fetchData(); // Call fetchData function
  }, [vehicleId]); // Re-run effect when vehicleId changes

  // Function to handle booking confirmation
  const handleConfirmBooking = async () => {
    // Validate check-in and check-out dates
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please select check-in and check-out dates.'); // Set error message
      setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
      return;
    }

    // Validate number of passengers and miles
    if (isNaN(numPassengers) || numPassengers < 1 || isNaN(numMiles) || numMiles < 0) {
      setErrorMessage('Please enter valid numbers for passengers and miles traveling.'); // Set error message
      setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
      return;
    }

    // Calculate total number of days between check-in and check-out dates
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1; // Total days booked

    // Calculate total price for the booking
    const vehiclePricePerDay = vehicleDetails.vehiclePrice; // Vehicle price per day
    const totalPrice = vehiclePricePerDay * totalDays; // Total booking price

    setTotalPrice(totalPrice); // Update total price in state
  };

  // Function to accept the booking
  const acceptBooking = async () => {
    try {
      // Ensure checkInDate and checkOutDate are Date objects
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      // Log the original dates for debugging
      console.log("Original Check-in Date:", startDate);
      console.log("Original Check-out Date:", endDate);

      // Format dates to YYYY-MM-DD for the booking API
      const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      // Log the formatted dates for debugging
      console.log("Formatted Check-in Date:", formattedCheckInDate);
      console.log("Formatted Check-out Date:", formattedCheckOutDate);

      // Create booking object
      const booking = {
        checkInDate: formattedCheckInDate, // Check-in date
        checkOutDate: formattedCheckOutDate, // Check-out date
        numOfPassengers: numPassengers, // Number of passengers
        numOfMiles: numMiles // Number of miles
      };
      console.log(booking) // Log booking object
      console.log(checkOutDate) // Log check-out date

      // Make booking request to API
      const response = await ApiService.bookVehicle(vehicleId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode); // Set booking confirmation code
        setShowMessage(true); // Show success message
        // Hide message and navigate to vehicles page after 5 seconds
        setTimeout(() => {
          setShowMessage(false);
          navigate('/vehicles'); // Navigate to vehicles page
        }, 5000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message); // Set error message if booking fails
      setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
    }
  };

  // Conditional rendering based on loading and error states
  if (isLoading) {
    return <p className='vehicle-detail-loading'>Loading vehicle details...</p>; // Loading message
  }

  if (error) {
    return <p className='vehicle-detail-loading'>{error}</p>; // Error message
  }

  if (!vehicleDetails) {
    return <p className='vehicle-detail-loading'>Vehicle not found.</p>; // Vehicle not found message
  }

  // Destructure vehicle details for easier access
  const { vehicleType, vehiclePrice, vehiclePhotoUrl, description, bookings } = vehicleDetails;

  return (
    <div className="vehicle-details-booking">
      {showMessage && (
        <p className="booking-success-message">
          Booking successful! Confirmation code: {confirmationCode}. An SMS and email of your booking details have been sent to you.
        </p>
      )}
      {errorMessage && (
        <p className="error-message">
          {errorMessage} {/* Display any error messages */}
        </p>
      )}
      <h2>Vehicle Details</h2>
      <br />
      <img src={vehiclePhotoUrl} alt={vehicleType} className="vehicle-details-image" /> {/* Vehicle image */}
      <div className="vehicle-details-info">
        <h3>{vehicleType}</h3>
        <p>Price: ${vehiclePrice} / day</p> {/* Vehicle price */}
        <p>{description}</p> {/* Vehicle description */}
      </div>
      {bookings && bookings.length > 0 && (
        <div>
          <h3>Existing Booking Details</h3>
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <li key={booking.id} className="booking-item">
                <span className="booking-number">Booking {index + 1} </span>
                <span className="booking-text">Check-in: {booking.checkInDate} </span>
                <span className="booking-text">Out: {booking.checkOutDate}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="booking-info">
        <button className="book-now-button" onClick={() => setShowDatePicker(true)}>Book Now</button>
        <button className="go-back-button" onClick={() => setShowDatePicker(false)}>Go Back</button>
        {showDatePicker && (
          <div className="date-picker-container">
            <DatePicker
              className="detail-search-field"
              selected={checkInDate} // Controlled date picker for check-in date
              onChange={(date) => setCheckInDate(date)} // Update check-in date on change
              selectsStart
              startDate={checkInDate} // Set start date for the date range
              endDate={checkOutDate} // Set end date for the date range
              placeholderText="Check-in date" // Placeholder for check-in date
              dateFormat="MM/dd/yyyy" // Date format
              required
            />
            <DatePicker
              className="detail-search-field"
              selected={checkOutDate} // Controlled date picker for check-out date
              onChange={(date) => setCheckOutDate(date)} // Update check-out date on change
              selectsEnd
              startDate={checkInDate} // Set start date for the date range
              endDate={checkOutDate} // Set end date for the date range
              placeholderText="Check-out date" // Placeholder for check-out date
              dateFormat="MM/dd/yyyy" // Date format
              required
            />
            <div className="booking-quantity">
              <label htmlFor="numPassengers">Number of Passengers:</label>
              <input
                type="number"
                id="numPassengers"
                min="1"
                value={numPassengers} // Bind value to state
                onChange={(e) => setNumPassengers(e.target.value)} // Update passengers count on change
              />
              <label htmlFor="numMiles">Number of Miles:</label>
              <input
                type="number"
                id="numMiles"
                min="0"
                value={numMiles} // Bind value to state
                onChange={(e) => setNumMiles(e.target.value)} // Update miles count on change
              />
            </div>
            <p>Total Price: ${totalPrice}</p> {/* Display total price */}
            <button className="confirm-booking-button" onClick={acceptBooking}>Confirm Booking</button> {/* Confirm booking button */}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailsPage; // Export component for use in other files
