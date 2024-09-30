import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import ApiService from '../../service/ApiService'; // Import the ApiService to interact with backend API
import Pagination from '../common/Pagination'; // Import Pagination component for managing paginated data

// Define the ManageBookingsPage component
const ManageBookingsPage = () => {
    // Define state variables
    const [bookings, setBookings] = useState([]); // Store all booking records
    const [filteredBookings, setFilteredBookings] = useState([]); // Store filtered bookings based on search
    const [searchTerm, setSearchTerm] = useState(''); // Store the search term entered by the user
    const [currentPage, setCurrentPage] = useState(1); // Track the current page number for pagination
    const [bookingsPerPage] = useState(6); // Set the number of bookings to display per page
    const navigate = useNavigate(); // Use navigate for redirection to different pages

    // Fetch bookings when the component mounts
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await ApiService.getAllBookings(); // Fetch all bookings from the API
                const allBookings = response.bookingList; // Extract booking list from response
                setBookings(allBookings); // Update the bookings state with fetched data
                setFilteredBookings(allBookings); // Initially set filtered bookings to show all bookings
            } catch (error) {
                console.error('Error fetching bookings:', error.message); // Log errors if API call fails
            }
        };

        fetchBookings(); // Call fetchBookings to load data on component mount
    }, []); // Empty dependency array means this effect runs once on mount

    // Filter bookings based on search term whenever searchTerm or bookings change
    useEffect(() => {
        filterBookings(searchTerm); // Apply filtering based on search term
    }, [searchTerm, bookings]); // Runs whenever searchTerm or bookings data changes

    // Function to filter bookings based on search term
    const filterBookings = (term) => {
        if (term === '') {
            setFilteredBookings(bookings); // If no search term, show all bookings
        } else {
            // Filter bookings based on matching bookingConfirmationCode
            const filtered = bookings.filter((booking) =>
                booking.bookingConfirmationCode && booking.bookingConfirmationCode.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredBookings(filtered); // Update state with filtered bookings
        }
        setCurrentPage(1); // Reset to the first page after filtering
    };

    // Update searchTerm state whenever the input value changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update the search term based on user input
    };

    // Calculate the indices for slicing bookings to display based on the current page
    const indexOfLastBooking = currentPage * bookingsPerPage; // Last booking on the current page
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage; // First booking on the current page
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking); // Extract the current page bookings

    // Function to change the current page when a pagination button is clicked
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='bookings-container'>
            <h2>All Bookings</h2> {/* Title for the bookings page */}
            
            {/* Search bar to filter bookings by booking number */}
            <div className='search-div'>
                <label>Filter by Booking Number:</label>
                <input
                    type="text"
                    value={searchTerm} // Bind input value to searchTerm state
                    onChange={handleSearchChange} // Call handleSearchChange when input value changes
                    placeholder="Enter booking number"
                />
            </div>

            {/* Display filtered bookings */}
            <div className="booking-results">
                {currentBookings.map((booking) => (
                    <div key={booking.id} className="booking-result-item"> {/* Key for unique identification */}
                        <p><strong>Booking Code:</strong> {booking.bookingConfirmationCode}</p>
                        <p><strong>Check In Date:</strong> {booking.checkInDate}</p>
                        <p><strong>Check out Date:</strong> {booking.checkOutDate}</p>
                        <p><strong>Total Passengers:</strong> {booking.numOfPassengers}</p>
                        {/* Button to navigate to edit booking page */}
                        <button
                            className="edit-vehicle-button"
                            onClick={() => navigate(`/admin/edit-booking/${booking.bookingConfirmationCode}`)}
                        >Manage Booking</button>
                    </div>
                ))}
            </div>

            {/* Pagination component to navigate between pages */}
            <Pagination
                vehiclessPerPage={bookingsPerPage} // Number of bookings per page
                totalVehicles={filteredBookings.length} // Total number of filtered bookings
                currentPage={currentPage} // Current active page
                paginate={paginate} // Function to change pages
            />
        </div>
    );
};

export default ManageBookingsPage; // Export the ManageBookingsPage component
