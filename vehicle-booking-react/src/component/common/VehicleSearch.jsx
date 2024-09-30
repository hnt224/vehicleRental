import React, { useState, useEffect } from 'react'; // Import necessary React hooks
import DatePicker from 'react-datepicker'; // Import DatePicker component for date selection
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for DatePicker styling
import ApiService from '../../service/ApiService'; // Import the API service for fetching data

const VehicleSearch = ({ handleSearchResult }) => {
    // State variables to manage date selection and vehicle type
    const [startDate, setStartDate] = useState(null); // State for check-in date
    const [endDate, setEndDate] = useState(null); // State for check-out date
    const [vehicleType, setVehicleType] = useState(''); // State for selected vehicle type
    const [vehicleTypes, setVehicleTypes] = useState([]); // State to store available vehicle types
    const [error, setError] = useState(''); // State to manage error messages

    // useEffect to fetch vehicle types from the API when the component mounts
    useEffect(() => {
        const fetchVehicleTypes = async () => {
            try {
                const types = await ApiService.getVehicleTypes(); // Call API to get vehicle types
                setVehicleTypes(types); // Update state with fetched vehicle types
            } catch (error) {
                console.error('Error fetching vehicle types:', error.message); // Log error to the console
            }
        };
        fetchVehicleTypes(); // Invoke the function to fetch vehicle types
    }, []); // Empty dependency array to run only on mount

    // Function to display error messages
    const showError = (message, timeOut = 5000) => {
        setError(message); // Set the error message
        setTimeout(() => {
            setError(''); // Clear the error message after the specified timeout
        }, timeOut);
    };

    // Function to handle the search action
    const handleInternalSearch = async () => {
        // Check if required fields are selected
        if (!startDate || !endDate || !vehicleType) {
            showError("Please select all fields"); // Show error if fields are missing
            return false; // Exit the function
        }

        try {
            // Format the selected dates to ISO string for the API request
            const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
            const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

            // Call API to fetch available vehicles based on selected dates and vehicle type
            const response = await ApiService.getAvailableVehiclesByDateAndType(formattedStartDate, formattedEndDate, vehicleType);
      
            if (response.statusCode === 200) { // Check if the response is successful
                if (response.vehicleList.length === 0) {
                    showError("Vehicle not currently available for the vehicle type and selected date range"); // Show error if no vehicles are found
                    return;
                }
                handleSearchResult(response.vehicleList); // Pass the found vehicles to the parent component
                setError(''); // Clear any previous error messages
            }
        } catch (error) {
            showError("Unknown error occurred:" + error.response.data.message); // Show error if API call fails
        }
    };

    return (
        <section>
            <div className="search-container">
                <div className="search-field">
                    <label>Check-in Date</label>
                    <DatePicker
                        selected={startDate} // Bind selected date to state
                        onChange={(date) => setStartDate(date)} // Update start date on change
                        dateFormat="dd/MM/yyyy" // Date format for the picker
                        placeholderText="Select Check-in Date" // Placeholder text
                    />
                </div>
                <div className="search-field">
                    <label>Check-out Date</label>
                    <DatePicker
                        selected={endDate} // Bind selected date to state
                        onChange={(date) => setEndDate(date)} // Update end date on change
                        dateFormat="dd/MM/yyyy" // Date format for the picker
                        placeholderText="Select Check-out Date" // Placeholder text
                    />
                </div>

                <div className="search-field">
                    <label>Vehicle Type</label>
                    <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}> // Dropdown for selecting vehicle type
                        <option disabled value="">
                            Select Vehicle Type
                        </option>
                        {vehicleTypes.map((vehicleType) => ( // Map through available vehicle types
                            <option key={vehicleType} value={vehicleType}>
                                {vehicleType} // Display vehicle type in dropdown
                            </option>
                        ))}
                    </select>
                </div>
                <button className="home-search-button" onClick={handleInternalSearch}> // Button to trigger search
                    Search Vehicles
                </button>
            </div>
            {error && <p className="error-message">{error}</p>} // Display error message if any
        </section>
    );
};

export default VehicleSearch; // Export the component for use in other files
