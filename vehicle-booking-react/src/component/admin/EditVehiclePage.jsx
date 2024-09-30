import React, { useState, useEffect } from 'react'; // Import necessary hooks from React
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks for accessing route parameters and navigation
import ApiService from '../../service/ApiService'; // Import the ApiService for API calls

// Define the EditVehiclePage component
const EditVehiclePage = () => {
    const { vehicleId } = useParams(); // Extract vehicleId from the URL using useParams
    const navigate = useNavigate(); // useNavigate hook to programmatically navigate to other routes
    const [vehicleDetails, setVehicleDetails] = useState({
        vehiclePhotoUrl: '', // Vehicle photo URL
        vehicleType: '', // Vehicle type
        vehiclePrice: '', // Vehicle price
        vehicleDescription: '', // Vehicle description
    });
    const [file, setFile] = useState(null); // State for holding the selected image file
    const [preview, setPreview] = useState(null); // State for holding the preview of the image file
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages

    // useEffect to fetch the vehicle details when the component mounts or vehicleId changes
    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                // Fetch the vehicle details using the ApiService
                const response = await ApiService.getVehicleById(vehicleId);
                // Update the vehicle details state with the fetched data
                setVehicleDetails({
                    vehiclePhotoUrl: response.vehicle.vehiclePhotoUrl,
                    vehicleType: response.vehicle.vehicleType,
                    vehiclePrice: response.vehicle.vehiclePrice,
                    vehicleDescription: response.vehicle.vehicleDescription,
                });
            } catch (error) {
                // Set error message in case of API failure
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchVehicleDetails(); // Call the function to fetch the vehicle details
    }, [vehicleId]); // Dependency array includes vehicleId

    // Handle changes in input fields for vehicle details
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the specific field in vehicleDetails based on the input field's name
        setVehicleDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle changes in file input for vehicle photo
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]; // Get the selected file
        if (selectedFile) {
            setFile(selectedFile); // Set the file state with the selected file
            setPreview(URL.createObjectURL(selectedFile)); // Set the preview state with the image URL for display
        } else {
            // Reset the file and preview if no file is selected
            setFile(null);
            setPreview(null);
        }
    };

    // Handle the update of vehicle details
    const handleUpdate = async () => {
        try {
            const formData = new FormData(); // Create a new FormData object for handling form data
            // Append the vehicle details to the form data
            formData.append('vehicleType', vehicleDetails.vehicleType);
            formData.append('vehiclePrice', vehicleDetails.vehiclePrice);
            formData.append('vehicleDescription', vehicleDetails.vehicleDescription);

            // Append the photo file if it's selected
            if (file) {
                formData.append('photo', file); // Append the selected file to the form data
            }

            // Call the API service to update the vehicle with form data
            const result = await ApiService.updateVehicle(vehicleId, formData);

            // Check if the update was successful
            if (result.statusCode === 200) {
                setSuccess('Vehicle updated successfully.'); // Set success message
                // Redirect to the admin vehicle management page after a delay
                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-vehicles'); // Navigate to manage vehicles page
                }, 3000);
            } else {
                // Handle unsuccessful status codes
                setError('Failed to update the vehicle.');
                setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
            }
        } catch (error) {
            // Set error messages from the API response or caught error
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
        }
    };

    // Handle the deletion of the vehicle
    const handleDelete = async () => {
        if (window.confirm('Do you want to delete this vehicle?')) {
            try {
                // Call the API service to delete the vehicle
                const result = await ApiService.deleteVehicle(vehicleId);
                if (result.statusCode === 200) {
                    setSuccess('Vehicle deleted successfully.'); // Set success message
                    setTimeout(() => {
                        setSuccess('');
                        navigate('/admin/manage-vehicles'); // Navigate to manage vehicles page
                    }, 3000);
                }
            } catch (error) {
                // Set error message in case of failure
                setError(error.response?.data?.message || error.message);
                setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
            }
        }
    };

    return (
        <div className="edit-vehicle-container">
            <h2>Edit Vehicle</h2>
            {/* Display error message if exists */}
            {error && <p className="error-message">{error}</p>}
            {/* Display success message if the update or delete is successful */}
            {success && <p className="success-message">{success}</p>}
            <div className="edit-vehicle-form">
                <div className="form-group">
                    {/* Show image preview or existing vehicle photo */}
                    {preview ? (
                        <img src={preview} alt="Vehicle Preview" className="vehicle-photo-preview" />
                    ) : (
                        vehicleDetails.vehiclePhotoUrl && (
                            <img src={vehicleDetails.vehiclePhotoUrl} alt="Vehicle" className="vehicle-photo" />
                        )
                    )}
                    {/* File input for selecting vehicle photo */}
                    <input
                        type="file"
                        name="photo" // Name should match the field name used in FormData
                        onChange={handleFileChange} // Handle file selection
                    />
                </div>
                <div className="form-group">
                    <label>Vehicle Type</label>
                    <input
                        type="text"
                        name="vehicleType" // Name must match the state property
                        value={vehicleDetails.vehicleType} // Bind input to vehicleType state
                        onChange={handleChange} // Update state on input change
                    />
                </div>
                <div className="form-group">
                    <label>Vehicle Price</label>
                    <input
                        type="text"
                        name="vehiclePrice" // Name must match the state property
                        value={vehicleDetails.vehiclePrice} // Bind input to vehiclePrice state
                        onChange={handleChange} // Update state on input change
                    />
                </div>
                <div className="form-group">
                    <label>Vehicle Description</label>
                    <textarea
                        name="vehicleDescription" // Name must match the state property
                        value={vehicleDetails.vehicleDescription} // Bind textarea to vehicleDescription state
                        onChange={handleChange} // Update state on textarea change
                    ></textarea>
                </div>
                {/* Button to handle vehicle update */}
                <button className="update-button" onClick={handleUpdate}>Update Vehicle</button>
                {/* Button to handle vehicle deletion */}
                <button className="delete-button" onClick={handleDelete}>Delete Vehicle</button>
            </div>
        </div>
    );
};

export default EditVehiclePage; // Export the component for use in other parts of the application
