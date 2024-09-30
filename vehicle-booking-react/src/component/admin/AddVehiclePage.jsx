import React, { useState, useEffect } from 'react'; // Import React and hooks for state and side effects
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigating between routes
import ApiService from '../../service/ApiService'; // Import ApiService to interact with the backend

// Define the AddVehiclePage component
const AddVehiclePage = () => {
    const navigate = useNavigate(); // useNavigate hook for programmatic navigation

    // State to manage vehicle details entered by the user
    const [vehicleDetails, setVehicleDetails] = useState({
        vehiclePhotoUrl: '', // Placeholder for the vehicle photo URL
        vehicleType: '', // Selected vehicle type
        vehiclePrice: '', // Vehicle price
        vehicleDescription: '', // Vehicle description
    });

    const [file, setFile] = useState(null); // Store the selected vehicle image file
    const [preview, setPreview] = useState(null); // Store the preview URL for the image
    const [error, setError] = useState(''); // Store error messages
    const [success, setSuccess] = useState(''); // Store success messages
    const [vehicleTypes, setVehicleTypes] = useState([]); // Store available vehicle types from the API
    const [newVehicleType, setNewVehicleType] = useState(false); // Track if a new vehicle type is being entered by the user

    // useEffect to fetch vehicle types from the API when the component mounts
    useEffect(() => {
        const fetchVehicleTypes = async () => {
            try {
                const types = await ApiService.getVehicleTypes(); // Fetch vehicle types from the API
                setVehicleTypes(types); // Update vehicleTypes state with fetched data
            } catch (error) {
                console.error('Error fetching Vehicle types:', error.message); // Log any errors that occur
            }
        };
        fetchVehicleTypes(); // Call the function to fetch vehicle types
    }, []); // Empty dependency array ensures this runs only once when the component is mounted

    // Handle changes in form inputs and update the vehicleDetails state
    const handleChange = (e) => {
        const { name, value } = e.target; // Destructure name and value from the event target
        setVehicleDetails(prevState => ({
            ...prevState, // Spread previous state
            [name]: value, // Update the specific input field
        }));
    };

    // Handle changes in vehicle type dropdown
    const handleVehicleTypeChange = (e) => {
        if (e.target.value === 'new') {
            setNewVehicleType(true); // Show an input field if 'new' is selected
            setVehicleDetails(prevState => ({ ...prevState, vehicleType: '' })); // Clear vehicleType for new entry
        } else {
            setNewVehicleType(false); // Hide the input field if an existing type is selected
            setVehicleDetails(prevState => ({ ...prevState, vehicleType: e.target.value })); // Set selected type
        }
    };

    // Handle file input changes (for vehicle photo)
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]; // Get the selected file
        if (selectedFile) {
            setFile(selectedFile); // Store the selected file in state
            setPreview(URL.createObjectURL(selectedFile)); // Create and set a preview URL for the image
        } else {
            setFile(null); // If no file is selected, reset file state
            setPreview(null); // Clear the preview
        }
    };

    // Function to add a new vehicle by sending the details to the API
    const addVehicle = async () => {
        // Ensure all required fields are filled
        if (!vehicleDetails.vehicleType || !vehicleDetails.vehiclePrice || !vehicleDetails.vehicleDescription) {
            setError('All Vehicle details must be provided.'); // Show an error if fields are missing
            setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
            return;
        }

        // Confirm the action with the user before proceeding
        if (!window.confirm('Do you want to add this Vehicle?')) {
            return; // Exit if the user cancels the action
        }

        try {
            const formData = new FormData(); // Create a FormData object to hold the vehicle details
            formData.append('vehicleType', vehicleDetails.vehicleType); // Append vehicle type
            formData.append('vehiclePrice', vehicleDetails.vehiclePrice); // Append vehicle price
            formData.append('vehicleDescription', vehicleDetails.vehicleDescription); // Append vehicle description

            if (file) {
                formData.append('photo', file); // If a file was uploaded, append the vehicle photo
            }

            const result = await ApiService.addVehicle(formData); // Send the formData to the API to add the vehicle
            if (result.statusCode === 200) { // Check if the response is successful
                setSuccess('Vehicle Added successfully.'); // Show a success message
                setTimeout(() => {
                    setSuccess(''); // Clear the success message after 3 seconds
                    navigate('/admin/manage-vehicles'); // Navigate back to the manage vehicles page
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message); // Show an error message if something goes wrong
            setTimeout(() => setError(''), 5000); // Clear the error message after 5 seconds
        }
    };

    return (
        <div className="edit-vehicle-container">
            <h2>Add New Vehicle</h2> {/* Page title */}
            {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
            {success && <p className="success-message">{success}</p>} {/* Display success message if any */}
            
            <div className="edit-vehicle-form">
                {/* Section to upload a vehicle photo */}
                <div className="form-group">
                    {preview && (
                        <img src={preview} alt="Vehicle Preview" className="vehicle-photo-preview" /> // Display image preview
                    )}
                    <input
                        type="file"
                        name="vehiclePhoto"
                        onChange={handleFileChange} // Handle file input change
                    />
                </div>

                {/* Dropdown to select a vehicle type */}
                <div className="form-group">
                    <label>Vehicle Type</label>
                    <select value={vehicleDetails.vehicleType} onChange={handleVehicleTypeChange}>
                        <option value="">Select a Vehicle type</option>
                        {vehicleTypes.map(type => (
                            <option key={type} value={type}>{type}</option> // Map available types to the dropdown
                        ))}
                        <option value="new">Other (please specify)</option> {/* Option to enter a new type */}
                    </select>
                    {/* Input field for entering a new vehicle type if "Other" is selected */}
                    {newVehicleType && (
                        <input
                            type="text"
                            name="vehicleType"
                            placeholder="Enter new vehicle type"
                            value={vehicleDetails.vehicleType}
                            onChange={handleChange} // Handle input changes for the new vehicle type
                        />
                    )}
                </div>

                {/* Input for vehicle price */}
                <div className="form-group">
                    <label>Vehicle Price</label>
                    <input
                        type="text"
                        name="vehiclePrice"
                        value={vehicleDetails.vehiclePrice}
                        onChange={handleChange} // Handle input changes for the vehicle price
                    />
                </div>

                {/* Textarea for vehicle description */}
                <div className="form-group">
                    <label>Vehicle Description</label>
                    <textarea
                        name="vehicleDescription"
                        value={vehicleDetails.vehicleDescription}
                        onChange={handleChange} // Handle input changes for the vehicle description
                    ></textarea>
                </div>

                {/* Button to submit the form and add the vehicle */}
                <button className="update-button" onClick={addVehicle}>Add Vehicle</button>
            </div>
        </div>
    );
};

export default AddVehiclePage; // Export the AddVehiclePage component
