import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import VehicleResult from '../common/VehicleResult';

const ManageVehiclePage = () => {
  // State to hold all vehicles, filtered vehicles, vehicle types, and the selected type for filtering
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State to manage pagination
  const [vehiclesPerPage] = useState(5); // Number of vehicles to display per page
  const navigate = useNavigate();

  // Fetch vehicle data and vehicle types from the API when the component mounts
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await ApiService.getAllVehicles();
        const allVehicles = response.vehicleList;
        setVehicles(allVehicles); // Store all vehicles in state
        setFilteredVehicles(allVehicles); // Initialize the filtered vehicles to show all
      } catch (error) {
        console.error('Error fetching Vehicles:', error.message);
      }
    };

    const fetchVehicleTypes = async () => {
      try {
        const types = await ApiService.getVehicleTypes();
        setVehicleTypes(types); // Store vehicle types for filtering
      } catch (error) {
        console.error('Error fetching Vehicle types:', error.message);
      }
    };

    // Call both functions to fetch data
    fetchVehicles();
    fetchVehicleTypes();
  }, []); // Empty dependency array ensures this only runs once on mount

  // Handle the change in vehicle type filter
  const handleVehicleTypeChange = (e) => {
    setSelectedVehicleType(e.target.value); // Update the selected vehicle type
    filterVehicles(e.target.value); // Filter the vehicles based on the selected type
  };

  // Filter vehicles based on the selected type
  const filterVehicles = (type) => {
    if (type === '') {
      // If "All" is selected, show all vehicles
      setFilteredVehicles(vehicles);
    } else {
      // Filter vehicles by their type
      const filtered = vehicles.filter((vehicle) => vehicle.vehicleType === type);
      setFilteredVehicles(filtered);
    }
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Logic for pagination: calculate indices of the first and last vehicle to display
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle); // Get the vehicles for the current page

  // Change page function for pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='all-vehicles'>
      <h2>All Vehicles</h2>

      {/* Filter section with vehicle type dropdown and add vehicle button */}
      <div className='all-vehicle-filter-div' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className='filter-select-div'>
          <label>Filter by Vehicle Type:</label>
          <select value={selectedVehicleType} onChange={handleVehicleTypeChange}>
            <option value="">All</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {/* Button to navigate to the add vehicle page */}
          <button className='add-vehicle-button' onClick={() => navigate('/admin/add-vehicle')}>
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Component to display the list of vehicles */}
      <VehicleResult vehicleSearchResults={currentVehicles} />

      {/* Pagination component */}
      <Pagination
        vehiclesPerPage={vehiclesPerPage} // Number of vehicles per page
        totalVehicles={filteredVehicles.length} // Total number of filtered vehicles
        currentPage={currentPage} // Current page number
        paginate={paginate} // Function to change the page
      />
    </div>
  );
};

export default ManageVehiclePage;
